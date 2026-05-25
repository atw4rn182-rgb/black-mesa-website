(function () {
  "use strict";

  const DESKTOP_BP = "(min-width: 769px)";

  function isDesktopBg() {
    /* Homepage logo is baked into the portrait clip — keep it on desktop too */
    if (document.body.classList.contains("home-page")) return false;
    return window.matchMedia(DESKTOP_BP).matches;
  }

  function initVideo(video) {
    if (!video) return;
    video.muted = true;
    video.setAttribute("playsinline", "");
    const play = () => video.play().catch(() => {});
    play();
  }

  function pauseVideo(video) {
    if (!video) return;
    video.pause();
  }

  function ensureLandscapeLoaded(video) {
    if (!video || video.dataset.bgReady === "1") return;

    const source = video.querySelector("source[data-src]");
    const deferred = source?.getAttribute("data-src");
    if (deferred) {
      source.setAttribute("src", deferred);
      source.removeAttribute("data-src");
    }

    video.load();
    video.dataset.bgReady = "1";
  }

  function syncBackgroundVideos(videos) {
    const { portrait, landscape } = videos;

    if (isDesktopBg()) {
      pauseVideo(portrait);
      if (landscape) {
        ensureLandscapeLoaded(landscape);
        landscape.preload = "auto";
        initVideo(landscape);
      }
      return;
    }

    pauseVideo(landscape);
    if (portrait) {
      portrait.preload = "auto";
      initVideo(portrait);
    }
  }

  function getActiveVideo(videos) {
    return isDesktopBg() ? videos.landscape : videos.portrait;
  }

  function watchBackgroundVideos(videos, onReady) {
    syncBackgroundVideos(videos);

    const done = () => onReady?.();

    const waitFor = (video) => {
      if (!video) {
        done();
        return;
      }
      if (video.readyState >= 2) {
        done();
        return;
      }
      video.addEventListener("loadeddata", done, { once: true });
      video.addEventListener("error", done, { once: true });
    };

    waitFor(getActiveVideo(videos));

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => syncBackgroundVideos(videos), 150);
    });
  }

  window.bmBgVideo = {
    DESKTOP_BP,
    isDesktopBg,
    initVideo,
    syncBackgroundVideos,
    watchBackgroundVideos,
  };
})();
