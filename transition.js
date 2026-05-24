(function () {
  "use strict";

  const STORAGE_KEY = "bm-page-transition";
  const FADE_OUT_MS = 1020;

  if (sessionStorage.getItem(STORAGE_KEY) === "1") {
    document.documentElement.classList.add("bm-pre-enter");
  }

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function navigateWithFade(url) {
    if (!url) return;

    if (prefersReducedMotion()) {
      window.location.href = url;
      return;
    }

    sessionStorage.setItem(STORAGE_KEY, "1");
    document.body.classList.add("page-exit");

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          window.location.href = url;
        }, FADE_OUT_MS);
      });
    });
  }

  function initPageEnter() {
    const shouldAnimate = sessionStorage.getItem(STORAGE_KEY) === "1";
    sessionStorage.removeItem(STORAGE_KEY);

    if (!shouldAnimate || prefersReducedMotion()) {
      document.body.classList.remove("page-enter");
      return;
    }

    document.body.classList.add("page-enter");

    const enterMs = 1450;
    window.setTimeout(() => {
      document.body.classList.remove("page-enter");
      document.documentElement.classList.remove("bm-pre-enter");
    }, enterMs);
  }

  window.bmNavigateWithFade = navigateWithFade;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPageEnter);
  } else {
    initPageEnter();
  }
})();
