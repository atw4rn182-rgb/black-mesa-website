(function () {
  "use strict";

  const navHome = document.getElementById("navHome");
  const portraitVideo = document.getElementById("quoteVideoPortrait");
  const landscapeVideo = document.getElementById("quoteVideoLandscape");
  const quoteForm = document.getElementById("quoteForm");
  const formSuccess = document.getElementById("quoteFormSuccess");

  const bgVideos = { portrait: portraitVideo, landscape: landscapeVideo };

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
      const active = window.bmBgVideo?.isDesktopBg()
        ? landscapeVideo
        : portraitVideo;
      if (active?.paused) window.bmBgVideo?.initVideo(active);
    },
    { once: true, passive: true }
  );
})();
