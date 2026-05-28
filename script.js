(function () {
  "use strict";

  const btnQuote = document.getElementById("btnQuote");
  const btnWork = document.getElementById("btnWork");
  const portraitVideo = document.getElementById("heroVideoPortrait");
  const landscapeVideo = document.getElementById("heroVideoLandscape");

  const bgVideos = { portrait: portraitVideo, landscape: landscapeVideo };

  function navigateWithFade(link) {
    if (!link) return;
    const url = link.getAttribute("href");
    if (!url) return;
    link.addEventListener("click", (e) => {
      e.preventDefault();
      window.bmNavigateWithFade?.(url) ?? (window.location.href = url);
    });
  }

  btnWork?.addEventListener(
    "mouseenter",
    () => {
      const prefetchHref = "assets/bull-skull-wide.mp4";
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

  navigateWithFade(btnWork);
  navigateWithFade(btnQuote);

  window.bmBgVideo?.syncBackgroundVideos(bgVideos);

  document.addEventListener(
    "touchstart",
    () => {
      if (portraitVideo?.paused) window.bmBgVideo?.initVideo(portraitVideo);
    },
    { once: true, passive: true }
  );
})();
