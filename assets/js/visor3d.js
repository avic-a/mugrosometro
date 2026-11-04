/* visor3d.js — modelo low poly flotando y girando sobre un pedestal (estilo selector de videojuego).
   Uso:
     import { crearVisor } from '../assets/js/visor3d.js';
     const visor = await crearVisor(elementoContenedor, '../assets/modelos/Chinche.glb');
     visor.onTocar(() => visor.agitar());
   Requiere el importmap de three.js en la página (ver chinche/index.html). */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

function textura(stops){
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  stops.forEach(([p, col]) => r.addColorStop(p, col));
  g.fillStyle = r; g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export async function crearVisor(contenedor, url, opciones = {}){
  const o = { tamano: 2.4, giro: 0.35, flota: 0.07, msMantener: 700, radio: 1.95, alturaCam: 0.15, inclinacion: 0.28, pedestal: true, medio: null, ajusteAncho: false,
              ajusteModelo: { x: 0, y: 0, z: 0 }, ...opciones };   // ajusteModelo: gira el modelo si viene acostado
  const reducir = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducir){ o.giro *= 0.3; o.flota *= 0.3; }

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const dom = renderer.domElement;
  dom.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:manipulation;-webkit-touch-callout:none;user-select:none';
  contenedor.appendChild(dom);

  const escena = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(32, 1, 0.1, 100);

  /* Luces */
  escena.add(new THREE.HemisphereLight(0xE9E6FF, 0x273C2C, 1.6));
  const sol = new THREE.DirectionalLight(0xffffff, 2.4);
  sol.position.set(3, 5, 4);
  escena.add(sol);
  const luzAro = new THREE.PointLight(0x8FB339, 8, 7, 2);
  escena.add(luzAro);

  /* Modelo */
  const gltf = await new GLTFLoader().loadAsync(url);
  const modelo = gltf.scene;
  modelo.traverse(n => {
    if (!n.isMesh) return;
    (Array.isArray(n.material) ? n.material : [n.material]).forEach(m => { m.flatShading = true; m.needsUpdate = true; });
  });
  modelo.rotation.set(o.ajusteModelo.x, o.ajusteModelo.y, o.ajusteModelo.z);
  const caja = new THREE.Box3().setFromObject(modelo);
  const tam = caja.getSize(new THREE.Vector3());
  const centro = caja.getCenter(new THREE.Vector3());
  modelo.position.sub(centro);                         // el centro del modelo queda en el origen
  const esc = o.tamano / Math.max(tam.x, tam.y, tam.z);
  const pivote = new THREE.Group();                    // gira sobre su eje vertical
  pivote.add(modelo);
  pivote.scale.setScalar(esc);
  const flota = new THREE.Group();                     // sube y baja, se agita
  flota.add(pivote);
  flota.rotation.x = o.inclinacion;                             // ligera inclinación para verlo desde arriba
  escena.add(flota);

  /* Zona de toque generosa (esfera invisible alrededor del modelo) */
  const zona = new THREE.Mesh(new THREE.SphereGeometry(o.tamano * 0.62, 12, 8), new THREE.MeshBasicMaterial({ visible: false }));
  flota.add(zona);

  /* Pedestal hexagonal, aro de luz y sombra */
  const yTope = -(tam.y * esc / 2 + 0.9);
  let aro = null, sombra = null;
  if (o.pedestal){
    const pedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(1.55, 1.7, 0.16, 6),
      new THREE.MeshStandardMaterial({ color: 0x273C2C, roughness: 0.85, flatShading: true }));
    pedestal.position.y = yTope - 0.08;
    escena.add(pedestal);
    aro = new THREE.Mesh(
      new THREE.RingGeometry(1.2, 1.4, 6),
      new THREE.MeshBasicMaterial({ color: 0x8FB339, transparent: true, opacity: 0.85, side: THREE.DoubleSide }));
    aro.rotation.x = -Math.PI / 2;
    aro.position.y = yTope + 0.005;
    escena.add(aro);
    sombra = new THREE.Mesh(
      new THREE.PlaneGeometry(2.6, 2.6),
      new THREE.MeshBasicMaterial({ map: textura([[0, 'rgba(0,0,0,.75)'], [1, 'rgba(0,0,0,0)']]), transparent: true, depthWrite: false }));
    sombra.rotation.x = -Math.PI / 2;
    sombra.position.y = yTope + 0.012;
    escena.add(sombra);
    luzAro.position.set(0, yTope + 0.6, 0.6);
  } else {
    luzAro.position.set(0, -1.6, 1.8);              // luz verde que sube desde abajo
  }

  /* Halo detrás del modelo */
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({
    map: textura([[0, 'rgba(255,255,255,1)'], [0.35, 'rgba(255,255,255,.3)'], [1, 'rgba(255,255,255,0)']]),
    color: 0xE9E6FF, transparent: true, opacity: 0.2, depthWrite: false, blending: THREE.AdditiveBlending }));
  halo.scale.setScalar(5.2);
  halo.position.set(0, 0, -1.2);
  escena.add(halo);

  /* Partículas que suben despacio */
  const N = 46, pos = new Float32Array(N * 3), vel = new Float32Array(N);
  for (let i = 0; i < N; i++){
    const a = Math.random() * Math.PI * 2, r = 0.8 + Math.random() * 1.2;
    pos.set([Math.cos(a) * r, yTope + Math.random() * 3.2, Math.sin(a) * r], i * 3);
    vel[i] = 0.12 + Math.random() * 0.2;
  }
  const geoP = new THREE.BufferGeometry();
  geoP.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const particulas = new THREE.Points(geoP, new THREE.PointsMaterial({
    color: 0xC9F26B, size: 0.06, transparent: true, opacity: 0.75, depthWrite: false, blending: THREE.AdditiveBlending }));
  escena.add(particulas);

  /* Cámara: se acomoda al espacio disponible (vertical u horizontal) */
  const medio = o.medio !== null ? o.medio : yTope / 2 + 0.1;
  function ajustar(){
    const w = contenedor.clientWidth || 1, h = contenedor.clientHeight || 1;
    renderer.setSize(w, h, false);
    cam.aspect = w / h;
    const fv = THREE.MathUtils.degToRad(cam.fov);
    const fh = 2 * Math.atan(Math.tan(fv / 2) * cam.aspect);
    const r = o.ajusteAncho ? o.radio * Math.max(1, cam.aspect / 0.8) : o.radio;   // en pantallas anchas se aleja para que quepa todo
    const d = Math.max(r / Math.sin(fv / 2), r / Math.sin(fh / 2)) * 1.03;
    cam.position.set(0, medio + d * o.alturaCam, d);
    cam.lookAt(0, medio, 0);
    cam.updateProjectionMatrix();
  }
  const observador = new ResizeObserver(ajustar);
  observador.observe(contenedor);
  ajustar();

  /* Efectos que se pueden disparar desde la página */
  let agit = 0, marea = 0, haloExtra = 0, haloDur = 1, salto = 0, vuelta = null;
  const colorBase = new THREE.Color(0xE9E6FF);
  const api = {
    agitar(f = 1){ agit = Math.max(agit, f); },
    mareo(seg = 1.5){ marea = seg; agit = Math.max(agit, 0.6); },
    brillo(color = '#C9F26B', seg = 2.5){ halo.material.color.set(color); haloExtra = seg; haloDur = seg; },
    saltar(){ salto = 1; },
    vueltaRapida(ms = 1000){ vuelta = { t0: performance.now(), dur: ms, desde: pivote.rotation.y }; },
    alto: tam.y * esc,
    alCuadro(fn){ api._cuadro = fn; },
    THREE, escena, flota, pivote, yTope,
    onTocar(fn){ api._tocar = fn; },
    onMantener(fn){ api._mantener = fn; },
    destruir(){ cancelAnimationFrame(raf); observador.disconnect(); renderer.dispose(); dom.remove(); }
  };

  /* Toque y toque largo (solo cuentan si caen sobre la chinche) */
  const rc = new THREE.Raycaster(), p = new THREE.Vector2();
  let timer = null, largo = false, activo = false, x0 = 0, y0 = 0;
  const sobreChinche = e => {
    const r = dom.getBoundingClientRect();
    p.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    rc.setFromCamera(p, cam);
    return rc.intersectObject(zona, false).length > 0;
  };
  dom.addEventListener('pointerdown', e => {
    if (!sobreChinche(e)) return;
    activo = true; largo = false; x0 = e.clientX; y0 = e.clientY;
    timer = setTimeout(() => { largo = true; api._mantener && api._mantener(); }, o.msMantener);
  });
  dom.addEventListener('pointermove', e => {
    if (activo && Math.hypot(e.clientX - x0, e.clientY - y0) > 14){ clearTimeout(timer); activo = false; }
  });
  const fin = e => {
    if (!activo) return;
    clearTimeout(timer); activo = false;
    if (!largo && e.type === 'pointerup') api._tocar && api._tocar();
  };
  dom.addEventListener('pointerup', fin);
  dom.addEventListener('pointercancel', fin);
  dom.addEventListener('contextmenu', e => e.preventDefault());

  /* Bucle de animación */
  let t = 0, antes = performance.now(), raf = 0;
  function cuadro(ahora){
    const dt = Math.min(0.05, (ahora - antes) / 1000);
    antes = ahora; t += dt;

    if (vuelta){                                           // vuelta rápida y regresa de frente
      const p = Math.min(1, (ahora - vuelta.t0) / vuelta.dur);
      const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      pivote.rotation.y = vuelta.desde + 2 * Math.PI * e;
      if (p >= 1) vuelta = null;
    } else {
      pivote.rotation.y += (o.giro + (marea > 0 ? 8 * Math.min(1, marea) : 0)) * dt;
      if (o.giro === 0 && marea <= 0){                     // sin giro: vuelve suave al frente
        const obj = Math.round(pivote.rotation.y / (2 * Math.PI)) * 2 * Math.PI;
        pivote.rotation.y += (obj - pivote.rotation.y) * Math.min(1, dt * 6);
      }
    }
    marea = Math.max(0, marea - dt);

    const s = Math.sin(t * 1.5);
    salto = Math.max(0, salto - dt * 1.6);
    flota.position.y = s * o.flota + (salto > 0 ? Math.sin(Math.PI * (1 - salto)) * 0.7 : 0);
    if (sombra){ sombra.scale.setScalar(1 - s * 0.08); sombra.material.opacity = 0.9 - s * 0.1; }

    agit = Math.max(0, agit - dt * 1.8);
    flota.rotation.z = Math.sin(t * 45) * 0.22 * agit;
    flota.scale.setScalar(1 + Math.sin(t * 30) * 0.05 * agit);

    haloExtra = Math.max(0, haloExtra - dt);
    const k = haloExtra / haloDur;
    halo.material.opacity = 0.2 + 0.7 * k;
    if (haloExtra === 0) halo.material.color.lerp(colorBase, 0.1);
    luzAro.intensity = 8 + 30 * k;
    if (aro){ aro.material.opacity = 0.65 + 0.2 * s + 0.15 * k; aro.rotation.z += dt * 0.25; }

    if (!reducir){
      for (let i = 0; i < N; i++){
        pos[i * 3 + 1] += vel[i] * dt;
        if (pos[i * 3 + 1] > yTope + 3.4) pos[i * 3 + 1] = yTope;
      }
      geoP.attributes.position.needsUpdate = true;
    }
    api._cuadro && api._cuadro(dt, t);
    renderer.render(escena, cam);
    raf = requestAnimationFrame(cuadro);
  }
  raf = requestAnimationFrame(cuadro);
  return api;
}
