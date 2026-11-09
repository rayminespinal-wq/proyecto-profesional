document.addEventListener("DOMContentLoaded", () => {
  const $ = (id) => document.getElementById(id);

  /* ---------- Aviso flotante ---------- */
  let temporizador;
  const avisar = (texto) => {
    const aviso = $("aviso");
    aviso.textContent = texto;
    aviso.classList.add("visible");
    clearTimeout(temporizador);
    temporizador = setTimeout(() => aviso.classList.remove("visible"), 2200);
  };

  /* ---------- Año del pie ---------- */
  $("anio").textContent = new Date().getFullYear();

  /* ---------- Foto (con imagen de respaldo si falta foto.jpg) ---------- */
  const foto = $("fotoPersonal");
  const respaldo =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 400">
         <rect width="320" height="400" fill="#cfe6e6"/>
         <circle cx="160" cy="140" r="62" fill="#0e8f7e"/>
         <path d="M40 400c0-90 52-140 120-140s120 50 120 140z" fill="#0e8f7e"/>
       </svg>`
    );
  const usarRespaldo = () => { foto.src = respaldo; };
  foto.addEventListener("error", usarRespaldo, { once: true });
  if (foto.complete && foto.naturalWidth === 0) usarRespaldo();

  /* ---------- Texto que se escribe solo (rol) ---------- */
  const roles = ["Estudiante de desarrollo web", "Amante de la música", "Gamer y futuro programador"];
  const rolTexto = $("rolTexto");
  let r = 0, c = 0, borrando = false;
  const escribir = () => {
    const rol = roles[r];
    c += borrando ? -1 : 1;
    rolTexto.textContent = rol.slice(0, c);
    let espera = borrando ? 40 : 90;
    if (!borrando && c === rol.length) { borrando = true; espera = 1500; }
    else if (borrando && c === 0) { borrando = false; r = (r + 1) % roles.length; espera = 400; }
    setTimeout(escribir, espera);
  };
  escribir();

  /* ---------- Modo oscuro / claro ---------- */
  const btnTema = $("btnTema");
  btnTema.addEventListener("click", () => {
    const oscuro = document.body.classList.toggle("oscuro");
    btnTema.textContent = oscuro ? "Cambiar a modo claro" : "Cambiar a modo oscuro";
    btnTema.setAttribute("aria-pressed", oscuro);
  });

  /* ---------- Cambiar color principal ---------- */
  const tonos = [172, 262, 14, 215, 330, 45];
  let t = 0;
  $("btnColor").addEventListener("click", () => {
    t = (t + 1) % tonos.length;
    document.documentElement.style.setProperty("--h", tonos[t]);
    avisar("Color cambiado");
  });

  /* ---------- Pestañas ---------- */
  const botonesMenu = document.querySelectorAll("#menu button");
  const paneles = document.querySelectorAll(".panel");

  const mostrarPanel = (id) => {
    paneles.forEach((p) => p.classList.toggle("visible", p.id === id));
    botonesMenu.forEach((b) => b.classList.toggle("activo", b.dataset.panel === id));
    if (id === "bienvenida") contarNumeros();
    if (id === "habilidades") llenarBarras();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  botonesMenu.forEach((b) => b.addEventListener("click", () => mostrarPanel(b.dataset.panel)));
  document.querySelectorAll("[data-ir]").forEach((b) =>
    b.addEventListener("click", () => mostrarPanel(b.dataset.ir))
  );

  /* ---------- Cambiar mensaje de bienvenida ---------- */
  const saludos = [
    "Hola, bienvenido a mi página",
    "¡Qué bueno verte por aquí!",
    "Gracias por visitar mi portafolio",
    "Pasa, explora con calma",
  ];
  let s = 0;
  $("btnMensaje").addEventListener("click", () => {
    s = (s + 1) % saludos.length;
    $("tituloBienvenida").textContent = saludos[s];
  });

  /* ---------- Números que cuentan hacia arriba ---------- */
  function contarNumeros() {
    document.querySelectorAll(".numero").forEach((el) => {
      const meta = Number(el.dataset.cuenta);
      let valor = 0;
      el.textContent = 0;
      const paso = setInterval(() => {
        valor++;
        el.textContent = valor;
        if (valor >= meta) clearInterval(paso);
      }, 250);
    });
  }
  contarNumeros();

  /* ---------- Intereses ---------- */
  const chips = document.querySelectorAll(".chip");
  chips.forEach((chip) =>
    chip.addEventListener("click", () => {
      chips.forEach((o) => o.classList.remove("activo"));
      chip.classList.add("activo");
      $("textoInteres").textContent = chip.dataset.texto;
    })
  );

  /* ---------- Barras de la tabla de habilidades ---------- */
  function llenarBarras() {
    document.querySelectorAll("tbody tr").forEach((fila) => {
      const barra = fila.querySelector(".barra-nivel span");
      barra.style.width = "0";
      setTimeout(() => (barra.style.width = fila.dataset.nivel + "%"), 50);
    });
  }

  /* ---------- Formulario con validación ---------- */
  const form = $("formContacto");
  const mensaje = $("mensaje");

  mensaje.addEventListener("input", () => {
    $("contador").textContent = `${mensaje.value.length} / ${mensaje.maxLength}`;
  });

  const validar = (campo, texto) => {
    campo.closest(".campo").classList.toggle("invalido", Boolean(texto));
    $("error-" + campo.id).textContent = texto;
    return !texto;
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    $("resultado").textContent = "";

    const okNombre = validar($("nombre"),
      $("nombre").value.trim().length < 2 ? "Escribe tu nombre (mínimo 2 letras)." : "");
    const okCorreo = validar($("correo"),
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($("correo").value.trim()) ? "" : "Escribe un correo válido, por ejemplo nombre@correo.com.");
    const okMsg = validar(mensaje,
      mensaje.value.trim().length < 10 ? "El mensaje debe tener al menos 10 caracteres." : "");

    if (okNombre && okCorreo && okMsg) {
      $("resultado").textContent = `¡Gracias, ${$("nombre").value.trim()}! Tu mensaje fue enviado.`;
      form.reset();
      $("contador").textContent = `0 / ${mensaje.maxLength}`;
      avisar("Mensaje enviado");
    }
  });

  /* ---------- Encuesta ---------- */
  const votos = document.querySelectorAll(".voto");
  votos.forEach((v) =>
    v.addEventListener("click", () => {
      votos.forEach((o) => o.classList.remove("elegido"));
      v.classList.add("elegido");
      $("graciasVoto").textContent = `¡Gracias por tu voto: "${v.dataset.voto}"!`;
    })
  );
});