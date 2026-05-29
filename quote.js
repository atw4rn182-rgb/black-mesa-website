(function () {
  "use strict";

  const QUOTE_REVEAL_DELAY_MS = 1600;

  const navHome = document.getElementById("navHome");
  const portraitVideo = document.getElementById("quoteVideoPortrait");
  const landscapeVideo = document.getElementById("quoteVideoLandscape");
  const quoteForm = document.getElementById("quoteForm");
  const formSuccess = document.getElementById("quoteFormSuccess");

  const bgVideos = { portrait: portraitVideo, landscape: landscapeVideo };

  function revealQuoteContent() {
    document.body.classList.add("is-quote-content-visible");
  }

  function scheduleQuoteReveal() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealQuoteContent();
      return;
    }
    window.setTimeout(revealQuoteContent, QUOTE_REVEAL_DELAY_MS);
  }

  scheduleQuoteReveal();

  quoteForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!quoteForm.checkValidity()) {
      quoteForm.reportValidity();
      return;
    }

    const submitBtn = quoteForm.querySelector('button[type="submit"]');
    submitBtn?.setAttribute("disabled", "disabled");

    try {
      const res = await fetch(quoteForm.action, {
        method: "POST",
        body: new FormData(quoteForm),
        headers: { Accept: "application/json" },
      });

      if (!res.ok) throw new Error("Formspree request failed");

      quoteForm.hidden = true;
      formSuccess.hidden = false;
      quoteForm.reset();
    } catch {
      submitBtn?.removeAttribute("disabled");
      window.alert(
        "Something went wrong sending your request. Please try again."
      );
    }
  });

  navHome?.addEventListener("click", (e) => {
    e.preventDefault();
    const homeUrl = navHome.getAttribute("href") || "index.html";
    window.bmNavigateWithFade?.(homeUrl) ?? (window.location.href = homeUrl);
  });

  window.bmBgVideo?.syncBackgroundVideos(bgVideos);

  document.addEventListener(
    "touchstart",
    () => {
      if (portraitVideo?.paused) window.bmBgVideo?.initVideo(portraitVideo);
    },
    { once: true, passive: true }
  );
})();
