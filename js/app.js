// KHẢM MEDIA — app logic
(function () {
  'use strict';

  var projectsGrid = document.getElementById('projectsGrid');
  var filtersEl = document.getElementById('filters');
  var filmsGrid = document.getElementById('filmsGrid');
  var projectView = document.getElementById('projectView');
  var pvTitle = document.getElementById('pvTitle');
  var pvCount = document.getElementById('pvCount');
  var pvGallery = document.getElementById('pvGallery');
  var backBtn = document.getElementById('backBtn');
  var lightbox = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  var lbCounter = document.getElementById('lbCounter');
  var videoModal = document.getElementById('videoModal');
  var videoFrame = document.getElementById('videoFrame');
  var videoCaption = document.getElementById('videoCaption');

  var allProjects = [];
  DATA.categories.forEach(function (cat) {
    cat.projects.forEach(function (p) {
      p.catLabel = cat.label;
      p.catKey = cat.key;
      allProjects.push(p);
    });
  });

  var currentFilter = 'all';
  var currentProject = null;
  var lbList = [], lbIndex = 0;

  // ---------- lazy fade-in for imgs ----------
  function lazyImg(src) {
    var img = document.createElement('img');
    img.loading = 'lazy';
    img.addEventListener('load', function () { img.classList.add('loaded'); });
    img.addEventListener('error', function () { img.classList.add('loaded'); });
    img.src = src;
    return img;
  }

  // ---------- filters ----------
  function renderFilters() {
    var tabs = [{ key: 'all', label: 'All' }].concat(
      DATA.categories.map(function (c) { return { key: c.key, label: c.label }; })
    );
    tabs.forEach(function (t) {
      var b = document.createElement('button');
      b.textContent = t.label;
      b.dataset.key = t.key;
      if (t.key === currentFilter) b.classList.add('active');
      b.addEventListener('click', function () {
        currentFilter = t.key;
        filtersEl.querySelectorAll('button').forEach(function (x) { x.classList.remove('active'); });
        b.classList.add('active');
        renderProjects();
      });
      filtersEl.appendChild(b);
    });
  }

  // ---------- projects ----------
  function renderProjects() {
    projectsGrid.innerHTML = '';
    var list = currentFilter === 'all'
      ? allProjects
      : allProjects.filter(function (p) { return p.catKey === currentFilter; });
    list.forEach(function (p) {
      var card = document.createElement('div');
      card.className = 'project-card';
      var wrap = document.createElement('div');
      wrap.className = 'card-img';
      wrap.appendChild(lazyImg(p.cover));
      card.appendChild(wrap);
      var meta = document.createElement('div');
      meta.className = 'card-meta';
      var nameCol = document.createElement('div');
      var name = document.createElement('span');
      name.className = 'card-name';
      name.textContent = p.name;
      var cat = document.createElement('span');
      cat.className = 'card-cat';
      cat.textContent = p.catLabel;
      nameCol.appendChild(name);
      nameCol.appendChild(cat);
      var count = document.createElement('span');
      count.className = 'card-count';
      count.textContent = p.count;
      meta.appendChild(nameCol);
      meta.appendChild(count);
      card.appendChild(meta);
      card.addEventListener('click', function () { openProject(p); });
      projectsGrid.appendChild(card);
    });
  }

  // ---------- project overlay ----------
  function openProject(p) {
    currentProject = p;
    pvTitle.textContent = p.name;
    pvCount.textContent = p.count + ' photos';
    pvGallery.innerHTML = '';
    p.thumbs.forEach(function (th, i) {
      var img = lazyImg(p.images[i]);
      img.addEventListener('click', function () { openLightbox(p, i); });
      pvGallery.appendChild(img);
    });
    projectView.hidden = false;
    projectView.scrollTop = 0;
    document.body.style.overflow = 'hidden';
    history.replaceState(null, '', '#project/' + p.slug);
  }

  function closeProject() {
    projectView.hidden = true;
    document.body.style.overflow = '';
    history.replaceState(null, '', '#photography');
  }

  backBtn.addEventListener('click', closeProject);

  // ---------- lightbox ----------
  function openLightbox(p, i) {
    lbList = p.images;
    lbIndex = i;
    lbImg.src = lbList[lbIndex];
    lbCounter.textContent = (lbIndex + 1) + ' / ' + lbList.length;
    lightbox.hidden = false;
  }
  function lbGo(d) {
    lbIndex = (lbIndex + d + lbList.length) % lbList.length;
    lbImg.src = lbList[lbIndex];
    lbCounter.textContent = (lbIndex + 1) + ' / ' + lbList.length;
  }
  function closeLightbox() {
    lightbox.hidden = true;
    lbImg.src = '';
  }
  document.getElementById('lbClose').addEventListener('click', closeLightbox);
  document.getElementById('lbPrev').addEventListener('click', function () { lbGo(-1); });
  document.getElementById('lbNext').addEventListener('click', function () { lbGo(1); });
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  // ---------- films ----------
  var videoFiltersEl = document.getElementById('videoFilters');
  var currentVideoFilter = 'all';
  var allVideos = [];
  
  DATA.videos.forEach(function (vcat) {
    vcat.items.forEach(function (v) {
      v.catLabel = vcat.label;
      v.catKey = vcat.key;
      allVideos.push(v);
    });
  });

  function renderVideoFilters() {
    if (!videoFiltersEl) return;
    var tabs = [{ key: 'all', label: 'All' }].concat(
      DATA.videos.map(function (c) { return { key: c.key, label: c.label }; })
    );
    tabs.forEach(function (t) {
      var b = document.createElement('button');
      b.textContent = t.label;
      b.dataset.key = t.key;
      if (t.key === currentVideoFilter) b.classList.add('active');
      b.addEventListener('click', function () {
        currentVideoFilter = t.key;
        videoFiltersEl.querySelectorAll('button').forEach(function (x) { x.classList.remove('active'); });
        b.classList.add('active');
        renderFilms();
      });
      videoFiltersEl.appendChild(b);
    });
  }

  function renderFilms() {
    filmsGrid.innerHTML = '';
    var list = currentVideoFilter === 'all'
      ? allVideos
      : allVideos.filter(function (v) { return v.catKey === currentVideoFilter; });
      
    list.forEach(function (v) {
      var card = document.createElement('div');
      card.className = 'film-card';
      var poster = document.createElement('div');
      poster.className = 'film-poster';
      poster.appendChild(lazyImg(v.poster));
      var play = document.createElement('div');
      play.className = 'play-btn';
      play.innerHTML = '<span><svg width="13" height="15" viewBox="0 0 13 15"><path d="M0 0l13 7.5L0 15z"/></svg></span>';
      poster.appendChild(play);
      card.appendChild(poster);
      var meta = document.createElement('div');
      meta.className = 'film-meta';
      var title = document.createElement('div');
      title.className = 'film-title';
      title.textContent = v.title;
      var sub = document.createElement('div');
      sub.className = 'film-sub';
      sub.textContent = v.catLabel;
      meta.appendChild(title);
      meta.appendChild(sub);
      card.appendChild(meta);
      card.addEventListener('click', function () { openVideo(v); });
      filmsGrid.appendChild(card);
    });
  }

  // ---------- video modal ----------
  function openVideo(v) {
    videoFrame.src = v.embed;
    videoCaption.textContent = v.title;
    videoModal.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function closeVideo() {
    videoFrame.src = '';
    videoModal.hidden = true;
    document.body.style.overflow = '';
  }
  document.getElementById('vmClose').addEventListener('click', closeVideo);
  document.getElementById('videoBackdrop').addEventListener('click', closeVideo);

  // ---------- keyboard ----------
  document.addEventListener('keydown', function (e) {
    if (!videoModal.hidden) {
      if (e.key === 'Escape') closeVideo();
      return;
    }
    if (!lightbox.hidden) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') lbGo(-1);
      if (e.key === 'ArrowRight') lbGo(1);
      return;
    }
    if (!projectView.hidden && e.key === 'Escape') closeProject();
  });

  // ---------- reveal on scroll ----------
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.classList.add('visible');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  // ---------- deep link ----------
  function checkHash() {
    var m = location.hash.match(/^#project\/(.+)$/);
    if (m) {
      var p = allProjects.find(function (x) { return x.slug === m[1]; });
      if (p) openProject(p);
    }
  }

  // ---------- random hero image ----------
  function setRandomHeroImage() {
    var heroImage = document.getElementById('heroImage');
    if (heroImage && allProjects.length > 0) {
      var randomProj = allProjects[Math.floor(Math.random() * allProjects.length)];
      if (randomProj && randomProj.images && randomProj.images.length > 0) {
        var randomImg = randomProj.images[Math.floor(Math.random() * randomProj.images.length)];
        heroImage.src = randomImg;
      }
    }
  }

  setRandomHeroImage();
  renderFilters();
  renderProjects();
  renderVideoFilters();
  renderFilms();
  checkHash();
})();
