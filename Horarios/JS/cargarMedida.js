(function initMedidasEstaticas() {
  function $(sel)    { return document.querySelector(sel); }
  function $all(sel) { return document.querySelectorAll(sel); }

  function aplicarMedidas() {
    const dvw = window.innerWidth;
    const dvh = window.innerHeight;

    // ===== TABLA =====
    const tabla = $("table");
    if (tabla) {
      const tablaH = dvh * 0.85; // 85dvh
      tabla.style.height = tablaH + "px";
    } else {
      console.warn("[medidas] No se encontró <table> (ok si esta vista no la usa).");
    }

    // ===== BOTONES =====
    const botones = $all(".botones div");
    if (botones.length) {
      const anchoGrande = dvw * 0.20, altoGrande = dvh * 0.10; // 20dvw x 10dvh
      const anchoChico  = dvh * 0.20, altoChico  = dvh * 0.08; // 20dvh x 8dvh

      if (dvw > 900) {
        botones.forEach(b => { b.style.width = anchoGrande + "px"; b.style.height = altoGrande + "px"; });
      } else {
        botones.forEach(b => { b.style.width = anchoChico  + "px"; b.style.height = altoChico  + "px"; });
      }
    } else {
      console.warn("[medidas] No se encontraron .botones div (ok si esta vista no los usa).");
    }

    // ===== MENÚ =====
    const menu = $(".menu");
    const contenedor = $(".contenedorMenu");
    if (menu || contenedor) {
      if (dvw > 900) {
        if (menu)        { menu.style.minHeight = (dvh * 0.85) + "px"; menu.style.top = (dvh * 0.15) + "px"; }
        if (contenedor)  { contenedor.style.height = (dvh * 0.85) + "px"; }
      } else {
        if (menu)        { menu.style.minHeight = (dvh * 0.90) + "px"; menu.style.top = (dvh * 0.10) + "px"; }
        if (contenedor)  { contenedor.style.height = (dvh * 0.90) + "px"; }
      }
    } else {
      console.warn("[medidas] No hay .menu / .contenedorMenu en esta vista.");
    }

    // ===== TÍTULO / LOGIN =====
    const titulo        = $(".titulo");
    const semana        = $(".titulo .semana");
    const login         = $(".login");
    const cajaMensaje   = $(".cajaMensajeLogin");
    const cajaIncognito = $(".cajaIncognito");
    const loginMovil    = $(".loginMovil");

    if (titulo || semana || login || cajaMensaje || cajaIncognito || loginMovil) {
      if (dvw > 900) {
        if (titulo)        titulo.style.height = (dvh * 0.15) + "px"; // 15dvh
        if (semana)        semana.style.width  = (dvw * 0.60) + "px"; // 60dvw
        if (login)         login.style.width   = (dvw * 0.40) + "px"; // 40dvw
        if (cajaMensaje)   cajaMensaje.style.fontSize = (dvh * 0.03) + "px"; // 3dvh
        if (cajaIncognito) cajaIncognito.style.marginRight = (dvw * 0.10) + "px"; // 10dvw
      } else {
        if (titulo)        titulo.style.height = (dvh * 0.10) + "px"; // 10dvh
        if (tabla)         tabla.style.height  = (dvh * 0.90) + "px"; // 90dvh
        if (semana)        semana.style.width  = (dvw * 0.80) + "px"; // 80dvw
        if (loginMovil)    loginMovil.style.width = (dvw * 0.20) + "px"; // 20dvw
      }
    } else {
      console.warn("[medidas] No hay elementos de título/login en esta vista.");
    }
  }

  // Ejecutar cuando el DOM esté listo (evita null.style)
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", aplicarMedidas, { once: true });
  } else {
    aplicarMedidas();
  }

  // Si tu HTML inserta partes dinámicas luego (AJAX), podés volver a llamar:
  window.aplicarMedidasEstaticas = aplicarMedidas;
})();
