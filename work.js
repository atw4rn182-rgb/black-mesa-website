(function () {
  "use strict";

  const navHome = document.getElementById("navHome");
  const portraitVideo = document.getElementById("heroVideoPortrait");
  const landscapeVideo = document.getElementById("heroVideoLandscape");
  const bgVideos = { portrait: portraitVideo, landscape: landscapeVideo };
  const tabPhotos = document.getElementById("tabPhotos");
  const tabVideos = document.getElementById("tabVideos");
  const panelPhotos = document.getElementById("panelPhotos");
  const panelVideos = document.getElementById("panelVideos");
  const workContentPanel = document.getElementById("workContentPanel");
  const workPhotosPanel = document.getElementById("workPhotosPanel");
  const workVideosPanel = document.getElementById("workVideosPanel");
  const workTabs = document.querySelector(".work-tabs");
  const projectVideos = document.querySelectorAll(".project-video");

  const PROJECT_VIDEOS = [
    "assets/projects/project-01.mp4",
    "assets/projects/project-02.mp4",
    "assets/projects/project-03.mp4",
    "assets/projects/project-04.mp4",
    "assets/projects/project-05.mp4",
    "assets/projects/project-06.mp4",
    "assets/projects/project-07.mp4",
    "assets/projects/project-08.mp4",
  ];

  let photosLoaded = false;
  let tabsRevealed = false;
  let clipsRevealed = false;
  let scrollResizeTimer;
  const CLIP_REVEAL_DELAY_MS = 520;
  const CLIP_REVEAL_FALLBACK_MS = 2800;

  function scheduleContentReflow() {
    clearTimeout(scrollResizeTimer);
    scrollResizeTimer = setTimeout(() => {}, 50);
  }

  function initVideo(video) {
    if (!video) return;
    video.muted = true;
    video.setAttribute("playsinline", "");
    const play = () => video.play().catch(() => {});
    play();
  }

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function revealTabs() {
    if (tabsRevealed) return;
    tabsRevealed = true;
    workTabs?.classList.add("is-ui-visible");
  }

  function revealVideoClips() {
    if (clipsRevealed) return;
    clipsRevealed = true;
    workVideosPanel?.classList.add("is-media-visible");
    projectVideos.forEach(initVideo);
  }

  function waitForBackgroundThenRevealTabs() {
    if (prefersReducedMotion()) {
      revealTabs();
      return;
    }

    const revealAfterDelay = () => {
      setTimeout(revealTabs, CLIP_REVEAL_DELAY_MS);
    };

    const fallback = window.setTimeout(revealTabs, CLIP_REVEAL_FALLBACK_MS);
    const cancelFallback = () => window.clearTimeout(fallback);

    window.bmBgVideo?.watchBackgroundVideos(bgVideos, () => {
      cancelFallback();
      revealAfterDelay();
    });
  }

  function initPageVideos() {
    window.bmBgVideo?.syncBackgroundVideos(bgVideos);
    waitForBackgroundThenRevealTabs();

    document.addEventListener(
      "touchstart",
      () => {
        const active = window.bmBgVideo?.isDesktopBg()
          ? landscapeVideo
          : portraitVideo;
        if (active?.paused) initVideo(active);
        projectVideos.forEach((v) => {
          if (v.paused) initVideo(v);
        });
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

  function toPhotoUrl(path) {
    return path
      .split("/")
      .map((segment, index) => (index < 2 ? segment : encodeURIComponent(segment)))
      .join("/");
  }

  function isFeaturedFilename(path) {
    return /feature/i.test(path.split("/").pop() || "");
  }

  async function resolvePhotoSources() {
    const entries = [];

    try {
      const res = await fetch("assets/photos/manifest.json", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        const featuredList = Array.isArray(data.featured) ? data.featured : [];
        const galleryList = Array.isArray(data.photos) ? data.photos : [];

        for (const src of featuredList) {
          entries.push({ type: "image", src, featured: true });
        }
        for (const src of galleryList) {
          if (!featuredList.includes(src)) {
            entries.push({ type: "image", src, featured: false });
          }
        }

        if (!featuredList.length && !galleryList.length && Array.isArray(data)) {
          for (const src of data) {
            entries.push({
              type: "image",
              src,
              featured: isFeaturedFilename(src),
            });
          }
        }
      }
    } catch {
      /* manifest unavailable (e.g. offline file preview) */
    }

    if (entries.length) {
      entries.sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return a.src.localeCompare(b.src, undefined, { sensitivity: "base" });
      });
      return entries;
    }

    return [];
  }

  function revealPhotosMedia() {
    workPhotosPanel?.classList.add("is-media-visible");
  }

  function appendPhotoItem(grid, entry, index) {
    const item = document.createElement("article");
    item.className = "media-grid-item";
    item.style.setProperty("--stagger", String(Math.min(index, 10)));

    const img = document.createElement("img");
    img.src =
      entry.type === "thumb" ? entry.src : toPhotoUrl(entry.src);
    img.alt = entry.alt || `Black Mesa project photo ${index + 1}`;
    img.loading = index < 4 ? "eager" : "lazy";
    img.decoding = "async";

    img.onerror = () => {
      item.hidden = true;
      scheduleContentReflow();
    };

    img.onload = () => {
      scheduleContentReflow();
    };

    item.appendChild(img);
    grid.appendChild(item);
  }

  async function loadPhotos() {
    if (photosLoaded || !panelPhotos) return;
    photosLoaded = true;

    const entries = await resolvePhotoSources();
    if (!entries.length) {
      const empty = document.createElement("p");
      empty.className = "media-gallery-empty";
      empty.textContent = "Photos coming soon.";
      panelPhotos.appendChild(empty);
      return;
    }

    entries.forEach((entry, index) => {
      appendPhotoItem(panelPhotos, entry, index);
    });

    scheduleContentReflow();
  }

  function setActiveTab(tab) {
    const isPhotos = tab === "photos";
    const isVideos = tab === "videos";

    tabPhotos?.classList.toggle("is-active", isPhotos);
    tabVideos?.classList.toggle("is-active", isVideos);
    tabPhotos?.setAttribute("aria-selected", String(isPhotos));
    tabVideos?.setAttribute("aria-selected", String(isVideos));

    if (workContentPanel) {
      workContentPanel.hidden = false;
      workContentPanel.classList.add("is-visible");
    }

    if (workPhotosPanel) workPhotosPanel.hidden = !isPhotos;
    if (workVideosPanel) workVideosPanel.hidden = !isVideos;

    document.body.classList.toggle("work-page--photos", isPhotos);
    document.body.classList.toggle("work-page--videos", isVideos);

    if (isPhotos) {
      loadPhotos().then(() => {
        revealPhotosMedia();
        scheduleContentReflow();
      });
    }

    if (isVideos) {
      revealVideoClips();
      projectVideos.forEach((v) => {
        if (v.paused) initVideo(v);
      });
      scheduleContentReflow();
    }
  }

  tabPhotos?.addEventListener("click", () => setActiveTab("photos"));
  tabVideos?.addEventListener("click", () => setActiveTab("videos"));

  navHome?.addEventListener("click", (e) => {
    e.preventDefault();
    const homeUrl = navHome.getAttribute("href") || "index.html";
    window.bmNavigateWithFade?.(homeUrl) ?? (window.location.href = homeUrl);
  });

  window.addEventListener("resize", scheduleContentReflow);

  panelVideos?.querySelectorAll(".media-grid-item").forEach((el, index) => {
    el.style.setProperty("--stagger", String(index));
  });

  function maybeOpenTabFromUrl() {
    const tab = new URLSearchParams(window.location.search).get("tab");
    if (tab !== "photos" && tab !== "videos") return;

    const tryOpen = () => {
      if (!tabsRevealed) {
        window.setTimeout(tryOpen, 80);
        return;
      }
      setActiveTab(tab);
    };
    tryOpen();
  }

  initPageVideos();
  maybeOpenTabFromUrl();
})();
