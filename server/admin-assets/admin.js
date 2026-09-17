const dirtyForms = new Set();
document.querySelectorAll('[data-dirty-form]').forEach((form) => {
  const markDirty = () => {
    dirtyForms.add(form);
    const status = form.querySelector('[data-save-status]');
    if (status) status.textContent = 'Tienes cambios sin guardar.';
  };
  form.addEventListener('input', markDirty);
  form.addEventListener('change', markDirty);
  form.addEventListener('submit', (event) => {
    if ([...dirtyForms].some((other) => other !== form) && !confirm('Hay cambios sin guardar en otro formulario. ¿Quieres continuar?')) { event.preventDefault(); return; }
    dirtyForms.clear();
  });
});
window.addEventListener('beforeunload', (event) => {
  if (!dirtyForms.size) return;
  event.preventDefault(); event.returnValue = '';
});
document.querySelectorAll('[data-reset-image]').forEach((form) => form.addEventListener('submit', (event) => {
  if (!confirm('¿Restaurar la fotografía y descripción iniciales?')) event.preventDefault();
  else dirtyForms.clear();
}));
document.querySelectorAll('[data-confirm]').forEach((form) => form.addEventListener('submit', (event) => {
  if (!confirm(form.dataset.confirm)) event.preventDefault();
  else if (dirtyForms.size && !confirm('Hay cambios sin guardar. ¿Quieres continuar?')) event.preventDefault();
  else dirtyForms.clear();
}));
const list = document.querySelector('[data-service-list]');
const addButton = document.querySelector('[data-add-service]');
if (list && addButton) {
  const template = document.querySelector('[data-service-template]');
  const status = document.querySelector('[data-service-status]');
  addButton.hidden = false;
  list.querySelectorAll('[data-remove-service]').forEach((button) => { button.hidden = false; });
  const changed = () => {
    list.dispatchEvent(new Event('input', { bubbles: true }));
    addButton.disabled = list.children.length >= 24;
    status.textContent = list.children.length + ' espacios de servicio · máximo 24.';
  };
  addButton.addEventListener('click', () => {
    if (list.children.length >= 24) return;
    list.append(template.content.cloneNode(true));
    list.lastElementChild.querySelector('input').focus();
    changed();
  });
  list.addEventListener('click', (event) => {
    const button = event.target.closest('[data-remove-service]');
    if (!button) return;
    const row = button.closest('[data-service-row]');
    const target = row.nextElementSibling ?? row.previousElementSibling;
    row.remove(); changed();
    (target?.querySelector('input') ?? addButton).focus();
  });
  addButton.disabled = list.children.length >= 24;
}
