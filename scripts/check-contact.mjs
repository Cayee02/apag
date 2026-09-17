import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { createServer } from 'node:net';
import { mkdtemp, mkdir, readFile, writeFile, rm, access } from 'node:fs/promises';
import { join, resolve, dirname, basename } from 'node:path';
import { randomBytes } from 'node:crypto';
import { setTimeout as delay } from 'node:timers/promises';
import { findPhp } from './php-runtime.mjs';
import { validateContactFields } from '../src/js/components/contact-form.js';

const root = process.cwd();
await access('dist/contacto.html'); await access('vendor/autoload.php');
const php = await findPhp();
const temporary = await mkdtemp(join(root, '.tmp-contact-'));
const mailConfiguration = join(temporary, 'mail.php');
await writeFile(mailConfiguration, '<?php return [];');
const schema = JSON.parse(await readFile('server/schema.json', 'utf8'));
const texts = Object.fromEntries(Object.entries(schema.fields).map(([key, field]) => [key, field.value]));
const message = { first_name: 'José', last_name: 'Prueba', email: 'persona@example.test', phone: '+595 989 123 456', subject: 'Consulta de prueba', message: 'Quiero información confirmada sobre APAG. Muchas gracias.', privacy_consent: '1', website: '' };
const servers = []; const children = []; const sockets = new Set();
const deliveries = []; let rejectMail = false; let logs = '';
async function port() {
  const socket = createServer(); await new Promise((done) => socket.listen(0, '127.0.0.1', done));
  const value = socket.address().port; await new Promise((done) => socket.close(done)); return value;
}
function cli(args, env, input) {
  const result = spawnSync(php, args, { env: { ...process.env, ...env }, input, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr + result.stdout); return result.stdout;
}
async function web(environment, prefix = '') {
  const number = await port();
  const child = spawn(php, ['-d', 'display_errors=Off', '-S', '127.0.0.1:' + number, '-t', 'dist', 'server/router.php'], { env: { ...process.env, ...environment } });
  children.push(child); child.stdout.on('data', (chunk) => { logs += chunk; }); child.stderr.on('data', (chunk) => { logs += chunk; });
  const origin = 'http://127.0.0.1:' + number;
  for (let index = 0; index < 60; index++) {
    try { await fetch(origin + prefix + '/'); return origin; } catch { await delay(100); }
  }
  throw Error('No arrancó PHP');
}
function client(origin, prefix = '') {
  const jar = new Map();
  return async (path, body) => {
    const headers = {};
    if (jar.size) headers.Cookie = [...jar].map(([key, value]) => key + '=' + value).join('; ');
    const response = await fetch(origin + prefix + path, { method: body ? 'POST' : 'GET', body, headers, redirect: 'manual' });
    for (const cookie of response.headers.getSetCookie()) { const pair = cookie.split(';')[0]; const index = pair.indexOf('='); jar.set(pair.slice(0, index), pair.slice(index + 1)); }
    return { status: response.status, headers: response.headers, text: await response.text() };
  };
}
const parse = (response) => JSON.parse(response.text);
const tokens = (html) => Object.fromEntries(['csrf', 'form_id', 'policy_version'].map((key) => [key, html.match(new RegExp('name="' + key + '" value="([a-f0-9]+)"'))?.[1]]));
const body = (state, changes = {}) => new URLSearchParams({ ...message, csrf: state.csrf, form_id: state.form_id, policy_version: state.policy_version, ...changes });
async function resetRate(storage) { await writeFile(join(storage, 'contact-rate.json'), '{}'); }
async function content(storage, changes = {}) {
  const base = { revision: 0, texts: { ...texts, 'privacy.body': 'Contenido aprobado únicamente para una prueba aislada del formulario.' }, services: [], images: [], privacy_approved: true };
  await mkdir(storage, { recursive: true });
  await writeFile(join(storage, 'content.json'), JSON.stringify({ ...base, ...changes }));
}

try {
  assert.deepEqual(validateContactFields(message), {});
  assert(validateContactFields({ ...message, subject: 'A\nBcc: persona@example.test' }).subject);
  assert(validateContactFields({ ...message, email: 'incorrecto', privacy_consent: '0' }).email);
  const unit = join(temporary, 'unit'); await mkdir(unit);
  process.stdout.write(cli(['server/contact-tests.php'], { APAG_STORAGE_DIR: unit, APAG_PUBLIC_DIR: resolve('dist'), APAG_BASE_PATH: '/', APAG_MAIL_CONFIG: mailConfiguration }));
  const smtp = createServer((socket) => {
    sockets.add(socket); socket.on('close', () => sockets.delete(socket));
    socket.setEncoding('utf8'); socket.write('220 local.test ESMTP test\r\n');
    let buffer = ''; let dataMode = false; let mailData = '';
    socket.on('data', (chunk) => {
      buffer += chunk;
      while (buffer.includes('\r\n')) {
        const index = buffer.indexOf('\r\n'); const line = buffer.slice(0, index); buffer = buffer.slice(index + 2);
        if (dataMode) {
          if (line === '.') { deliveries.push(mailData); dataMode = false; socket.write('250 Accepted for local test\r\n'); }
          else mailData += (line.startsWith('..') ? line.slice(1) : line) + '\r\n';
        } else if (/^EHLO|^HELO/.test(line)) socket.write('250-local.test\r\n250 8BITMIME\r\n');
        else if (line.startsWith('MAIL FROM')) socket.write(rejectMail ? '550 Rejected test; private SMTP diagnostic\r\n' : '250 OK\r\n');
        else if (line.startsWith('RCPT TO') || line === 'RSET') socket.write('250 OK\r\n');
        else if (line === 'DATA') { dataMode = true; mailData = ''; socket.write('354 End with dot\r\n'); }
        else if (line === 'QUIT') { socket.end('221 Bye\r\n'); }
        else socket.write('250 OK\r\n');
      }
    });
  });
  await new Promise((done) => smtp.listen(0, '127.0.0.1', done)); servers.push(smtp);
  const storage = join(temporary, 'http'); await mkdir(storage);
  const environment = { APAG_STORAGE_DIR: storage, APAG_PUBLIC_DIR: resolve('dist'), APAG_BASE_PATH: '/', APAG_MAIL_CONFIG: mailConfiguration, APAG_SMTP_HOST: '127.0.0.1', APAG_SMTP_PORT: String(smtp.address().port), APAG_SMTP_ENCRYPTION: 'none', APAG_SMTP_USERNAME: '', APAG_SMTP_PASSWORD: '', APAG_MAIL_FROM: 'sender@example.test', APAG_MAIL_FROM_NAME: 'APAG', APAG_MAIL_TO: 'inbox@example.test' };
  const origin = await web(environment); const request = client(origin);
  let state = parse(await request('/api/contacto')); assert.equal(state.ready, false);
  const unavailable = await request('/api/contacto', body(state)); assert.equal(unavailable.status, 503); assert.equal(deliveries.length, 0);
  const defaultPrivacy = await request('/privacidad.html'); assert(defaultPrivacy.text.includes('[CONTENIDO PENDIENTE APAG]'));
  await content(storage, { privacy_approved: false });
  assert(!(await request('/privacidad.html')).text.includes('Contenido aprobado únicamente'));
  await content(storage);
  const native = await request('/contacto.html'); assert(native.text.includes('data-ready="true"')); assert(!native.text.includes('<fieldset disabled'));
  assert(native.headers.get('cache-control').includes('no-store'));
  assert(native.headers.getSetCookie().every((cookie) => !cookie.includes('apag_admin')));
  state = parse(await request('/api/contacto')); assert.equal(state.ready, true);
  assert.equal((await request('/api/contacto', body(state, { csrf: 'invalid' }))).status, 403);
  const invalid = await request('/api/contacto', body(state, { email: 'invalid', privacy_consent: '0' }));
  assert.equal(invalid.status, 422); assert(parse(invalid).errors.email && parse(invalid).errors.privacy_consent);
  assert.equal((await request('/api/contacto', body(state, { website: 'https://bot.example.test' }))).status, 422);
  assert.equal((await request('/api/contacto', body(state))).status, 429);
  await delay(2100);
  const firstBody = body(state);
  const success = await request('/api/contacto', firstBody); assert.equal(success.status, 200); assert.equal(parse(success).ok, true);
  assert.equal(deliveries.length, 1);
  const email = deliveries[0]; assert(email.includes('From: APAG <sender@example.test>')); assert(email.includes('To: APAG <inbox@example.test>'));
  assert(email.includes('Reply-To:') && email.includes('persona@example.test')); assert(email.includes('Content-Type: text/plain; charset=UTF-8'));
  const textBody = Buffer.from(email.split('\r\n\r\n')[1].replace(/\s/g, ''), 'base64').toString('utf8');
  assert(textBody.includes('José Prueba') && textBody.includes(message.message) && textBody.includes(state.policy_version));
  assert.equal((await request('/api/contacto', firstBody)).status, 200); assert.equal(deliveries.length, 1);
  const changedDuplicate = await request('/api/contacto', body(state, { message: 'Esta es otra consulta distinta a la que ya fue enviada.' })); assert.equal(changedDuplicate.status, 409); assert.equal(parse(changedDuplicate).ok, false);
  const nextState = parse(success);
  const limited = await request('/api/contacto', body(nextState)); assert.equal(limited.status, 429); assert(Number(limited.headers.get('retry-after')) >= 1);
  const pending = parse(await request('/api/contacto'));
  await content(storage, { texts: { ...texts, 'privacy.body': 'Texto distinto aprobado solo para otra prueba aislada.' } });
  const policyChanged = await request('/api/contacto', body(pending)); assert.equal(policyChanged.status, 409); assert.equal(parse(policyChanged).clear_consent, true);
  assert.equal(deliveries.length, 1);
  await resetRate(storage);
  const nativePage = await request('/contacto.html'); const nativeTokens = tokens(nativePage.text); await delay(2100);
  const nativeSuccess = await request('/contacto.html', body(nativeTokens)); assert.equal(nativeSuccess.status, 303); assert.equal(nativeSuccess.headers.get('location'), '/contacto.html#formulario');
  assert.equal(deliveries.length, 2);
  const successPage = await request('/contacto.html'); assert(successPage.text.includes('Tu consulta fue enviada')); assert(successPage.text.includes('data-kind="success"'));
  const badNative = await request('/contacto.html', body(tokens(successPage.text), { message: '</textarea><script>bad</script>', email: 'bad' }));
  assert.equal(badNative.status, 422); assert(badNative.text.includes('&lt;/textarea&gt;')); assert(!badNative.text.includes('<script>bad'));
  await resetRate(storage); rejectMail = true;
  const failureState = parse(await request('/api/contacto')); await delay(2100);
  const failure = await request('/api/contacto', body(failureState)); assert.equal(failure.status, 503); assert.equal(parse(failure).ok, false);
  assert(!failure.text.includes('private SMTP diagnostic')); assert(!failure.text.includes('sender@example.test')); assert.equal(deliveries.length, 2);
  const privateContent = await readFile(join(storage, 'content.json'), 'utf8'); assert(!privateContent.includes(message.email));
  const rateData = await readFile(join(storage, 'contact-rate.json'), 'utf8'); assert(!rateData.includes('127.0.0.1'));
  const accountPassword = randomBytes(18).toString('base64url');
  cli(['server/bin/create-admin.php'], environment, JSON.stringify({ username: 'contact-admin', password: accountPassword }));
  const admin = await request('/admin'); const adminCsrf = admin.text.match(/name="csrf" value="([a-f0-9]+)"/)[1];
  assert.equal((await request('/admin', new URLSearchParams({ action: 'login', csrf: adminCsrf, username: 'contact-admin', password: accountPassword }))).status, 303);
  const privacyAdmin = await request('/admin?section=privacy'); const loggedCsrf = privacyAdmin.text.match(/name="csrf" value="([a-f0-9]+)"/)[1];
  const approval = new URLSearchParams({ action: 'save', csrf: loggedCsrf, revision: '0', 'texts[privacy.title]': texts['privacy.title'], 'texts[privacy.body]': '[CONTENIDO PENDIENTE APAG]', privacy_approved: '1' });
  assert.equal((await request('/admin?section=privacy', approval)).status, 422);
  approval.set('texts[privacy.body]', 'Borrador privado de prueba, no es una política institucional.'); approval.delete('privacy_approved');
  assert.equal((await request('/admin?section=privacy', approval)).status, 303);
  assert(!(await request('/privacidad.html')).text.includes('Borrador privado de prueba'));
  assert.equal(parse(await request('/api/contacto')).ready, false);
  const secondOrigin = await web({ ...environment, APAG_BASE_PATH: '/apag' }, '/apag'); const nested = client(secondOrigin, '/apag');
  const nestedApi = parse(await nested('/api/contacto')); assert.equal(nestedApi.policy_url, '/apag/privacidad.html');
  assert((await nested('/contacto.html')).text.includes('action="/apag/contacto.html#formulario"'));
  assert.equal((await request('/storage/contact-secret.json')).status, 404);
  assert(!/Fatal error|Parse error|Warning:/.test(logs), logs);
  assert(!logs.includes(message.email));
  console.log('OK formulario HTTP + SMTP local: validación, CSRF, honeypot, tiempo, envío real, Reply-To, duplicados, límites, política actualizada, flujo sin JS, error SMTP y subcarpeta');
} finally {
  for (const socket of sockets) socket.destroy();
  await Promise.all(servers.map((server) => new Promise((done) => server.close(done))));
  await Promise.all(children.map((child) => new Promise((done) => { if (child.exitCode !== null) { done(); return; } child.once('exit', done); child.kill(); })));
  if (dirname(temporary) !== root || !basename(temporary).startsWith('.tmp-contact-')) throw Error('Limpieza fuera de la carpeta temporal del formulario.');
  await rm(temporary, { recursive: true, force: true });
}
