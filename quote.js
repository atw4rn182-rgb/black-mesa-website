(function () {
  "use strict";

  const navHome = document.getElementById("navHome");
  const portraitVideo = document.getElementById("quoteVideoPortrait");
  const landscapeVideo = document.getElementById("quoteVideoLandscape");
  const quoteForm = document.getElementById("quoteForm");
  const formSuccess = document.getElementById("quoteFormSuccess");

  const bgVideos = { portrait: portraitVideo, landscape: landscapeVideo };

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
