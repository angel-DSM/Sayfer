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
  const sel = (id, arr, valKey, lblFn) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = arr.map(x => `<option value="${x[valKey]}">${lblFn(x)}</option>`).join('');
  };
  // Ciclos: carga galpones en el select y limpia campos al abrir
  if (modalId === 'modal-ciclo') {
    sel('c-galpon', g, 'id_galpon', x => x.nombre);
    document.getElementById('c-nombre').value = '';
    document.getElementById('c-inicio').value = today();
    document.getElementById('c-fin').value    = '';
  }
  const { galpones: g, ciclos: c, tiposAlimento: ta,
    tiposMed: tm, tiposMuerte: tmu, usuarios: u, unidades: un } = S;

  if (modalId === 'modal-ciclo') {
    // Renderizar checkboxes en vez de <select multiple>
    const lista = document.getElementById('c-galpon-lista');
    lista.innerHTML = g.length === 0
        ? '<span style="color:var(--text3);font-size:12px">No hay galpones registrados</span>'
        : g.map(x => `
        <label style="display:flex;align-items:center;gap:10px;cursor:pointer;font-size:14px;color:var(--text)">
          <input type="checkbox" value="${x.id_galpon}"
            style="width:16px;height:16px;accent-color:var(--green,#22c55e);cursor:pointer"
            onchange="updateGalponPreview()">
          <span>${x.nombre}</span>
          <span style="margin-left:auto;font-size:11px;color:var(--text3)">${x.capacidad?.toLocaleString() || ''} aves</span>
        </label>`
        ).join('');

    // Limpiar campos
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
    sel('aa-ciclo',  c,  'id',               x => x.nombreCiclo || `Ciclo ${x.id}`);
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
    sel('am-ciclo',   c,  'id',            x => x.nombreCiclo||`Ciclo ${x.id_ciclo}`);
    document.getElementById('am-fecha').value = today();
  }
  if (modalId === 'modal-mortalidad') {
    sel('mo-galpon',  g,  'id_galpon',           x => `${x.id_galpon} — ${x.nombre}`);
    sel('mo-ciclo',   c,  'id',            x => x.nombreCiclo||`Ciclo ${x.id_ciclo}`);
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
  [S.galpones, S.ciclos, S.tiposAlimento, S.tiposMed,
    S.tiposMuerte, S.usuarios, S.unidades] = await Promise.all([
    tryGet('/galpon',        'galpones'),
    tryGet('/ciclo-produccion',          'ciclos'),
    tryGet('/tipo-alimento',  'tiposAlimento'),
    tryGet('/tipo-medicamento','tiposMed'),
    tryGet('/tipo-muerte',    'tiposMuerte'),
    tryGet('/usuario',        'usuarios'),
    tryGet('/unidad-medida', 'unidades'),
  ]);
  loadDashboard();
}

// ─── DASHBOARD ────────────────────────────────────────────
async function loadDashboard() {
  const now = new Date().toLocaleString('es-CO');
  document.getElementById('dash-updated').textContent = `Última actualización: ${now}`;

  const mort  = await tryGet('/mortalidad', 'mortalidad');
  const hoy   = new Date().toISOString().split('T')[0];
  const bajasHoy   = mort.filter(m => m.fecha_muerte === hoy).reduce((a,m) => a + m.cantidad_muertos, 0);
  const bajas7dias = mort.slice(0,7).reduce((a,m) => a + m.cantidad_muertos, 0);

  document.getElementById('s-galpones').textContent      = S.galpones.length;
  document.getElementById('s-ciclos').textContent        = S.ciclos.filter(c => !c.fecha_fin || c.fecha_fin > today()).length;
  document.getElementById('s-muertos-hoy').textContent   = bajasHoy;
  document.getElementById('s-muertos-nota').textContent  = `${bajas7dias} en últimos 7 días`;
  document.getElementById('s-tipos-alimento').textContent= S.tiposAlimento.length;
  document.getElementById('s-tipos-med').textContent     = S.tiposMed.length;

  // Tabla de ciclos (dashboard)
  const vinculosDash = S.vinculos || await tryGet('/galpon-ciclo-produccion', 'vinculos');
  document.getElementById('dash-ciclos-tbody').innerHTML = S.ciclos.map(c => {
    const vins = vinculosDash.filter(v => v.id_ciclo?.id === c.id || v.id_ciclo?.id_ciclo === c.id);
    const fechasIni = vins.map(v => v.fecha_inicio).filter(Boolean).sort();
    const fechasFin = vins.map(v => v.fecha_fin).filter(Boolean).sort();
    const fechaInicio = fechasIni[0] || null;
    const fechaFin    = fechasFin[fechasFin.length - 1] || null;
    const activo = !fechaFin || fechaFin > today();
    return `<tr>
    <td class="mono">${c.id}</td>
    <td>${c.nombreCiclo || '—'}</td>
    <td class="mono">${fechaInicio || '—'}</td>
    <td class="mono">${fechaFin || '—'}</td>
    <td>${activo
        ? '<span class="badge badge-green">● Activo</span>'
        : '<span class="badge badge-gray">Cerrado</span>'}</td>
  </tr>`;
  }).join('');

  // Gráfica mortalidad últimos 7 días
  const days = [...Array(7)].map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() - 6 + i);
    return d.toISOString().split('T')[0];
  });
  const byDay = days.map(d => ({
    label: d.slice(5),
    val: mort.filter(m => m.fecha_muerte === d).reduce((a,m) => a + m.cantidad_muertos, 0)
  }));
  const maxM = Math.max(...byDay.map(d => d.val), 1);
  document.getElementById('chart-mortalidad').innerHTML = byDay.map(d => `
    <div class="bar-col">
      <div class="bar red" style="height:${(d.val/maxM*140)}px" data-val="${d.val} bajas"></div>
      <div class="bar-lbl">${d.label}</div>
    </div>`).join('');
  document.getElementById('chip-total-muertos').textContent = `Total 7d: ${bajas7dias}`;

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

  const low = data.some(m => +m.cantidadActual < 5);
  // Alertas automáticas
  const alertas = [];
  stock.forEach(s => {
    if (+s.cantidad < 2000)
      alertas.push(`Stock crítico: <b>${s.nombre_alimento}</b> — ${s.cantidad} kg`);
  });
  const medBajo = (await tryGet('/stock-medicamento','stockMed')).filter(m => +m.cantidad_actual < 5);
  medBajo.forEach(m =>
      alertas.push(`Medicamento bajo: <b>${m.nombre}</b> — ${m.cantidad_actual} ${m.nombre_unidad || ''}`)
  );
  const iconAlerta = `<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>`;
  document.getElementById('dash-alerts').innerHTML = alertas
      .map(a => `<div class="alert alert-warn">${iconAlerta}<div>${a}</div></div>`).join('');
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
  [S.ciclos, S.vinculos] = await Promise.all([
    tryGet('/ciclo-produccion',        'ciclos'),
    tryGet('/galpon-ciclo-produccion', 'vinculos')
  ]);

  document.getElementById('ciclos-tbody').innerHTML = S.ciclos.map(c => {
    // Buscar todos los vínculos de este ciclo
    const vins = S.vinculos.filter(v => v.id_ciclo?.id === c.id || v.id_ciclo?.id_ciclo === c.id);

    // Galpones asociados (nombres)
    const galponesNombres = vins.length > 0
        ? [...new Set(vins.map(v => v.id_galpon?.nombre || `G${v.id_galpon?.id_galpon}`))].join(', ')
        : '—';

    // Fechas: tomar la menor fecha_inicio y la mayor fecha_fin del conjunto de vínculos
    const fechasIni = vins.map(v => v.fecha_inicio).filter(Boolean).sort();
    const fechasFin = vins.map(v => v.fecha_fin).filter(Boolean).sort();
    const fechaInicio = fechasIni[0] || null;
    const fechaFin    = fechasFin[fechasFin.length - 1] || null;

    // Duración en días
    let dias = '—';
    if (fechaInicio) {
      const ini = new Date(fechaInicio);
      const fin = fechaFin ? new Date(fechaFin) : new Date();
      dias = Math.round((fin - ini) / (1000 * 60 * 60 * 24));
    }

    const activo = !fechaFin || fechaFin > today();
    const estadoBadge = activo
        ? '<span class="badge badge-green">● Activo</span>'
        : '<span class="badge badge-gray">Cerrado</span>';

    return `<tr>
      <td class="mono">${c.id}</td>
      <td>${c.nombreCiclo || '—'}</td>
      <td>${galponesNombres}</td>
      <td class="mono">${fechaInicio || '—'}</td>
      <td class="mono">${fechaFin || 'En curso'}</td>
      <td class="mono">${dias !== '—' ? dias + ' días' : '—'}</td>
      <td>${estadoBadge}</td>
      ${isAdmin() ? `<td><button class="btn-icon" onclick="prepareEditCiclo(${c.id})" title="Editar">✏️</button></td>` : '<td>—</td>'}
    </tr>`;
  }).join('') || '<tr><td colspan="8" style="text-align:center;color:var(--text3);padding:20px">Sin ciclos registrados</td></tr>';
}

// ─── EDITAR / ELIMINAR CICLO ──────────────────────────────
async function prepareEditCiclo(id) {
  const ciclo = S.ciclos.find(c => c.id === id);
  if (!ciclo) { toast('❌', 'Ciclo no encontrado', '', 't-warn'); return; }

  document.getElementById('ec-id').value     = ciclo.id;
  document.getElementById('ec-nombre').value = ciclo.nombreCiclo || '';

  // Buscar los vínculos de este ciclo para obtener fechas y galpones actuales
  const vins = (S.vinculos || []).filter(v =>
      v.id_ciclo?.id === ciclo.id || v.id_ciclo?.id_ciclo === ciclo.id
  );

  // Fechas: tomar la menor inicio y mayor fin del conjunto
  const fechasIni = vins.map(v => v.fecha_inicio).filter(Boolean).sort();
  const fechasFin = vins.map(v => v.fecha_fin).filter(Boolean).sort();
  document.getElementById('ec-inicio').value = fechasIni[0] || '';
  document.getElementById('ec-fin').value    = fechasFin[fechasFin.length - 1] || '';

  // ID de galpones ya vinculados
  const galponesActuales = vins.map(v => v.id_galpon?.id_galpon).filter(Boolean);

  // Renderizar checkboxes marcando los ya vinculados
  const lista = document.getElementById('ec-galpon-lista');
  lista.innerHTML = S.galpones.map(g => `
    <label style="display:flex;align-items:center;gap:10px;cursor:pointer;font-size:14px;color:var(--text)">
      <input type="checkbox" value="${g.id_galpon}"
        ${galponesActuales.includes(g.id_galpon) ? 'checked' : ''}
        style="width:16px;height:16px;accent-color:var(--green,#22c55e);cursor:pointer"
        onchange="updateEcGalponPreview()">
      <span>${g.nombre}</span>
      <span style="margin-left:auto;font-size:11px;color:var(--text3)">${g.capacidad?.toLocaleString() || ''} aves</span>
    </label>`
  ).join('');

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
      body: JSON.stringify({ nombreCiclo: nombre })
    });
    if (!rCiclo.ok) {
      const err = await rCiclo.json().catch(() => ({}));
      throw new Error(err.message || 'Error al actualizar el ciclo');
    }

    // 2. Borrar todos los vínculos actuales de este ciclo
    const vinculosActuales = (S.vinculos || []).filter(v =>
        v.id_ciclo?.id === +id || v.id_ciclo?.id_ciclo === +id
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
          id_ciclo:     { id: +id }
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
        v.id_ciclo?.id === +id || v.id_ciclo?.id_ciclo === +id
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
  document.getElementById('tipos-alimento-tbody').innerHTML = S.tiposAlimento.map(t => `
    <tr>
      <td class="mono">${t.id_tipo_alimento}</td>
      <td>${t.nombre_alimento}</td>
      <td style="color:var(--text3)">${t.descripcion_alimento || '—'}</td>
    </tr>`).join('');
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
  document.getElementById('ing-alimento-tbody').innerHTML = data.map(r => `
    <tr>
      <td class="mono">${r.id_IngAlimento}</td>
      <td>${r.id_tipo_alimento?.nombre_alimento || '—'}</td>
      <td class="mono">${(+r.cantidad).toLocaleString()}</td>
      <td class="mono">${r.fecha_ingreso}</td>
      <td class="mono">${r.fecha_vencimiento}</td>
      <td class="mono">${r.valor_total != null ? '$' + r.valor_total.toLocaleString() : '—'}</td>
      <td>${isAdmin() ? `<button class="btn-icon" onclick="prepareEditIngAlimento(${r.id_IngAlimento})" title="Editar">✏️</button>` : '—'}</td>
    </tr>`).join('') ||
      '<tr><td colspan="7" style="text-align:center;color:var(--text3)">Sin registros</td></tr>';
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
  document.getElementById('ing-med-tbody').innerHTML = data.map(r => `
    <tr>
      <td class="mono">${r.ing_medicamento}</td>
      <td>${r.id_tipo_medicamento?.nombre || '—'}</td>
      <td class="mono">${+r.cantidad}</td>
      <td class="mono">${r.fecha_ingreso}</td>
      <td class="mono">${r.fecha_vencimiento}</td>
      <td class="mono">${r.valor_total != null ? '$' + (+r.valor_total).toLocaleString() : '—'}</td>
      <td>${isAdmin() ? `<button class="btn-icon" onclick="prepareEditIngMed(${r.ing_medicamento})" title="Editar">✏️</button>` : '—'}</td>
    </tr>`).join('') ||
      '<tr><td colspan="7" style="text-align:center;color:var(--text3)">Sin registros</td></tr>';
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

  document.getElementById('m-total').textContent    = data.reduce((a, m) => a + (+m.muertos || 0), 0);
  document.getElementById('m-hoy').textContent      = data.filter(m => m.fecha_de_muerte === hoy).reduce((a, m) => a + (+m.muertos || 0), 0);
  document.getElementById('m-galpones').textContent = [...new Set(data.map(m => m.id_galpon?.id_galpon).filter(Boolean))].length;

  document.getElementById('mortalidad-tbody').innerHTML = data.map(m => `
    <tr>
      <td class="mono">${m.id_Mortalidad}</td>
      <td>${m.id_ciclo?.nombreCiclo || '—'}</td>
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
  </div>`).join('');
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
      body: JSON.stringify({ nombreCiclo: nombre })
    });

    if (!resCiclo.ok) {
      const err = await resCiclo.json().catch(() => ({}));
      throw new Error(err.message || `Error ${resCiclo.status} al crear el ciclo`);
    }

    const cicloData = await resCiclo.json();
    // El DTO devuelve el campo como "id" (no id_ciclo)
    const idCiclo = cicloData.data?.id;

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
          id_ciclo:     { id: idCiclo }
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

// Abre el modal de edición con los datos del ciclo (solo ADMIN)
async function prepareEditCiclo(id) {
  const ciclo = S.ciclos.find(c => c.id_ciclo === id);
  if (!ciclo) return;
  document.getElementById('ec-id').value     = ciclo.id_ciclo;
  document.getElementById('ec-nombre').value = ciclo.nombre_ciclo || '';
  document.getElementById('ec-inicio').value = ciclo.fecha_inicio || '';
  document.getElementById('ec-fin').value    = ciclo.fecha_fin    || '';
  await fillGalponSelect('ec-galpon', ciclo.id_galpon?.id_galpon);
  openModal('modal-editar-ciclo');
}

// Envía PUT con header X-User-Rol para protección de rol
async function updateCiclo() {
  const id = +document.getElementById('ec-id').value;
  const payload = {
    nombre_ciclo: document.getElementById('ec-nombre').value,
    fecha_inicio: document.getElementById('ec-inicio').value,
    fecha_fin:    document.getElementById('ec-fin').value || null,
    id_galpon:    { id_galpon: +document.getElementById('ec-galpon').value }
  };
  try {
    const r = await fetch(S.apiBase + '/ciclo-produccion/' + id, {
      method: 'PUT',
      headers: { ...headers(), 'X-User-Rol': S.user?.rol || '' },
      body: JSON.stringify(payload)
    });
    const res = await r.json();
    if (!r.ok) { toast('❌', 'Error', res.message || 'No se pudo actualizar'); return; }
    toast('✅', 'Ciclo actualizado', payload.nombre_ciclo);
    closeModal('modal-editar-ciclo');
    loadCiclos();
  } catch (err) {
    toast('❌', 'Error de red', err.message);
  }
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
      body: JSON.stringify({ nombre_alimento: nombre, descripcion_alimento: v('ta-desc') })
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
    document.getElementById('eia-fechav').value = ingreso.fecha_vencimiento;
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
    document.getElementById('eim-fechav').value = ingreso.fecha_vencimiento;
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
    id_ciclo:       { id: +v('mo-ciclo') },
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
      `<option value="${c.id}" ${c.id === m.id_ciclo?.id ? 'selected' : ''}>${c.nombreCiclo || `Ciclo ${c.id}`}</option>`
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
    id_ciclo:        { id: +v('emo-ciclo') },
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
      `<option value="${c.id}" ${c.id === r.id_ciclo ? 'selected' : ''}>${c.nombreCiclo || `Ciclo ${c.id}`}</option>`
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
      `<option value="${c.id}" ${c.id === r.id_ciclo ? 'selected' : ''}>${c.nombreCiclo || `Ciclo ${c.id}`}</option>`
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