/* editor.js — editor de hoja (Konva)
   Usa las variables de index.html: sb, code, pool, renders, layouts, lastGroups, flip, build, say, HOJAS, BUCKET */
(function(){
const W = 800, H = 1100, PAPEL = '#E9E6FF';          // lienzo lógico: misma proporción que la página
const COLORES = ['#09120B', '#273C2C', '#82204A', '#690313', '#8FB339', '#E9E6FF'];
const FW = 360, FH = 480, IMW = 320, IMH = 400;       // marco de foto (polaroid)
const $e = id => document.getElementById(id);

/* ---------- Interfaz ---------- */
document.head.insertAdjacentHTML('beforeend', `<style>
#ed{position:fixed;inset:0;z-index:50;background:var(--noche);display:flex;flex-direction:column;padding:env(safe-area-inset-top) 0 env(safe-area-inset-bottom)}
#ed[hidden],#ed-panel[hidden]{display:none}
.ed-top{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px 12px}
.ed-hoja{display:flex;align-items:center;gap:8px;font:700 1.4rem 'Inconsolata',cursive}
button.sm{padding:6px 14px}
#ed-stage{flex:1;min-height:0;overflow:hidden;display:flex;align-items:center;justify-content:center;touch-action:none}
.ed-sel,.ed-bar{display:flex;gap:8px;justify-content:center;align-items:center;flex-wrap:wrap;padding:6px 10px}
.ed-sel{min-height:56px;visibility:hidden;background:rgba(233,230,255,.08)}
#ed-panel{display:flex;gap:10px;overflow-x:auto;padding:8px 12px;background:rgba(233,230,255,.08)}
#ed-panel button{flex:none;border:0;background:none;padding:0;min-height:0}
#ed-panel img{display:block;height:72px;max-width:110px;object-fit:contain;background:var(--lavanda);border-radius:6px;padding:4px}
#ed-msg{text-align:center;font-size:.8rem;min-height:1.4em;padding-bottom:6px;opacity:.9}
button.sw{width:30px;height:30px;min-height:0;padding:0;border-radius:50%;border:2px solid var(--lavanda)}
</style>`);
document.body.insertAdjacentHTML('beforeend', `
<div id="ed" hidden role="dialog" aria-label="Editar hoja">
  <div class="ed-top">
    <button class="ghost" id="ed-x">Cerrar</button>
    <div class="ed-hoja">
      <button class="ghost sm" id="ed-prev" aria-label="Hoja anterior">‹</button>
      <span id="ed-t">Hoja 1</span>
      <button class="ghost sm" id="ed-next" aria-label="Hoja siguiente">›</button>
    </div>
    <button class="main" id="ed-save">Guardar</button>
  </div>
  <div id="ed-stage"></div>
  <div class="ed-sel" id="ed-sel">
    <span id="ed-textctl" hidden><button id="ed-txt">Editar texto</button> <span id="ed-col"></span></span>
    <button id="ed-front">Al frente</button>
    <button class="ghost" id="ed-del">Eliminar</button>
  </div>
  <div class="ed-bar">
    <button id="ed-addtxt">Texto</button>
    <button id="ed-st">Stickers</button>
    <button id="ed-ph">Fotos</button>
    <button class="ghost" id="ed-reset">Restablecer</button>
  </div>
  <div id="ed-panel" hidden></div>
  <div id="ed-msg" role="status" aria-live="polite"></div>
</div>`);
$e('ed-col').innerHTML = COLORES.map(c => `<button class="sw" data-c="${c}" style="background:${c}" aria-label="Color ${c}"></button>`).join(' ');

/* ---------- Estado ---------- */
let stage, layer, tr, sel = null, h = 1, k = 1, dirty = false, stickers = null, panelAbierto = '';
const msg = t => { $e('ed-msg').textContent = t || ''; };
const marcar = () => { dirty = true; };

function cargarImg(src){
  return new Promise((ok, no) => {
    const i = new Image();
    i.crossOrigin = 'anonymous';
    i.onload = () => ok(i);
    i.onerror = () => no(new Error('No se pudo cargar ' + src));
    i.src = src;
  });
}
const urlFoto = f => (pool.find(p => p.f === f) || {}).url;

/* ---------- Elementos ---------- */
async function nodoFoto(o){
  const img = await cargarImg(urlFoto(o.f));
  const g = new Konva.Group({ x: o.x, y: o.y, rotation: o.r || 0, scaleX: o.sx || 1, scaleY: o.sy || o.sx || 1,
    offsetX: FW / 2, offsetY: FH / 2, draggable: true });
  g.setAttrs({ tipo: 'foto', f: o.f });
  g.add(new Konva.Rect({ width: FW, height: FH, fill: '#fff', shadowColor: '#09120B', shadowBlur: 18, shadowOpacity: .25, shadowOffsetY: 6 }));
  const im = new Konva.Image({ image: img, x: 20, y: 20, width: IMW, height: IMH });
  const r = img.naturalWidth / img.naturalHeight, t = IMW / IMH;
  let cw = img.naturalWidth, ch = img.naturalHeight, cx = 0, cy = 0;
  if (r > t){ cw = ch * t; cx = (img.naturalWidth - cw) / 2; } else { ch = cw / t; cy = (img.naturalHeight - ch) / 2; }
  im.crop({ x: cx, y: cy, width: cw, height: ch });
  g.add(im);
  g.add(new Konva.Rect({ x: FW / 2 - 65, y: -14, width: 130, height: 34, fill: '#82204A', opacity: .82, rotation: -3 }));
  return g;
}
function centrar(t){ t.offsetX(t.width() / 2); t.offsetY(t.height() / 2); }
function nodoTexto(o){
  const t = new Konva.Text({ x: o.x, y: o.y, rotation: o.r || 0, scaleX: o.sx || 1, scaleY: o.sy || o.sx || 1,
    text: o.text, fontFamily: 'Inconsolata', fontStyle: 'bold', fontSize: o.size || 64, fill: o.fill || '#09120B',
    width: o.w || 520, align: 'center', draggable: true });
  t.setAttrs({ tipo: 'texto' });
  centrar(t);
  t.on('dblclick dbltap', () => editarTexto(t));
  return t;
}
async function nodoSticker(o){
  const img = await cargarImg('../assets/stickers/' + o.f);
  const w = o.w || 220, hh = w * (img.naturalHeight || 512) / (img.naturalWidth || 512);
  const n = new Konva.Image({ image: img, x: o.x, y: o.y, width: w, height: hh, offsetX: w / 2, offsetY: hh / 2,
    rotation: o.r || 0, scaleX: o.sx || 1, scaleY: o.sy || o.sx || 1, draggable: true });
  n.setAttrs({ tipo: 'sticker', f: o.f });
  return n;
}
const crear = o => o.t === 'foto' ? nodoFoto(o) : o.t === 'texto' ? nodoTexto(o) : nodoSticker(o);

function agregar(n){
  n.on('click tap dragstart', () => elegir(n));
  n.on('dragend transformend', marcar);
  layer.add(n);
}

function elegir(n){
  sel = n;
  tr.nodes(n ? [n] : []);
  $e('ed-sel').style.visibility = n ? 'visible' : 'hidden';
  $e('ed-textctl').hidden = !(n && n.getAttr('tipo') === 'texto');
  tr.getLayer().batchDraw();
}

function editarTexto(t){
  const v = prompt('Escribe tu nota', t.text());
  if (v === null) return;
  t.text(v.trim() ? v : ' ');
  centrar(t);
  marcar();
  layer.batchDraw();
}

/* ---------- Lienzo ---------- */
function ajustar(){
  if (!stage) return;
  const c = $e('ed-stage');
  k = Math.min(c.clientWidth / W, c.clientHeight / H) * 0.98;
  stage.width(W * k); stage.height(H * k); stage.scale({ x: k, y: k });
}

function iniciarLienzo(){
  if (stage) stage.destroy();
  $e('ed-stage').innerHTML = '';
  stage = new Konva.Stage({ container: 'ed-stage', width: 10, height: 10 });
  const fondo = new Konva.Layer({ listening: false });
  fondo.add(new Konva.Rect({ width: W, height: H, fill: PAPEL }));
  layer = new Konva.Layer();
  const ui = new Konva.Layer();
  tr = new Konva.Transformer({
    keepRatio: true, padding: 6, anchorSize: 22, borderStroke: '#82204A', anchorStroke: '#82204A', anchorFill: '#E9E6FF',
    enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
    rotationSnaps: [0, 90, 180, 270], rotationSnapTolerance: 6,
    boundBoxFunc: (a, b) => (b.width < 40 || b.height < 40) ? a : b
  });
  ui.add(tr);
  stage.add(fondo, layer, ui);
  stage.on('click tap', e => { if (e.target === stage) elegir(null); });
  sel = null;
  $e('ed-sel').style.visibility = 'hidden';
  ajustar();
}

/* Acomodo inicial: el mismo que ya se ve en el libro */
function porDefecto(n){
  const fs = pool.filter(p => p.f.startsWith(`h${n}-`)).map(p => p.f);
  const P = {
    1: [[400, 550, 1.5, 0]],
    2: [[400, 300, 1, -2], [400, 800, 1, 2]],
    3: [[400, 330, 1.1, -1.5], [235, 810, .8, 2], [565, 810, .8, -2]],
    4: [[235, 300, .85, -2], [565, 300, .85, 2], [235, 790, .85, 2], [565, 790, .85, -2]]
  }[fs.length] || [];
  return fs.map((f, i) => ({ t: 'foto', f, x: P[i][0], y: P[i][1], sx: P[i][2], sy: P[i][2], r: P[i][3] }));
}

async function cargarHoja(n){
  h = n; dirty = false;
  $e('ed-t').textContent = 'Hoja ' + h;
  iniciarLienzo();
  cerrarPanel();
  msg('Cargando…');
  try { await document.fonts.load('700 64px Inconsolata'); } catch(e){}
  for (const o of (layouts[h] || porDefecto(h))){
    try { agregar(await crear(o)); } catch(e){ console.warn(e); }
  }
  layer.draw();
  msg('');
}

function serializar(){
  return layer.children.map(n => {
    const o = { t: n.getAttr('tipo'), x: Math.round(n.x()), y: Math.round(n.y()), r: Math.round(n.rotation() * 10) / 10,
      sx: Math.round(n.scaleX() * 1e4) / 1e4, sy: Math.round(n.scaleY() * 1e4) / 1e4 };
    if (o.t === 'foto') o.f = n.getAttr('f');
    if (o.t === 'sticker'){ o.f = n.getAttr('f'); o.w = n.width(); }
    if (o.t === 'texto'){ o.text = n.text(); o.fill = n.fill(); o.size = n.fontSize(); o.w = n.width(); }
    return o;
  });
}

/* ---------- Guardar (imagen de la hoja + lista de elementos) ---------- */
async function subirLayouts(){
  const r = await sb.storage.from(BUCKET).upload(`${code}/layout.json`,
    new Blob([JSON.stringify(layouts)], { type: 'application/json' }),
    { contentType: 'application/json', upsert: true, cacheControl: '0' });
  if (r.error) throw r.error;
  hasLayout = true;
}

async function guardar(){
  elegir(null);
  $e('ed-save').disabled = true;
  msg('Guardando…');
  try {
    const items = serializar();
    const blob = await stage.toBlob({ pixelRatio: 1 / k, mimeType: 'image/jpeg', quality: 0.88 });
    const store = sb.storage.from(BUCKET);
    const r = await store.upload(`${code}/p${h}.jpg`, blob, { contentType: 'image/jpeg', upsert: true, cacheControl: '60' });
    if (r.error) throw r.error;
    layouts[h] = items;
    await subirLayouts();
    renders[h] = store.getPublicUrl(`${code}/p${h}.jpg`).data.publicUrl + '?v=' + Date.now();
    dirty = false;
    msg('Hoja guardada.');
    return true;
  } catch(err){
    console.error(err);
    msg('No se pudo guardar: ' + (err && err.message ? err.message : 'error de conexión'));
    return false;
  } finally {
    $e('ed-save').disabled = false;
  }
}

async function restablecer(){
  if (!confirm('Se quitará todo lo que agregaste en esta hoja y las fotos volverán a su acomodo original. ¿Continuar?')) return;
  try {
    if (layouts[h]){
      delete layouts[h];
      delete renders[h];
      await sb.storage.from(BUCKET).remove([`${code}/p${h}.jpg`]);
      await subirLayouts();
    }
  } catch(err){ console.error(err); msg('No se pudo restablecer: ' + (err.message || '')); return; }
  await cargarHoja(h);
}

/* ---------- Paneles (stickers y fotos) ---------- */
function cerrarPanel(){ panelAbierto = ''; $e('ed-panel').hidden = true; ajustar(); }
async function abrirPanel(tipo){
  if (panelAbierto === tipo){ cerrarPanel(); return; }
  panelAbierto = tipo;
  const p = $e('ed-panel');
  if (tipo === 'st'){
    if (!stickers){
      try { const r = await fetch('../assets/stickers/stickers.json'); stickers = r.ok ? await r.json() : []; } catch(e){ stickers = []; }
    }
    p.innerHTML = stickers.length
      ? stickers.map(f => `<button data-st="${f}" aria-label="Sticker ${f}"><img src="../assets/stickers/${f}" alt=""></button>`).join('')
      : '<span>No encontré stickers en assets/stickers/.</span>';
  } else {
    p.innerHTML = pool.length
      ? pool.map(x => `<button data-ph="${x.f}" aria-label="Foto ${x.f}"><img src="${x.url}" alt="" crossorigin="anonymous"></button>`).join('')
      : '<span>Aún no hay fotos subidas.</span>';
  }
  p.hidden = false;
  ajustar();
}

async function anadir(o){
  try {
    const n = await crear(o);
    agregar(n); elegir(n); marcar(); layer.batchDraw();
    return n;
  } catch(err){ msg(err.message); }
}
const azar = () => (Math.random() - .5) * 120;

$e('ed-panel').onclick = e => {
  const b = e.target.closest('button');
  if (!b) return;
  if (b.dataset.st) anadir({ t: 'sticker', f: b.dataset.st, x: W / 2 + azar(), y: H / 2 + azar(), r: azar() / 10 });
  if (b.dataset.ph) anadir({ t: 'foto', f: b.dataset.ph, x: W / 2 + azar(), y: H / 2 + azar(), sx: .8, sy: .8, r: azar() / 20 });
};
$e('ed-st').onclick = () => abrirPanel('st');
$e('ed-ph').onclick = () => abrirPanel('ph');
$e('ed-addtxt').onclick = async () => {
  const t = await anadir({ t: 'texto', text: 'Escribe aquí', x: W / 2, y: H / 2 });
  if (t) editarTexto(t);
};
$e('ed-txt').onclick = () => sel && editarTexto(sel);
$e('ed-col').onclick = e => {
  const b = e.target.closest('button');
  if (b && sel){ sel.fill(b.dataset.c); marcar(); layer.batchDraw(); }
};
$e('ed-front').onclick = () => { if (sel){ sel.moveToTop(); marcar(); layer.batchDraw(); } };
$e('ed-del').onclick = () => { if (sel){ const n = sel; elegir(null); n.destroy(); marcar(); layer.batchDraw(); } };
$e('ed-reset').onclick = restablecer;
$e('ed-save').onclick = guardar;

/* ---------- Abrir, cambiar de hoja y cerrar ---------- */
function hojaActual(){
  const i = flip ? flip.getCurrentPageIndex() : 2;   // 0 portada, 1 guarda, 2-6 hojas, 7 contraportada
  return Math.min(HOJAS, Math.max(1, i - 1));
}
async function ir(d){
  const n = h + d;
  if (n < 1 || n > HOJAS) return;
  if (dirty && !(await guardar())) return;
  await cargarHoja(n);
}
async function cerrar(){
  if (dirty && confirm('Tienes cambios sin guardar en esta hoja. ¿Guardarlos?')){
    if (!(await guardar())) return;
  }
  $e('ed').hidden = true;
  document.body.style.overflow = '';
  if (stage){ stage.destroy(); stage = null; }
  build(lastGroups, h + 1);
}
async function abrir(){
  $e('ed').hidden = false;
  document.body.style.overflow = 'hidden';
  await cargarHoja(hojaActual());
}

$e('ed-x').onclick = cerrar;
$e('ed-prev').onclick = () => ir(-1);
$e('ed-next').onclick = () => ir(1);
window.addEventListener('resize', () => { if (!$e('ed').hidden) ajustar(); });
document.addEventListener('keydown', e => {
  if ($e('ed').hidden || !sel) return;
  if (e.key === 'Delete' || e.key === 'Backspace'){ e.preventDefault(); $e('ed-del').click(); }
});

$e('edit').onclick = () => {
  if (!sb){ say('Conecta Supabase primero.'); return; }
  abrir();
};
})();
