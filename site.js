// Shared behavior for all pages. Each handler no-ops if its element is absent.
(function () {
  var reduce = false;
  try { reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}

  // current year in the footer
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // scroll progress bar
  var bar = document.getElementById("progress");
  function onScroll() {
    if (!bar) return;
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    bar.style.width = ((max > 0 ? h.scrollTop / max : 0) * 100).toFixed(2) + "%";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // hero glow follows the cursor (home page only)
  var glow = document.getElementById("heroGlow");
  if (glow && !reduce) {
    window.addEventListener("mousemove", function (e) {
      var host = glow.parentElement;
      if (!host) return;
      var r = host.getBoundingClientRect();
      if (e.clientY < r.top - 40 || e.clientY > r.bottom + 40) { glow.style.opacity = "0"; return; }
      glow.style.left = (e.clientX - r.left) + "px";
      glow.style.top = (e.clientY - r.top) + "px";
      glow.style.opacity = "1";
    }, { passive: true });
  }

  // reveal-on-scroll
  var els = document.querySelectorAll("[data-reveal]");
  if (!els.length) return;
  if (reduce || !("IntersectionObserver" in window)) {
    els.forEach(function (el) { el.style.opacity = "1"; el.style.transform = "none"; });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.style.opacity = "1";
        en.target.style.transform = "none";
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  els.forEach(function (el) { io.observe(el); });
  // fallback: if anything never intersects, show it after 2.2s
  setTimeout(function () {
    els.forEach(function (el) { el.style.opacity = "1"; el.style.transform = "none"; });
  }, 2200);
})();
