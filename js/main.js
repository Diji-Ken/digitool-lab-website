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
        const target = document.querySelector(this.getAttribute('href'));
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
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Animate On Scroll
  AOS.init({
    duration: 800, // アニメーションの時間を800msに設定
    once: true, // アニメーションを1回だけ実行
    offset: 200, // アニメーションが始まるトリガーポイント
    disable: function() {
      // モバイルデバイスで画面が小さい場合は無効化（パフォーマンス向上）
      return window.innerWidth < 480;
    }
  });
}); 