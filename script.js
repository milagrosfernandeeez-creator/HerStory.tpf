/* La caja de Florence · Milagros Fernandez · CC BY-SA 4.0 */
(function () {
  var KEY_FX = "cf-efectos", KEY_VISTAS = "cf-vistas";
  var root = document.documentElement;
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } }

  /* Efectos VHS: por defecto apagados si el dispositivo pide menos movimiento */
  var guardado = get(KEY_FX);
  var reducir = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fxOn = guardado === null ? !reducir : guardado === "1";
  root.classList.toggle("fx-off", !fxOn);

  document.addEventListener("DOMContentLoaded", function () {
    /* Botón de efectos */
    var b = document.getElementById("fx");
    function pintar() {
      b.setAttribute("aria-pressed", String(fxOn));
      b.textContent = "Efectos: " + (fxOn ? "sí" : "no");
      root.classList.toggle("fx-off", !fxOn);
    }
    if (b) { pintar(); b.addEventListener("click", function () { fxOn = !fxOn; set(KEY_FX, fxOn ? "1" : "0"); pintar(); }); }

    /* Contador de tiempo decorativo */
    var tc = document.getElementById("timecode"), seg = 0;
    function dos(n) { return (n < 10 ? "0" : "") + n; }
    if (tc) setInterval(function () {
      seg++; tc.textContent = dos(Math.floor(seg / 3600)) + ":" + dos(Math.floor(seg / 60) % 60) + ":" + dos(seg % 60);
    }, 1000);

    /* Cintas vistas */
    var actual = (location.pathname.split("/").pop() || "index.html");
    var links = document.querySelectorAll("[data-cinta]");
    var total = links.length, vistas = [];
    var raw = get(KEY_VISTAS);
    if (raw === null && !set(KEY_VISTAS, "[]")) return;   /* almacenamiento bloqueado: sin contador */
    try { vistas = JSON.parse(raw || "[]"); } catch (e) { vistas = []; }
    if (!Array.isArray(vistas)) vistas = [];
    if (actual === "") actual = "index.html";
    if (document.querySelector('[data-cinta="' + actual + '"]') && vistas.indexOf(actual) < 0) {
      vistas.push(actual); set(KEY_VISTAS, JSON.stringify(vistas));
    }
    links.forEach(function (a) {
      if (vistas.indexOf(a.getAttribute("data-cinta")) >= 0) {
        a.classList.add("vista");
        if (!a.querySelector(".tilde")) { var t = document.createElement("span"); t.className = "tilde"; t.setAttribute("aria-label", " (vista)"); t.textContent = " ✓"; a.appendChild(t); }
      }
    });
    var c = document.getElementById("contador"), n = document.getElementById("vistas");
    if (c && n) { n.textContent = vistas.length; c.hidden = false; }

    /* ▶ cambia a ■ mientras el video se reproduce */
    document.querySelectorAll("video").forEach(function (v) {
      var s = document.querySelector(".etiqueta .play");
      if (!s) return;
      v.addEventListener("play", function () { s.textContent = "■"; });
      v.addEventListener("pause", function () { s.textContent = "▶"; });
      v.addEventListener("ended", function () { s.textContent = "▶"; });
    });
  });
})();
