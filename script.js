(function () {
  "use strict";

  const btnQuote = document.getElementById("btnQuote");
  const btnWork = document.getElementById("btnWork");
  const navQuote = document.getElementById("navQuote");
  const navWork = document.getElementById("navWork");
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
  navigateWithFade(navWork);
  navigateWithFade(navQuote);

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
