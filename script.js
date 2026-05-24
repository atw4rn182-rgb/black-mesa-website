(function () {
  "use strict";

  const btnQuote = document.getElementById("btnQuote");
  const btnWork = document.getElementById("btnWork");
  const heroVideo = document.getElementById("heroVideo");
  const contactForm = document.getElementById("contactForm");
  const formSuccess = document.getElementById("formSuccess");
  const yearEl = document.getElementById("year");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  function initVideo() {
    if (!heroVideo) return;
    heroVideo.muted = true;
    heroVideo.setAttribute("playsinline", "");
    const play = () => heroVideo.play().catch(() => {});
    play();
    document.addEventListener(
      "touchstart",
      () => {
        if (heroVideo.paused) play();
      },
      { once: true, passive: true }
    );
  }

  const workUrl = btnWork?.getAttribute("href") || "work.html";

  btnWork?.addEventListener(
    "mouseenter",
    () => {
      const prefetchHref = "assets/bull-skull.mp4";
      if (document.querySelector(`link[rel="prefetch"][href="${prefetchHref}"]`)) {
        return;
      }
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.as = "video";
      link.href = prefetchHref;
      document.head.appendChild(link);
    },
    { once: true }
  );

  btnWork?.addEventListener("click", (e) => {
    if (btnWork.tagName === "A") {
      e.preventDefault();
      window.bmNavigateWithFade?.(workUrl) ??
        (window.location.href = workUrl);
    }
  });

  btnQuote?.addEventListener("click", (e) => {
    if (btnQuote.tagName === "A") {
      e.preventDefault();
      const quoteUrl = btnQuote.getAttribute("href") || "quote.html";
      window.bmNavigateWithFade?.(quoteUrl) ??
        (window.location.href = quoteUrl);
    }
  });

  contactForm?.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    contactForm.hidden = true;
    formSuccess.hidden = false;
    contactForm.reset();
  });

  initVideo();
})();
