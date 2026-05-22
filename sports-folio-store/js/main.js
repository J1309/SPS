(function () {
  'use strict';

  var cartKey = 'sfs_cart';

  function getCart() {
    try { return JSON.parse(localStorage.getItem(cartKey)) || { items: [], promoCode: null, discount: 0 }; }
    catch (e) { return { items: [], promoCode: null, discount: 0 }; }
  }

  function saveCart(cart) {
    try { localStorage.setItem(cartKey, JSON.stringify(cart)); } catch (e) {}
    updateCartBadge();
  }

  function updateCartBadge() {
    var cart = getCart();
    var count = cart.items.reduce(function (sum, item) { return sum + item.quantity; }, 0);
    document.querySelectorAll('.cart-badge').forEach(function (b) {
      b.textContent = count;
      b.classList.toggle('show', count > 0);
    });
  }

  window.addToCart = function (productId, size) {
    var product = window._products ? window._products.find(function (p) { return p.id === productId; }) : null;
    var cart = getCart();
    var existing = cart.items.find(function (i) { return i.productId === productId && i.selectedSize === (size || null); });
    if (existing) {
      existing.quantity += 1;
    } else if (product) {
      cart.items.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
        selectedSize: size || null,
      });
    }
    saveCart(cart);
    if (typeof Toastify !== 'undefined') {
      Toastify({ text: 'Added to cart', className: 'success', duration: 2000, gravity: 'bottom', position: 'center', style: { background: '#1A5E38' } }).showToast();
    }
    return cart;
  };

  window.removeFromCart = function (productId, size) {
    var cart = getCart();
    var itemEl = document.querySelector('[data-product-id="' + productId + '"][data-size="' + (size || '') + '"]');
    if (itemEl) {
      itemEl.classList.add('removing');
      setTimeout(function () {
        cart.items = cart.items.filter(function (i) { return !(i.productId === productId && i.selectedSize === (size || null)); });
        saveCart(cart);
        renderCartPage();
      }, 400);
    } else {
      cart.items = cart.items.filter(function (i) { return !(i.productId === productId && i.selectedSize === (size || null)); });
      saveCart(cart);
      renderCartPage();
    }
  };

  window.updateQuantity = function (productId, size, delta) {
    var cart = getCart();
    var item = cart.items.find(function (i) { return i.productId === productId && i.selectedSize === (size || null); });
    if (item) {
      item.quantity = Math.max(1, item.quantity + delta);
      saveCart(cart);
      renderCartPage();
    }
  };

  function showToast(message, type) {
    if (typeof Toastify !== 'undefined') {
      Toastify({ text: message, className: type || 'success', duration: 3000, gravity: 'bottom', position: 'center', style: { background: type === 'error' ? '#EF4444' : '#1A5E38' } }).showToast();
    }
  }

  function formatCurrency(amount) {
    return '$' + amount.toFixed(2);
  }

  function initNavbar() {
    var navbar = document.querySelector('.navbar');
    var hamburger = document.querySelector('.hamburger');
    var mobileMenu = document.querySelector('.mobile-menu');
    var overlay = document.querySelector('.mobile-overlay');

    if (!navbar) return;

    window.addEventListener('scroll', function () {
      navbar.classList.toggle('scrolled', window.scrollY > 80);
    }, { passive: true });

    if (hamburger && mobileMenu && overlay) {
      hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('open');
        overlay.classList.toggle('show');
        document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
      });
      overlay.addEventListener('click', function () {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
        overlay.classList.remove('show');
        document.body.style.overflow = '';
      });
    }

    var currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(function (a) {
      var href = a.getAttribute('href');
      if (href === currentPath || (currentPath === '' && href === 'index.html')) {
        a.classList.add('active');
      }
    });

    updateCartBadge();
  }

  /* Lenis smooth scroll */
  function initLenis() {
    if (typeof Lenis === 'undefined') return;
    var lenis = new Lenis({
      duration: 1.2,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      orientation: 'vertical',
      smoothWheel: true,
    });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    }
    window.lenis = lenis;
  }

  /* GSAP animations with enhanced parallax */
  function initGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    var mm = gsap.matchMedia();

    /* Hero parallax: 2-layer depth effect */
    mm.add('(prefers-reduced-motion: no-preference)', function () {
      var heroLayers = document.querySelectorAll('.hero-bg-layer');
      if (heroLayers.length) {
        gsap.to(heroLayers[0], {
          yPercent: 25,
          ease: 'none',
          scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.5 },
        });
        if (heroLayers[1]) {
          gsap.to(heroLayers[1], {
            yPercent: 35,
            ease: 'none',
            scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.5 },
          });
        }
      }

      var heroTitle = document.querySelector('.hero-title');
      var heroBadge = document.querySelector('.hero-badge');
      var heroDesc = document.querySelector('.hero-desc');
      var heroCta = document.querySelector('.hero-cta');

      if (heroBadge) gsap.from(heroBadge, { y: 24, opacity: 0, duration: 0.7, delay: 0.1, ease: 'power2.out' });
      if (heroTitle) {
        gsap.from(heroTitle.querySelectorAll('.line'), {
          y: 80,
          opacity: 0,
          duration: 1.1,
          stagger: 0.2,
          ease: 'power3.out',
          delay: 0.3,
        });
      }
      if (heroDesc) gsap.from(heroDesc, { y: 24, opacity: 0, duration: 0.7, delay: 0.6, ease: 'power2.out' });
      if (heroCta) gsap.from(heroCta, { y: 24, opacity: 0, duration: 0.7, delay: 0.8, ease: 'power2.out' });

      var heroStack = document.querySelector('.hero-kinetic-stack');
      if (heroStack) gsap.from(heroStack.children, { x: 42, opacity: 0, duration: 0.8, stagger: 0.12, delay: 0.9, ease: 'power3.out' });
    });

    /* Page hero text and media sweep */
    mm.add('(prefers-reduced-motion: no-preference)', function () {
      var pageHero = document.querySelector('.page-hero');
      if (!pageHero) return;
      gsap.from('.page-hero-content > *', {
        y: 34,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',
      });
      gsap.to('.page-hero-content', {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: { trigger: pageHero, start: 'top top', end: 'bottom top', scrub: true },
      });
    });

    /* Story image parallax */
    mm.add('(prefers-reduced-motion: no-preference)', function () {
      gsap.utils.toArray('.story-image').forEach(function (img) {
        gsap.to(img, {
          yPercent: -12,
          ease: 'none',
          scrollTrigger: { trigger: img.closest('.story-block'), scrub: 1.5 },
        });
      });
    });

    /* Generic parallax-layer support */
    mm.add('(prefers-reduced-motion: no-preference)', function () {
      gsap.utils.toArray('.parallax-layer').forEach(function (layer) {
        var speed = parseFloat(layer.getAttribute('data-speed')) || -0.1;
        if (layer.closest('.hero')) return;
        gsap.to(layer, {
          yPercent: speed * 100,
          ease: 'none',
          scrollTrigger: {
            trigger: layer.closest('section') || layer.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      });
    });

    /* Scroll reveals with exponential easing */
    mm.add('(prefers-reduced-motion: no-preference)', function () {
      gsap.utils.toArray('.reveal').forEach(function (el) {
        gsap.fromTo(el, { y: 48, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
        });
      });
      gsap.utils.toArray('.reveal-left').forEach(function (el) {
        gsap.fromTo(el, { x: -48, opacity: 0 }, {
          x: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
        });
      });
      gsap.utils.toArray('.reveal-right').forEach(function (el) {
        gsap.fromTo(el, { x: 48, opacity: 0 }, {
          x: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
        });
      });
    });

    /* Product card stagger */
    mm.add('(prefers-reduced-motion: no-preference)', function () {
      var productCards = document.querySelectorAll('.product-card');
      if (productCards.length) {
        gsap.fromTo(productCards, { y: 60, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.7, stagger: 0.06, ease: 'power3.out',
          scrollTrigger: { trigger: '.featured-grid', start: 'top 80%', toggleActions: 'play none none none' },
          onComplete: function () { productCards.forEach(function (c) { c.classList.add('visible'); }); },
        });
      }
    });

    /* Story lines */
    mm.add('(prefers-reduced-motion: no-preference)', function () {
      gsap.utils.toArray('.story-line').forEach(function (line) {
        gsap.to(line, {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: line, start: 'top 80%', toggleActions: 'play none none none' },
        });
      });
    });

    /* Pillar cards staggered */
    mm.add('(prefers-reduced-motion: no-preference)', function () {
      var pillars = document.querySelectorAll('.pillar-card');
      if (pillars.length) {
        gsap.fromTo(pillars, { y: 40, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: '.pillars-grid', start: 'top 80%', toggleActions: 'play none none none' },
        });
      }
    });

    /* Shop hero parallax */
    mm.add('(prefers-reduced-motion: no-preference)', function () {
      var shopHero = document.querySelector('.shop-hero');
      if (shopHero) {
        gsap.to('.shop-hero h1', {
          yPercent: 30,
          ease: 'none',
          scrollTrigger: { trigger: '.shop-hero', start: 'top top', end: 'bottom top', scrub: true },
        });
      }
    });

    /* Contact hero parallax */
    mm.add('(prefers-reduced-motion: no-preference)', function () {
      var contactHero = document.querySelector('.contact-hero');
      if (contactHero) {
        gsap.to('.contact-hero h1', {
          yPercent: 25,
          ease: 'none',
          scrollTrigger: { trigger: '.contact-hero', start: 'top top', end: 'bottom top', scrub: true },
        });
      }
    });
  }

  /* Swiper testimonials */
  function initSwiper() {
    if (typeof Swiper === 'undefined') return;
    var swiperEl = document.querySelector('.testimonials-swiper');
    if (!swiperEl) return;
    new Swiper(swiperEl, {
      slidesPerView: 1,
      spaceBetween: 32,
      loop: true,
      autoplay: { delay: 4500, disableOnInteraction: false },
      pagination: { el: '.swiper-pagination', clickable: true },
      speed: 700,
    });
  }

  /* Marquee infinite scroll */
  function initMarquee() {
    var track = document.querySelector('.marquee-track');
    if (!track) return;
    var original = track.innerHTML;

    while (track.children.length < 36 || track.scrollWidth < window.innerWidth * 3) {
      track.insertAdjacentHTML('beforeend', original);
    }

    track.classList.add('is-moving', 'force-marquee');
  }

  /* Shop page */
  var filteredProducts = [];

  function renderShopProducts(productsToRender) {
    var grid = document.querySelector('.shop-grid');
    if (!grid) return;
    if (!productsToRender.length) {
      grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:80px 0;color:var(--slate)"><i class="fas fa-search" style="font-size:48px;color:#ddd;margin-bottom:16px;display:block"></i><h3>No products found</h3><p style="margin-top:8px">Try adjusting your filters</p></div>';
      document.querySelector('.shop-toolbar .results').textContent = '0 products found';
      return;
    }
    grid.innerHTML = productsToRender.map(function (p) {
      return '<div class="product-card visible" data-id="' + p.id + '">' +
        '<div class="product-card-image">' +
          '<img src="' + p.image + '" alt="' + p.name + '" loading="lazy">' +
          (p.discount ? '<span class="product-card-tag sale">-' + p.discount + '%</span>' : '') +
          '<span class="quick-view" onclick="window.openQuickView(\'' + p.id + '\')">Quick View</span>' +
        '</div>' +
        '<div class="product-card-body">' +
          '<div class="product-card-brand">' + p.brand + '</div>' +
          '<div class="product-card-name">' + p.name + '</div>' +
          '<div class="product-card-price">' +
            '<span class="current">$' + p.price.toFixed(2) + '</span>' +
            (p.originalPrice ? '<span class="old">$' + p.originalPrice.toFixed(2) + '</span>' : '') +
          '</div>' +
          '<div class="product-card-stars">' + '&#9733;'.repeat(Math.floor(p.rating)) + (p.rating % 1 >= 0.5 ? '&#189;' : '') + ' (' + p.reviewCount + ')</div>' +
          '<button class="btn btn-primary" onclick="window.addToCart(\'' + p.id + '\')"><i class="fas fa-shopping-cart"></i> Add to Cart</button>' +
        '</div>' +
      '</div>';
    }).join('');
    document.querySelector('.shop-toolbar .results').textContent = productsToRender.length + ' products found';
  }

  function filterAndSortProducts() {
    var category = (document.querySelector('input[name="category"]:checked') && document.querySelector('input[name="category"]:checked').value) || 'all';
    var priceMax = parseInt(document.querySelector('#priceRange') ? document.querySelector('#priceRange').value : '500') || 500;
    var selectedBrands = Array.from(document.querySelectorAll('input[name="brand"]:checked')).map(function (b) { return b.value; });
    var sortBy = (document.querySelector('#sortBy') && document.querySelector('#sortBy').value) || 'popularity';

    var result = [].concat(window._products || []);

    if (category !== 'all') result = result.filter(function (p) { return p.category === category; });
    result = result.filter(function (p) { return p.price <= priceMax; });
    if (selectedBrands.length) result = result.filter(function (p) { return selectedBrands.indexOf(p.brand) !== -1; });

    switch (sortBy) {
      case 'price-asc': result.sort(function (a, b) { return a.price - b.price; }); break;
      case 'price-desc': result.sort(function (a, b) { return b.price - a.price; }); break;
      case 'newest': result.sort(function (a, b) { return (b.tags.indexOf('new-arrival') !== -1 ? 1 : 0) - (a.tags.indexOf('new-arrival') !== -1 ? 1 : 0); }); break;
      default: result.sort(function (a, b) { return b.rating - a.rating || b.reviewCount - a.reviewCount; }); break;
    }

    filteredProducts = result;
    renderShopProducts(result);
    renderFilterChips();

    if (typeof gsap !== 'undefined') {
      gsap.fromTo('.shop-grid .product-card', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.04, ease: 'power2.out' });
    }
  }

  function renderFilterChips() {
    var chipsContainer = document.querySelector('#filterChips');
    if (!chipsContainer) return;

    var category = (document.querySelector('input[name="category"]:checked') && document.querySelector('input[name="category"]:checked').value) || 'all';
    var priceMax = parseInt(document.querySelector('#priceRange') ? document.querySelector('#priceRange').value : '500') || 500;
    var selectedBrands = Array.from(document.querySelectorAll('input[name="brand"]:checked')).map(function (b) { return b.value; });

    var chips = [];

    if (category !== 'all') {
      chips.push({ label: category.charAt(0).toUpperCase() + category.slice(1), type: 'category', value: category });
    }

    if (priceMax < 500) {
      chips.push({ label: 'Under $' + priceMax, type: 'price', value: priceMax });
    }

    selectedBrands.forEach(function (brand) {
      chips.push({ label: brand, type: 'brand', value: brand });
    });

    if (!chips.length) {
      chipsContainer.innerHTML = '';
      chipsContainer.classList.remove('has-chips');
      return;
    }

    chipsContainer.classList.add('has-chips');
    chipsContainer.innerHTML = chips.map(function (chip) {
      return '<span class="filter-chip" data-type="' + chip.type + '" data-value="' + chip.value + '">' + chip.label + ' <i class="fas fa-times"></i></span>';
    }).join('');

    chipsContainer.querySelectorAll('.filter-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        var type = this.getAttribute('data-type');
        var value = this.getAttribute('data-value');
        if (type === 'category') {
          document.querySelector('input[name="category"][value="all"]').checked = true;
        } else if (type === 'price') {
          var pr = document.querySelector('#priceRange');
          var pv = document.querySelector('#priceValue');
          if (pr) { pr.value = 500; }
          if (pv) { pv.textContent = '$0 \u2013 $500'; }
        } else if (type === 'brand') {
          document.querySelectorAll('input[name="brand"]').forEach(function (b) {
            if (b.value === value) b.checked = false;
          });
        }
        filterAndSortProducts();
      });
    });
  }

  function initFilterAccordion() {
    document.querySelectorAll('.filter-section').forEach(function (section) {
      var header = section.querySelector('.filter-section-header');
      if (!header) return;
      header.addEventListener('click', function () {
        section.classList.toggle('collapsed');
      });
    });
  }

  function initMobileFilterDrawer() {
    var openBtn = document.querySelector('#mobileFilterBtn');
    var drawer = document.querySelector('#filterDrawer');
    var overlay = document.querySelector('#filterDrawerOverlay');
    var closeBtn = document.querySelector('#filterDrawerClose');
    var applyBtn = document.querySelector('#filterDrawerApply');

    if (!drawer || !overlay) return;

    function populateDrawer() {
      var drawerContent = document.querySelector('#filterDrawerContent');
      var sidebar = document.querySelector('#shopSidebar');
      if (!drawerContent || !sidebar) return;

      drawerContent.innerHTML = '';
      var items = sidebar.querySelectorAll('.filter-section, .btn-clear');
      items.forEach(function (el) {
        var clone = el.cloneNode(true);
        clone.querySelectorAll('[id]').forEach(function (child) { child.removeAttribute('id'); });
        drawerContent.appendChild(clone);
      });

      drawerContent.querySelectorAll('input[name="category"], input[name="brand"]').forEach(function (el) {
        el.addEventListener('change', function () {
          var name = el.getAttribute('name');
          var value = el.value;
          var realInput = document.querySelector('input[name="' + name + '"][value="' + value + '"]');
          if (realInput) realInput.checked = el.checked;
          filterAndSortProducts();
        });
      });

      var drawerRange = drawerContent.querySelector('input[type="range"]');
      if (drawerRange) {
        drawerRange.addEventListener('input', function () {
          var realRange = document.querySelector('#priceRange');
          var realVal = document.querySelector('#priceValue');
          if (realRange) realRange.value = drawerRange.value;
          if (realVal) realVal.textContent = '$0 \u2013 $' + drawerRange.value;
          filterAndSortProducts();
        });
      }

      var drawerClear = drawerContent.querySelector('.btn-clear');
      if (drawerClear) {
        drawerClear.addEventListener('click', function (e) {
          e.stopPropagation();
          document.querySelectorAll('input[name="category"]').forEach(function (c) { c.checked = c.value === 'all'; });
          document.querySelectorAll('input[name="brand"]').forEach(function (c) { c.checked = false; });
          var pr = document.querySelector('#priceRange');
          var pv = document.querySelector('#priceValue');
          if (pr) { pr.value = 500; pv.textContent = '$0 \u2013 $500'; }
          filterAndSortProducts();
        });
      }
    }

    function openDrawer() {
      populateDrawer();
      drawer.classList.add('open');
      overlay.classList.add('show');
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      drawer.classList.remove('open');
      overlay.classList.remove('show');
      document.body.style.overflow = '';
    }

    if (openBtn) openBtn.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (overlay) overlay.addEventListener('click', closeDrawer);
    if (applyBtn) applyBtn.addEventListener('click', closeDrawer);
  }

  function initShopPage() {
    var priceRange = document.querySelector('#priceRange');
    var priceValue = document.querySelector('#priceValue');
    var clearBtn = document.querySelector('.btn-clear');
    var sortBy = document.querySelector('#sortBy');
    var categoryFromUrl = new URLSearchParams(window.location.search).get('category');

    if (categoryFromUrl) {
      var categoryInput = document.querySelector('input[name="category"][value="' + categoryFromUrl + '"]');
      if (categoryInput) categoryInput.checked = true;
    }

    if (priceRange && priceValue) {
      priceRange.addEventListener('input', function () {
        priceValue.textContent = '$0 \u2013 $' + priceRange.value;
        filterAndSortProducts();
      });
    }

    document.querySelectorAll('input[name="category"], input[name="brand"]').forEach(function (el) {
      el.addEventListener('change', filterAndSortProducts);
    });

    if (sortBy) sortBy.addEventListener('change', filterAndSortProducts);
    if (clearBtn) clearBtn.addEventListener('click', function () {
      document.querySelectorAll('input[name="category"]').forEach(function (c) { c.checked = c.value === 'all'; });
      document.querySelectorAll('input[name="brand"]').forEach(function (c) { c.checked = false; });
      if (priceRange) { priceRange.value = 500; priceValue.textContent = '$0 \u2013 $500'; }
      filterAndSortProducts();
    });

    initFilterAccordion();
    initMobileFilterDrawer();

    // Sticky sort bar on scroll
    var toolbar = document.querySelector('.shop-toolbar');
    if (toolbar) {
      var toolbarTop = toolbar.offsetTop;
      function onScrollSticky() {
        toolbar.classList.toggle('sticky', window.scrollY + 80 > toolbarTop);
      }
      window.addEventListener('scroll', onScrollSticky, { passive: true });
      onScrollSticky();
    }

    filterAndSortProducts();
  }

  window.openQuickView = function (productId) {
    var product = (window._products || []).find(function (p) { return p.id === productId; });
    if (!product) return;
    var modal = document.querySelector('.modal-overlay');
    if (!modal) return;
    modal.querySelector('.modal-image img').src = product.images[0] || product.image;
    modal.querySelector('.modal-image img').alt = product.name;
    modal.querySelector('.modal-info h2').textContent = product.name;
    modal.querySelector('.modal-info .brand').textContent = product.brand;
    modal.querySelector('.modal-info .price').innerHTML = '$' + product.price.toFixed(2) + (product.originalPrice ? ' <span style="text-decoration:line-through;font-size:16px;color:var(--slate);font-weight:400">$' + product.originalPrice.toFixed(2) + '</span>' : '');
    modal.querySelector('.modal-info .desc').textContent = product.description;

    var sizeSelect = modal.querySelector('.modal-info .size-select select');
    if (product.sizes && product.sizes.length) {
      sizeSelect.closest('.size-select').style.display = 'block';
      sizeSelect.innerHTML = '<option value="">Select Size</option>' + product.sizes.map(function (s) { return '<option value="' + s + '">' + s + '</option>'; }).join('');
    } else {
      sizeSelect.closest('.size-select').style.display = 'none';
    }

    var qtySpan = modal.querySelector('.qty span');
    qtySpan.textContent = '1';
    var qtyMinus = modal.querySelector('.qty-minus');
    var qtyPlus = modal.querySelector('.qty-plus');
    var addBtn = modal.querySelector('.add-to-cart-btn');

    if (qtyMinus) qtyMinus.onclick = function () { qtySpan.textContent = Math.max(1, parseInt(qtySpan.textContent) - 1); };
    if (qtyPlus) qtyPlus.onclick = function () { qtySpan.textContent = Math.min(99, parseInt(qtySpan.textContent) + 1); };
    if (addBtn) addBtn.onclick = function () {
      for (var i = 0; i < parseInt(qtySpan.textContent); i++) window.addToCart(product.id, sizeSelect ? sizeSelect.value || undefined : undefined);
      closeModal();
    };

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (typeof gsap !== 'undefined') gsap.fromTo(modal.querySelector('.modal'), { y: 48, scale: 0.96, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.45, ease: 'power3.out' });
  };

  window.closeModal = function () {
    var modal = document.querySelector('.modal-overlay');
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  /* Cart page */
  function renderCartPage() {
    var cart = getCart();
    var container = document.querySelector('.cart-items');
    var summary = document.querySelector('.cart-summary');
    var emptyState = document.querySelector('.empty-cart');

    if (!container) return;

    if (!cart.items.length) {
      if (container) container.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      if (summary) summary.style.display = 'none';
      updateCartSummary();
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (summary) summary.style.display = 'block';

    container.innerHTML = cart.items.map(function (item, idx) {
      return '<div class="cart-item" data-product-id="' + item.productId + '" data-size="' + (item.selectedSize || '') + '" data-index="' + idx + '">' +
        '<div class="cart-item-image"><img src="' + item.image + '" alt="' + item.name + '" loading="lazy"></div>' +
        '<div class="cart-item-info">' +
          '<h3>' + item.name + '</h3>' +
          (item.selectedSize ? '<div class="meta">Size: ' + item.selectedSize + '</div>' : '') +
          '<div class="price">' + formatCurrency(item.price) + '</div>' +
        '</div>' +
        '<div class="cart-item-actions">' +
          '<div class="qty">' +
            '<button onclick="window.updateQuantity(\'' + item.productId + '\', \'' + (item.selectedSize || '') + '\', -1)" aria-label="Decrease quantity">\u2212</button>' +
            '<span>' + item.quantity + '</span>' +
            '<button onclick="window.updateQuantity(\'' + item.productId + '\', \'' + (item.selectedSize || '') + '\', 1)" aria-label="Increase quantity">+</button>' +
          '</div>' +
          '<button class="cart-item-remove" onclick="window.removeFromCart(\'' + item.productId + '\', \'' + (item.selectedSize || '') + '\')" aria-label="Remove item"><i class="fas fa-trash-alt"></i></button>' +
        '</div>' +
      '</div>';
    }).join('');

    updateCartSummary();
  }

  function updateCartSummary() {
    var cart = getCart();
    var subtotal = cart.items.reduce(function (sum, item) { return sum + item.price * item.quantity; }, 0);
    var shipping = subtotal >= 100 ? 0 : 9.99;
    var discount = 0;

    if (cart.promoCode) {
      var codeData = promoCodes[cart.promoCode];
      if (codeData) {
        if (codeData.type === 'percent') discount = subtotal * (codeData.discount / 100);
        else if (codeData.type === 'flat') discount = codeData.discount;
        else if (codeData.type === 'freeshipping') discount = shipping;
      }
    }

    var total = Math.max(0, subtotal + shipping - discount);

    document.querySelectorAll('.cart-summary .subtotal').forEach(function (el) { el.textContent = formatCurrency(subtotal); });
    document.querySelectorAll('.cart-summary .shipping').forEach(function (el) { el.textContent = shipping === 0 ? 'FREE' : formatCurrency(shipping); });
    document.querySelectorAll('.cart-summary .discount').forEach(function (el) {
      if (discount > 0) { el.textContent = '-' + formatCurrency(discount); el.closest('.cart-summary-row').style.display = 'flex'; }
      else { el.closest('.cart-summary-row').style.display = 'none'; }
    });
    document.querySelectorAll('.cart-summary .total').forEach(function (el) { el.textContent = formatCurrency(total); });

    updateCartBadge();
  }

  function initCartPage() {
    var checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', function (e) {
        var ripple = document.createElement('span');
        ripple.classList.add('ripple');
        var rect = this.getBoundingClientRect();
        ripple.style.left = (e.clientX - rect.left) + 'px';
        ripple.style.top = (e.clientY - rect.top) + 'px';
        ripple.style.width = ripple.style.height = '300px';
        this.appendChild(ripple);
        setTimeout(function () { ripple.remove(); }, 600);
        var cart = getCart();
        if (!cart.items.length) { showToast('Your cart is empty', 'error'); return; }
        showToast('Redirecting to secure checkout...', 'success');
      });
    }

    var promoBtn = document.querySelector('.promo button');
    var promoInput = document.querySelector('.promo input');
    if (promoBtn && promoInput) {
      promoBtn.addEventListener('click', function () {
        var code = promoInput.value.trim().toUpperCase();
        var cart = getCart();
        if (promoCodes[code]) {
          cart.promoCode = code;
          saveCart(cart);
          showToast('Promo applied: ' + promoCodes[code].description, 'success');
          updateCartSummary();
        } else {
          showToast('Invalid promo code', 'error');
        }
      });
    }

    renderCartPage();
  }

  /* Contact form */
  function initContactForm() {
    var form = document.querySelector('.contact-form form');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      var valid = true;
      this.querySelectorAll('.form-group').forEach(function (g) { g.classList.remove('error'); });

      var name = this.querySelector('#name');
      var email = this.querySelector('#email');
      var message = this.querySelector('#message');

      if (!name.value.trim()) { name.closest('.form-group').classList.add('error'); valid = false; }
      if (!email.value.trim() || !/\S+@\S+\.\S+/.test(email.value)) { email.closest('.form-group').classList.add('error'); valid = false; }
      if (!message.value.trim()) { message.closest('.form-group').classList.add('error'); valid = false; }

      if (!valid) return;

      var submitBtn = this.querySelector('.form-submit');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      try {
        var formData = new FormData(this);
        var response = await fetch(this.action, { method: 'POST', body: formData, headers: { 'Accept': 'application/json' } });
        if (response.ok) {
          this.style.display = 'none';
          document.querySelector('.form-success').style.display = 'block';
          showToast('Message sent successfully.', 'success');
        } else {
          showToast('Something went wrong. Please try again.', 'error');
        }
      } catch (err) {
        showToast('Network error. Please check your connection.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }
    });
  }

  function initKineticPointer() {
    var floatTarget = document.querySelector('.parallax-float');
    var hero = document.querySelector('.kinetic-hero');
    if (!floatTarget || !hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    floatTarget.style.willChange = 'transform';
    hero.addEventListener('pointermove', function (event) {
      var rect = hero.getBoundingClientRect();
      var x = (event.clientX - rect.left) / rect.width - 0.5;
      var y = (event.clientY - rect.top) / rect.height - 0.5;
      floatTarget.style.transform = 'translate3d(' + (x * -28).toFixed(1) + 'px,' + (y * -20).toFixed(1) + 'px,0)';
    }, { passive: true });
    hero.addEventListener('pointerleave', function () { floatTarget.style.transform = ''; });
  }

  function initNativeParallax() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var items = [];
    var lastScrollY = -1;

    function add(el, speed, axis, trigger) {
      if (!el) return;
      el.classList.add('native-parallax-active');
      items.push({
        el: el,
        speed: speed,
        axis: axis || 'y',
        trigger: trigger || el.closest('section') || el.parentElement || el,
        base: getComputedStyle(el).transform === 'none' ? '' : getComputedStyle(el).transform,
      });
    }

    var hero = document.querySelector('.hero');
    document.querySelectorAll('.hero-bg-layer').forEach(function (layer, index) {
      add(layer, index === 0 ? 0.72 : 1.05, 'y', hero);
    });

    document.querySelectorAll('.story-image').forEach(function (image) {
      add(image, -0.34, 'y', image.closest('.story-block'));
    });

    document.querySelectorAll('.spotlight-card img').forEach(function (image) {
      add(image, -0.18, 'y', image.closest('.spotlight-card'));
    });

    add(document.querySelector('.hero-content'), -0.16, 'y', hero);

    function update() {
      var currentScrollY = window.scrollY || window.pageYOffset || 0;
      if (currentScrollY === lastScrollY) {
        requestAnimationFrame(update);
        return;
      }

      lastScrollY = currentScrollY;
      var viewportHeight = window.innerHeight || document.documentElement.clientHeight;

      items.forEach(function (item) {
        if (!item.trigger) return;
        var rect = item.trigger.getBoundingClientRect();
        if (rect.bottom < -160 || rect.top > viewportHeight + 160) return;

        var progress = (viewportHeight - rect.top) / (viewportHeight + rect.height);
        progress = Math.max(0, Math.min(1, progress));
        var centered = progress - 0.5;
        var distance = rect.height * item.speed;
        var y = centered * distance;
        var x = item.axis === 'xy' ? centered * distance * -0.45 : 0;
        var base = item.base && item.base !== 'none' ? item.base + ' ' : '';

        item.el.style.transform = base + 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
      });

      if (hero) {
        document.documentElement.style.setProperty('--scroll-depth', Math.min(currentScrollY / Math.max(viewportHeight, 1), 1).toFixed(3));
      }
      requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
    window.addEventListener('resize', function () { lastScrollY = -1; }, { passive: true });
    window.nativeParallaxRefresh = update;
  }

  function initBoomerangBg() {
    var container = document.getElementById('boomerangBg');
    if (!container) return;

    var videoUrl = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260511_131941_d136af49-e243-493a-be14-6ff3f24e09e6.mp4';

    var video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.crossOrigin = 'anonymous';
    video.src = videoUrl;
    video.className = 'hero-vid-video';
    container.appendChild(video);

    var displayCanvas = document.createElement('canvas');
    displayCanvas.className = 'hero-vid-canvas';
    displayCanvas.style.display = 'none';
    container.appendChild(displayCanvas);

    var frames = [];
    var capturing = false;
    var MAX_WIDTH = 960;

    function captureFrame() {
      if (video.readyState < 2) return;
      var vw = video.videoWidth;
      var vh = video.videoHeight;
      if (!vw || !vh) return;
      var scale = Math.min(1, MAX_WIDTH / vw);
      var w = Math.round(vw * scale);
      var h = Math.round(vh * scale);
      var canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      var ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(video, 0, 0, w, h);
      frames.push(canvas);
    }

    var captureRaf;
    function captureLoop() {
      if (!capturing) return;
      captureFrame();
      captureRaf = requestAnimationFrame(captureLoop);
    }

    video.addEventListener('loadedmetadata', function () {
      capturing = true;
      video.play().catch(function () {});
      captureRaf = requestAnimationFrame(captureLoop);
    });

    video.addEventListener('ended', function () {
      capturing = false;
      if (captureRaf) cancelAnimationFrame(captureRaf);
      video.style.display = 'none';
      if (!frames.length) return;
      var first = frames[0];
      displayCanvas.width = first.width;
      displayCanvas.height = first.height;
      displayCanvas.style.display = 'block';
      var index = 0;
      var direction = 1;
      var lastTime = performance.now();
      var interval = 1000 / 30;
      var ctx = displayCanvas.getContext('2d');
      if (!ctx) return;
      function boomerangLoop(now) {
        if (now - lastTime >= interval) {
          lastTime = now;
          ctx.drawImage(frames[index], 0, 0);
          index += direction;
          if (index >= frames.length - 1) direction = -1;
          else if (index <= 0) direction = 1;
        }
        requestAnimationFrame(boomerangLoop);
      }
      requestAnimationFrame(boomerangLoop);
    });

    video.load();
  }

  /* Init */
  document.addEventListener('DOMContentLoaded', function () {
    if (typeof products !== 'undefined') window._products = products;
    initNavbar();
    initLenis();
    initMarquee();
    initSwiper();
    initKineticPointer();

    setTimeout(function () {
      initGSAP();
      initNativeParallax();
      if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .story-line, .product-card').forEach(function (el) {
          el.style.opacity = '1';
          el.style.transform = 'none';
        });
      }
      if (document.querySelector('.shop-grid')) initShopPage();
      if (document.querySelector('.cart-items')) initCartPage();
      if (document.querySelector('.contact-form')) initContactForm();

      if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    }, 100);
  });

  window.addEventListener('load', function () {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  });

})();
