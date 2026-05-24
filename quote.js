(function () {
  "use strict";

  const navHome = document.getElementById("navHome");
  const quoteVideo = document.getElementById("quoteVideo");
  const posterImg = document.querySelector(".quote-bg-poster");
  const quoteForm = document.getElementById("quoteForm");
  const formSuccess = document.getElementById("quoteFormSuccess");
  const CAMPFIRE_WIDE_VIDEO = "assets/campfire-wide.mp4";
  const CAMPFIRE_POSTER = "assets/campfire-poster.jpg";
  const DESKTOP_BG_MQ = "(min-width: 480px)";

  function isDesktopQuoteBg() {
    return window.matchMedia(DESKTOP_BG_MQ).matches;
  }

  function initVideo(video) {
    if (!video) return;
    video.muted = true;
    video.setAttribute("playsinline", "");
    const play = () => video.play().catch(() => {});
    play();
    document.addEventListener(
      "touchstart",
      () => {
        if (video.paused) play();
      },
      { once: true, passive: true }
    );
  }

  function captureVideoThumb(src, options = {}) {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.muted = true;
      video.playsInline = true;
      video.preload = options.preload || "auto";
      video.src = src;

      const cleanup = () => {
        video.removeAttribute("src");
        video.load();
      };

      video.addEventListener(
        "loadeddata",
        () => {
          const seekTo = Math.min(0.6, (video.duration || 1) * 0.15);
          video.currentTime = seekTo;
        },
        { once: true }
      );

      video.addEventListener(
        "seeked",
        () => {
          try {
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth || 640;
            canvas.height = video.videoHeight || 360;
            canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL("image/jpeg", 0.82));
          } catch {
            resolve(null);
          } finally {
            cleanup();
          }
        },
        { once: true }
      );

      video.addEventListener(
        "error",
        () => {
          cleanup();
          resolve(null);
        },
        { once: true }
      );
    });
  }

  async function initMobilePoster() {
    if (!posterImg || isDesktopQuoteBg()) return;

    const applyThumb = async () => {
      const thumb = await captureVideoThumb(CAMPFIRE_WIDE_VIDEO, {
        preload: "metadata",
      });
      if (thumb) posterImg.src = thumb;
    };

    if (posterImg.complete && posterImg.naturalWidth > 0) return;

    posterImg.addEventListener("error", applyThumb, { once: true });

    if (!posterImg.getAttribute("src")) {
      posterImg.src = CAMPFIRE_POSTER;
    }
  }

  function initQuoteBackground() {
    if (isDesktopQuoteBg()) {
      if (quoteVideo) {
        quoteVideo.preload = "auto";
        initVideo(quoteVideo);
      }
      return;
    }
    initMobilePoster();
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

  initQuoteBackground();
})();
