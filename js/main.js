document.addEventListener('DOMContentLoaded', () => {
  // Enhanced Mobile Menu
  const menuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (menuButton && mobileMenu) {
    let isMenuOpen = false;
    
    function openMobileMenu() {
      isMenuOpen = true;
      mobileMenu.style.display = 'block'; // 明示的にdisplayを設定
      mobileMenu.classList.add('show');
      menuButton.classList.add('active');
      menuButton.setAttribute('aria-expanded', 'true');
      
      // フォーカス管理
      const firstMenuItem = mobileMenu.querySelector('a');
      if (firstMenuItem) {
        firstMenuItem.focus();
      }
    }

    function closeMobileMenu() {
      isMenuOpen = false;
      mobileMenu.classList.remove('show');
      menuButton.classList.remove('active');
      menuButton.setAttribute('aria-expanded', 'false');
      
      // アニメーション完了後にdisplay: noneを設定
      setTimeout(() => {
        if (!isMenuOpen) {
          mobileMenu.style.display = 'none';
        }
      }, 300);
    }

    function toggleMobileMenu() {
      if (isMenuOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    }
    
    // メニューボタンクリック時の処理
    menuButton.addEventListener('click', () => {
      toggleMobileMenu();
    });

    // ESCキーでメニューを閉じる
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        closeMobileMenu();
      }
    });

    // メニュー外クリックで閉じる
    document.addEventListener('click', (e) => {
      if (isMenuOpen && !menuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
        closeMobileMenu();
      }
    });

    // ウィンドウリサイズ時にデスクトップサイズになったらメニューを閉じる
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && isMenuOpen) {
        closeMobileMenu();
      }
    });

    // 初期設定
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-controls', 'mobile-menu');
    mobileMenu.setAttribute('role', 'navigation');
    mobileMenu.style.display = 'none'; // 初期状態で非表示
    
    // Smooth scroll for anchor links with mobile menu handling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const selector = this.getAttribute('href');
        if (!selector || selector === '#') return;

        const target = document.querySelector(selector);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          
          // モバイルメニューが開いている場合は閉じる
          if (mobileMenu && mobileMenu.classList.contains('show')) {
            closeMobileMenu();
          }
        }
      });
    });
    
    // Touch-friendly interactions for mobile
    if ('ontouchstart' in window) {
      // タッチデバイス用の最適化
      document.body.classList.add('touch-device');
      
      // スワイプジェスチャーでメニューを開閉
      let touchStartX = 0;
      let touchStartY = 0;
      
      document.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      });
      
      document.addEventListener('touchend', (e) => {
        if (!touchStartX || !touchStartY) return;
        
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        
        // 水平スワイプが垂直スワイプより大きい場合のみ処理
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 100) {
          if (deltaX > 0 && touchStartX < 50) {
            // 左端から右スワイプでメニューを開く
            if (mobileMenu && !mobileMenu.classList.contains('show')) {
              openMobileMenu();
            }
          } else if (deltaX < 0 && mobileMenu && mobileMenu.classList.contains('show')) {
            // 左スワイプでメニューを閉じる
            closeMobileMenu();
          }
        }
        
        touchStartX = 0;
        touchStartY = 0;
      });
    }
  }

  // Smooth scroll for anchor links (global)
  document.querySelectorAll('a[href^="#"]:not([data-processed])').forEach(anchor => {
    anchor.setAttribute('data-processed', 'true');
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const selector = this.getAttribute('href');
      if (!selector || selector === '#') return;

      const target = document.querySelector(selector);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  function sendAnalyticsEvent(eventName, params = {}) {
    window.dataLayer = window.dataLayer || [];
    if (typeof window.gtag !== 'function') {
      window.gtag = function () {
        window.dataLayer.push(arguments);
      };
    }

    window.gtag('event', eventName, {
      event_category: 'lead',
      page_path: window.location.pathname,
      page_title: document.title,
      transport_type: 'beacon',
      ...params
    });
  }

  function trackLinkClick(link) {
    const href = link.getAttribute('href') || '';
    const absoluteHref = link.href || href;
    const linkText = link.textContent.trim().replace(/\s+/g, ' ').slice(0, 80);
    const eventParams = {
      link_url: absoluteHref,
      link_text: linkText
    };

    if (link.matches('.open-download-modal, #header-download-button, #bottom-download-button, #article-download-button')) {
      sendAnalyticsEvent('download_click', eventParams);
      return;
    }

    if (absoluteHref.includes('timerex.net')) {
      sendAnalyticsEvent('timerex_click', eventParams);
      return;
    }

    if (absoluteHref.includes('/line/open/') || absoluteHref.includes('line.me') || absoluteHref.includes('lin.ee')) {
      sendAnalyticsEvent('line_click', eventParams);
      return;
    }

    if (absoluteHref.includes('/contact.html') || absoluteHref.endsWith('/contact')) {
      sendAnalyticsEvent('contact_click', eventParams);
      return;
    }

    if (absoluteHref.includes('showroom.digitool-lab.com')) {
      sendAnalyticsEvent('showroom_click', eventParams);
      return;
    }

    try {
      const destination = new URL(absoluteHref, window.location.href);
      const isExternal = destination.hostname && destination.hostname !== window.location.hostname && !destination.hostname.endsWith('.digitool-lab.com');
      if (isExternal) {
        sendAnalyticsEvent('outbound_click', {
          ...eventParams,
          outbound_domain: destination.hostname
        });
      }
    } catch (error) {
      // Ignore malformed URLs used for local anchors or script-driven links.
    }
  }

  function handleTrackedClick(e) {
    if (e.__cvTracked) return;

    const target = e.target instanceof Element ? e.target : null;
    if (!target) return;

    const link = target.closest('a');
    if (!link) return;

    e.__cvTracked = true;
    trackLinkClick(link);
  }

  document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', handleTrackedClick, true);
  });

  document.addEventListener('click', (e) => {
    handleTrackedClick(e);
  }, true);
  window.__cvTrackingReady = true;

  document.addEventListener('submit', (e) => {
    const form = e.target;
    if (!(form instanceof HTMLFormElement)) return;

    if (form.id === 'download-form') {
      sendAnalyticsEvent('file_download', {
        form_id: form.id,
        file_name: 'digitool-lab-service-guide.pdf'
      });
      return;
    }

    const action = form.getAttribute('action') || '';
    if (action.includes('contact_form') || window.location.pathname.endsWith('/contact.html')) {
      sendAnalyticsEvent('generate_lead', {
        form_id: form.id || 'contact-form',
        form_action: action
      });
    }
  }, true);

  // Animate On Scroll
  if (window.AOS) {
    AOS.init({
      duration: 800,
      once: true,
      offset: 200
    });
  }
});
