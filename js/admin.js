const login = document.querySelector('#admin-login');
const settingsForm = document.querySelector('#admin-settings');
const packageList = document.querySelector('#packages');
const adminStatus = document.querySelector('#admin-status');
let adminToken = '';
let savedConfig = null;
let drafts = {};
let currentCommission = 'static';
function addPackage(item = { label: '', mxn: '', usd: '' }) {
  const row = document.createElement('div');
  row.className = 'package-row';
  for (const [field, label, type] of [['label','Nombre','text'],['mxn','MXN','number'],['usd','USD','number']]) {
    const wrapper = document.createElement('label'); wrapper.textContent = label;
    const input = document.createElement('input'); input.name = field; input.type = type; input.value = item[field] ?? ''; input.required = type === 'text';
    if (type === 'number') { input.min = '0'; input.max = '1000000'; input.step = '0.01'; } else input.maxLength = 80;
    wrapper.append(input); row.append(wrapper);
  }
  const remove = document.createElement('button'); remove.type = 'button'; remove.textContent = 'Quitar';
  remove.addEventListener('click', () => row.remove()); row.append(remove); packageList.append(row);
}
function readDraft() {
  return {
    delivery: settingsForm.elements.delivery.value.trim(),
    packages: [...packageList.querySelectorAll('.package-row')].map(row => ({
      label: row.querySelector('[name=label]').value.trim(),
      mxn: row.querySelector('[name=mxn]').value === '' ? null : Number(row.querySelector('[name=mxn]').value),
      usd: row.querySelector('[name=usd]').value === '' ? null : Number(row.querySelector('[name=usd]').value)
    }))
  };
}
function showDraft(name) {
  const draft = drafts[name];
  settingsForm.elements.delivery.value = draft.delivery;
  packageList.replaceChildren();
  draft.packages.forEach(addPackage);
}
login.addEventListener('submit', async event => {
  event.preventDefault(); adminStatus.textContent = 'Comprobando…';
  try {
    const response = await fetch(supabaseUrl + '/auth/v1/token?grant_type=password', {
      method: 'POST', headers: { apikey: supabaseKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: login.elements.email.value.trim(), password: login.elements.password.value })
    });
    const result = await response.json();
    if (!response.ok || !result.access_token) throw new Error('login');
    const config = await loadSettings();
    adminToken = result.access_token; login.reset(); login.hidden = true; settingsForm.hidden = false;
    savedConfig = config;
    currentCommission = 'static';
    settingsForm.elements.commission.value = 'static';
    drafts = { static: { delivery: config.delivery, packages: config.packages }, animated: config.animated || structuredClone(defaultAnimated) };
    settingsForm.elements.open.checked = config.open;
    showDraft('static');
    adminStatus.textContent = '';
  } catch { adminStatus.textContent = 'No se pudo acceder. Comprueba tu correo, contraseña y configuración.'; }
});
document.querySelector('#add-package').addEventListener('click', () => { if (packageList.children.length < 20) addPackage(); });
settingsForm.elements.commission.addEventListener('change', () => {
  drafts[currentCommission] = readDraft();
  currentCommission = settingsForm.elements.commission.value;
  showDraft(currentCommission);
});
document.querySelector('#logout').addEventListener('click', () => { const token = adminToken; adminToken = ''; settingsForm.hidden = true; login.hidden = false; adminStatus.textContent = 'Sesión cerrada.'; fetch(supabaseUrl + '/auth/v1/logout', { method: 'POST', headers: { apikey: supabaseKey, Authorization: 'Bearer ' + token } }).catch(() => {}); });
settingsForm.addEventListener('submit', async event => {
  event.preventDefault();
  drafts[currentCommission] = readDraft();
  if (Object.values(drafts).some(draft => !draft.delivery || !draft.packages.length || draft.packages.some(p => !p.label || (p.mxn === null && p.usd === null) || [p.mxn, p.usd].some(n => n !== null && (!Number.isFinite(n) || n < 0 || n > 1000000))))) {
    adminStatus.textContent = 'Cada comisión necesita un plazo y al menos un paquete con nombre y precio.'; return;
  }
  adminStatus.textContent = 'Guardando…';
  try {
    const response = await fetch(supabaseUrl + '/rest/v1/portfolio_settings?id=eq.1', {
      method: 'PATCH',
      headers: { apikey: supabaseKey, Authorization: 'Bearer ' + adminToken, 'Content-Type': 'application/json', Prefer: 'return=representation' },
      body: JSON.stringify({ config: { ...savedConfig, open: settingsForm.elements.open.checked, delivery: drafts.static.delivery, packages: drafts.static.packages, animated: drafts.animated } })
    });
    const rows = await response.json();
    if (!response.ok || !Array.isArray(rows) || rows.length !== 1) throw new Error('save');
    savedConfig = rows[0].config;
    adminStatus.textContent = 'Cambios guardados.';
  } catch { adminStatus.textContent = 'No se pudo guardar. Vuelve a iniciar sesión si caducó.'; }
});
