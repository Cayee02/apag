const limits = { first_name: [2, 80], last_name: [0, 80], email: [3, 254], phone: [0, 30], subject: [3, 160], message: [20, 4000] };
const labels = { first_name: 'nombre', last_name: 'apellido', email: 'correo', phone: 'teléfono', subject: 'asunto', message: 'mensaje' };

export function validateContactFields(values) {
  const errors = {};
  for (const [key, [minimum, maximum]] of Object.entries(limits)) {
    const value = String(values[key] ?? '').trim();
    const length = [...value].length;
    if (length < minimum || length > maximum || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value) || (key !== 'message' && /[\r\n]/.test(value))) {
      errors[key] = `El ${labels[key]} debe tener ${minimum ? `entre ${minimum} y ${maximum}` : `hasta ${maximum}`} caracteres.`;
    }
  }
  if (!errors.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(values.email).trim())) errors.email = 'Escribe un correo válido.';
  const phone = String(values.phone ?? '').trim();
  const digits = phone.replace(/\D/g, '').length;
  if (phone && (!/^\+?[0-9 ()-]+$/.test(phone) || digits < 7 || digits > 15)) errors.phone = 'Escribe un teléfono válido, con código de país si corresponde.';
  if (values.privacy_consent !== '1') errors.privacy_consent = 'Debes leer y aceptar la política de privacidad.';
  return errors;
}

export function initContactForm() {
  const form = document.querySelector('[data-contact-form]');
  if (!form) return () => {};
  const fields = form.querySelector('[data-form-fields]');
  const notice = form.querySelector('[data-form-notice]');
  const label = form.querySelector('[data-submit-label]');
  const errorSlots = [...form.querySelectorAll('[data-form-error]')];
  const controller = new AbortController();
  const endpoint = new URL('./api/contacto', window.location.href);
  let ready = form.dataset.ready === 'true';
  let sending = false;
  let disposed = false;
  form.noValidate = true;

  const showNotice = (message, kind = 'info') => {
    notice.textContent = message;
    notice.dataset.kind = kind;
    notice.setAttribute('role', kind === 'error' ? 'alert' : 'status');
  };
  const showErrors = (errors) => {
    for (const slot of errorSlots) {
      const key = slot.dataset.formError;
      slot.textContent = errors[key] ?? '';
      form.elements.namedItem(key).setAttribute('aria-invalid', errors[key] ? 'true' : 'false');
    }
  };
  const setTokens = (state) => {
    const oldPolicy = form.elements.namedItem('policy_version').value;
    if (oldPolicy && state.policy_version && state.policy_version !== oldPolicy) form.elements.namedItem('privacy_consent').checked = false;
    for (const key of ['csrf', 'form_id', 'policy_version']) {
      if (typeof state[key] === 'string') form.elements.namedItem(key).value = state[key];
    }
    if (typeof state.ready === 'boolean') ready = state.ready;
    form.dataset.ready = ready ? 'true' : 'false';
    fields.disabled = !ready;
  };
  const focusError = (errors) => {
    const key = Object.keys(errors)[0];
    if (key && ready) form.elements.namedItem(key).focus();
    else notice.focus();
  };
  const handleInput = (event) => {
    const key = event.target.name;
    const slot = errorSlots.find((candidate) => candidate.dataset.formError === key);
    if (slot) { slot.textContent = ''; event.target.setAttribute('aria-invalid', 'false'); }
  };
  const handleFeedbackLink = (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (link) document.getElementById(link.hash.slice(1))?.focus();
  };
  const submit = async (event) => {
    event.preventDefault();
    if (!ready || sending) return;
    const body = new URLSearchParams(new FormData(form));
    for (const key of Object.keys(limits)) {
      const value = String(body.get(key) ?? '').trim();
      body.set(key, value); form.elements.namedItem(key).value = value;
    }
    const errors = validateContactFields(Object.fromEntries(body));
    showErrors(errors);
    if (Object.keys(errors).length) { showNotice('Revisa los campos marcados antes de enviar.', 'error'); focusError(errors); return; }
    sending = true; fields.disabled = true; label.textContent = 'Enviando…'; form.setAttribute('aria-busy', 'true');
    showNotice('Estamos enviando tu consulta. Espera un momento.');
    try {
      const response = await fetch(endpoint, { method: 'POST', body, headers: { Accept: 'application/json' }, signal: controller.signal });
      const state = await response.json();
      if (disposed) return;
      if (response.ok && state.ok) {
        form.reset(); showErrors({}); setTokens(state);
        showNotice(state.message, 'success'); notice.focus();
      } else {
        setTokens(state); showErrors(state.errors ?? {});
        if (state.clear_consent) form.elements.namedItem('privacy_consent').checked = false;
        showNotice(state.message ?? 'No pudimos enviar la consulta. Inténtalo más tarde.', 'error');
        focusError(state.errors ?? {});
      }
    } catch {
      if (disposed) return;
      // Keep the same submission ID: retrying after a lost response cannot send twice.
      showNotice('No pudimos confirmar el envío. Tus datos siguen aquí; revisa la conexión y vuelve a intentar.', 'error'); notice.focus();
    } finally {
      if (!disposed) { sending = false; fields.disabled = !ready; label.textContent = 'Enviar consulta'; form.setAttribute('aria-busy', 'false'); }
    }
  };
  form.addEventListener('submit', submit);
  form.addEventListener('input', handleInput);
  notice.addEventListener('click', handleFeedbackLink);
  if (!ready) {
    fetch(endpoint, { signal: controller.signal, headers: { Accept: 'application/json' } })
      .then((response) => { if (!response.ok) throw Error('Formulario no disponible'); return response.json(); })
      .then((state) => { if (!disposed) { setTokens(state); showNotice(state.message ?? ''); } })
      .catch(() => { if (!disposed) showNotice('El formulario no está disponible en este momento. Puedes escribirnos por correo o llamarnos.'); });
  } else if (notice.dataset.kind === 'error') notice.focus();
  return () => {
    disposed = true; controller.abort();
    form.removeEventListener('submit', submit); form.removeEventListener('input', handleInput); notice.removeEventListener('click', handleFeedbackLink);
    fields.disabled = !ready; label.textContent = 'Enviar consulta'; form.removeAttribute('aria-busy'); form.noValidate = false;
  };
}
