/* ═══════════════════════════════════════════════════════════
   SAYFER — Gestión Avícola
   app.js · Lógica principal del sistema
   proyecto_sayfer · v1.0
═══════════════════════════════════════════════════════════ */

// ─── ESTADO GLOBAL ────────────────────────────────────────
localStorage.setItem('sayfer_rol_actual', 'admin');
let _editandoUsuario = null;
const S = {

  apiBase: localStorage.getItem('sayfer_url') || 'http://localhost:8090',
  token:   localStorage.getItem('sayfer_token') || '',
  user:    JSON.parse(localStorage.getItem('sayfer_user') || 'null'),
  // caché de datos de referencia
  galpones:     [],
  ciclos:       [],
  tiposAlimento:[],
  tiposMed:     [],
  tiposMuerte:  [],
  usuarios:     [],
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

    // 3. Si no es ninguno, usa los datos demo
    return DEMO[demoKey] || [];
  } catch (err) {
    console.error(`Error cargando ${path}:`, err);
    return DEMO[demoKey] || [];
  }
}

// ─── AUTENTICACIÓN ────────────────────────────────────────
function doLogin() {
  localStorage.setItem('sayfer_rol_actual', S.user?.rol || 'empleado');
  const url  = document.getElementById('login-url').value.trim();
  const user = document.getElementById('login-user').value.trim();
  if (url) { S.apiBase = url; localStorage.setItem('sayfer_url', url); }

  const fakeUser = { nombre: user, apellido: '', rol: 'admin', id_usuario: 1 };
  S.user = fakeUser;
  localStorage.setItem('sayfer_user', JSON.stringify(fakeUser));

  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('top-username').textContent = user;
  document.getElementById('top-avatar').textContent   = user[0]?.toUpperCase() || 'U';
  document.getElementById('cfg-url').value = S.apiBase;

  pingApi();
  loadAll();
}

function doLogout() {
  localStorage.removeItem('sayfer_user');
  location.reload();
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
    'config':          () => { loadUnidades(); renderConfigStatus(); }
  };
  loaders[tabId]?.();
}

// ─── MODALES ──────────────────────────────────────────────
function openModal(id) {
  document.getElementById(id).classList.add('open');
  populateSelects(id);
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

  const { galpones: g, ciclos: c, tiposAlimento: ta,
    tiposMed: tm, tiposMuerte: tmu, usuarios: u, unidades: un } = S;

  if (modalId === 'modal-mortalidad') {
    sel('mo-ciclo',      c,   'id_ciclo',          x => `${x.id_ciclo} — ${x.nombre_ciclo||'Sin nombre'}`);
    sel('mo-galpon',     g,   'id_galpon',          x => `${x.id_galpon} — ${x.nombre}`);
    sel('mo-tipo-muerte',tmu, 'id_tipo_muerte',     x => x.nombre);
    document.getElementById('mo-fecha').value = today();
  }
  if (modalId === 'modal-ing-alimento') {
    sel('ia-tipo', ta, 'id_tipo_alimento', x => x.nombre_alimento);
    document.getElementById('ia-fecha').value = today();
  }
  if (modalId === 'modal-ing-med') {
    sel('im-tipo',   tm, 'id_tipo_medicamento', x => x.nombre);
    sel('im-unidad', un, 'id',           x => x.nombre);
    document.getElementById('im-fecha').value = today();
  }
  if (modalId === 'modal-adm-alimento') {
    sel('aa-tipo',    ta, 'id_tipo_alimento', x => x.nombre_alimento);
    sel('aa-galpon',  g,  'id_galpon',        x => `${x.id_galpon} — ${x.nombre}`);
    sel('aa-ciclo',   c,  'id_ciclo',         x => x.nombre_ciclo||`Ciclo ${x.id_ciclo}`);
    sel('aa-usuario', u,  'id_usuario',       x => `${x.nombre} ${x.apellido}`);
    document.getElementById('aa-fecha').value = today();
  }
  if (modalId === 'modal-adm-med') {
    sel('am-tipo',    tm, 'id_tipo_medicamento', x => x.nombre);
    sel('am-galpon',  g,  'id_galpon',           x => `${x.id_galpon} — ${x.nombre}`);
    sel('am-ciclo',   c,  'id_ciclo',            x => x.nombre_ciclo||`Ciclo ${x.id_ciclo}`);
    sel('am-usuario', u,  'id_usuario',          x => `${x.nombre} ${x.apellido}`);
    sel('am-unidad',  un, 'id_unidad',           x => x.nombre_unidad);
    document.getElementById('am-fecha').value = today();
  }
}

function today() { return new Date().toISOString().split('T')[0]; }

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

function saveConfig() {
  S.apiBase = document.getElementById('cfg-url').value   || S.apiBase;
  S.token   = document.getElementById('cfg-token').value || '';
  localStorage.setItem('sayfer_url',   S.apiBase);
  localStorage.setItem('sayfer_token', S.token);
  toast('💾', 'Configuración guardada');
  pingApi();
}

function renderConfigStatus() {
  document.getElementById('cfg-url').value = S.apiBase;
  document.getElementById('cfg-status-list').innerHTML = `
    <div class="info-row"><span class="info-key">URL</span><span class="mono">${S.apiBase}</span></div>
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
  document.getElementById('s-ciclos').textContent        = S.ciclos.filter(c => !c.fecha_fin).length;
  document.getElementById('s-muertos-hoy').textContent   = bajasHoy;
  document.getElementById('s-muertos-nota').textContent  = `${bajas7dias} en últimos 7 días`;
  document.getElementById('s-tipos-alimento').textContent= S.tiposAlimento.length;
  document.getElementById('s-tipos-med').textContent     = S.tiposMed.length;

  // Tabla de ciclos
  document.getElementById('dash-ciclos-tbody').innerHTML = S.ciclos.map(c => `
    <tr>
      <td class="mono">${c.id_ciclo}</td>
      <td>${c.nombre_ciclo || '—'}</td>
      <td class="mono">${c.fecha_inicio}</td>
      <td class="mono">${c.fecha_fin || '—'}</td>
      <td>${c.fecha_fin
      ? '<span class="badge badge-gray">Cerrado</span>'
      : '<span class="badge badge-green">● Activo</span>'}</td>
    </tr>`).join('');

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
  document.getElementById('galpones-tbody').innerHTML = S.galpones.map(g => `
    <tr>
      <td class="mono">${g.id_galpon}</td>
      <td>${g.nombre}</td>
      <td>${g.capacidad?.toLocaleString()}</td>
      <td>${S.ciclos.length} ciclos</td>
      <td><button class="btn btn-secondary btn-sm">✏️ Editar</button></td>
    </tr>`).join('');
}

// ─── CICLOS DE PRODUCCIÓN ─────────────────────────────────
async function loadCiclos() {
  S.ciclos = await tryGet('/ciclo-produccion', 'ciclos');
  document.getElementById('ciclos-tbody').innerHTML = S.ciclos.map(c => {
    const ini  = new Date(c.fecha_inicio);
    const fin  = c.fecha_fin ? new Date(c.fecha_fin) : new Date();
    const dias = Math.round((fin - ini) / (1000 * 60 * 60 * 24));
    return `<tr>
      <td class="mono">${c.id_ciclo}</td>
      <td>${c.nombre_ciclo || '—'}</td>
      <td class="mono">${c.fecha_inicio}</td>
      <td class="mono">${c.fecha_fin || 'En curso'}</td>
      <td class="mono">${dias} días</td>
      <td>${c.fecha_fin
        ? '<span class="badge badge-gray">Cerrado</span>'
        : '<span class="badge badge-green">● Activo</span>'}</td>
      <td><button class="btn btn-secondary btn-sm">✏️</button></td>
    </tr>`;
  }).join('');
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
      <td class="mono">${r.valor_total    != null ? '$' + r.valor_total.toLocaleString()    : '—'}</td>
    </tr>`).join('') ||
      '<tr><td colspan="6" style="text-align:center;color:var(--text3)">Sin registros</td></tr>';
}

// ─── MEDICAMENTOS ─────────────────────────────────────────
async function loadTiposMed() {
  S.tiposMed = await tryGet('/tipo-medicamento', 'tiposMed');
  document.getElementById('tipos-med-tbody').innerHTML = S.tiposMed.map(t => `
    <tr>
      <td class="mono">${t.id_tipo_medicamento}</td>
      <td>${t.nombre}</td>
      <td style="color:var(--text3)">${t.descripcion_medi || '—'}</td>
    </tr>`).join('');
}

async function loadStockMed() {
  const data = await tryGet('/stock-medicamento', 'stockMed');
  document.getElementById('stock-med-tbody').innerHTML = data.map(m => {
    const low = +m.cantidad_actual < 5;
    return `<tr>
      <td>${m.nombre}</td>
      <td class="mono">${+m.cantidad_actual}</td>
      <td class="mono">${m.nombre_unidad || '—'}</td>
      <td>${low
        ? '<span class="badge badge-red">⚠ Bajo</span>'
        : '<span class="badge badge-green">OK</span>'}</td>
    </tr>`;
  }).join('') || '<tr><td colspan="4" style="text-align:center;color:var(--text3)">Sin datos</td></tr>';

  const low = data.some(m => +m.cantidad_actual < 5);
  document.getElementById('badge-med').style.display = low ? 'inline' : 'none';
}

async function loadIngMed() {
  const data = await tryGet('/ing-medicamento', 'ingMed');
  document.getElementById('ing-med-tbody').innerHTML = data.map(r => `
    <tr>
      <td class="mono">${r.ing_medicamento}</td>
      <td>${r.id_tipo_medicamento?.nombre || '—'}</td>
      <td class="mono">${+r.cantidad}</td>
      <td class="mono">${r.id_unidad?.nombre || '—'}</td>
      <td class="mono">${r.fecha_ingreso}</td>
      <td class="mono">${r.valor_total    != null ? '$' + r.valor_total.toLocaleString()    : '—'}</td>
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
    </tr>`).join('');
}

async function loadMortalidad() {
  const data  = await tryGet('/mortalidad', 'mortalidad');
  const hoy   = new Date().toISOString().split('T')[0];
  document.getElementById('m-total').textContent    = data.reduce((a,m) => a + m.cantidad_muertos, 0);
  document.getElementById('m-hoy').textContent      = data.filter(m => m.fecha_muerte === hoy).reduce((a,m) => a + m.cantidad_muertos, 0);
  document.getElementById('m-galpones').textContent = [...new Set(data.map(m => m.id_galpon))].length;

  document.getElementById('mortalidad-tbody').innerHTML = data.map(m => `
    <tr>
      <td class="mono">${m.id_mortalidad}</td>
      <td class="mono">${m.id_ciclo}</td>
      <td class="mono">${m.id_galpon}</td>
      <td>${m.nombre_tipo || m.id_tipo_muerte}</td>
      <td class="mono">${m.fecha_muerte}</td>
      <td style="color:var(--red);font-weight:700">${m.cantidad_muertos}</td>
      <td style="color:var(--text3)">${m.causa || '—'}</td>
    </tr>`).join('') ||
      '<tr><td colspan="7" style="text-align:center;color:var(--text3)">Sin registros</td></tr>';

  // Gráfica de barras por causa
  const byCausa = {};
  data.forEach(m => {
    const k = m.nombre_tipo || `Tipo ${m.id_tipo_muerte}`;
    byCausa[k] = (byCausa[k] || 0) + m.cantidad_muertos;
  });
  const entries = Object.entries(byCausa);
  const maxC    = Math.max(...entries.map(e => e[1]), 1);
  document.getElementById('chart-causas').innerHTML = entries.map(([k, val]) => `
    <div class="bar-col">
      <div class="bar red" style="height:${(val/maxC*110)}px" data-val="${val}"></div>
      <div class="bar-lbl">${k.split(' ')[0]}</div>
    </div>`).join('');
}

// ─── ADMINISTRACIÓN DE ALIMENTO ───────────────────────────
async function loadAdmAlimento() {
  const data = await tryGet('/admi-alimento', 'admAlimento');

  document.getElementById('adm-alimento-tbody').innerHTML = data.map(r => `
    <tr>
      <td class="mono">${r.id_admi_alimento}</td>
      <td>${r.nombre_alimento  || r.id_tipo_alimento}</td>
      <td>${r.nombre_galpon    || r.id_galpon}</td>
      <td>${r.nombre_ciclo     || r.id_ciclo}</td>
      <td class="mono">${(+r.cantidad_utilizada).toLocaleString()} kg</td>
      <td class="mono">${r.fecha_alimentacion}</td>
      <td>${r.nombre_usuario   || r.id_usuario}</td>
    </tr>`).join('') ||
      '<tr><td colspan="7" style="text-align:center;color:var(--text3)">Sin registros</td></tr>';
}

// ─── ADMINISTRACIÓN DE MEDICAMENTOS ──────────────────────
async function loadAdmMed() {
  const data = await tryGet('/admi-medicamento', 'admMed');
  document.getElementById('adm-med-tbody').innerHTML = data.map(r => `
    <tr>
      <td class="mono">${r.id_admi_medicamento}</td>
      <td>${r.nombre_med       || r.id_tipo_medicamento}</td>
      <td>${r.nombre_galpon    || r.id_galpon}</td>
      <td>${r.nombre_ciclo     || r.id_ciclo}</td>
      <td class="mono">${+r.cantidad_utilizada}</td>
      <td class="mono">${r.nombre_unidad || r.id_unidad}</td>
      <td class="mono">${r.fecha_medicacion}</td>
      <td>${r.nombre_usuario   || r.id_usuario}</td>
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

  // Mostrar campo estado y hint de contraseña
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

function postGalpon() {
  doPost('/galpon',
      { nombre: v('g-nombre'), capacidad: +v('g-capacidad') },
      'modal-galpon', loadGalpones, 'Galpón');
}
function postCiclo() {
  doPost('/ciclo-produccion',
      { nombreCiclo: v('c-nombre'), fecha_inicio: v('c-inicio'), fecha_fin: v('c-fin') || null },
      'modal-ciclo', loadCiclos, 'Ciclo');
}
function postTipoAlimento() {
  doPost('/tipo-alimento',
      { nombre_alimento: v('ta-nombre'), descripcion_alimento: v('ta-desc') },
      'modal-tipo-alimento', () => { loadTiposAlimento(); loadStockAlimento(); }, 'Tipo Alimento');
}
function postIngAlimento() {
  doPost('/ing-alimento',
      { id_tipo_alimento: { id_tipo_alimento: +v('ia-tipo') }, cantidad: +v('ia-cantidad'),
        fecha_ingreso: v('ia-fecha'), valor_total: +v('ia-vtotal'), },
      'modal-ing-alimento', () => { loadIngAlimento(); loadStockAlimento(); }, 'Ingreso Alimento');
}
function postTipoMed() {
  doPost('/tipo-medicamento',
      { nombre: v('tm-nombre'), descripcion_medi: v('tm-desc') },
      'modal-tipo-med', loadTiposMed, 'Tipo Medicamento');
}
function postIngMed() {
  doPost('/ing-medicamento',
      {
        id_tipo_medicamento: { id_tipo_medicamento: +v('im-tipo') },
        cantidad:            +v('im-cantidad'),
        id_unidad:           { id: +v('im-unidad') },
        fecha_ingreso:       v('im-fecha'),
        valor_total:         +v('im-vtotal')
      },
      'modal-ing-med', () => { loadIngMed(); loadStockMed(); }, 'Ingreso Medicamento');
}
function postTipoMuerte() {
  doPost('/tipo-muerte',
      { nombre: v('tmu-nombre'), descripcion: v('tmu-desc') },
      'modal-tipo-muerte', loadTiposMuerte, 'Tipo Muerte');
}
function postMortalidad() {
  doPost('/mortalidad',
      { id_ciclo: +v('mo-ciclo'), id_galpon: +v('mo-galpon'),
        id_tipo_muerte: +v('mo-tipo-muerte'), fecha_muerte: v('mo-fecha'),
        cantidad_muertos: +v('mo-cantidad'), causa: v('mo-causa') },
      'modal-mortalidad', loadMortalidad, 'Mortalidad');
}
function postAdmAlimento() {
  doPost('/admi-alimento',
      { id_tipo_alimento: +v('aa-tipo'), id_galpon: +v('aa-galpon'),
        id_ciclo: +v('aa-ciclo'), id_usuario: +v('aa-usuario'),
        cantidad_utilizada: +v('aa-cantidad'), fecha_alimentacion: v('aa-fecha') },
      'modal-adm-alimento', loadAdmAlimento, 'Alimentación');
}
function postAdmMed() {
  doPost('/admi-medicamento',
      { id_tipo_medicamento: +v('am-tipo'), id_galpon: +v('am-galpon'),
        id_ciclo: +v('am-ciclo'), id_usuario: +v('am-usuario'),
        id_unidad: +v('am-unidad'), cantidad_utilizada: +v('am-cantidad'),
        fecha_medicacion: v('am-fecha') },
      'modal-adm-med', loadAdmMed, 'Medicación');
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

  // Ocultar estado y hint (solo en edición)
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
  if (S.user) {
    document.getElementById('login-screen').style.display  = 'none';
    document.getElementById('top-username').textContent    = S.user.nombre;
    document.getElementById('top-avatar').textContent      = S.user.nombre[0]?.toUpperCase() || 'U';
    document.getElementById('cfg-url').value               = S.apiBase;
    pingApi();
    loadAll();
  }
});