/* ═══════════════════════════════════════════════════════════
   SAYFER — Gestión Avícola
   app.js · Lógica principal del sistema
   proyecto_sayfer · v1.0
═══════════════════════════════════════════════════════════ */

// ─── ESTADO GLOBAL ────────────────────────────────────────
localStorage.setItem('sayfer_rol_actual', 'admin');
let _editandoUsuario = null;
const S = {

  apiBase: localStorage.getItem('sayfer_url') || 'http://localhost:8090/api',
  token:   localStorage.getItem('sayfer_token') || '',
  theme:   localStorage.getItem('sayfer_theme') || 'system',
  user:    JSON.parse(localStorage.getItem('sayfer_user') || 'null'),
  // caché de datos de referencia
  galpones:     [],
  ciclos:       [],
  tiposAlimento:[],
  tiposMed:     [],
  tiposMuerte:  [],
  usuarios:     [],
  vinculos: [],
  unidades:     []
};

// ─── CABECERAS HTTP ───────────────────────────────────────
function headers() {
  const h = { 'Content-Type': 'application/json' };
  if (S.token) h['Authorization'] = `Bearer ${S.token}`;
  return h;
}

// ─── LLAMADAS A LA API ────────────────────────────────────
async function GET(path) {
  const r = await fetch(S.apiBase + path, {
    headers: headers(),
    signal: AbortSignal.timeout(6000)
  });
  if (!r.ok) throw new Error(`Error: ${r.status}`);

  const res = await r.json();
  return res.data;
}


async function POST(path, body) {
  const r = await fetch(S.apiBase + path, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(6000)
  });
  if (!r.ok) throw new Error(`POST ${path} → ${r.status}`);
  return r.json().catch(() => ({}));
}

const PUT = (path, body) => fetch(S.apiBase + path, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body)
}).then(r => r.json());

// Intenta GET a la API; si falla, devuelve datos demo
async function tryGet(path, demoKey) {
  try {
    const result = await GET(path);

    // 1. Si es un array directo (como en tipos-medicamento)
    if (Array.isArray(result)) return result;

    // 2. Si es un objeto de paginación (tiene la propiedad .content)
    if (result && Array.isArray(result.content)) {
      return result.content;
    }

    // 3. Si no es ninguno, retorna vacío
    return [];
  } catch (err) {
    console.error(`Error cargando ${path}:`, err);
    return [];
  }
}

// ─── AUTENTICACIÓN ────────────────────────────────────────
function toggleLoadingScreen(show) {
  const loading = document.getElementById('loading-screen');
  if (!loading) return;
  loading.classList.toggle('show', show);
  loading.setAttribute('aria-hidden', show ? 'false' : 'true');
}

function setLoginError(msg) {
  const box  = document.getElementById('login-error');
  const text = document.getElementById('login-error-text');
  const u    = document.getElementById('login-user');
  const p    = document.getElementById('login-pass');
  if (msg) {
    text.textContent = msg;
    box.style.display = 'flex';
    // re-trigger animation
    box.style.animation = 'none';
    box.offsetHeight;
    box.style.animation = '';
    u.classList.add('input-error');
    p.classList.add('input-error');
  } else {
    box.style.display = 'none';
    u.classList.remove('input-error');
    p.classList.remove('input-error');
  }
}

async function doLogin() {
  const correo = document.getElementById('login-user').value.trim();
  const pass   = document.getElementById('login-pass').value;

  if (!correo || !pass) {
    setLoginError('Completa el correo y la contraseña para continuar.');
    return;
  }

  setLoginError(null);

  let userData;
  try {
    const r = await fetch(S.apiBase + '/usuario/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, password: pass }),
      signal: AbortSignal.timeout(6000)
    });
    if (!r.ok) {
      setLoginError('Credenciales incorrectas. Verifica tu correo y contraseña.');
      document.getElementById('login-pass').value = '';
      return;
    }
    const res = await r.json();
    userData = res.data;
  } catch (err) {
    setLoginError('No se pudo conectar con el servidor. Verifica la URL de la API.');
    return;
  }

  S.user = userData;
  localStorage.setItem('sayfer_user', JSON.stringify(userData));
  localStorage.setItem('sayfer_rol_actual', userData.rol);

  toggleLoadingScreen(true);
  await new Promise(res => setTimeout(res, 1500));

  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('top-username').textContent = userData.nombre;
  document.getElementById('top-avatar').textContent   = userData.nombre[0]?.toUpperCase() || 'U';
  document.getElementById('cfg-url').value = S.apiBase;

  toggleLoadingScreen(false);
  applyRoleRestrictions();
  pingApi();
  loadAll();
}

function isAdmin() { return S.user?.rol === 'admin'; }

function applyRoleRestrictions() {
  document.querySelectorAll('[data-admin-only]').forEach(el => {
    el.style.display = isAdmin() ? '' : 'none';
  });
}

function doLogout() {
  localStorage.removeItem('sayfer_user');
  location.reload();
}

function goProfile() {
  const navItem = document.querySelector('.nav-item[onclick*="perfil"]');
  go('perfil', navItem, 'Mi Perfil');
}

// ─── PERFIL ───────────────────────────────────────────────
function renderProfile() {
  const u = S.user || {};
  const nombre = u.nombre || '';

  // avatar grande
  const big = document.getElementById('profile-avatar-big');
  if (big) big.textContent = nombre[0]?.toUpperCase() || '?';

  const nd = document.getElementById('profile-name-display');
  if (nd) nd.textContent = nombre + (u.apellido ? ' ' + u.apellido : '');

  const rd = document.getElementById('profile-role-display');
  if (rd) rd.textContent = u.rol || 'usuario';

  // campos del form
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
  set('prf-nombre',   nombre);
  set('prf-correo',   u.correo   || '');
  set('prf-telefono', u.telefono || '');
}

function saveProfile() {
  const nombre   = document.getElementById('prf-nombre').value.trim();
  const correo   = document.getElementById('prf-correo').value.trim();
  const telefono = document.getElementById('prf-telefono').value.trim();

  if (!nombre) { toast('⚠️', 'El nombre no puede estar vacío', '', 't-warn'); return; }

  S.user = { ...S.user, nombre, correo, telefono };
  localStorage.setItem('sayfer_user', JSON.stringify(S.user));

  // actualizar topbar
  document.getElementById('top-username').textContent = nombre;
  document.getElementById('top-avatar').textContent   = nombre[0]?.toUpperCase() || 'U';

  renderProfile();
  toast('✅', 'Perfil actualizado');
}

function showChangePassword(show) {
  const views = ['pwd-view-default','pwd-view-step1','pwd-view-step2','pwd-view-done'];
  views.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  const target = show ? 'pwd-view-step1' : 'pwd-view-default';
  const el = document.getElementById(target);
  if (el) el.style.display = '';
  // limpiar campos
  ['prf-pass-actual','prf-pass-nueva','prf-pass-confirm'].forEach(id => {
    const f = document.getElementById(id); if (f) f.value = '';
  });
}

function verifyCurrentPassword() {
  const actual = document.getElementById('prf-pass-actual').value;
  if (!actual) { document.getElementById('prf-pass-actual').focus(); return; }
  // Aquí iría la verificación con el backend
  document.getElementById('pwd-view-step1').style.display = 'none';
  document.getElementById('pwd-view-step2').style.display = '';
}

function savePassword() {
  const nueva    = document.getElementById('prf-pass-nueva').value;
  const confirma = document.getElementById('prf-pass-confirm').value;
  if (!nueva || !confirma) {
    toast('⚠️', 'Completa ambos campos', '', 't-warn'); return;
  }
  if (nueva !== confirma) {
    toast('⚠️', 'Las contraseñas no coinciden', '', 't-warn'); return;
  }
  if (nueva.length < 6) {
    toast('⚠️', 'Mínimo 6 caracteres', '', 't-warn'); return;
  }
  // Aquí iría el PUT al backend
  document.getElementById('pwd-view-step2').style.display = 'none';
  document.getElementById('pwd-view-done').style.display  = '';
}

function showRecovery(show) {
  document.getElementById('recovery-wrap').style.display = show ? '' : 'none';
  document.querySelector('.login-form-wrap:not(#recovery-wrap)').style.display = show ? 'none' : '';
  if (!show) {
    document.getElementById('recovery-step-1').style.display = '';
    document.getElementById('recovery-step-2').style.display = 'none';
    document.getElementById('recovery-step-3').style.display = 'none';
    document.getElementById('recovery-email').value = '';
    document.getElementById('recovery-code').value = '';
    document.getElementById('recovery-new-password').value = '';
    document.getElementById('recovery-confirm-password').value = '';
    document.getElementById('recovery-error').style.display = 'none';
  }
}

async function sendRecovery() {
  const email = document.getElementById('recovery-email').value.trim();
  if (!email) {
    document.getElementById('recovery-email').focus();
    return;
  }
  const btn = document.querySelector('#recovery-step-1 .btn-login');
  btn.disabled = true;
  btn.textContent = 'Enviando...';
  try {
    await fetch('http://localhost:8090/api/usuario/recuperar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo: email })
    });
  } catch (_) { /* mostrar paso 2 igualmente para no revelar si el correo existe */ }
  btn.disabled = false;
  btn.textContent = 'Enviar instrucciones';
  document.getElementById('recovery-step-1').style.display = 'none';
  document.getElementById('recovery-step-2').style.display = '';
}

async function confirmRecovery() {
  const correo = document.getElementById('recovery-email').value.trim();
  const codigo = document.getElementById('recovery-code').value.trim();
  const nuevaPassword = document.getElementById('recovery-new-password').value;
  const confirmar = document.getElementById('recovery-confirm-password').value;
  const errorEl = document.getElementById('recovery-error');

  errorEl.style.display = 'none';

  if (!codigo || codigo.length !== 6) {
    errorEl.textContent = 'Ingresa el código de 6 dígitos';
    errorEl.style.display = '';
    return;
  }
  if (!nuevaPassword || nuevaPassword.length < 6) {
    errorEl.textContent = 'La contraseña debe tener al menos 6 caracteres';
    errorEl.style.display = '';
    return;
  }
  if (nuevaPassword !== confirmar) {
    errorEl.textContent = 'Las contraseñas no coinciden';
    errorEl.style.display = '';
    return;
  }

  const btn = document.querySelector('#recovery-step-2 .btn-login');
  btn.disabled = true;
  btn.textContent = 'Verificando...';

  try {
    const res = await fetch('http://localhost:8090/api/usuario/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, codigo, nuevaPassword })
    });
    const data = await res.json();
    if (res.ok) {
      document.getElementById('recovery-step-2').style.display = 'none';
      document.getElementById('recovery-step-3').style.display = '';
    } else {
      errorEl.textContent = data.message || 'Error al cambiar la contraseña';
      errorEl.style.display = '';
    }
  } catch (_) {
    errorEl.textContent = 'Error de conexión. Intenta de nuevo.';
    errorEl.style.display = '';
  }

  btn.disabled = false;
  btn.textContent = 'Cambiar contraseña';
}

// ─── NAVEGACIÓN ENTRE TABS ────────────────────────────────
function go(tabId, el, label) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const tab = document.getElementById('tab-' + tabId);
  if (tab) tab.classList.add('active');
  if (el)  el.classList.add('active');
  document.getElementById('page-label').textContent = label || tabId;

  // Carga lazy por sección
  const loaders = {
    'dashboard':       loadDashboard,
    'galpones':        loadGalpones,
    'ciclos':          loadCiclos,
    'alimento':        () => { loadTiposAlimento(); loadStockAlimento(); loadIngAlimento(); },
    'medicamentos':    () => { loadTiposMed(); loadStockMed(); loadIngMed(); },
    'mortalidad':      () => { loadTiposMuerte(); loadMortalidad(); },
    'adm-alimento':    loadAdmAlimento,
    'adm-medicamento': loadAdmMed,
    'usuarios':        loadUsuarios,
    'config':          () => { loadUnidades(); renderConfigStatus(); },
    'perfil':          renderProfile

  };
  loaders[tabId]?.();
}

// ─── MODALES ──────────────────────────────────────────────
function openModal(id) {
  document.getElementById(id).classList.add('open');
  populateSelects(id);
  const errBox = document.querySelector(`#${id} [id$="-error-msg"]`);
  if (errBox) errBox.style.display = 'none';
}
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

// Cierra modal al hacer clic fuera
document.querySelectorAll('.modal-overlay').forEach(m =>
    m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); })
);

// Rellena los <select> de cada modal con datos del caché
function populateSelects(modalId) {
  const { galpones: g, ciclos: c, tiposAlimento: ta,
    tiposMed: tm, tiposMuerte: tmu, usuarios: u, unidades: un } = S;
  const sel = (id, arr, valKey, lblFn) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = arr.map(x => `<option value="${x[valKey]}">${lblFn(x)}</option>`).join('');
  };

  if (modalId === 'modal-ciclo') {
    // Galpones que ya tienen ciclo activo (fecha_fin nula o >= hoy)
    const hoyStr = today();
    const ocupados = new Set(
      (S.vinculos || [])
        .filter(v => !v.fecha_fin || toDateStr(v.fecha_fin) >= hoyStr)
        .map(v => v.id_galpon?.id_galpon)
        .filter(Boolean)
    );

    const lista = document.getElementById('c-galpon-lista');
    lista.innerHTML = g.length === 0
        ? '<span style="color:var(--text3);font-size:12px">No hay galpones registrados</span>'
        : g.map(x => {
            const bloqueado = ocupados.has(x.id_galpon);
            return `
        <label style="display:flex;align-items:center;gap:10px;cursor:${bloqueado?'not-allowed':'pointer'};font-size:14px;color:${bloqueado?'var(--text3)':'var(--text)'}">
          <input type="checkbox" value="${x.id_galpon}"
            ${bloqueado ? 'disabled' : ''}
            style="width:16px;height:16px;accent-color:var(--green,#22c55e);cursor:${bloqueado?'not-allowed':'pointer'}"
            onchange="updateGalponPreview()">
          <span>${x.nombre}</span>
          <span style="margin-left:auto;font-size:11px;color:var(--text3)">${bloqueado ? '🔒 ciclo activo' : (x.capacidad?.toLocaleString() || '') + ' aves'}</span>
        </label>`;
          }).join('');

    document.getElementById('c-nombre').value = '';
    document.getElementById('c-inicio').value = today();
    document.getElementById('c-fin').value    = '';
    document.getElementById('c-galpon-preview').textContent = 'Ningún galpón seleccionado';
  }
  if (modalId === 'modal-ing-alimento') {
    sel('ia-tipo', ta, 'id_tipo_alimento', x => x.nombre_alimento);
    document.getElementById('ia-fecha').value = today();
    const errBox = document.getElementById('ia-error-msg');
    if (errBox) errBox.style.display = 'none';
    // Cargar stock actual en el modal
    loadStockPreviewAlimento();
  }
  if (modalId === 'modal-ing-med') {
    sel('im-tipo',   tm, 'id_tipo_medicamento', x => x.nombre);
    document.getElementById('im-fecha').value = today();
  }
  if (modalId === 'modal-adm-alimento') {
    sel('aa-tipo',   ta, 'id_tipo_alimento', x => x.nombre_alimento);
    sel('aa-galpon', g,  'id_galpon',        x => x.nombre);
    sel('aa-ciclo',  c,  'id_ciclo',          x => x.nombre_ciclo || `Ciclo ${x.id_ciclo}`);
    document.getElementById('aa-fecha').value = today();
    document.getElementById('aa-cantidad').value = '';
  }
  if (modalId === 'modal-galpon') {
    ['g-nombre','g-metros','g-capacidad'].forEach(id => { const el = document.getElementById(id); if(el) el.value = ''; });
    ['g-sugerencia','g-alerta','g-error-msg'].forEach(id => { const el = document.getElementById(id); if(el) el.style.display = 'none'; });
    document.getElementById('g-capacidad').placeholder = '—';
  }
  if (modalId === 'modal-adm-med') {
    sel('am-tipo',    tm, 'id_tipo_medicamento', x => x.nombre);
    sel('am-galpon',  g,  'id_galpon',           x => `${x.id_galpon} — ${x.nombre}`);
    sel('am-ciclo',   c,  'id_ciclo',       x => x.nombre_ciclo||`Ciclo ${x.id_ciclo}`);
    document.getElementById('am-fecha').value = today();
  }
  if (modalId === 'modal-mortalidad') {
    sel('mo-galpon',  g,  'id_galpon',           x => `${x.id_galpon} — ${x.nombre}`);
    sel('mo-ciclo',   c,  'id_ciclo',       x => x.nombre_ciclo||`Ciclo ${x.id_ciclo}`);
    sel('mo-tipo-muerte', tmu ,  'id_tipo_muerte',            x => x.nombre||`tipo ${x.id_tipo_muerte}`);
    document.getElementById('mo-fecha').value    = today();
    document.getElementById('mo-cantidad').value = '';
    document.getElementById('mo-causa').value    = '';
  }
  if (modalId === 'modal-ciclo') {
    const galpones = S.galpones || [];
    const sinGalpones = document.getElementById('ciclo-sin-galpones');
    const cicloForm   = document.getElementById('ciclo-form');
    const guardarBtn  = document.getElementById('ciclo-guardar-btn');
    if (galpones.length === 0) {
      sinGalpones.style.display = '';
      cicloForm.style.display = 'none';
      guardarBtn.style.display = 'none';
    } else {
      sinGalpones.style.display = 'none';
      cicloForm.style.display = '';
      guardarBtn.style.display = '';
      sel('c-galpon', galpones, 'id_galpon', x => `${x.nombre || 'Galpón'} (ID: ${x.id_galpon})`);
      document.getElementById('c-inicio').value = today();
    }
    const errBox = document.getElementById('c-error-msg');
    if (errBox) errBox.style.display = 'none';
  }
  if (modalId === 'modal-editar-tipos-med') { loadEditarTiposMed(); }
  if (modalId === 'modal-editar-tipos-alimento') {
    loadEditarTiposAlimento();
  }
}

function today() { return new Date().toISOString().split('T')[0]; }
// Renderiza gráfico agrupado por ciclo → barras por tipo
function renderGraficoCiclos(elId, grupos, opacity, unit = '') {
  const chartEl = document.getElementById(elId);
  if (!grupos.length) {
    chartEl.innerHTML = '<span style="color:var(--text3);font-size:12px">Sin datos</span>';
    return;
  }
  const allVals = grupos.flatMap(g => Object.values(g.byTipo));
  const maxV = Math.max(...allVals, 1);
  const BAR_H = 120;
  chartEl.style.height = 'auto';
  chartEl.style.alignItems = 'stretch';
  chartEl.innerHTML = grupos.map(g => {
    const bars = Object.entries(g.byTipo).map(([tipo, val]) => {
      const words = tipo.trim().split(/\s+/);
      const lbl = words.length > 1 ? words.slice(-2).join(' ') : tipo;
      const opStyle = opacity ? `opacity:${opacity}` : '';
      const display = val.toLocaleString() + (unit ? ' ' + unit : '');
      return `<div class="bar-col" title="${tipo}: ${display}" style="min-width:36px">
        <span class="bar-val" style="font-size:10px">${display}</span>
        <div class="bar" style="height:${(val/maxV*BAR_H)}px;background:linear-gradient(180deg,var(--accent),var(--accent2));${opStyle}" data-val="${display}"></div>
        <div class="bar-lbl" style="white-space:normal;line-height:1.2">${lbl}</div>
      </div>`;
    }).join('');
    const words = g.nombre.trim().split(/\s+/);
    const cicloLbl = words.length > 1 ? words.slice(-2).join(' ') : g.nombre;
    return `<div style="display:flex;flex-direction:column;align-items:center;gap:6px;padding:0 12px;border-right:1px solid var(--border)">
      <div style="display:flex;align-items:flex-end;gap:6px;min-height:${BAR_H + 40}px">${bars}</div>
      <div style="font-size:11px;font-weight:600;color:var(--text2);text-align:center;line-height:1.3">
        ${cicloLbl}<br><span style="font-size:10px;font-weight:400;color:var(--text3)">${g.galpon}</span>
      </div>
    </div>`;
  }).join('');
}

// Normaliza fecha de la API: array [2026,4,7] → "2026-04-07", string → string
function toDateStr(d) {
  if (!d) return null;
  if (Array.isArray(d)) return `${d[0]}-${String(d[1]).padStart(2,'0')}-${String(d[2]).padStart(2,'0')}`;
  return String(d).slice(0, 10);
}

// Bloquea todo excepto dígitos, punto decimal y teclas de control
function onlyNumbers(e) {
  const control = ['Backspace','Delete','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Tab','Enter','Home','End'];
  if (control.includes(e.key)) return;
  if (e.ctrlKey || e.metaKey) return; // permite Ctrl+C, Ctrl+V, etc.
  if (!/^\d$/.test(e.key) && e.key !== '.') e.preventDefault();
}

// ─── NOTIFICACIONES TOAST ─────────────────────────────────
function toast(icon, title, sub = '', type = 't-success') {
  const c = document.getElementById('toasts');
  const d = document.createElement('div');
  d.className = `toast ${type}`;
  d.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <div>
      <div class="toast-title">${title}</div>
      ${sub ? `<div class="toast-sub">${sub}</div>` : ''}
    </div>`;
  c.appendChild(d);
  setTimeout(() => {
    d.style.opacity    = '0';
    d.style.transition = 'opacity .3s';
    setTimeout(() => d.remove(), 300);
  }, 3500);
}

// ─── ESTADO DE LA API ─────────────────────────────────────
async function pingApi() {
  const dot = document.getElementById('api-dot');
  const lbl = document.getElementById('api-label');
  dot.className = 'dot pulsing';
  lbl.textContent = 'Conectando...';
  try {
    const probe = await fetch(S.apiBase + '/galpon', { headers: headers(), signal: AbortSignal.timeout(4000) }); if(!probe.ok) throw new Error('fail'); // Ajustar al endpoint de tu Spring Boot
    dot.className   = 'dot pulsing';
    lbl.textContent = 'API OK';
    toast('✅', 'Conexión exitosa', S.apiBase);
  } catch {
    dot.className   = 'dot off';
    lbl.textContent = 'Sin conexión — demo';
    toast('⚠️', 'Sin conexión con API', 'Cargando datos demo', 't-warn');
  }
}

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(mode = 'system') {
  S.theme = mode;
  const resolved = mode === 'system' ? getSystemTheme() : mode;
  document.body.dataset.theme = resolved;
  // resaltar el botón activo
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === mode);
  });
}

function pickTheme(mode) {
  localStorage.setItem('sayfer_theme', mode);
  applyTheme(mode);
}

function saveConfig() {
  S.apiBase = document.getElementById('cfg-url').value   || S.apiBase;
  S.token   = document.getElementById('cfg-token').value || '';

  localStorage.setItem('sayfer_url',   S.apiBase);
  localStorage.setItem('sayfer_token', S.token);

  toast('💾', 'Configuración guardada');
  pingApi();
  renderConfigStatus();
}

function renderConfigStatus() {
  document.getElementById('cfg-url').value = S.apiBase;
  applyTheme(S.theme);   // sincroniza botones activos
  document.getElementById('cfg-status-list').innerHTML = `
    <div class="info-row"><span class="info-key">URL</span><span class="mono">${S.apiBase}</span></div>
    <div class="info-row"><span class="info-key">Tema</span><span class="mono">${S.theme}</span></div>
    <div class="info-row"><span class="info-key">Base de datos</span><span class="mono">proyecto_sayfer</span></div>
    <div class="info-row"><span class="info-key">Tablas mapeadas</span><span class="mono">13 tablas</span></div>`;
}

// ─── FILTRO DE TABLAS ─────────────────────────────────────
function filterTbl(inp, tbodyId) {
  const q = inp.value.toLowerCase();
  document.querySelectorAll(`#${tbodyId} tr`).forEach(tr =>
      tr.style.display = tr.textContent.toLowerCase().includes(q) ? '' : 'none'
  );
}

// ─── CARGA INICIAL ────────────────────────────────────────
async function loadAll() {
  // Carga datos de referencia en paralelo y los guarda en caché
  [S.galpones, S.ciclos, S.vinculos, S.tiposAlimento, S.tiposMed,
    S.tiposMuerte, S.usuarios, S.unidades] = await Promise.all([
    tryGet('/galpon',                    'galpones'),
    tryGet('/ciclo-produccion',          'ciclos'),
    tryGet('/galpon-ciclo-produccion',   'vinculos'),
    tryGet('/tipo-alimento',             'tiposAlimento'),
    tryGet('/tipo-medicamento',          'tiposMed'),
    tryGet('/tipo-muerte',               'tiposMuerte'),
    tryGet('/usuario',                   'usuarios'),
    tryGet('/unidad-medida',             'unidades'),
  ]);
  loadDashboard();
}

// ─── DASHBOARD ────────────────────────────────────────────
async function loadDashboard() {
  const now = new Date().toLocaleString('es-CO');
  document.getElementById('dash-updated').textContent = `Última actualización: ${now}`;
  const btnPdf = document.getElementById('btn-reporte-pdf');
  if (btnPdf) btnPdf.style.display = isAdmin() ? '' : 'none';

  const mort  = await tryGet('/mortalidad', 'mortalidad');
  const hoy   = new Date().toISOString().split('T')[0];
  const bajasHoy   = mort.filter(m => toDateStr(m.fecha_de_muerte) === hoy).reduce((a,m) => a + (+m.muertos || 0), 0);
  const bajas7dias = mort.reduce((a,m) => a + (+m.muertos || 0), 0);

  const ciclosActDash = S.ciclos.filter(c => !c.fecha_fin || toDateStr(c.fecha_fin) >= hoy);
  const totalPollosAct = ciclosActDash.reduce((a, c) => a + (+c.cantidad_pollos || 0), 0);
  document.getElementById('s-galpones').textContent         = S.galpones.length;
  document.getElementById('s-ciclos').textContent           = ciclosActDash.length;
  document.getElementById('s-pollos-activos').textContent   = totalPollosAct ? totalPollosAct.toLocaleString() : '—';
  document.getElementById('s-muertos-hoy').textContent   = bajasHoy;
  document.getElementById('s-muertos-nota').textContent  = `${bajas7dias} bajas registradas`;
  document.getElementById('s-tipos-alimento').textContent= S.tiposAlimento.length;
  document.getElementById('s-tipos-med').textContent     = S.tiposMed.length;

  // Tabla de ciclos (dashboard) — fechas del DTO, galpón desde vinculos
  const vinculosDash = S.vinculos || [];
  document.getElementById('dash-ciclos-tbody').innerHTML = S.ciclos.map(c => {
    const fi = toDateStr(c.fecha_inicio);
    const ff = toDateStr(c.fecha_fin);
    const activo = !ff || ff >= hoy;
    const vins = vinculosDash.filter(v => v.id_ciclo?.id_ciclo === c.id_ciclo);
    const galpon = [...new Set(vins.map(v => v.id_galpon?.nombre).filter(Boolean))].join(', ') || '—';
    return `<tr>
    <td class="mono">${c.id_ciclo}</td>
    <td>${c.nombre_ciclo || '—'}</td>
    <td>${galpon}</td>
    <td class="mono">${fi || '—'}</td>
    <td class="mono">${ff || 'En curso'}</td>
    <td>${activo
        ? '<span class="badge badge-green">● Activo</span>'
        : '<span class="badge badge-gray">Cerrado</span>'}</td>
  </tr>`;
  }).join('') || '<tr><td colspan="6" style="text-align:center;color:var(--text3);padding:20px">Sin ciclos registrados</td></tr>';

  // Gráfica mortalidad — solo ciclos activos
  const hoyDash = today();
  const ciclosActivosDash = new Set(
    (S.ciclos || []).filter(c => { const f = toDateStr(c.fecha_fin); return !f || f >= hoyDash; })
                    .map(c => c.id_ciclo)
  );
  const byCicloDash = {};
  mort.filter(m => ciclosActivosDash.has(m.id_ciclo?.id_ciclo)).forEach(m => {
    const k = m.id_ciclo?.nombre_ciclo || `Ciclo ${m.id_ciclo?.id_ciclo || '?'}`;
    byCicloDash[k] = (byCicloDash[k] || 0) + (+m.muertos || 0);
  });
  const ciclosDashEntries = Object.entries(byCicloDash);
  const maxMC = Math.max(...ciclosDashEntries.map(e => e[1]), 1);
  document.getElementById('chart-mortalidad').innerHTML = ciclosDashEntries.map(([k, val]) => {
    const words = k.trim().split(/\s+/);
    const lbl = words.length > 1 ? words.slice(-2).join(' ') : k;
    return `<div class="bar-col" title="${k}">
      <div class="bar red" style="height:${(val/maxMC*140)}px" data-val="${val} bajas"></div>
      <div class="bar-lbl" style="white-space:normal;line-height:1.2">${lbl}</div>
    </div>`;
  }).join('') || '<span style="color:var(--text3);font-size:12px">Sin bajas en ciclos activos</span>';
  document.getElementById('chip-total-muertos').textContent = `Total: ${ciclosDashEntries.reduce((a,[,v]) => a + v, 0)}`;

  // Stock alimento
  const stock = await tryGet('/stock-alimento', 'stockAlimento');
  const maxS  = Math.max(...stock.map(s => +s.cantidad), 1);
  document.getElementById('dash-stock-alimento').innerHTML = stock.map(s => `
    <div style="margin-bottom:14px">
      <div style="display:flex;justify-content:space-between;margin-bottom:5px;font-size:13px">
        <span>${s.nombre_alimento || s.id_tipo_alimento}</span>
        <span class="mono">${(+s.cantidad).toLocaleString()} kg</span>
      </div>
      <div class="prog-bar">
        <div class="prog-fill${+s.cantidad < 2000 ? ' danger' : +s.cantidad < 5000 ? ' warn' : ''}"
             style="width:${(+s.cantidad / maxS * 100)}%"></div>
      </div>
    </div>`).join('') || '<div style="color:var(--text3);font-size:12px">Sin datos</div>';
//stock medi
  const data1 = await tryGet('/stock-medicamento', 'stockMed');
  const max  = Math.max(...data1.map(d => +d.cantidadActual), 1);

  document.getElementById('dash-stock-med').innerHTML = data1.map(m => {
    const cantidad = +m.cantidadActual;
    const nombre   = m.id_tipo_medicamento?.nombre || `Tipo ${m.id_stock_medicamento}`;
    const unidad   = m.id_unidad?.nombre || '';
    return `
    <div style="margin-bottom:14px">
      <div style="display:flex;justify-content:space-between;margin-bottom:5px;font-size:13px">
        <span>${nombre}</span>
        <span class="mono">${cantidad.toLocaleString()} ${unidad}</span>
      </div>
      <div class="prog-bar">
        <div class="prog-fill${cantidad < 5 ? ' danger' : cantidad < 20 ? ' warn' : ''}"
             style="width:${Math.max(2, (cantidad / max * 100))}%"></div>
      </div>
    </div>`;
  }).join('') || '<div style="color:var(--text3)">Sin datos de stock</div>';

  // Alertas automáticas
  const [ingAlimDash, ingMedDash] = await Promise.all([
    tryGet('/ing-alimento',    'ingAlimento'),
    tryGet('/ing-medicamento', 'ingMedicamento'),
  ]);

  const alertas = [];
  const hoy30 = new Date(); hoy30.setDate(hoy30.getDate() + 30);
  const hoy30str = hoy30.toISOString().split('T')[0];

  // Stock crítico
  stock.forEach(s => {
    if (+s.cantidad < 100)
      alertas.push({ tipo: 'warn', msg: `Stock crítico de alimento: <b>${s.nombre_alimento}</b> — ${(+s.cantidad).toLocaleString()} kg` });
  });
  data1.filter(m => +m.cantidadActual < 5).forEach(m =>
    alertas.push({ tipo: 'warn', msg: `Medicamento bajo: <b>${m.id_tipo_medicamento?.nombre || '—'}</b> — ${m.cantidadActual} ${m.id_tipo_medicamento?.unidad || ''}` })
  );

  // Vencimientos próximos (≤ 30 días)
  ingAlimDash.forEach(r => {
    const fv = toDateStr(r.fecha_vencimiento);
    if (!fv || fv > hoy30str) return;
    const dias = Math.round((new Date(fv) - new Date(hoy)) / 86400000);
    const nombre = r.id_tipo_alimento?.nombre_alimento || '—';
    if (dias < 0)
      alertas.push({ tipo: 'danger', msg: `Alimento vencido: <b>${nombre}</b> — venció el ${fv}` });
    else
      alertas.push({ tipo: 'warn', msg: `Alimento por vencer: <b>${nombre}</b> — vence en ${dias} día${dias !== 1 ? 's' : ''} (${fv})` });
  });
  ingMedDash.forEach(r => {
    const fv = toDateStr(r.fecha_vencimiento);
    if (!fv || fv > hoy30str) return;
    const dias = Math.round((new Date(fv) - new Date(hoy)) / 86400000);
    const nombre = r.id_tipo_medicamento?.nombre || '—';
    if (dias < 0)
      alertas.push({ tipo: 'danger', msg: `Medicamento vencido: <b>${nombre}</b> — venció el ${fv}` });
    else
      alertas.push({ tipo: 'warn', msg: `Medicamento por vencer: <b>${nombre}</b> — vence en ${dias} día${dias !== 1 ? 's' : ''} (${fv})` });
  });

  const iconAlerta = `<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>`;
  document.getElementById('dash-alerts').innerHTML = alertas
    .map(a => `<div class="alert alert-${a.tipo}">${iconAlerta}<div>${a.msg}</div></div>`).join('');
}

// ─── GALPONES ─────────────────────────────────────────────
async function loadGalpones() {
  S.galpones = await tryGet('/galpon', 'galpones');
  const vinculos = await tryGet('/galpon-ciclo-produccion', 'galponCiclos');
  document.getElementById('galpones-tbody').innerHTML = S.galpones.map(g => {
    const ciclosCount = vinculos.filter(v => v.id_galpon?.id_galpon === g.id_galpon).length;
    return `<tr>
      <td class="mono">${g.id_galpon}</td>
      <td>${g.nombre}</td>
      <td class="mono">${g.capacidad?.toLocaleString() || '—'}</td>
      <td class="mono">${ciclosCount} ciclo${ciclosCount !== 1 ? 's' : ''}</td>
      ${isAdmin() ? `<td><button class="btn-icon" onclick="prepareEditGalpon(${g.id_galpon})" title="Editar">✏️</button></td>` : '<td>—</td>'}
    </tr>`;
  }).join('');
}


// ─── EDITAR GALPÓN ───────────────────────────────────────
function calcSugerenciaGalponEdit() {
  const metros = +document.getElementById('eg-metros').value;
  const sug = document.getElementById('eg-sugerencia');
  const sugVal = document.getElementById('eg-sugerencia-val');
  if (metros > 0) {
    const max = Math.round(metros * 10);
    sugVal.textContent = max.toLocaleString();
    sug.style.display = '';
    checkCapacidadGalponEdit();
  } else {
    sug.style.display = 'none';
    document.getElementById('eg-alerta').style.display = 'none';
  }
}

function checkCapacidadGalponEdit() {
  const metros = +document.getElementById('eg-metros').value;
  const cap = +document.getElementById('eg-capacidad').value;
  document.getElementById('eg-alerta').style.display =
    metros > 0 && cap > 0 && cap > metros * 10 ? '' : 'none';
}

function prepareEditGalpon(id) {
  const g = S.galpones.find(x => x.id_galpon === id);
  if (!g) { toast('\u274C', 'Galpón no encontrado', '', 't-warn'); return; }
  document.getElementById('eg-id').value        = g.id_galpon;
  document.getElementById('eg-nombre').value    = g.nombre || '';
  document.getElementById('eg-metros').value    = g.metros_cuadrados || '';
  document.getElementById('eg-capacidad').value = g.capacidad || '';
  ['eg-sugerencia','eg-alerta','eg-error-msg'].forEach(function(eid) {
    const el = document.getElementById(eid); if(el) el.style.display = 'none';
  });
  if (g.metros_cuadrados) calcSugerenciaGalponEdit();
  openModal('modal-editar-galpon');
}

async function updateGalpon() {
  const errBox  = document.getElementById('eg-error-msg');
  const errText = document.getElementById('eg-error-text');
  if (errBox) errBox.style.display = 'none';

  const id       = document.getElementById('eg-id').value;
  const nombre   = document.getElementById('eg-nombre').value.trim();
  const capacidad = +document.getElementById('eg-capacidad').value;
  const metrosVal = document.getElementById('eg-metros').value;
  const metros   = metrosVal ? +metrosVal : null;

  if (!nombre) {
    if (errBox && errText) { errText.textContent = 'El nombre es obligatorio.'; errBox.style.display = ''; }
    return;
  }
  if (!capacidad || capacidad <= 0) {
    if (errBox && errText) { errText.textContent = 'La capacidad debe ser mayor a 0.'; errBox.style.display = ''; }
    return;
  }

  try {
    const r = await fetch(S.apiBase + '/galpon/' + id, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: nombre, capacidad: capacidad, metros_cuadrados: metros })
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({}));
      if (errBox && errText) { errText.textContent = err.message || 'Error al actualizar.'; errBox.style.display = ''; }
      return;
    }
    toast('\u2705', 'Galpón actualizado');
    closeModal('modal-editar-galpon');
    loadGalpones();
  } catch {
    if (errBox && errText) { errText.textContent = 'No se pudo conectar.'; errBox.style.display = ''; }
  }
}

async function deleteGalpon() {
  const id     = document.getElementById('eg-id').value;
  const nombre = document.getElementById('eg-nombre').value;
  if (!confirm('\u26A0\uFE0F \u00BFEliminar el galpón "' + nombre + '"?\n\nEsta acción eliminará todos sus vínculos con ciclos.')) return;
  try {
    const r = await fetch(S.apiBase + '/galpon/' + id, { method: 'DELETE' });
    if (!r.ok) { toast('\u274C', 'No se pudo eliminar', 'El galpón puede tener registros asociados.', 't-error'); return; }
    toast('\u2705', 'Galpón eliminado');
    closeModal('modal-editar-galpon');
    loadGalpones();
  } catch {
    toast('\u274C', 'Error al eliminar', '', 't-error');
  }
}

// ─── CICLOS DE PRODUCCIÓN ─────────────────────────────────
async function loadCiclos() {
  // Traer ambas entidades en paralelo
  [S.ciclos, S.vinculos, S.galpones] = await Promise.all([
    tryGet('/ciclo-produccion',        'ciclos'),
    tryGet('/galpon-ciclo-produccion', 'vinculos'),
    tryGet('/galpon',                  'galpones')
  ]);

  const todayStr = today();
  document.getElementById('ciclos-tbody').innerHTML = S.ciclos.map(c => {
    const fechaInicio = toDateStr(c.fecha_inicio);
    const fechaFin    = toDateStr(c.fecha_fin);
    const vins2 = S.vinculos.filter(v => v.id_ciclo?.id_ciclo === c.id_ciclo);
    const galpon = [...new Set(vins2.map(v => v.id_galpon?.nombre).filter(Boolean))].join(', ') || '—';

    let dias = '—';
    if (fechaInicio) {
      const ini = new Date(fechaInicio);
      const fin = fechaFin ? new Date(fechaFin) : new Date();
      dias = Math.round((fin - ini) / (1000 * 60 * 60 * 24));
    }

    const activo = !fechaFin || fechaFin >= todayStr;
    const estadoBadge = activo
        ? '<span class="badge badge-green">● Activo</span>'
        : '<span class="badge badge-gray">Cerrado</span>';

    const pollos = c.cantidad_pollos != null ? c.cantidad_pollos.toLocaleString() : '—';
    return `<tr>
      <td class="mono">${c.id_ciclo}</td>
      <td>${c.nombre_ciclo || '—'}</td>
      <td>${galpon}</td>
      <td class="mono">${fechaInicio || '—'}</td>
      <td class="mono">${fechaFin || 'En curso'}</td>
      <td class="mono">${dias !== '—' ? dias + ' días' : '—'}</td>
      <td class="mono">${pollos}</td>
      <td>${estadoBadge}</td>
      ${isAdmin() ? `<td><button class="btn-icon" onclick="prepareEditCiclo(${c.id_ciclo})" title="Editar">✏️</button></td>` : '<td>—</td>'}
    </tr>`;
  }).join('') || '<tr><td colspan="9" style="text-align:center;color:var(--text3);padding:20px">Sin ciclos registrados</td></tr>';

  // ── Costo acumulado por ciclo activo ──
  const [admiAlimC, admiMedC, ingAlimC, ingMedC] = await Promise.all([
    tryGet('/admi-alimento',    'admiAlimento'),
    tryGet('/admi-medicamento', 'admiMedicamento'),
    tryGet('/ing-alimento',     'ingAlimento'),
    tryGet('/ing-medicamento',  'ingMedicamento'),
  ]);

  // Precio promedio por tipo (valor_total / cantidad)
  const precioAlim = {};
  ingAlimC.forEach(r => {
    const k = r.id_tipo_alimento?.id_tipo_alimento;
    if (!k) return;
    if (!precioAlim[k]) precioAlim[k] = { val: 0, cant: 0 };
    precioAlim[k].val  += +r.valor_total || 0;
    precioAlim[k].cant += +r.cantidad    || 0;
  });
  const precioMed = {};
  ingMedC.forEach(r => {
    const k = r.id_tipo_medicamento?.id_tipo_medicamento;
    if (!k) return;
    if (!precioMed[k]) precioMed[k] = { val: 0, cant: 0 };
    precioMed[k].val  += +r.valor_total || 0;
    precioMed[k].cant += +r.cantidad    || 0;
  });

  const ciclosActivos = S.ciclos.filter(c => { const f = toDateStr(c.fecha_fin); return !f || f >= todayStr; });
  document.getElementById('costos-ciclos-tbody').innerHTML = ciclosActivos.map(c => {
    const vins   = S.vinculos.filter(v => v.id_ciclo?.id_ciclo === c.id_ciclo);
    const galpon = [...new Set(vins.map(v => v.id_galpon?.nombre).filter(Boolean))].join(', ') || '—';
    const invPollos = (+c.cantidad_pollos || 0) * (+c.valor_pollo || 0);

    const costoAlim = admiAlimC
      .filter(r => r.id_ciclo?.id_ciclo === c.id_ciclo)
      .reduce((a, r) => {
        const k   = r.id_tipo_alimento?.id_tipo_alimento;
        const avg = k && precioAlim[k]?.cant > 0 ? precioAlim[k].val / precioAlim[k].cant : 0;
        return a + (+r.cantidad_utilizada || 0) * avg;
      }, 0);

    const costoMed = admiMedC
      .filter(r => r.id_ciclo?.id_ciclo === c.id_ciclo)
      .reduce((a, r) => {
        const k   = r.id_tipo_medicamento?.id_tipo_medicamento;
        const avg = k && precioMed[k]?.cant > 0 ? precioMed[k].val / precioMed[k].cant : 0;
        return a + (+r.cantidad_utilizada_medi || 0) * avg;
      }, 0);

    const total = invPollos + costoAlim + costoMed;
    const fmtP  = n => '$' + Math.round(n).toLocaleString('es-CO');
    return `<tr>
      <td>${c.nombre_ciclo || `Ciclo ${c.id_ciclo}`}</td>
      <td>${galpon}</td>
      <td class="mono">${invPollos ? fmtP(invPollos) : '—'}</td>
      <td class="mono">${costoAlim ? fmtP(costoAlim) : '—'}</td>
      <td class="mono">${costoMed  ? fmtP(costoMed)  : '—'}</td>
      <td class="mono" style="font-weight:700">${total ? fmtP(total) : '—'}</td>
    </tr>`;
  }).join('') || '<tr><td colspan="6" style="text-align:center;color:var(--text3);padding:20px">Sin ciclos activos</td></tr>';
}

// ─── EDITAR / ELIMINAR CICLO ──────────────────────────────
async function prepareEditCiclo(id) {
  const ciclo = S.ciclos.find(c => c.id_ciclo === id);
  if (!ciclo) { toast('❌', 'Ciclo no encontrado', '', 't-warn'); return; }

  document.getElementById('ec-id').value          = ciclo.id_ciclo;
  document.getElementById('ec-nombre').value      = ciclo.nombre_ciclo || '';
  document.getElementById('ec-inicio').value      = toDateStr(ciclo.fecha_inicio) || '';
  document.getElementById('ec-fin').value         = toDateStr(ciclo.fecha_fin)    || '';
  document.getElementById('ec-pollos').value      = ciclo.cantidad_pollos != null ? ciclo.cantidad_pollos : '';
  document.getElementById('ec-valor-pollo').value = ciclo.valor_pollo    != null ? ciclo.valor_pollo    : '';

  // Buscar los vínculos de este ciclo para los galpones actuales
  const vins = (S.vinculos || []).filter(v =>
      v.id_ciclo?.id_ciclo === ciclo.id_ciclo
  );

  // ID de galpones ya vinculados a ESTE ciclo
  const galponesActuales = vins.map(v => v.id_galpon?.id_galpon).filter(Boolean);

  // Galpones ocupados por OTRO ciclo activo
  const hoyStr2 = today();
  const ocupadosPorOtro = new Set(
    (S.vinculos || [])
      .filter(v => v.id_ciclo?.id_ciclo !== ciclo.id_ciclo &&
                   (!v.fecha_fin || toDateStr(v.fecha_fin) >= hoyStr2))
      .map(v => v.id_galpon?.id_galpon)
      .filter(Boolean)
  );

  const lista = document.getElementById('ec-galpon-lista');
  lista.innerHTML = S.galpones.map(g => {
    const bloqueado = ocupadosPorOtro.has(g.id_galpon);
    return `
    <label style="display:flex;align-items:center;gap:10px;cursor:${bloqueado?'not-allowed':'pointer'};font-size:14px;color:${bloqueado?'var(--text3)':'var(--text)'}">
      <input type="checkbox" value="${g.id_galpon}"
        ${galponesActuales.includes(g.id_galpon) ? 'checked' : ''}
        ${bloqueado ? 'disabled' : ''}
        style="width:16px;height:16px;accent-color:var(--green,#22c55e);cursor:${bloqueado?'not-allowed':'pointer'}"
        onchange="updateEcGalponPreview()">
      <span>${g.nombre}</span>
      <span style="margin-left:auto;font-size:11px;color:var(--text3)">${bloqueado ? '🔒 ciclo activo' : (g.capacidad?.toLocaleString() || '') + ' aves'}</span>
    </label>`;
  }).join('');

  updateEcGalponPreview();

  const errBox = document.getElementById('ec-error-msg');
  if (errBox) errBox.style.display = 'none';
  openModal('modal-editar-ciclo');
}

function updateEcGalponPreview() {
  const checks = document.querySelectorAll('#ec-galpon-lista input[type=checkbox]:checked');
  const nombres = Array.from(checks).map(c => c.closest('label').querySelector('span').textContent);
  document.getElementById('ec-galpon-preview').textContent =
      nombres.length > 0 ? '✔ ' + nombres.join(', ') : 'Ningún galpón seleccionado';
}

async function updateCiclo() {
  const errBox  = document.getElementById('ec-error-msg');
  const errText = document.getElementById('ec-error-text');
  if (errBox) errBox.style.display = 'none';

  const id     = v('ec-id');
  const nombre = v('ec-nombre')?.trim();
  const inicio = v('ec-inicio');
  const fin    = v('ec-fin') || null;

  const checks = document.querySelectorAll('#ec-galpon-lista input[type=checkbox]:checked');
  const galponesSeleccionados = Array.from(checks).map(c => +c.value);

  if (!nombre) {
    if (errBox && errText) { errText.textContent = 'El nombre es obligatorio.'; errBox.style.display = ''; }
    return;
  }
  if (!inicio) {
    if (errBox && errText) { errText.textContent = 'La fecha de inicio es obligatoria.'; errBox.style.display = ''; }
    return;
  }
  if (fin && fin < inicio) {
    if (errBox && errText) { errText.textContent = 'La fecha fin no puede ser anterior a la de inicio.'; errBox.style.display = ''; }
    return;
  }
  if (galponesSeleccionados.length === 0) {
    if (errBox && errText) { errText.textContent = 'Selecciona al menos un galpón.'; errBox.style.display = ''; }
    return;
  }

  try {
    // 1. Actualizar nombre del ciclo
    const rCiclo = await fetch(S.apiBase + '/ciclo-produccion/' + id, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify({
        nombre_ciclo:   nombre,
        fecha_inicio:   inicio,
        fecha_fin:      fin,
        cantidad_pollos: v('ec-pollos') ? +v('ec-pollos') : null,
        valor_pollo:    v('ec-valor-pollo') ? +v('ec-valor-pollo') : null,
      })
    });
    if (!rCiclo.ok) {
      const err = await rCiclo.json().catch(() => ({}));
      throw new Error(err.message || 'Error al actualizar el ciclo');
    }

    // 2. Borrar todos los vínculos actuales de este ciclo
    const vinculosActuales = (S.vinculos || []).filter(v =>
        v.id_ciclo?.id_ciclo === +id
    );
    for (const vin of vinculosActuales) {
      await fetch(S.apiBase + '/galpon-ciclo-produccion/' + vin.id_galpon_ciclo_produccion, {
        method: 'DELETE',
        headers: headers()
      });
    }

    // 3. Crear los nuevos vínculos con los galpones seleccionados
    for (const idGalpon of galponesSeleccionados) {
      const rVin = await fetch(S.apiBase + '/galpon-ciclo-produccion', {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          fecha_inicio: inicio,
          fecha_fin:    fin,
          id_galpon:    { id_galpon: idGalpon },
          id_ciclo:     { id_ciclo: +id }
        })
      });
      if (!rVin.ok) {
        const err = await rVin.json().catch(() => ({}));
        throw new Error(err.message || `Error al vincular galpón ${idGalpon}`);
      }
    }

    toast('✅', 'Ciclo actualizado');
    closeModal('modal-editar-ciclo');
    loadCiclos();

  } catch (err) {
    if (errBox && errText) { errText.textContent = err.message; errBox.style.display = ''; }
  }
}

async function deleteCiclo() {
  const id     = v('ec-id');
  const nombre = v('ec-nombre');
  if (!confirm(`⚠️ ¿Eliminar el ciclo "${nombre}"?\n\nSe eliminarán también todos los galpones vinculados.\nEsta acción no se puede deshacer.`)) return;

  try {
    // 1. Borrar primero todos los vínculos galpon-ciclo
    const vinculosActuales = (S.vinculos || []).filter(v =>
        v.id_ciclo?.id_ciclo === +id
    );
    for (const vin of vinculosActuales) {
      await fetch(S.apiBase + '/galpon-ciclo-produccion/' + vin.id_galpon_ciclo_produccion, {
        method: 'DELETE',
        headers: headers()
      });
    }

    // 2. Borrar el ciclo
    const r = await fetch(S.apiBase + '/ciclo-produccion/' + id, {
      method: 'DELETE',
      headers: headers()
    });
    if (!r.ok) { toast('❌', 'No se pudo eliminar el ciclo', '', 't-warn'); return; }

    toast('✅', 'Ciclo eliminado');
    closeModal('modal-editar-ciclo');
    loadCiclos();

  } catch {
    toast('❌', 'Error al eliminar', '', 't-warn');
  }
}

// ─── ALIMENTO ─────────────────────────────────────────────
async function loadTiposAlimento() {
  S.tiposAlimento = await tryGet('/tipo-alimento', 'tiposAlimento');
  const admin = isAdmin();
  const CAT_LABEL = { preiniciador: 'Preiniciador', iniciador: 'Iniciador', engorde: 'Engorde', finalizacion: 'Finalización' };
  document.getElementById('tipos-alimento-tbody').innerHTML = S.tiposAlimento.map(t => {
    const btn = admin
      ? '<button class="btn-icon" onclick="prepareEditTipoAlimento(' + t.id_tipo_alimento + ')" title="Editar">✏️</button>'
      : '—';
    return `<tr>
      <td class="mono">${t.id_tipo_alimento}</td>
      <td>${t.nombre_alimento}</td>
      <td>${t.categoria ? '<span class="badge badge-gray">' + (CAT_LABEL[t.categoria] || t.categoria) + '</span>' : '—'}</td>
      <td style="color:var(--text3)">${t.descripcion_alimento || '—'}</td>
      <td>${btn}</td>
    </tr>`;
  }).join('');
}

async function refreshStock(type) {
  const svgId = `spin-stock-${type}`;
  const svg = document.getElementById(svgId);
  if (svg) svg.classList.add('spin');
  try {
    if (type === 'alimento') await loadStockAlimento();
    else if (type === 'med') await loadStockMed();
  } finally {
    if (svg) svg.classList.remove('spin');
  }
}

async function loadStockAlimento() {
  const data = await tryGet('/stock-alimento', 'stockAlimento');
  const max  = Math.max(...data.map(d => +d.cantidad), 1);
  document.getElementById('stock-alimento-list').innerHTML = data.map(s => `
    <div style="margin-bottom:14px">
      <div style="display:flex;justify-content:space-between;margin-bottom:5px;font-size:13px">
        <span>${s.nombre_alimento || `Tipo ${s.id_tipo_alimento}`}</span>
        <span class="mono">${(+s.cantidad).toLocaleString()} kg</span>
      </div>
      <div class="prog-bar">
        <div class="prog-fill${+s.cantidad < 2000 ? ' danger' : +s.cantidad < 5000 ? ' warn' : ''}"
             style="width:${Math.max(2, (+s.cantidad / max * 100))}%"></div>
      </div>
    </div>`).join('') || '<div style="color:var(--text3)">Sin datos de stock</div>';

  const low = data.some(d => +d.cantidad < 2000);
  document.getElementById('badge-alimento').style.display = low ? 'inline' : 'none';
}

async function loadIngAlimento() {
  const data = await tryGet('/ing-alimento', 'ingAlimento');
  const admin = isAdmin();
  document.getElementById('ing-alimento-tbody').innerHTML = data.map(r => {
    const btnEdit = admin
      ? '<button class="btn-icon" onclick="prepareEditIngAlimento(' + r.id_IngAlimento + ')" title="Editar">✏️</button>'
      : '—';
    return `<tr>
      <td class="mono">${r.id_IngAlimento}</td>
      <td>${r.id_tipo_alimento?.nombre_alimento || '—'}</td>
      <td class="mono">${(+r.cantidad).toLocaleString()}</td>
      <td class="mono">${toDateStr(r.fecha_ingreso) || '—'}</td>
      <td class="mono">${toDateStr(r.fecha_vencimiento) || '—'}</td>
      <td class="mono">${r.valor_total != null ? '$' + (+r.valor_total).toLocaleString() : '—'}</td>
      <td>${btnEdit}</td>
    </tr>`;
  }).join('') || '<tr><td colspan="7" style="text-align:center;color:var(--text3)">Sin registros</td></tr>';
}

// ─── MEDICAMENTOS ─────────────────────────────────────────
async function loadTiposMed() {
  S.tiposMed = await tryGet('/tipo-medicamento', 'tiposMed');
  document.getElementById('tipos-med-tbody').innerHTML = S.tiposMed.map(t => `
    <tr>
      <td>${t.nombre || '—'}</td>
      <td style="color:var(--text3)">${t.categoria || '—'}</td>
      <td>${t.unidad || '—'}</td>
      <td>${t.periodo_retiro != null ? t.periodo_retiro + ' días' : '—'}</td>
      <td>${isAdmin() ? `<button class="btn-icon" onclick="prepareEditTipoMed(${t.id_tipo_medicamento})" title="Editar">✏️</button>` : '—'}</td>
    </tr>`).join('');
}

async function loadStockMed() {
  const data = await tryGet('/stock-medicamento', 'stockMed');
  const max  = Math.max(...data.map(d => +d.cantidadActual), 1);

  document.getElementById('stock-med-list').innerHTML = data.map(m => {
    const cantidad = +m.cantidadActual;
    const nombre   = m.id_tipo_medicamento?.nombre || `Tipo ${m.id_stock_medicamento}`;
    const unidad   = m.id_unidad?.nombre || '';
    return `
    <div style="margin-bottom:14px">
      <div style="display:flex;justify-content:space-between;margin-bottom:5px;font-size:13px">
        <span>${nombre}</span>
        <span class="mono">${cantidad.toLocaleString()} ${unidad}</span>
      </div>
      <div class="prog-bar">
        <div class="prog-fill${cantidad < 5 ? ' danger' : cantidad < 20 ? ' warn' : ''}"
             style="width:${Math.max(2, (cantidad / max * 100))}%"></div>
      </div>
    </div>`;
  }).join('') || '<div style="color:var(--text3)">Sin datos de stock</div>';

  const low = data.some(m => +m.cantidadActual < 5);
  document.getElementById('badge-med').style.display = low ? 'inline' : 'none';
}

async function loadIngMed() {
  const data = await tryGet('/ing-medicamento', 'ingMed');
  const admin = isAdmin();
  document.getElementById('ing-med-tbody').innerHTML = data.map(r => {
    const btnEdit = admin
      ? '<button class="btn-icon" onclick="prepareEditIngMed(' + r.ing_medicamento + ')" title="Editar">✏️</button>'
      : '—';
    return `<tr>
      <td class="mono">${r.ing_medicamento}</td>
      <td>${r.id_tipo_medicamento?.nombre || '—'}</td>
      <td class="mono">${+r.cantidad}</td>
      <td class="mono">${toDateStr(r.fecha_ingreso) || '—'}</td>
      <td class="mono">${toDateStr(r.fecha_vencimiento) || '—'}</td>
      <td class="mono">${r.valor_total != null ? '$' + (+r.valor_total).toLocaleString() : '—'}</td>
      <td>${btnEdit}</td>
    </tr>`;
  }).join('') || '<tr><td colspan="7" style="text-align:center;color:var(--text3)">Sin registros</td></tr>';
}

// ─── MORTALIDAD ───────────────────────────────────────────
async function loadTiposMuerte() {
  S.tiposMuerte = await tryGet('/tipo-muerte', 'tiposMuerte');
  document.getElementById('tipos-muerte-tbody').innerHTML = S.tiposMuerte.map(t => `
    <tr>
      <td class="mono">${t.id_tipo_muerte}</td>
      <td>${t.nombre}</td>
      <td style="color:var(--text3)">${t.descripcion || '—'}</td>
      <td>${isAdmin() ? `<button class="btn-icon" onclick="prepareEditTipoMuerte(${t.id_tipo_muerte})" title="Editar">✏️</button>` : '—'}</td>
    </tr>`).join('') ||
      '<tr><td colspan="4" style="text-align:center;color:var(--text3)">Sin registros</td></tr>';
}
async function loadMortalidad() {
  const data = await tryGet('/mortalidad', 'mortalidad');
  const hoy  = new Date().toISOString().split('T')[0];
  if (!S.ciclos) S.ciclos = await tryGet('/ciclo-produccion', 'ciclos');

  const totalBajas = data.reduce((a, m) => a + (+m.muertos || 0), 0);
  const totalPollosSistema = S.ciclos.reduce((a, c) => a + (+c.cantidad_pollos || 0), 0);
  const tasaGlobal = totalPollosSistema > 0 ? (totalBajas / totalPollosSistema * 100).toFixed(1) : null;

  document.getElementById('m-total').textContent    = totalBajas;
  document.getElementById('m-hoy').textContent      = data.filter(m => m.fecha_de_muerte === hoy).reduce((a, m) => a + (+m.muertos || 0), 0);
  document.getElementById('m-galpones').textContent = [...new Set(data.map(m => m.id_galpon?.id_galpon).filter(Boolean))].length;
  document.getElementById('m-tasa').textContent     = tasaGlobal != null ? tasaGlobal + '%' : '—';

  // Tasa por ciclo
  const bajasPorCiclo = {};
  data.forEach(m => {
    const cid = m.id_ciclo?.id_ciclo;
    if (!cid) return;
    if (!bajasPorCiclo[cid]) bajasPorCiclo[cid] = { nombre: m.id_ciclo?.nombre_ciclo || `Ciclo ${cid}`, bajas: 0 };
    bajasPorCiclo[cid].bajas += +m.muertos || 0;
  });
  document.getElementById('tasa-ciclo-tbody').innerHTML = S.ciclos.map(c => {
    const pollos = +c.cantidad_pollos || 0;
    const bajas  = bajasPorCiclo[c.id_ciclo]?.bajas || 0;
    const tasa   = pollos > 0 ? (bajas / pollos * 100).toFixed(1) : null;
    const color  = tasa == null ? 'var(--text3)' : tasa >= 6 ? 'var(--red)' : tasa >= 3 ? '#f59e0b' : 'var(--green,#22c55e)';
    return `<tr>
      <td>${c.nombre_ciclo || `Ciclo ${c.id_ciclo}`}</td>
      <td class="mono">${pollos ? pollos.toLocaleString() : '—'}</td>
      <td class="mono" style="color:var(--red)">${bajas.toLocaleString()}</td>
      <td class="mono" style="color:${color};font-weight:700">${tasa != null ? tasa + '%' : '—'}</td>
    </tr>`;
  }).join('') || '<tr><td colspan="4" style="text-align:center;color:var(--text3)">Sin ciclos</td></tr>';

  document.getElementById('mortalidad-tbody').innerHTML = data.map(m => `
    <tr>
      <td class="mono">${m.id_Mortalidad}</td>
      <td>${m.id_ciclo?.nombre_ciclo || '—'}</td>
      <td>${m.id_galpon?.nombre     || '—'}</td>
      <td>${m.id_tipo_muerte?.nombre || '—'}</td>
      <td class="mono">${m.fecha_de_muerte}</td>
      <td style="color:var(--red);font-weight:700">${m.muertos}</td>
      <td style="color:var(--text3)">${m.causa || '—'}</td>
      <td>${isAdmin() ? `<button class="btn-icon" onclick="prepareEditMortalidad(${m.id_Mortalidad})" title="Editar">✏️</button>` : '—'}</td>
    </tr>`).join('') ||
      '<tr><td colspan="8" style="text-align:center;color:var(--text3)">Sin registros</td></tr>';

  // Gráfica por tipo de causa
  const byCausa = {};
  data.forEach(m => {
    const k = m.id_tipo_muerte?.nombre || 'Sin tipo';
    byCausa[k] = (byCausa[k] || 0) + (+m.muertos || 0);
  });
  const entries = Object.entries(byCausa);
  const maxC    = Math.max(...entries.map(e => e[1]), 1);
  document.getElementById('chart-causas').innerHTML = entries.map(([k, val]) => `
  <div class="bar-col">
    <span class="bar-val">${val}</span>
    <div class="bar red" style="height:${(val / maxC * 110)}px" data-val="${val}"></div>
    <div class="bar-lbl">${k.split(' ')[0]}</div>
  </div>`).join('') || '<span style="color:var(--text3);font-size:12px">Sin datos</span>';

  // Gráfica por mes
  const byMes = {};
  data.forEach(m => {
    const d = toDateStr(m.fecha_de_muerte);
    if (!d) return;
    const k = d.slice(0, 7); // "YYYY-MM"
    byMes[k] = (byMes[k] || 0) + (+m.muertos || 0);
  });
  const mesSorted = Object.entries(byMes).sort(([a], [b]) => a.localeCompare(b));
  const maxM = Math.max(...mesSorted.map(e => e[1]), 1);
  const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  document.getElementById('chart-mes').innerHTML = mesSorted.map(([k, val]) => {
    const [y, mo] = k.split('-');
    const lbl = MESES[+mo - 1] + ' ' + y.slice(2);
    return `<div class="bar-col">
      <span class="bar-val">${val}</span>
      <div class="bar red" style="height:${(val / maxM * 110)}px" data-val="${val}"></div>
      <div class="bar-lbl">${lbl}</div>
    </div>`;
  }).join('') || '<span style="color:var(--text3);font-size:12px">Sin datos</span>';

  // Gráfica por ciclo de producción
  const byCiclo = {};
  data.forEach(m => {
    const k = m.id_ciclo?.nombre_ciclo || `Ciclo ${m.id_ciclo?.id_ciclo || '?'}`;
    byCiclo[k] = (byCiclo[k] || 0) + (+m.muertos || 0);
  });
  const cicloEntries = Object.entries(byCiclo);
  const maxCi = Math.max(...cicloEntries.map(e => e[1]), 1);
  document.getElementById('chart-ciclo').innerHTML = cicloEntries.map(([k, val]) => {
    const words = k.trim().split(/\s+/);
    const lbl = words.length > 1 ? words.slice(-2).join(' ') : k;
    return `<div class="bar-col" title="${k}">
      <span class="bar-val">${val}</span>
      <div class="bar red" style="height:${(val / maxCi * 110)}px" data-val="${val}"></div>
      <div class="bar-lbl" style="white-space:normal;line-height:1.2">${lbl}</div>
    </div>`;
  }).join('') || '<span style="color:var(--text3);font-size:12px">Sin datos</span>';

  // Gráfico agrupado: por ciclo activo → una barra por tipo de muerte
  const hoyStr = today();
  const ciclosActivos = (S.ciclos || []).filter(c => {
    const fin = toDateStr(c.fecha_fin);
    return !fin || fin >= hoyStr;
  });
  const grupos = ciclosActivos.map(c => {
    const vins   = (S.vinculos || []).filter(v => v.id_ciclo?.id_ciclo === c.id_ciclo);
    const galpon = [...new Set(vins.map(v => v.id_galpon?.nombre).filter(Boolean))].join(', ') || '?';
    const registros = data.filter(m => m.id_ciclo?.id_ciclo === c.id_ciclo);
    const byTipo = {};
    registros.forEach(m => {
      const t = m.id_tipo_muerte?.nombre || 'Sin tipo';
      byTipo[t] = (byTipo[t] || 0) + (+m.muertos || 0);
    });
    return { nombre: c.nombre_ciclo || `Ciclo ${c.id_ciclo}`, galpon, byTipo };
  }).filter(g => Object.keys(g.byTipo).length > 0);

  const chartEl = document.getElementById('chart-mort-ciclo-agrupado');
  if (!grupos.length) {
    chartEl.innerHTML = '<span style="color:var(--text3);font-size:12px">Sin datos en ciclos activos</span>';
  } else {
    const allVals = grupos.flatMap(g => Object.values(g.byTipo));
    const maxV = Math.max(...allVals, 1);
    const BAR_H = 120;
    chartEl.style.height = 'auto';
    chartEl.style.alignItems = 'stretch';
    chartEl.innerHTML = grupos.map(g => {
      const bars = Object.entries(g.byTipo).map(([tipo, val]) => {
        const words = tipo.trim().split(/\s+/);
        const lbl = words.length > 1 ? words.slice(-2).join(' ') : tipo;
        return `<div class="bar-col" title="${tipo}: ${val.toLocaleString()} bajas" style="min-width:36px">
          <span class="bar-val" style="font-size:10px">${val.toLocaleString()} bajas</span>
          <div class="bar red" style="height:${(val/maxV*BAR_H)}px" data-val="${val.toLocaleString()} bajas"></div>
          <div class="bar-lbl" style="white-space:normal;line-height:1.2">${lbl}</div>
        </div>`;
      }).join('');
      const words = g.nombre.trim().split(/\s+/);
      const cicloLbl = words.length > 1 ? words.slice(-2).join(' ') : g.nombre;
      return `<div style="display:flex;flex-direction:column;align-items:center;gap:6px;padding:0 12px;border-right:1px solid var(--border)">
        <div style="display:flex;align-items:flex-end;gap:6px;min-height:${BAR_H + 40}px">${bars}</div>
        <div style="font-size:11px;font-weight:600;color:var(--text2);text-align:center;white-space:normal;line-height:1.3">
          ${cicloLbl}<br><span style="font-size:10px;font-weight:400;color:var(--text3)">${g.galpon}</span>
        </div>
      </div>`;
    }).join('');
  }

  // Gráfico agrupado: ciclos FINALIZADOS → una barra por tipo de muerte
  const ciclosFinalizados = (S.ciclos || []).filter(c => {
    const fin = toDateStr(c.fecha_fin);
    return fin && fin < hoyStr;
  });
  const gruposFin = ciclosFinalizados.map(c => {
    const vins   = (S.vinculos || []).filter(v => v.id_ciclo?.id_ciclo === c.id_ciclo);
    const galpon = [...new Set(vins.map(v => v.id_galpon?.nombre).filter(Boolean))].join(', ') || '?';
    const registros = data.filter(m => m.id_ciclo?.id_ciclo === c.id_ciclo);
    const byTipo = {};
    registros.forEach(m => {
      const t = m.id_tipo_muerte?.nombre || 'Sin tipo';
      byTipo[t] = (byTipo[t] || 0) + (+m.muertos || 0);
    });
    return { nombre: c.nombre_ciclo || `Ciclo ${c.id_ciclo}`, galpon, byTipo };
  }).filter(g => Object.keys(g.byTipo).length > 0);

  const chartElFin = document.getElementById('chart-mort-ciclo-fin');
  if (!gruposFin.length) {
    chartElFin.innerHTML = '<span style="color:var(--text3);font-size:12px">Sin datos en ciclos finalizados</span>';
  } else {
    const allValsFin = gruposFin.flatMap(g => Object.values(g.byTipo));
    const maxVF = Math.max(...allValsFin, 1);
    const BAR_H = 120;
    chartElFin.style.height = 'auto';
    chartElFin.style.alignItems = 'stretch';
    chartElFin.innerHTML = gruposFin.map(g => {
      const bars = Object.entries(g.byTipo).map(([tipo, val]) => {
        const words = tipo.trim().split(/\s+/);
        const lbl = words.length > 1 ? words.slice(-2).join(' ') : tipo;
        return `<div class="bar-col" title="${tipo}: ${val.toLocaleString()} bajas" style="min-width:36px">
          <span class="bar-val" style="font-size:10px">${val.toLocaleString()} bajas</span>
          <div class="bar red" style="height:${(val/maxVF*BAR_H)}px;opacity:0.6" data-val="${val.toLocaleString()} bajas"></div>
          <div class="bar-lbl" style="white-space:normal;line-height:1.2">${lbl}</div>
        </div>`;
      }).join('');
      const words = g.nombre.trim().split(/\s+/);
      const cicloLbl = words.length > 1 ? words.slice(-2).join(' ') : g.nombre;
      return `<div style="display:flex;flex-direction:column;align-items:center;gap:6px;padding:0 12px;border-right:1px solid var(--border)">
        <div style="display:flex;align-items:flex-end;gap:6px;min-height:${BAR_H + 40}px">${bars}</div>
        <div style="font-size:11px;font-weight:600;color:var(--text2);text-align:center;white-space:normal;line-height:1.3">
          ${cicloLbl}<br><span style="font-size:10px;font-weight:400;color:var(--text3)">${g.galpon}</span>
        </div>
      </div>`;
    }).join('');
  }
}
// ─── ADMINISTRACIÓN DE ALIMENTO ───────────────────────────
async function loadAdmAlimento() {
  const data = await tryGet('/admi-alimento', 'admAlimento');
  document.getElementById('adm-alimento-tbody').innerHTML = data.map(r => `
    <tr>
      <td class="mono">${r.id_admi_alimento}</td>
      <td>${r.nombre_alimento  || '—'}</td>
      <td>${r.nombre_galpon    || '—'}</td>
      <td>${r.nombre_ciclo     || '—'}</td>
      <td class="mono">${(+r.cantidad_utilizada).toLocaleString()} kg</td>
      <td class="mono">${r.fecha_alimentacion}</td>
      <td>${r.nombre_usuario   || '—'}</td>
      <td>${isAdmin() ? `<button class="btn-icon" onclick="prepareEditAdmAlimento(${r.id_admi_alimento})" title="Editar">✏️</button>` : '—'}</td>
    </tr>`).join('') ||
      '<tr><td colspan="8" style="text-align:center;color:var(--text3)">Sin registros</td></tr>';

  // Gráficos agrupados por ciclo: activos y finalizados
  const hoyStr = today();
  const buildGrupos = (ciclos) => ciclos.map(c => {
    const vins   = (S.vinculos || []).filter(v => v.id_ciclo?.id_ciclo === c.id_ciclo);
    const galpon = [...new Set(vins.map(v => v.id_galpon?.nombre).filter(Boolean))].join(', ') || '?';
    const byTipo = {};
    data.filter(r => r.id_ciclo === c.id_ciclo).forEach(r => {
      const t = r.nombre_alimento || 'Sin tipo';
      byTipo[t] = (byTipo[t] || 0) + (+r.cantidad_utilizada || 0);
    });
    return { nombre: c.nombre_ciclo || `Ciclo ${c.id_ciclo}`, galpon, byTipo };
  }).filter(g => Object.keys(g.byTipo).length > 0);

  renderGraficoCiclos('chart-consumo-ciclo',
    buildGrupos((S.ciclos || []).filter(c => { const f = toDateStr(c.fecha_fin); return !f || f >= hoyStr; })), null, 'kg');
  renderGraficoCiclos('chart-consumo-ciclo-fin',
    buildGrupos((S.ciclos || []).filter(c => { const f = toDateStr(c.fecha_fin); return f && f < hoyStr; })), '0.6', 'kg');
}

// ─── ADMINISTRACIÓN DE MEDICAMENTOS ──────────────────────
async function loadAdmMed() {
  const data = await tryGet('/admi-medicamento', 'admMed');
  document.getElementById('adm-med-tbody').innerHTML = data.map(r => `
    <tr>
      <td class="mono">${r.id_admi_medicamento}</td>
      <td>${r.nombre_med    || '—'}</td>
      <td>${r.nombre_galpon || '—'}</td>
      <td>${r.nombre_ciclo  || '—'}</td>
      <td class="mono">${+r.cantidad_utilizada}</td>
      <td class="mono">${r.fecha_medicacion}</td>
      <td>${r.nombre_usuario || '—'}</td>
      <td>${isAdmin() ? `<button class="btn-icon" onclick="prepareEditAdmMed(${r.id_admi_medicamento})" title="Editar">✏️</button>` : '—'}</td>
    </tr>`).join('') ||
      '<tr><td colspan="8" style="text-align:center;color:var(--text3)">Sin registros</td></tr>';

  // Gráficos agrupados por ciclo: activos y finalizados
  const hoyStrM = today();
  const buildGruposMed = (ciclos) => ciclos.map(c => {
    const vins   = (S.vinculos || []).filter(v => v.id_ciclo?.id_ciclo === c.id_ciclo);
    const galpon = [...new Set(vins.map(v => v.id_galpon?.nombre).filter(Boolean))].join(', ') || '?';
    const byTipo = {};
    data.filter(r => r.id_ciclo === c.id_ciclo).forEach(r => {
      const t = r.nombre_med || 'Sin tipo';
      byTipo[t] = (byTipo[t] || 0) + (+r.cantidad_utilizada || 0);
    });
    return { nombre: c.nombre_ciclo || `Ciclo ${c.id_ciclo}`, galpon, byTipo };
  }).filter(g => Object.keys(g.byTipo).length > 0);

  renderGraficoCiclos('chart-consumo-med',
    buildGruposMed((S.ciclos || []).filter(c => { const f = toDateStr(c.fecha_fin); return !f || f >= hoyStrM; })), null, 'und');
  renderGraficoCiclos('chart-consumo-med-fin',
    buildGruposMed((S.ciclos || []).filter(c => { const f = toDateStr(c.fecha_fin); return f && f < hoyStrM; })), '0.6', 'und');
}

// ─── USUARIOS ─────────────────────────────────────────────
async function loadUsuarios() {
  S.usuarios = await tryGet('/usuario', 'usuarios');
  const rolBadge   = r => r === 'admin' ? 'badge-yellow' : r === 'veterinario' ? 'badge-blue' : 'badge-gray';
  const estadoBadge = e => e ? '<span class="badge badge-green">Activo</span>' : '<span class="badge badge-gray">Inactivo</span>';
  const esAdmin = S.user?.rol === 'admin';

  document.getElementById('usuarios-tbody').innerHTML = S.usuarios.map(u => `
    <tr>
      <td class="mono">${u.cedula}</td>
      <td>${u.nombre}</td>
      <td>${u.apellido}</td>
      <td><span class="badge ${rolBadge(u.rol)}">${u.rol}</span></td>
      <td class="mono">${u.fecha_registro}</td>
      <td>${estadoBadge(u.estado)}</td>
      <td>${esAdmin ? `<button class="btn-icon" onclick="prepareEditUsuario(${u.cedula})" title="Editar">✏️</button>` : '—'}</td>
    </tr>`).join('');
}

function prepareEditUsuario(cedula) {
  const u = S.usuarios.find(x => x.cedula === cedula);
  if (!u) return;

  _editandoUsuario = cedula;

  // Cambiar título y modo de cédula
  document.getElementById('modal-usuario-titulo').textContent = 'Editar Usuario';
  const inputCedula = document.getElementById('u-cedula');
  inputCedula.value    = u.cedula;
  inputCedula.readOnly = true;
  inputCedula.style.background = 'var(--bg2)';

  // Rellenar campos
  document.getElementById('u-nombre').value    = u.nombre;
  document.getElementById('u-apellido').value  = u.apellido;
  document.getElementById('u-fecha').value     = u.fecha_registro;
  document.getElementById('u-correo').value    = u.correo || '';
  document.getElementById('u-contrasena').value = ''; // siempre vacío al editar
  document.getElementById('u-rol').value       = u.rol;
  document.getElementById('u-estado').value    = String(u.estado ?? true);

  // Mostrar campo estado e hint de contraseña
  document.getElementById('u-estado-group').style.display = '';
  document.getElementById('u-pass-hint').style.display    = '';

  openModal('modal-usuario');
}
// ─── UNIDADES DE MEDIDA ───────────────────────────────────
async function loadUnidades() {
  S.unidades = await tryGet('/unidad-medida', 'unidades');
  document.getElementById('unidad-tbody').innerHTML = S.unidades.map(u => `
    <tr><td class="mono">${u.id}</td><td>${u.nombre}</td></tr>`).join('');
}

// ─── ENVÍO DE FORMULARIOS (POST) ──────────────────────────
async function doPost(path, payload, modalId, reloadFn, label) {
  try {
    await POST(path, payload);
    toast('✅', label + ' registrado', path);
  } catch {
    toast('⚠️', label + 'No se pudo conectar al API', 't-warn');
  }
  closeModal(modalId);
  reloadFn?.();
}

//---- actualizacion de formularios (put)

async function doPut(path, payload, modalId, reloadFn, label) {
  try {
    await PUT(path, payload);
    toast('✅', label + ' actualizado', path);
  } catch {
    toast('⚠️', label + ': No se pudo conectar al API', 't-warn');
  }
  closeModal(modalId);
  if (reloadFn) reloadFn();
}

// Helpers de lectura de inputs
function v(id) { return document.getElementById(id)?.value || ''; }

function calcSugerenciaGalpon() {
  const metros = +v('g-metros');
  const sugerencia = document.getElementById('g-sugerencia');
  const sugerenciaVal = document.getElementById('g-sugerencia-val');
  if (metros > 0) {
    const max = Math.round(metros * 10);
    sugerenciaVal.textContent = max.toLocaleString();
    sugerencia.style.display = '';
    document.getElementById('g-capacidad').placeholder = max;
    checkCapacidadGalpon();
  } else {
    sugerencia.style.display = 'none';
    document.getElementById('g-alerta').style.display = 'none';
    document.getElementById('g-capacidad').placeholder = '—';
  }
}

function checkCapacidadGalpon() {
  const metros = +v('g-metros');
  const capacidad = +v('g-capacidad');
  const alerta = document.getElementById('g-alerta');
  if (metros > 0 && capacidad > 0 && capacidad > metros * 10) {
    alerta.style.display = '';
  } else {
    alerta.style.display = 'none';
  }
}

async function postGalpon() {
  const errBox  = document.getElementById('g-error-msg');
  const errText = document.getElementById('g-error-text');
  if (errBox) errBox.style.display = 'none';

  const nombre   = v('g-nombre')?.trim();
  const capacidad = +v('g-capacidad');
  const metros   = v('g-metros') ? +v('g-metros') : null;

  if (!nombre) {
    if (errBox && errText) { errText.textContent = 'El nombre es obligatorio.'; errBox.style.display = ''; }
    return;
  }
  if (!capacidad || capacidad <= 0) {
    if (errBox && errText) { errText.textContent = 'Ingresa la capacidad de pollos.'; errBox.style.display = ''; }
    return;
  }

  try {
    const r = await fetch(S.apiBase + '/galpon', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, capacidad, metros_cuadrados: metros })
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({}));
      if (errBox && errText) { errText.textContent = err.message || 'Error al guardar el galpón.'; errBox.style.display = ''; }
      return;
    }
    toast('✅', 'Galpón creado');
    closeModal('modal-galpon');
    loadGalpones();
  } catch {
    if (errBox && errText) { errText.textContent = 'No se pudo conectar con el servidor.'; errBox.style.display = ''; }
  }
}
async function postCiclo() {
  const nombre = v('c-nombre');
  const inicio = v('c-inicio');
  const fin    = v('c-fin') || null;

  const checks = document.querySelectorAll('#c-galpon-lista input[type=checkbox]:checked');
  const galponesSeleccionados = Array.from(checks).map(c => +c.value);

  if (!nombre) {
    toast('⚠️', 'Nombre requerido', 'Escribe un nombre para el ciclo', 't-warn'); return;
  }
  if (!inicio) {
    toast('⚠️', 'Fecha inicio requerida', '', 't-warn'); return;
  }
  if (fin && fin < inicio) {
    toast('⚠️', 'Fecha inválida', 'La fecha fin no puede ser anterior a la de inicio', 't-warn'); return;
  }
  if (galponesSeleccionados.length === 0) {
    toast('⚠️', 'Galpón requerido', 'Selecciona al menos un galpón', 't-warn'); return;
  }

  try {
    // 1. Crear el ciclo
    const resCiclo = await fetch(S.apiBase + '/ciclo-produccion', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({
        nombre_ciclo:    nombre,
        fecha_inicio:    inicio,
        fecha_fin:       fin,
        cantidad_pollos: v('c-pollos') ? +v('c-pollos') : null,
        valor_pollo:     v('c-valor-pollo') ? +v('c-valor-pollo') : null,
      })
    });

    if (!resCiclo.ok) {
      const err = await resCiclo.json().catch(() => ({}));
      throw new Error(err.message || `Error ${resCiclo.status} al crear el ciclo`);
    }

    const cicloData = await resCiclo.json();
    const idCiclo = cicloData.data?.id_ciclo;

    if (!idCiclo) {
      throw new Error('El servidor no devolvió el ID del ciclo creado');
    }

    // 2. Crear un vínculo por cada galpón seleccionado, uno a uno para detectar errores
    for (const idGalpon of galponesSeleccionados) {
      const resVinculo = await fetch(S.apiBase + '/galpon-ciclo-produccion', {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          fecha_inicio: inicio,
          fecha_fin:    fin,
          id_galpon:    { id_galpon: idGalpon },
          id_ciclo:     { id_ciclo: idCiclo }
        })
      });

      if (!resVinculo.ok) {
        const err = await resVinculo.json().catch(() => ({}));
        throw new Error(err.message || `Error ${resVinculo.status} al vincular galpón ${idGalpon}`);
      }
    }

    toast('✅', 'Ciclo creado', `${galponesSeleccionados.length} galpón(es) vinculados`);
    closeModal('modal-ciclo');
    loadCiclos();

  } catch (err) {
    toast('❌', 'Error al guardar', err.message, 't-warn');
  }
}
function updateGalponPreview() {
  const checks = document.querySelectorAll('#c-galpon-lista input[type=checkbox]:checked');
  const nombres = Array.from(checks).map(c => c.closest('label').querySelector('span').textContent);
  document.getElementById('c-galpon-preview').textContent =
      nombres.length > 0 ? '✔ ' + nombres.join(', ') : 'Ningún galpón seleccionado';
}
// Llena un <select> de galpones con opción pre-seleccionada
async function fillGalponSelect(selectId, selectedId = null) {
  const galpones = await tryGet('/galpon', 'galpones');
  const sel = document.getElementById(selectId);
  sel.innerHTML = '<option value="">— Seleccione un galpón —</option>' +
      galpones.map(g =>
          `<option value="${g.id_galpon}" ${g.id_galpon === selectedId ? 'selected' : ''}>${g.nombre}</option>`
      ).join('');
}

async function postTipoAlimento() {
  const errBox  = document.getElementById('ta-error-msg');
  const errText = document.getElementById('ta-error-text');
  errBox.style.display = 'none';

  const nombre = v('ta-nombre')?.trim();
  if (!nombre) {
    errText.textContent = 'El nombre del tipo de alimento es obligatorio.';
    errBox.style.display = '';
    return;
  }

  // Validación local: ya existe en caché
  const existe = S.tiposAlimento.some(t =>
    t.nombre_alimento.toLowerCase() === nombre.toLowerCase()
  );
  if (existe) {
    errText.textContent = `Ya existe un tipo de alimento con el nombre "${nombre}".`;
    errBox.style.display = '';
    return;
  }

  try {
    const r = await fetch(S.apiBase + '/tipo-alimento', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre_alimento: nombre, categoria: v('ta-categoria') || null, descripcion_alimento: v('ta-desc') })
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({}));
      errText.textContent = err.message || 'Error al guardar el tipo de alimento.';
      errBox.style.display = '';
      return;
    }
    toast('✅', 'Tipo de alimento guardado');
    closeModal('modal-tipo-alimento');
    loadTiposAlimento();
    loadStockAlimento();
  } catch {
    errText.textContent = 'No se pudo conectar con el servidor.';
    errBox.style.display = '';
  }
}

async function loadEditarTiposAlimento() {
  const lista = document.getElementById('editar-tipos-lista');
  try {
    const data = await tryGet('/tipo-alimento', 'tiposAlimento');
    if (!data || data.length === 0) {
      lista.innerHTML = '<div style="color:var(--text3);font-size:12px;text-align:center;padding:20px">No hay tipos de alimento registrados</div>';
      return;
    }
    lista.innerHTML = data.map(t => `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:12px;border:1px solid var(--border);border-radius:6px;background:var(--bg2)">
        <div style="flex:1">
          <div style="font-weight:600;font-size:14px;color:var(--text)">${t.nombre_alimento}</div>
          <div style="font-size:12px;color:var(--text3);margin-top:4px">${t.descripcion_alimento || 'Sin descripción'}</div>
        </div>
        ${isAdmin() ? `<button class="btn btn-sm" onclick="deleteTipoAlimento(${t.id_tipo_alimento},'${t.nombre_alimento.replace(/'/g, "\\'")}');" style="background:var(--red);color:white;border:none;cursor:pointer;padding:6px 12px;border-radius:4px;font-size:12px">🗑️ Eliminar</button>` : ''}
      </div>
    `).join('');
  } catch (err) {
    lista.innerHTML = '<div style="color:var(--red);font-size:12px;text-align:center;padding:20px">Error al cargar tipos de alimento</div>';
  }
}

async function deleteTipoAlimento(id, nombre) {
  const confirmDelete = confirm(`⚠️ ADVERTENCIA DE ELIMINACIÓN\n\n¿Estás seguro de que deseas eliminar el tipo de alimento "${nombre}"?\n\nEsta acción no se puede deshacer y eliminará todos los registros asociados.`);
  if (!confirmDelete) return;

  try {
    const r = await fetch(S.apiBase + '/tipo-alimento/' + id, { method: 'DELETE' });
    if (!r.ok) {
      toast('❌', 'No se pudo eliminar', 'El tipo de alimento puede estar siendo usado en otros registros.', 't-error');
      return;
    }
    toast('✅', 'Tipo de alimento eliminado');
    await loadTiposAlimento();
    await loadEditarTiposAlimento();
  } catch (err) {
    toast('❌', 'Error al eliminar', 'No se pudo conectar con el servidor.', 't-error');
  }
}

function prepareEditTipoAlimento(id) {
  const t = S.tiposAlimento.find(x => x.id_tipo_alimento === id);
  if (!t) return;
  document.getElementById('eta-id').value = t.id_tipo_alimento;
  document.getElementById('eta-nombre').value = t.nombre_alimento;
  document.getElementById('eta-categoria').value = t.categoria || '';
  document.getElementById('eta-desc').value = t.descripcion_alimento || '';
  document.getElementById('eta-error-msg').style.display = 'none';
  openModal('modal-editar-tipo-alimento');
}

async function updateTipoAlimento() {
  const errBox  = document.getElementById('eta-error-msg');
  const errText = document.getElementById('eta-error-text');
  errBox.style.display = 'none';
  const id     = +document.getElementById('eta-id').value;
  const nombre = document.getElementById('eta-nombre').value.trim();
  if (!nombre) {
    errText.textContent = 'El nombre del tipo de alimento es obligatorio.';
    errBox.style.display = '';
    return;
  }
  try {
    const r = await fetch(S.apiBase + '/tipo-alimento/' + id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre_alimento: nombre, categoria: document.getElementById('eta-categoria').value || null, descripcion_alimento: document.getElementById('eta-desc').value })
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({}));
      errText.textContent = err.message || 'Error al actualizar el tipo de alimento.';
      errBox.style.display = '';
      return;
    }
    toast('✅', 'Tipo de alimento actualizado');
    closeModal('modal-editar-tipo-alimento');
    loadTiposAlimento();
    loadStockAlimento();
  } catch {
    errText.textContent = 'No se pudo conectar con el servidor.';
    errBox.style.display = '';
  }
}

async function loadStockPreviewAlimento() {
  const el = document.getElementById('ia-stock-list');
  if (!el) return;
  try {
    const data = await tryGet('/stock-alimento', 'stockAlimento');
    if (!data || data.length === 0) {
      el.innerHTML = '<span style="color:var(--text3)">Sin datos de stock</span>';
      return;
    }
    el.innerHTML = data.map(s => {
      const bajo = +s.cantidad < 2000;
      return `<div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid var(--border)">
        <span>${s.nombre_alimento || `Tipo ${s.id_tipo_alimento}`}</span>
        <span class="mono" style="color:${bajo ? 'var(--red)' : 'var(--green,#22c55e)'};font-weight:600">
          ${(+s.cantidad).toLocaleString()} kg${bajo ? ' ⚠️' : ''}
        </span>
      </div>`;
    }).join('');
  } catch {
    el.innerHTML = '<span style="color:var(--text3)">No se pudo cargar el stock</span>';
  }
}

async function postIngAlimento() {
  const errBox  = document.getElementById('ia-error-msg');
  const errText = document.getElementById('ia-error-text');
  if (errBox) errBox.style.display = 'none';

  // Validación
  if (!v('ia-tipo')) {
    if (errBox && errText) { errText.textContent = 'Selecciona un tipo de alimento.'; errBox.style.display = ''; }
    return;
  }
  if (!v('ia-cantidad') || +v('ia-cantidad') <= 0) {
    if (errBox && errText) { errText.textContent = 'La cantidad debe ser mayor a 0.'; errBox.style.display = ''; }
    return;
  }
  if (!v('ia-fecha')) {
    if (errBox && errText) { errText.textContent = 'Ingresa la fecha de ingreso.'; errBox.style.display = ''; }
    return;
  }
  if (!v('ia-fechav')) {
    if (errBox && errText) { errText.textContent = 'Ingresa la fecha de vencimiento.'; errBox.style.display = ''; }
    return;
  }

  const vtotal = v('ia-vtotal');
  const payload = {
    id_tipo_alimento: { id_tipo_alimento: +v('ia-tipo') },
    cantidad:    +v('ia-cantidad'),
    fecha_ingreso: v('ia-fecha'),
    fecha_vencimiento: v('ia-fechav'),
    valor_total: vtotal && +vtotal > 0 ? +vtotal : null
  };

  try {
    await POST('/ing-alimento', payload);
    toast('✅', 'Ingreso de alimento registrado', 'Stock actualizado correctamente');
    closeModal('modal-ing-alimento');
    loadIngAlimento();
    loadStockAlimento();
  } catch (err) {
    const msg = err?.message || 'Error desconocido';
    if (errBox && errText) {
      errText.textContent = `No se pudo registrar: ${msg}`;
      errBox.style.display = '';
    }
    toast('❌', 'No se pudo registrar el ingreso', msg, 't-warn');
  }
}

async function prepareEditIngAlimento(id) {
  try {
    const allData = await tryGet('/ing-alimento', 'ingAlimento');
    const ingreso = allData.find(r => r.id_IngAlimento === id);
    
    if (!ingreso) {
      toast('❌', 'Ingreso no encontrado', '', 't-warn');
      return;
    }

    // Llenar campos del modal
    document.getElementById('eia-id').value = ingreso.id_IngAlimento;
    document.getElementById('eia-tipo-id').value = ingreso.id_tipo_alimento?.id_tipo_alimento || '';
    document.getElementById('eia-tipo-display').value = ingreso.id_tipo_alimento?.nombre_alimento || 'Desconocido';
    document.getElementById('eia-cantidad').value = ingreso.cantidad;
    document.getElementById('eia-fecha').value = ingreso.fecha_ingreso;
    document.getElementById('eia-fechav').value = toDateStr(ingreso.fecha_vencimiento) || '';
    document.getElementById('eia-vtotal').value = ingreso.valor_total || '';
    
    // Limpiar mensajes de error
    const errBox = document.getElementById('eia-error-msg');
    if (errBox) errBox.style.display = 'none';
    
    openModal('modal-editar-ing-alimento');
  } catch (err) {
    toast('❌', 'Error al cargar ingreso', 'No se pudo cargar los datos', 't-warn');
  }
}

async function updateIngAlimento() {
  const errBox = document.getElementById('eia-error-msg');
  const errText = document.getElementById('eia-error-text');
  if (errBox) errBox.style.display = 'none';

  const id = v('eia-id');
  if (!id) {
    if (errBox && errText) { errText.textContent = 'Error: ID no válido'; errBox.style.display = ''; }
    return;
  }

  if (!v('eia-cantidad') || +v('eia-cantidad') <= 0) {
    if (errBox && errText) { errText.textContent = 'La cantidad debe ser mayor a 0.'; errBox.style.display = ''; }
    return;
  }
  if (!v('eia-fecha')) {
    if (errBox && errText) { errText.textContent = 'Ingresa la fecha de ingreso.'; errBox.style.display = ''; }
    return;
  }
  if (!v('eia-fechav')) {
    if (errBox && errText) { errText.textContent = 'Ingresa la fecha de vencimiento.'; errBox.style.display = ''; }
    return;
  }

  const vtotal = v('eia-vtotal');
  const tipoId = v('eia-tipo-id');
  const payload = {
    id_tipo_alimento: tipoId ? { id_tipo_alimento: +tipoId } : null,
    cantidad: +v('eia-cantidad'),
    fecha_ingreso: v('eia-fecha'),
    fecha_vencimiento: v('eia-fechav'),
    valor_total: vtotal && +vtotal > 0 ? +vtotal : null
  };

  try {
    await PUT(`/ing-alimento/${id}`, payload);
    toast('✅', 'Ingreso actualizado', 'Los cambios se guardaron correctamente');
    closeModal('modal-editar-ing-alimento');
    loadIngAlimento();
    loadStockAlimento();
  } catch (err) {
    const msg = err?.message || 'Error desconocido';
    if (errBox && errText) {
      errText.textContent = `No se pudo actualizar: ${msg}`;
      errBox.style.display = '';
    }
    toast('❌', 'Error al actualizar', msg, 't-warn');
  }
}

async function deleteIngAlimento() {
  const id = v('eia-id');
  const nombreAlimento = document.getElementById('eia-tipo-display').value;
  
  const confirmDelete = confirm(`⚠️ ADVERTENCIA DE ELIMINACIÓN\n\n¿Estás seguro de que deseas eliminar este ingreso de "${nombreAlimento}"?\n\nEsta acción no se puede deshacer.`);
  if (!confirmDelete) return;

  try {
    await fetch(S.apiBase + '/ing-alimento/' + id, { method: 'DELETE' });
    toast('✅', 'Ingreso eliminado', 'El registro ha sido eliminado correctamente');
    closeModal('modal-editar-ing-alimento');
    loadIngAlimento();
    loadStockAlimento();
  } catch (err) {
    toast('❌', 'Error al eliminar', 'No se pudo eliminar el ingreso', 't-warn');
  }
}

function openNuevoTipoMed() {
  document.getElementById('tm-nombre').value = '';
  document.getElementById('tm-categoria').value = '';
  document.getElementById('tm-unidad').value = '';
  document.getElementById('tm-retiro').value = '';
  document.getElementById('tm-condiciones').value = '';
  document.getElementById('tm-error-msg').style.display = 'none';
  openModal('modal-tipo-med');
}

async function postTipoMed() {
  const errBox = document.getElementById('tm-error-msg');
  const errText = document.getElementById('tm-error-text');
  if (errBox) errBox.style.display = 'none';

  const nombre = v('tm-nombre')?.trim();
  if (!nombre) {
    if (errBox && errText) { errText.textContent = 'El nombre comercial es obligatorio.'; errBox.style.display = ''; }
    return;
  }
  const existe = S.tiposMed?.some(t => t.nombre?.toLowerCase() === nombre.toLowerCase());
  if (existe) {
    if (errBox && errText) { errText.textContent = `Ya existe un tipo de medicamento con el nombre "${nombre}".`; errBox.style.display = ''; }
    return;
  }

  const retiro  = v('tm-retiro');
  const payload = {
    nombre,
    descripcion_medi:           '',
    categoria:                  v('tm-categoria') || null,
    unidad:                     v('tm-unidad') || null,
    periodo_retiro:             retiro !== '' && +retiro >= 0 ? +retiro : null,
    condiciones_almacenamiento: v('tm-condiciones')?.trim() || null
  };

  try {
    const r = await fetch(S.apiBase + '/tipo-medicamento', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({}));
      if (errBox && errText) { errText.textContent = err.message || 'Error al guardar.'; errBox.style.display = ''; }
      return;
    }
    toast('✅', 'Tipo de medicamento guardado');
    closeModal('modal-tipo-med');
    loadTiposMed();
  } catch {
    if (errBox && errText) { errText.textContent = 'No se pudo conectar con el servidor.'; errBox.style.display = ''; }
  }
}
async function postIngMed() {
  const errBox  = document.getElementById('im-error-msg');
  const errText = document.getElementById('im-error-text');
  if (errBox) errBox.style.display = 'none';

  const tipoId   = v('im-tipo');
  const cantidad = v('im-cantidad');
  const fecha    = v('im-fecha');
  const fechav    = v('im-fechav');

  if (!tipoId) {
    if (errBox && errText) { errText.textContent = 'Selecciona un tipo de medicamento.'; errBox.style.display = ''; }
    return;
  }
  if (!cantidad || +cantidad <= 0) {
    if (errBox && errText) { errText.textContent = 'La cantidad debe ser mayor a 0.'; errBox.style.display = ''; }
    return;
  }
  if (!fecha) {
    if (errBox && errText) { errText.textContent = 'La fecha de ingreso es obligatoria.'; errBox.style.display = ''; }
    return;
  }
  if (!fechav) {
    if (errBox && errText) { errText.textContent = 'La fecha de vencimiento es obligatoria.'; errBox.style.display = ''; }
    return;
  }

  const vtotal = v('im-vtotal');
  const payload = {
    id_tipo_medicamento: { id_tipo_medicamento: +tipoId },
    cantidad:    +cantidad,
    fecha_ingreso: fecha,
    fecha_vencimiento: fechav,
    valor_total: vtotal && +vtotal > 0 ? +vtotal : null
  };

  try {
    const r = await fetch(S.apiBase + '/ing-medicamento', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({}));
      if (errBox && errText) { errText.textContent = err.message || `Error ${r.status} al registrar.`; errBox.style.display = ''; }
      return;
    }
    toast('✅', 'Ingreso registrado');
    closeModal('modal-ing-med');
    loadIngMed();
    loadStockMed();
  } catch {
    if (errBox && errText) { errText.textContent = 'No se pudo conectar con el servidor.'; errBox.style.display = ''; }
  }
}

// ─── EDITAR TIPOS MEDICAMENTO ─────────────────────────────
async function loadEditarTiposMed() {
  const lista = document.getElementById('editar-tipos-med-lista');
  try {
    const data = await tryGet('/tipo-medicamento', 'tiposMed');
    if (!data || data.length === 0) {
      lista.innerHTML = '<div style="color:var(--text3);font-size:12px;text-align:center;padding:20px">No hay tipos registrados</div>';
      return;
    }
    lista.innerHTML = data.map(t => `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:12px;border:1px solid var(--border);border-radius:6px;background:var(--bg2)">
        <div style="flex:1">
          <div style="font-weight:600;font-size:14px;color:var(--text)">${t.nombre}</div>
          <div style="font-size:12px;color:var(--text3);margin-top:4px">
            ${t.categoria ? `Categoría: ${t.categoria}` : ''}
            ${t.unidad ? ` · Unidad: ${t.unidad.nombre}` : ''}
            ${t.periodo_retiro != null ? ` · Retiro: ${t.periodo_retiro} días` : ''}
            ${t.condiciones_almacenamiento ? `<br>${t.condiciones_almacenamiento}` : ''}
          </div>
        </div>
        ${isAdmin() ? `<button class="btn btn-sm" onclick="deleteTipoMed(${t.id_tipo_medicamento},'${(t.nombre||'').replace(/'/g,"\\'")}');" style="background:var(--red);color:white;border:none;cursor:pointer;padding:6px 12px;border-radius:4px;font-size:12px">🗑️ Eliminar</button>` : ''}
      </div>
    `).join('');
  } catch {
    lista.innerHTML = '<div style="color:var(--red);font-size:12px;text-align:center;padding:20px">Error al cargar tipos</div>';
  }
}

function prepareEditTipoMed(id) {
  const t = S.tiposMed?.find(x => x.id_tipo_medicamento === id);
  if (!t) return;
  document.getElementById('etm-id').value         = t.id_tipo_medicamento;
  document.getElementById('etm-nombre').value     = t.nombre || '';
  document.getElementById('etm-categoria').value  = t.categoria || '';
  document.getElementById('etm-unidad').value     = t.unidad || '';
  document.getElementById('etm-retiro').value     = t.periodo_retiro ?? '';
  document.getElementById('etm-condiciones').value = t.condiciones_almacenamiento || '';
  document.getElementById('etm-error-msg').style.display = 'none';
  openModal('modal-edit-tipo-med');
}

async function updateTipoMed() {
  const errBox  = document.getElementById('etm-error-msg');
  const errText = document.getElementById('etm-error-text');
  errBox.style.display = 'none';

  const nombre = document.getElementById('etm-nombre').value.trim();
  if (!nombre) {
    errText.textContent = 'El nombre comercial es obligatorio.';
    errBox.style.display = '';
    return;
  }

  const id     = document.getElementById('etm-id').value;
  const retiro = document.getElementById('etm-retiro').value;
  const payload = {
    nombre,
    descripcion_medi:           '',
    categoria:                  document.getElementById('etm-categoria').value || null,
    unidad:                     document.getElementById('etm-unidad').value || null,
    periodo_retiro:             retiro !== '' && +retiro >= 0 ? +retiro : null,
    condiciones_almacenamiento: document.getElementById('etm-condiciones').value.trim() || null
  };

  try {
    const r = await fetch(S.apiBase + '/tipo-medicamento/' + id, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({}));
      errText.textContent = err.message || 'Error al guardar.';
      errBox.style.display = '';
      return;
    }
    toast('✅', 'Tipo de medicamento actualizado');
    closeModal('modal-edit-tipo-med');
    loadTiposMed();
  } catch {
    errText.textContent = 'No se pudo conectar con el servidor.';
    errBox.style.display = '';
  }
}

async function deleteTipoMedDesdeEdit() {
  const id     = document.getElementById('etm-id').value;
  const nombre = document.getElementById('etm-nombre').value;
  if (!confirm(`⚠️ ¿Eliminar el tipo de medicamento "${nombre}"?\n\nEsta acción no se puede deshacer.`)) return;
  try {
    const r = await fetch(S.apiBase + '/tipo-medicamento/' + id, { method: 'DELETE' });
    if (!r.ok) {
      toast('❌', 'No se pudo eliminar', 'El tipo puede estar en uso.', 't-error');
      return;
    }
    toast('✅', 'Tipo de medicamento eliminado');
    closeModal('modal-edit-tipo-med');
    await loadTiposMed();
    await loadStockMed();
  } catch {
    toast('❌', 'Error al eliminar', 'No se pudo conectar.', 't-error');
  }
}

// ─── EDITAR INGRESO MEDICAMENTO ───────────────────────────
async function prepareEditIngMed(id) {
  try {
    const allData = await tryGet('/ing-medicamento', 'ingMed');
    const ingreso = allData.find(r => r.ing_medicamento === id);
    if (!ingreso) { toast('❌', 'Ingreso no encontrado', '', 't-warn'); return; }

    document.getElementById('eim-id').value = ingreso.ing_medicamento;
    document.getElementById('eim-tipo-id').value = ingreso.id_tipo_medicamento?.id_tipo_medicamento || '';
    document.getElementById('eim-tipo-display').value = ingreso.id_tipo_medicamento?.nombre || 'Desconocido';
    document.getElementById('eim-cantidad').value = ingreso.cantidad;
    document.getElementById('eim-fecha').value = ingreso.fecha_ingreso;
    document.getElementById('eim-fechav').value = toDateStr(ingreso.fecha_vencimiento) || '';
    document.getElementById('eim-vtotal').value = ingreso.valor_total || '';
    const errBox = document.getElementById('eim-error-msg');
    if (errBox) errBox.style.display = 'none';
    openModal('modal-editar-ing-med');
  } catch {
    toast('❌', 'Error al cargar ingreso', '', 't-warn');
  }
}

async function updateIngMed() {
  const errBox = document.getElementById('eim-error-msg');
  const errText = document.getElementById('eim-error-text');
  if (errBox) errBox.style.display = 'none';

  const id = v('eim-id');
  if (!v('eim-cantidad') || +v('eim-cantidad') <= 0) {
    if (errBox && errText) { errText.textContent = 'La cantidad debe ser mayor a 0.'; errBox.style.display = ''; }
    return;
  }
  if (!v('eim-fecha')) {
    if (errBox && errText) { errText.textContent = 'Ingresa la fecha de ingreso.'; errBox.style.display = ''; }
    return;
  }
  if (!v('eim-fechav')) {
    if (errBox && errText) { errText.textContent = 'Ingresa la fecha de vencimiento.'; errBox.style.display = ''; }
    return;
  }

  const tipoId = v('eim-tipo-id');
  const unidadId = v('eim-unidad-id');
  const vtotal = v('eim-vtotal');
  const payload = {
    id_tipo_medicamento: tipoId ? { id_tipo_medicamento: +tipoId } : null,
    cantidad: +v('eim-cantidad'),
    fecha_ingreso: v('eim-fecha'),
    fecha_vencimiento: v('eim-fechav'),
    valor_total: vtotal && +vtotal > 0 ? +vtotal : null
  };

  try {
    const r = await fetch(S.apiBase + '/ing-medicamento/' + id, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({}));
      if (errBox && errText) { errText.textContent = err.message || 'Error al actualizar.'; errBox.style.display = ''; }
      return;
    }
    toast('✅', 'Ingreso actualizado', 'Los cambios se guardaron correctamente');
    closeModal('modal-editar-ing-med');
    loadIngMed();
    loadStockMed();
  } catch {
    if (errBox && errText) { errText.textContent = 'No se pudo conectar.'; errBox.style.display = ''; }
  }
}

async function deleteIngMed() {
  const id = v('eim-id');
  const nombre = document.getElementById('eim-tipo-display').value;
  if (!confirm(`⚠️ ¿Eliminar este ingreso de "${nombre}"?\n\nEsta acción no se puede deshacer.`)) return;
  try {
    const r = await fetch(S.apiBase + '/ing-medicamento/' + id, { method: 'DELETE' });
    if (!r.ok) { toast('❌', 'No se pudo eliminar', '', 't-error'); return; }
    toast('✅', 'Ingreso eliminado');
    closeModal('modal-editar-ing-med');
    loadIngMed();
    loadStockMed();
  } catch {
    toast('❌', 'Error al eliminar', '', 't-error');
  }
}

function postTipoMuerte() {
  doPost('/tipo-muerte',
      { nombre: v('tmu-nombre'), descripcion: v('tmu-desc') },
      'modal-tipo-muerte', loadTiposMuerte, 'Tipo Muerte');
}
async function postMortalidad() {
  if (!v('mo-ciclo'))       { toast('⚠️', 'Selecciona un ciclo', '', 't-warn'); return; }
  if (!v('mo-galpon'))      { toast('⚠️', 'Selecciona un galpón', '', 't-warn'); return; }
  if (!v('mo-tipo-muerte')) { toast('⚠️', 'Selecciona el tipo de muerte', '', 't-warn'); return; }
  if (!v('mo-fecha'))       { toast('⚠️', 'Ingresa la fecha', '', 't-warn'); return; }
  if (!+v('mo-cantidad') || +v('mo-cantidad') < 1) { toast('⚠️', 'La cantidad debe ser al menos 1', '', 't-warn'); return; }

  const payload = {
    id_ciclo:       { id_ciclo: +v('mo-ciclo') },
    id_galpon:      { id_galpon: +v('mo-galpon') },
    id_tipo_muerte: { id_tipo_muerte: +v('mo-tipo-muerte') },
    fecha_de_muerte: v('mo-fecha'),
    muertos:         v('mo-cantidad'),
    causa:           v('mo-causa') || ''
  };

  try {
    const r = await fetch(S.apiBase + '/mortalidad', {
      method: 'POST', headers: headers(), body: JSON.stringify(payload)
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({}));
      toast('❌', 'Error al registrar', err.message || `Error ${r.status}`, 't-warn');
      return;
    }
    toast('✅', 'Baja registrada');
    closeModal('modal-mortalidad');
    loadMortalidad();
  } catch (err) {
    toast('❌', 'Error de conexión', err.message, 't-warn');
  }
}
// ── Tipo de Muerte: editar y eliminar ────────────────────
function prepareEditTipoMuerte(id) {
  const t = S.tiposMuerte.find(x => x.id_tipo_muerte === id);
  if (!t) return;
  document.getElementById('etmu-id').value     = t.id_tipo_muerte;
  document.getElementById('etmu-nombre').value = t.nombre;
  document.getElementById('etmu-desc').value   = t.descripcion || '';
  openModal('modal-editar-tipo-muerte');
}

async function updateTipoMuerte() {
  const id     = +v('etmu-id');
  const nombre = v('etmu-nombre').trim();
  if (!nombre) { toast('⚠️', 'El nombre es obligatorio', '', 't-warn'); return; }
  try {
    const r = await fetch(S.apiBase + '/tipo-muerte/' + id, {
      method: 'PUT', headers: headers(),
      body: JSON.stringify({ nombre, descripcion: v('etmu-desc') })
    });
    if (!r.ok) { const e = await r.json().catch(()=>({})); toast('❌', 'Error', e.message||'', 't-warn'); return; }
    toast('✅', 'Tipo de muerte actualizado');
    closeModal('modal-editar-tipo-muerte');
    loadTiposMuerte();
  } catch (err) { toast('❌', 'Error de conexión', err.message, 't-warn'); }
}

async function deleteTipoMuerte() {
  const id     = +v('etmu-id');
  const nombre = v('etmu-nombre');
  if (!confirm(`⚠️ ¿Eliminar el tipo "${nombre}"?\nEsta acción no se puede deshacer.`)) return;
  try {
    const r = await fetch(S.apiBase + '/tipo-muerte/' + id, { method: 'DELETE', headers: headers() });
    if (!r.ok) { toast('❌', 'No se pudo eliminar', 'Puede tener registros asociados', 't-warn'); return; }
    toast('✅', 'Tipo eliminado');
    closeModal('modal-editar-tipo-muerte');
    loadTiposMuerte();
  } catch { toast('❌', 'Error al eliminar', '', 't-warn'); }
}

// ── Mortalidad: editar y eliminar ────────────────────────
async function prepareEditMortalidad(id) {
  const data = await tryGet('/mortalidad', 'mortalidad');
  const m = data.find(x => x.id_Mortalidad === id);
  if (!m) { toast('❌', 'Registro no encontrado', '', 't-warn'); return; }

  document.getElementById('emo-id').value       = m.id_Mortalidad;
  document.getElementById('emo-fecha').value    = m.fecha_de_muerte;
  document.getElementById('emo-cantidad').value = m.muertos;
  document.getElementById('emo-causa').value    = m.causa || '';

  // Llenar selects con valor actual preseleccionado
  document.getElementById('emo-ciclo').innerHTML = S.ciclos.map(c =>
      `<option value="${c.id_ciclo}" ${c.id_ciclo === m.id_ciclo?.id_ciclo ? 'selected' : ''}>${c.nombre_ciclo || `Ciclo ${c.id_ciclo}`}</option>`
  ).join('');
  document.getElementById('emo-galpon').innerHTML = S.galpones.map(g =>
      `<option value="${g.id_galpon}" ${g.id_galpon === m.id_galpon?.id_galpon ? 'selected' : ''}>${g.nombre}</option>`
  ).join('');
  document.getElementById('emo-tipo-muerte').innerHTML = S.tiposMuerte.map(t =>
      `<option value="${t.id_tipo_muerte}" ${t.id_tipo_muerte === m.id_tipo_muerte?.id_tipo_muerte ? 'selected' : ''}>${t.nombre}</option>`
  ).join('');

  openModal('modal-editar-mortalidad');
}

async function updateMortalidad() {
  const id       = +v('emo-id');
  const cantidad = v('emo-cantidad');
  const fecha    = v('emo-fecha');
  if (!fecha)    { toast('⚠️', 'Ingresa la fecha', '', 't-warn'); return; }
  if (!+cantidad || +cantidad < 1) { toast('⚠️', 'La cantidad debe ser al menos 1', '', 't-warn'); return; }

  const payload = {
    id_ciclo:        { id_ciclo: +v('emo-ciclo') },
    id_galpon:       { id_galpon: +v('emo-galpon') },
    id_tipo_muerte:  { id_tipo_muerte: +v('emo-tipo-muerte') },
    fecha_de_muerte: fecha,
    muertos:         cantidad,
    causa:           v('emo-causa') || ''
  };

  try {
    const r = await fetch(S.apiBase + '/mortalidad/' + id, {
      method: 'PUT', headers: headers(), body: JSON.stringify(payload)
    });
    if (!r.ok) { const e = await r.json().catch(()=>({})); toast('❌', 'Error', e.message||`Error ${r.status}`, 't-warn'); return; }
    toast('✅', 'Registro actualizado');
    closeModal('modal-editar-mortalidad');
    loadMortalidad();
  } catch (err) { toast('❌', 'Error de conexión', err.message, 't-warn'); }
}

async function deleteMortalidad() {
  const id = +v('emo-id');
  if (!confirm('⚠️ ¿Eliminar este registro de baja?\nEsta acción no se puede deshacer.')) return;
  try {
    const r = await fetch(S.apiBase + '/mortalidad/' + id, { method: 'DELETE', headers: headers() });
    if (!r.ok) { toast('❌', 'No se pudo eliminar', '', 't-warn'); return; }
    toast('✅', 'Registro eliminado');
    closeModal('modal-editar-mortalidad');
    loadMortalidad();
  } catch { toast('❌', 'Error al eliminar', '', 't-warn'); }
}
async function postAdmAlimento() {
  const cantidad = +v('aa-cantidad');
  if (!v('aa-tipo'))  { toast('⚠️', 'Selecciona un tipo de alimento', '', 't-warn'); return; }
  if (!v('aa-galpon')){ toast('⚠️', 'Selecciona un galpón', '', 't-warn'); return; }
  if (!v('aa-ciclo')) { toast('⚠️', 'Selecciona un ciclo', '', 't-warn'); return; }
  if (!cantidad || cantidad <= 0) { toast('⚠️', 'La cantidad debe ser mayor a 0', '', 't-warn'); return; }
  if (!v('aa-fecha')) { toast('⚠️', 'Ingresa la fecha', '', 't-warn'); return; }

  const payload = {
    id_tipo_alimento: +v('aa-tipo'),
    id_galpon:        +v('aa-galpon'),
    id_ciclo:         +v('aa-ciclo'),
    id_usuario:       S.user?.cedula,
    cantidad_utilizada: cantidad,
    fecha_alimentacion: v('aa-fecha')
  };

  try {
    const r = await fetch(S.apiBase + '/admi-alimento', {
      method: 'POST', headers: headers(), body: JSON.stringify(payload)
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({}));
      toast('❌', 'Error al registrar', err.message || `Error ${r.status}`, 't-warn');
      return;
    }
    toast('✅', 'Alimentación registrada', 'Stock actualizado');
    closeModal('modal-adm-alimento');
    loadAdmAlimento();
    loadStockAlimento();
  } catch (err) {
    toast('❌', 'Error de conexión', err.message, 't-warn');
  }
}
async function prepareEditAdmAlimento(id) {
  const data = await tryGet('/admi-alimento', 'admAlimento');
  const r = data.find(x => x.id_admi_alimento === id);
  if (!r) { toast('❌', 'Registro no encontrado', '', 't-warn'); return; }

  document.getElementById('eaa-id').value           = r.id_admi_alimento;
  document.getElementById('eaa-tipo').value = r.nombre_alimento || '';
  document.getElementById('eaa-cantidad').value     = r.cantidad_utilizada;
  document.getElementById('eaa-fecha').value        = r.fecha_alimentacion;

  //llenar las consultas
  const selT = document.getElementById('eaa-tipo');
  selT.innerHTML = S.tiposAlimento.map(t =>
      `<option value="${t.id_tipo_alimento}" ${t.id_tipo_alimento === r.id_tipo_alimento ? 'selected' : ''}>
      ${t.nombre_alimento || 'Sin nombre'}
    </option>`
  ).join('');

  const selG = document.getElementById('eaa-galpon');
  selG.innerHTML = S.galpones.map(g =>
      `<option value="${g.id_galpon}" ${g.id_galpon === r.id_galpon ? 'selected' : ''}>${g.nombre}</option>`
  ).join('');

  const selC = document.getElementById('eaa-ciclo');
  selC.innerHTML = S.ciclos.map(c =>
      `<option value="${c.id_ciclo}" ${c.id_ciclo === r.id_ciclo ? 'selected' : ''}>${c.nombre_ciclo || `Ciclo ${c.id_ciclo}`}</option>`
  ).join('');

  openModal('modal-editar-adm-alimento');
}

async function updateAdmAlimento() {
  const id       = +v('eaa-id');
  const tipo_alimento       = +v('eaa-tipo');
  const cantidad = +v('eaa-cantidad');
  const fecha    = v('eaa-fecha');
  const galpon   = +v('eaa-galpon');
  const ciclo    = +v('eaa-ciclo');

  if (!cantidad || cantidad <= 0) { toast('⚠️', 'La cantidad debe ser mayor a 0', '', 't-warn'); return; }
  if (!fecha)   { toast('⚠️', 'Ingresa la fecha', '', 't-warn'); return; }
  if (!galpon)  { toast('⚠️', 'Selecciona un galpón', '', 't-warn'); return; }
  if (!ciclo)   { toast('⚠️', 'Selecciona un ciclo', '', 't-warn'); return; }

  // Obtener el tipo del registro original (no cambia en la edición)
  const data = await tryGet('/admi-alimento', 'admAlimento');
  const original = data.find(x => x.id_admi_alimento === id);
  if (!original) return;

  const payload = {
    id_tipo_alimento:   tipo_alimento,
    id_galpon:          galpon,
    id_ciclo:           ciclo,
    id_usuario:         S.user?.cedula,
    cantidad_utilizada: cantidad,
    fecha_alimentacion: fecha
  };

  try {
    const r = await fetch(S.apiBase + '/admi-alimento/' + id, {
      method: 'PUT', headers: headers(), body: JSON.stringify(payload)
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({}));
      toast('❌', 'Error al actualizar', err.message || `Error ${r.status}`, 't-warn');
      return;
    }
    toast('✅', 'Registro actualizado', 'Stock ajustado');
    closeModal('modal-editar-adm-alimento');
    loadAdmAlimento();
    loadStockAlimento();
  } catch (err) {
    toast('❌', 'Error de conexión', err.message, 't-warn');
  }
}

async function deleteAdmAlimento() {
  const id     = +v('eaa-id');
  const nombre = document.getElementById('eaa-tipo').value;
  if (!confirm(`⚠️ ¿Eliminar este registro de "${nombre}"?\n\nLa cantidad se devolverá al stock.\nEsta acción no se puede deshacer.`)) return;

  try {
    const r = await fetch(S.apiBase + '/admi-alimento/' + id, {
      method: 'DELETE', headers: headers()
    });
    if (!r.ok) { toast('❌', 'No se pudo eliminar', '', 't-warn'); return; }
    toast('✅', 'Registro eliminado', 'Stock restaurado');
    closeModal('modal-editar-adm-alimento');
    loadAdmAlimento();
    loadStockAlimento();
  } catch {
    toast('❌', 'Error al eliminar', '', 't-warn');
  }
}
async function postAdmMed() {
  const cantidad = +v('am-cantidad');
  if (!v('am-tipo'))  { toast('⚠️', 'Selecciona un medicamento', '', 't-warn'); return; }
  if (!v('am-galpon')){ toast('⚠️', 'Selecciona un galpón', '', 't-warn'); return; }
  if (!v('am-ciclo')) { toast('⚠️', 'Selecciona un ciclo', '', 't-warn'); return; }
  if (!cantidad || cantidad <= 0) { toast('⚠️', 'La cantidad debe ser mayor a 0', '', 't-warn'); return; }
  if (!v('am-fecha')) { toast('⚠️', 'Ingresa la fecha', '', 't-warn'); return; }

  const payload = {
    id_tipo_medicamento: +v('am-tipo'),
    id_galpon:           +v('am-galpon'),
    id_ciclo:            +v('am-ciclo'),
    id_usuario:          S.user?.cedula,
    cantidad_utilizada:  cantidad,
    fecha_medicacion:    v('am-fecha')
  };

  try {
    const r = await fetch(S.apiBase + '/admi-medicamento', {
      method: 'POST', headers: headers(), body: JSON.stringify(payload)
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({}));
      toast('❌', 'Error al registrar', err.message || `Error ${r.status}`, 't-warn');
      return;
    }
    toast('✅', 'Medicación registrada', 'Stock actualizado');
    closeModal('modal-adm-med');
    loadAdmMed();
    loadStockMed();
  } catch (err) {
    toast('❌', 'Error de conexión', err.message, 't-warn');
  }
}
async function prepareEditAdmMed(id) {
  const data = await tryGet('/admi-medicamento', 'admMed');
  const r = data.find(x => x.id_admi_medicamento === id);

  if (!r) {
    toast('❌', 'Registro no encontrado', '', 't-warn');
    return;
  }

  // Asignar valores a campos básicos
  document.getElementById('eam-id').value       = r.id_admi_medicamento;
  document.getElementById('eam-cantidad').value = r.cantidad_utilizada;
  document.getElementById('eam-fecha').value    = r.fecha_medicacion;

  // Llenar select de Tipos de Medicamento
  const selM = document.getElementById('eam-tipo-med');
  selM.innerHTML = S.tiposMed.map(m =>
      `<option value="${m.id_tipo_medicamento}" ${m.id_tipo_medicamento === r.id_tipo_medicamento ? 'selected' : ''}>
      ${m.nombre_medicamento || m.nombre || 'Sin nombre'}
    </option>`
  ).join('');

  // Llenar select de Galpones
  const selG = document.getElementById('eam-galpon');
  selG.innerHTML = S.galpones.map(g =>
      `<option value="${g.id_galpon}" ${g.id_galpon === r.id_galpon ? 'selected' : ''}>${g.nombre}</option>`
  ).join('');

  // Llenar select de Ciclos
  const selC = document.getElementById('eam-ciclo');
  selC.innerHTML = S.ciclos.map(c =>
      `<option value="${c.id_ciclo}" ${c.id_ciclo === r.id_ciclo ? 'selected' : ''}>${c.nombre_ciclo || `Ciclo ${c.id_ciclo}`}</option>`
  ).join('');

  openModal('modal-editar-adm-med');
}

async function updateAdmMed() {
  const id       = +v('eam-id');
  const tipoMed  = +v('eam-tipo-med');
  const cantidad = +v('eam-cantidad');
  const fecha    = v('eam-fecha');
  const galpon   = +v('eam-galpon');
  const ciclo    = +v('eam-ciclo');

  // Validaciones
  if (!tipoMed)  { toast('⚠️', 'Selecciona un medicamento', '', 't-warn'); return; }
  if (!cantidad || cantidad <= 0) { toast('⚠️', 'La cantidad debe ser mayor a 0', '', 't-warn'); return; }
  if (!fecha)    { toast('⚠️', 'Ingresa la fecha', '', 't-warn'); return; }
  if (!galpon)   { toast('⚠️', 'Selecciona un galpón', '', 't-warn'); return; }
  if (!ciclo)    { toast('⚠️', 'Selecciona un ciclo', '', 't-warn'); return; }

  const payload = {
    id_tipo_medicamento: tipoMed,
    id_galpon:           galpon,
    id_ciclo:            ciclo,
    id_usuario:          S.user?.cedula,
    cantidad_utilizada:  cantidad,
    fecha_medicacion:    fecha
  };

  try {
    const r = await fetch(S.apiBase + '/admi-medicamento/' + id, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(payload)
    });

    if (!r.ok) {
      const err = await r.json().catch(() => ({}));
      toast('❌', 'Error al actualizar', err.message || `Error ${r.status}`, 't-warn');
      return;
    }

    toast('✅', 'Registro actualizado', 'Stock de medicamento ajustado');
    closeModal('modal-editar-adm-med');

    // Recargar datos
    if (typeof loadAdmMed === 'function') loadAdmMed();
    if (typeof loadStockMed === 'function') loadStockMed();

  } catch (err) {
    toast('❌', 'Error de conexión', err.message, 't-warn');
  }
}

async function deleteAdmMed() {
  const id     = +v('eam-id');
  const nombre = document.getElementById('eam-tipo-display').value;
  if (!confirm(`⚠️ ¿Eliminar este registro de "${nombre}"?\n\nLa cantidad se devolverá al stock.\nEsta acción no se puede deshacer.`)) return;

  try {
    const r = await fetch(S.apiBase + '/admi-medicamento/' + id, {
      method: 'DELETE', headers: headers()
    });
    if (!r.ok) { toast('❌', 'No se pudo eliminar', '', 't-warn'); return; }
    toast('✅', 'Registro eliminado', 'Stock restaurado');
    closeModal('modal-editar-adm-med');
    loadAdmMed();
    loadStockMed();
  } catch {
    toast('❌', 'Error al eliminar', '', 't-warn');
  }
}
function NewUsuario() {
  _editandoUsuario = null;

  // Resetear modal a modo "nuevo"
  document.getElementById('modal-usuario-titulo').textContent = 'Nuevo Usuario';
  const inputCedula = document.getElementById('u-cedula');
  inputCedula.value    = '';
  inputCedula.readOnly = false;
  inputCedula.style.background = '';

  document.getElementById('u-nombre').value     = '';
  document.getElementById('u-apellido').value   = '';
  document.getElementById('u-fecha').value      = today();
  document.getElementById('u-correo').value     = '';
  document.getElementById('u-contrasena').value = '';
  document.getElementById('u-rol').value        = 'operador';

  // Ocultar estado e hint (solo en edición)
  document.getElementById('u-estado-group').style.display = 'none';
  document.getElementById('u-pass-hint').style.display    = 'none';

  openModal('modal-usuario');
}

function postUsuario() {
  const payload = {
    cedula:          +v('u-cedula'),
    nombre:          v('u-nombre'),
    apellido:        v('u-apellido'),
    fecha_registro:  v('u-fecha'),
    correo:          v('u-correo'),
    rol:             v('u-rol'),
    estado: true,
  };

  if (_editandoUsuario) {
    // Edición: incluir estado, contraseña solo si fue llenada
    payload.estado = v('u-estado') === 'true';
    const pass = v('u-contrasena');
    if (pass) payload.password = pass;

    doPut(`/usuario/${_editandoUsuario}`, payload, 'modal-usuario', loadUsuarios, 'Usuario');
  } else {
    // Nuevo: siempre enviar contraseña
    payload.password = v('u-contrasena');
    doPost('/usuario', payload, 'modal-usuario', loadUsuarios, 'Usuario');
  }
}
function postUnidad() {
  doPost('/unidad-medida',
      { nombre: v('un-nombre') },
      'modal-unidad', loadUnidades, 'Unidad');
}

// ─── REPORTE PDF ──────────────────────────────────────────
async function generarReportePDF() {
  if (!isAdmin()) { toast('❌', 'Acceso denegado', 'Solo el administrador puede generar reportes', 't-warn'); return; }
  const btn = document.querySelector('[onclick="generarReportePDF()"]');
  if (btn) { btn.disabled = true; btn.textContent = 'Generando...'; }

  try {
    const { jsPDF } = window.jspdf;
    const doc   = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const W     = doc.internal.pageSize.getWidth();
    const hoy   = new Date().toISOString().split('T')[0];
    const fecha = new Date().toLocaleDateString('es-CO', { year:'numeric', month:'long', day:'numeric' });
    let y = 15;

    // ── Cargar datos ──
    const [mort, stockAlim, stockMed, admiAlim, admiMed, ingAlim, ingMed] = await Promise.all([
      tryGet('/mortalidad',          'mortalidad'),
      tryGet('/stock-alimento',      'stockAlim'),
      tryGet('/stock-medicamento',   'stockMed'),
      tryGet('/admi-alimento',       'admiAlimento'),
      tryGet('/admi-medicamento',    'admiMedicamento'),
      tryGet('/ing-alimento',        'ingAlimento'),
      tryGet('/ing-medicamento',     'ingMedicamento'),
    ]);

    const galpones = S.galpones    || [];
    const ciclos   = S.ciclos      || [];
    const vinculos = S.vinculos    || [];
    const tiposAlim = S.tiposAlimento || [];

    const fmt  = n => (+n || 0).toLocaleString('es-CO');
    const fmtP = n => '$' + (+n || 0).toLocaleString('es-CO');

    const ciclosActivos    = ciclos.filter(c => { const f = toDateStr(c.fecha_fin); return !f || f >= hoy; });
    const ciclosFinalizados = ciclos.filter(c => { const f = toDateStr(c.fecha_fin); return f && f < hoy; });
    const galponDeCiclo    = (cid) => {
      const vins = vinculos.filter(v => v.id_ciclo?.id_ciclo === cid);
      return [...new Set(vins.map(v => v.id_galpon?.nombre).filter(Boolean))].join(', ') || '—';
    };

    // ── Encabezado ──
    doc.setFillColor(34, 197, 94);
    doc.rect(0, 0, W, 22, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18); doc.setFont('helvetica', 'bold');
    doc.text('SAYFER — Reporte General', 14, 13);
    doc.setFontSize(9); doc.setFont('helvetica', 'normal');
    doc.text('Gestión Avícola · ' + fecha, W - 14, 13, { align: 'right' });
    doc.setTextColor(0, 0, 0);
    y = 30;

    const newPage = () => { doc.addPage(); y = 15; };
    const checkY  = (need = 40) => { if (y + need > 275) newPage(); };

    const seccion = (titulo, r, g, b) => {
      checkY(12);
      doc.setFontSize(11); doc.setFont('helvetica', 'bold');
      doc.setFillColor(r ?? 34, g ?? 197, b ?? 94);
      doc.rect(14, y - 4, W - 28, 7, 'F');
      doc.setTextColor(255, 255, 255);
      doc.text(titulo, 16, y);
      doc.setTextColor(0, 0, 0);
      y += 6;
    };

    const tabla = (head, body, hColor, foot) => {
      checkY(20);
      doc.autoTable({
        startY: y, margin: { left: 14, right: 14 },
        head: [head], body, foot: foot ? [foot] : undefined,
        theme: 'striped',
        headStyles: { fillColor: hColor, textColor: 255 },
        footStyles: { fillColor: [220, 220, 220], textColor: 0, fontStyle: 'bold' },
        styles: { fontSize: 9 },
      });
      y = doc.lastAutoTable.finalY + 8;
    };

    // ════════════════════════════════════════
    // 1. RESUMEN GENERAL
    // ════════════════════════════════════════
    seccion('1. Resumen General');
    const totalMuertos     = mort.reduce((a, m) => a + (+m.muertos || 0), 0);
    const totalPerdidaMort = mort.reduce((a, m) => {
      const ciclo = ciclos.find(c => c.id_ciclo === m.id_ciclo?.id_ciclo);
      return a + ((+m.muertos || 0) * (+ciclo?.valor_pollo || 0));
    }, 0);
    const totalInvAlim     = ingAlim.reduce((a, r) => a + (+r.valor_total || 0), 0);
    const totalInvMed      = ingMed.reduce((a, r) => a + (+r.valor_total || 0), 0);
    const totalConsAlim    = admiAlim.reduce((a, r) => a + (+r.cantidad_utilizada || 0), 0);
    const totalConsMed     = admiMed.reduce((a, r) => a + (+r.cantidad_utilizada || 0), 0);
    const totalInvPollos   = ciclos.reduce((a, c) => {
      const cant = +c.cantidad_pollos || 0;
      const val  = +c.valor_pollo     || 0;
      return a + (cant * val);
    }, 0);
    const totalPollosActivos = ciclosActivos.reduce((a, c) => a + (+c.cantidad_pollos || 0), 0);

    tabla(
      ['Indicador', 'Valor'],
      [
        ['Galpones registrados',            galpones.length],
        ['Ciclos activos',                  ciclosActivos.length],
        ['Ciclos finalizados',              ciclosFinalizados.length],
        ['Aves en producción (activos)',    fmt(totalPollosActivos) + ' pollos'],
        ['Tipos de alimento',               tiposAlim.length],
        ['Tipos de medicamento',            (S.tiposMed || []).length],
        ['Total bajas registradas',         fmt(totalMuertos) + ' aves'],
        ['Total alimento consumido',        fmt(totalConsAlim) + ' kg'],
        ['Total medicamento aplicado',      fmt(totalConsMed) + ' und'],
        ['Inversión total en pollos',            fmtP(totalInvPollos)],
        ['Inversión total en alimentos',         fmtP(totalInvAlim)],
        ['Inversión total en medicamentos',      fmtP(totalInvMed)],
        ['Inversión total general',              fmtP(totalInvPollos + totalInvAlim + totalInvMed)],
        ['Pérdida aprox. por mortalidad',          fmtP(totalPerdidaMort)],
      ],
      [34, 197, 94]
    );

    // ════════════════════════════════════════
    // 2. GALPONES Y CICLOS
    // ════════════════════════════════════════
    seccion('2. Galpones');
    tabla(
      ['Nombre', 'Capacidad (aves)', 'Metros²'],
      galpones.map(g => [g.nombre, fmt(g.capacidad), g.metros_cuadrados ?? '—']),
      [34, 197, 94]
    );

    seccion('3. Ciclos Activos', 34, 197, 94);
    tabla(
      ['Ciclo', 'Galpón', 'Inicio', 'Fin', 'Pollos', 'Valor/Pollo', 'Inversión Pollos'],
      ciclosActivos.map(c => {
        const cant = +c.cantidad_pollos || 0;
        const val  = +c.valor_pollo     || 0;
        return [
          c.nombre_ciclo || `Ciclo ${c.id_ciclo}`,
          galponDeCiclo(c.id_ciclo),
          toDateStr(c.fecha_inicio) || '—',
          toDateStr(c.fecha_fin)    || 'En curso',
          cant ? fmt(cant) : '—',
          val  ? fmtP(val) : '—',
          cant && val ? fmtP(cant * val) : '—',
        ];
      }),
      [34, 197, 94]
    );

    seccion('4. Ciclos Finalizados', 100, 100, 100);
    // Pre-calcular bajas por ciclo para la pérdida
    const bajasPorCicloFin = {};
    mort.forEach(m => {
      const cid = m.id_ciclo?.id_ciclo;
      if (cid) bajasPorCicloFin[cid] = (bajasPorCicloFin[cid] || 0) + (+m.muertos || 0);
    });
    tabla(
      ['Ciclo', 'Galpón', 'Inicio', 'Fin', 'Pollos', 'Valor/Pollo', 'Inversión Pollos', 'Pérdida Mortalidad'],
      ciclosFinalizados.map(c => {
        const cant    = +c.cantidad_pollos || 0;
        const val     = +c.valor_pollo     || 0;
        const bajas   = bajasPorCicloFin[c.id_ciclo] || 0;
        const perdida = bajas * val;
        return [
          c.nombre_ciclo || `Ciclo ${c.id_ciclo}`,
          galponDeCiclo(c.id_ciclo),
          toDateStr(c.fecha_inicio) || '—',
          toDateStr(c.fecha_fin)    || '—',
          cant ? fmt(cant) : '—',
          val  ? fmtP(val) : '—',
          cant && val ? fmtP(cant * val) : '—',
          perdida ? fmtP(perdida) : '—',
        ];
      }),
      [100, 100, 100]
    );

    // ════════════════════════════════════════
    // COSTO ACUMULADO POR CICLO
    // ════════════════════════════════════════
    seccion('5. Costo Acumulado por Ciclo', 34, 139, 34);

    // Precio promedio por tipo de alimento y medicamento
    const precAlimPdf = {};
    ingAlim.forEach(r => {
      const k = r.id_tipo_alimento?.id_tipo_alimento;
      if (!k) return;
      if (!precAlimPdf[k]) precAlimPdf[k] = { val: 0, cant: 0 };
      precAlimPdf[k].val  += +r.valor_total || 0;
      precAlimPdf[k].cant += +r.cantidad    || 0;
    });
    const precMedPdf = {};
    ingMed.forEach(r => {
      const k = r.id_tipo_medicamento?.id_tipo_medicamento;
      if (!k) return;
      if (!precMedPdf[k]) precMedPdf[k] = { val: 0, cant: 0 };
      precMedPdf[k].val  += +r.valor_total || 0;
      precMedPdf[k].cant += +r.cantidad    || 0;
    });

    const costoPorCiclo = ciclos.map(c => {
      const invPollos = (+c.cantidad_pollos || 0) * (+c.valor_pollo || 0);
      const costoAlim = admiAlim
        .filter(r => r.id_ciclo?.id_ciclo === c.id_ciclo)
        .reduce((a, r) => {
          const k = r.id_tipo_alimento?.id_tipo_alimento;
          const avg = k && precAlimPdf[k]?.cant > 0 ? precAlimPdf[k].val / precAlimPdf[k].cant : 0;
          return a + (+r.cantidad_utilizada || 0) * avg;
        }, 0);
      const costoMed = admiMed
        .filter(r => r.id_ciclo?.id_ciclo === c.id_ciclo)
        .reduce((a, r) => {
          const k = r.id_tipo_medicamento?.id_tipo_medicamento;
          const avg = k && precMedPdf[k]?.cant > 0 ? precMedPdf[k].val / precMedPdf[k].cant : 0;
          return a + (+r.cantidad_utilizada_medi || 0) * avg;
        }, 0);
      const total = invPollos + costoAlim + costoMed;
      const estado = !toDateStr(c.fecha_fin) || toDateStr(c.fecha_fin) >= hoy ? 'Activo' : 'Finalizado';
      return [c.nombre_ciclo || `Ciclo ${c.id_ciclo}`, estado, invPollos ? fmtP(invPollos) : '—', fmtP(costoAlim), fmtP(costoMed), fmtP(total)];
    });
    const totalAcum = costoPorCiclo.reduce((a, r) => a + (+r[5].replace(/\D/g,'') || 0), 0);
    tabla(
      ['Ciclo', 'Estado', 'Inv. Pollos', 'Alimento', 'Medicamentos', 'Total'],
      costoPorCiclo,
      [34, 139, 34]
    );

    // ════════════════════════════════════════
    // ALERTAS DE VENCIMIENTO
    // ════════════════════════════════════════
    seccion('6. Alertas de Vencimiento', 220, 100, 0);
    const hoy30pdf = new Date(); hoy30pdf.setDate(hoy30pdf.getDate() + 30);
    const hoy30pdfStr = hoy30pdf.toISOString().split('T')[0];
    const vencRows = [];
    ingAlim.forEach(r => {
      const fv = toDateStr(r.fecha_vencimiento);
      if (!fv || fv > hoy30pdfStr) return;
      const dias = Math.round((new Date(fv) - new Date(hoy)) / 86400000);
      vencRows.push([r.id_tipo_alimento?.nombre_alimento || '—', 'Alimento', fv, dias < 0 ? 'VENCIDO' : `${dias} días`, fmt(r.cantidad) + ' kg']);
    });
    ingMed.forEach(r => {
      const fv = toDateStr(r.fecha_vencimiento);
      if (!fv || fv > hoy30pdfStr) return;
      const dias = Math.round((new Date(fv) - new Date(hoy)) / 86400000);
      vencRows.push([r.id_tipo_medicamento?.nombre || '—', 'Medicamento', fv, dias < 0 ? 'VENCIDO' : `${dias} días`, fmt(r.cantidad)]);
    });
    if (vencRows.length) {
      tabla(['Producto', 'Tipo', 'Vencimiento', 'Estado', 'Cantidad'], vencRows, [220, 100, 0]);
    } else {
      checkY(10);
      doc.setFontSize(9); doc.setFont('helvetica', 'italic'); doc.setTextColor(100);
      doc.text('Sin productos próximos a vencer en los próximos 30 días.', 16, y);
      doc.setFont('helvetica', 'normal'); doc.setTextColor(0);
      y += 10;
    }

    // ════════════════════════════════════════
    // 3. INVENTARIO Y STOCK (renumerado)
    // ════════════════════════════════════════
    seccion('7. Stock de Alimentos', 234, 179, 8);
    const tiposMedCache = S.tiposMed || [];
    tabla(
      ['Tipo de Alimento', 'Categoría', 'Stock actual (kg)'],
      stockAlim.map(s => {
        const nombre = s.id_tipo_alimento?.nombre_alimento || '—';
        const tipo   = tiposAlim.find(t => t.nombre_alimento === nombre);
        return [nombre, tipo?.categoria || '—', fmt(s.cantidad)];
      }),
      [234, 179, 8]
    );

    seccion('8. Stock de Medicamentos', 59, 130, 246);
    tabla(
      ['Medicamento', 'Categoría', 'Stock', 'Unidad'],
      stockMed.map(s => {
        const nombre = s.id_tipo_medicamento?.nombre || '—';
        const tipo   = tiposMedCache.find(t => t.nombre === nombre);
        return [nombre, tipo?.categoria || s.id_tipo_medicamento?.categoria || '—', fmt(s.cantidadActual), tipo?.unidad || s.id_tipo_medicamento?.unidad || '—'];
      }),
      [59, 130, 246]
    );

    // ════════════════════════════════════════
    // 4. COSTOS — INVERSIONES EN INVENTARIO
    // ════════════════════════════════════════
    seccion('9. Inversión en Alimentos (Ingresos al Inventario)', 180, 120, 0);
    const invAlimPorTipo = {};
    ingAlim.forEach(r => {
      const k = r.id_tipo_alimento?.nombre_alimento || '—';
      if (!invAlimPorTipo[k]) invAlimPorTipo[k] = { kg: 0, valor: 0 };
      invAlimPorTipo[k].kg    += +r.cantidad    || 0;
      invAlimPorTipo[k].valor += +r.valor_total || 0;
    });
    tabla(
      ['Tipo de Alimento', 'Categoría', 'Total kg ingresado', 'Valor Total'],
      Object.entries(invAlimPorTipo).map(([nombre, d]) => {
        const tipo = tiposAlim.find(t => t.nombre_alimento === nombre);
        return [nombre, tipo?.categoria || '—', fmt(d.kg) + ' kg', fmtP(d.valor)];
      }),
      [180, 120, 0],
      ['TOTAL', '', fmt(ingAlim.reduce((a,r)=>a+(+r.cantidad||0),0)) + ' kg', fmtP(totalInvAlim)]
    );

    seccion('10. Inversión en Medicamentos (Ingresos al Inventario)', 59, 100, 200);
    const invMedPorTipo = {};
    ingMed.forEach(r => {
      const k = r.id_tipo_medicamento?.nombre || '—';
      if (!invMedPorTipo[k]) invMedPorTipo[k] = { cant: 0, valor: 0 };
      invMedPorTipo[k].cant  += +r.cantidad    || 0;
      invMedPorTipo[k].valor += +r.valor_total || 0;
    });
    tabla(
      ['Medicamento', 'Cantidad ingresada', 'Valor Total'],
      Object.entries(invMedPorTipo).map(([nombre, d]) => [nombre, fmt(d.cant) + ' und', fmtP(d.valor)]),
      [59, 100, 200],
      ['TOTAL', fmt(ingMed.reduce((a,r)=>a+(+r.cantidad||0),0)) + ' und', fmtP(totalInvMed)]
    );

    // ════════════════════════════════════════
    // 5. COSTOS — CONSUMO POR CICLO
    // ════════════════════════════════════════
    seccion('11. Consumo de Alimento por Ciclo', 180, 120, 0);
    const consAlimCiclo = {};
    admiAlim.forEach(r => {
      const k = r.nombre_ciclo || `Ciclo ${r.id_ciclo}`;
      if (!consAlimCiclo[k]) consAlimCiclo[k] = { galpon: r.nombre_galpon || '—', kg: 0 };
      consAlimCiclo[k].kg += +r.cantidad_utilizada || 0;
    });
    tabla(
      ['Ciclo', 'Galpón', 'Total Consumido', 'Estado'],
      Object.entries(consAlimCiclo).map(([ciclo, d]) => {
        const c = ciclos.find(x => (x.nombre_ciclo || `Ciclo ${x.id_ciclo}`) === ciclo);
        const fin = c ? toDateStr(c.fecha_fin) : null;
        return [ciclo, d.galpon, fmt(d.kg) + ' kg', !fin || fin >= hoy ? 'Activo' : 'Finalizado'];
      }),
      [180, 120, 0],
      ['TOTAL', '', fmt(totalConsAlim) + ' kg', '']
    );

    seccion('12. Consumo de Medicamentos por Ciclo', 59, 100, 200);
    const consMedCiclo = {};
    admiMed.forEach(r => {
      const k = r.nombre_ciclo || `Ciclo ${r.id_ciclo}`;
      if (!consMedCiclo[k]) consMedCiclo[k] = { galpon: r.nombre_galpon || '—', cant: 0 };
      consMedCiclo[k].cant += +r.cantidad_utilizada || 0;
    });
    tabla(
      ['Ciclo', 'Galpón', 'Total Aplicado', 'Estado'],
      Object.entries(consMedCiclo).map(([ciclo, d]) => {
        const c = ciclos.find(x => (x.nombre_ciclo || `Ciclo ${x.id_ciclo}`) === ciclo);
        const fin = c ? toDateStr(c.fecha_fin) : null;
        return [ciclo, d.galpon, fmt(d.cant) + ' und', !fin || fin >= hoy ? 'Activo' : 'Finalizado'];
      }),
      [59, 100, 200],
      ['TOTAL', '', fmt(totalConsMed) + ' und', '']
    );

    // ════════════════════════════════════════
    // 6. ADMINISTRACIÓN DETALLADA
    // ════════════════════════════════════════
    seccion('13. Detalle Administración de Alimentos', 234, 179, 8);
    tabla(
      ['Fecha', 'Galpón', 'Ciclo', 'Alimento', 'Cantidad'],
      admiAlim.map(a => [
        toDateStr(a.fecha_alimentacion) || '—',
        a.nombre_galpon   || '—',
        a.nombre_ciclo    || '—',
        a.nombre_alimento || '—',
        fmt(a.cantidad_utilizada) + ' kg',
      ]),
      [234, 179, 8]
    );

    seccion('14. Detalle Administración de Medicamentos', 59, 130, 246);
    tabla(
      ['Fecha', 'Galpón', 'Ciclo', 'Medicamento', 'Cantidad'],
      admiMed.map(a => [
        toDateStr(a.fecha_medicacion) || '—',
        a.nombre_galpon || '—',
        a.nombre_ciclo  || '—',
        a.nombre_med    || '—',
        fmt(a.cantidad_utilizada) + ' und',
      ]),
      [59, 130, 246]
    );

    // ════════════════════════════════════════
    // 7. MORTALIDAD
    // ════════════════════════════════════════
    seccion('15. Registro de Mortalidades', 239, 68, 68);
    const mortPorCiclo = {};
    mort.forEach(m => {
      const cid  = m.id_ciclo?.id_ciclo;
      const k    = m.id_ciclo?.nombre_ciclo || `Ciclo ${cid || '?'}`;
      if (!mortPorCiclo[k]) mortPorCiclo[k] = { bajas: 0, cid };
      mortPorCiclo[k].bajas += +m.muertos || 0;
    });

    const mortResumen = Object.entries(mortPorCiclo).map(([nombre, d]) => {
      const ciclo      = ciclos.find(c => c.id_ciclo === d.cid);
      const valorPollo = +ciclo?.valor_pollo || 0;
      const pollos     = +ciclo?.cantidad_pollos || 0;
      const perdida    = d.bajas * valorPollo;
      const tasa       = pollos > 0 ? (d.bajas / pollos * 100).toFixed(1) + '%' : '—';
      return [nombre, pollos ? fmt(pollos) : '—', fmt(d.bajas) + ' aves', tasa, valorPollo ? fmtP(valorPollo) : '—', perdida ? fmtP(perdida) : '—'];
    });

    tabla(
      ['Ciclo', 'Pollos iniciales', 'Bajas', 'Tasa %', 'Valor/Pollo', 'Pérdida Aprox.'],
      mortResumen,
      [239, 68, 68],
      ['TOTAL', fmt(totalPollosActivos), fmt(totalMuertos) + ' aves', '', '', fmtP(totalPerdidaMort)]
    );

    checkY(20);
    tabla(
      ['Fecha', 'Galpón', 'Ciclo', 'Tipo de Muerte', 'Causa', 'Bajas'],
      mort.map(m => [
        toDateStr(m.fecha_de_muerte) || '—',
        m.id_galpon?.nombre          || '—',
        m.id_ciclo?.nombre_ciclo     || '—',
        m.id_tipo_muerte?.nombre     || '—',
        m.causa || '—',
        fmt(m.muertos),
      ]),
      [239, 68, 68]
    );

    // ── Pie de página ──
    const pages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pages; i++) {
      doc.setPage(i);
      doc.setFontSize(8); doc.setTextColor(150);
      doc.text(`Página ${i} de ${pages}  ·  Generado por SAYFER`, W / 2, 290, { align: 'center' });
    }

    doc.save('reporte-sayfer-' + hoy + '.pdf');
    toast('✅', 'Reporte generado', 'El PDF se descargó correctamente');
  } catch (e) {
    toast('❌', 'Error al generar PDF', e.message, 't-warn');
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Reporte PDF'; }
  }
}

// ─── INICIALIZACIÓN ───────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  toggleLoadingScreen(false);
  applyTheme(S.theme);

  const systemThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
  systemThemeQuery.addEventListener('change', () => {
    if (S.theme === 'system') applyTheme('system');
  });

  if (S.user) {
    document.getElementById('login-screen').style.display  = 'none';
    document.getElementById('top-username').textContent    = S.user.nombre;
    document.getElementById('top-avatar').textContent      = S.user.nombre[0]?.toUpperCase() || 'U';
    document.getElementById('cfg-url').value               = S.apiBase;
    pingApi();
    loadAll();
  }
});