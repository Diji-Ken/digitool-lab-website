document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu
  const menuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', () => {
      mobileMenu.style.display = mobileMenu.style.display === 'block' ? 'none' : 'block';
    });
  }

  // Animate On Scroll
  AOS.init({
    duration: 800, // アニメーションの時間を800msに設定
    once: true, // アニメーションを1回だけ実行
    offset: 200, // アニメーションが始まるトリガーポイント
  });

  // Download Modal Logic
  const openModalButtons = document.querySelectorAll('#open-modal-button, #header-download-button, #bottom-download-button');
  const modal = document.getElementById('download-modal');
  const closeModalButton = document.getElementById('close-modal');
  const downloadForm = document.getElementById('download-form');

  if (modal && closeModalButton && downloadForm) {
    // Open modal
    openModalButtons.forEach(button => {
      if(button) {
        button.addEventListener('click', (e) => {
      e.preventDefault();
      modal.style.display = 'flex';
        });
      }
    });

    // Close modal
    const closeModal = () => {
      modal.style.display = 'none';
    };

    closeModalButton.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Handle form submission
    downloadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // In a real scenario, you'd send form data to a server here.
      // For now, we'll just trigger the download directly.
      const link = document.createElement('a');
      link.href = 'documents/サービス資料.pdf';
      link.download = '株式会社デジタルツール研究所_サービス資料.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      closeModal();
    });
  }
}); 