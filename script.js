(function () {
  "use strict";

  const btnQuote = document.getElementById("btnQuote");
  const btnWork = document.getElementById("btnWork");
  const navQuote = document.getElementById("navQuote");
  const navWork = document.getElementById("navWork");
  const heroVideo = document.getElementById("heroVideo");

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

  navigateWithFade(btnWork);
  navigateWithFade(btnQuote);
  navigateWithFade(navWork);
  navigateWithFade(navQuote);

  initVideo();
})();
