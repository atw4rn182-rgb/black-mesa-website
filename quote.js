(function () {
  "use strict";

  const navHome = document.getElementById("navHome");
  const quoteVideo = document.getElementById("quoteVideo");
  const quoteForm = document.getElementById("quoteForm");
  const formSuccess = document.getElementById("quoteFormSuccess");
  const yearEl = document.getElementById("year");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  function initVideo() {
    if (!quoteVideo) return;
    quoteVideo.muted = true;
    quoteVideo.setAttribute("playsinline", "");
    const play = () => quoteVideo.play().catch(() => {});
    play();
    document.addEventListener(
      "touchstart",
      () => {
        if (quoteVideo.paused) play();
      },
      { once: true, passive: true }
    );
  }

  quoteForm?.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!quoteForm.checkValidity()) {
      quoteForm.reportValidity();
      return;
    }

    quoteForm.hidden = true;
    formSuccess.hidden = false;
    quoteForm.reset();
  });

  navHome?.addEventListener("click", (e) => {
    e.preventDefault();
    const homeUrl = navHome.getAttribute("href") || "index.html";
    window.bmNavigateWithFade?.(homeUrl) ?? (window.location.href = homeUrl);
  });

  initVideo();
})();
