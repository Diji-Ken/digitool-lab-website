// 共通のダウンロードモーダルテンプレート
const DOWNLOAD_MODAL_HTML = `
<div id="download-modal" class="modal-overlay" style="display: none;">
  <div class="modal-content">
    <button id="close-modal" class="modal-close">&times;</button>
    <h3>サービス詳細資料のダウンロード</h3>
    <p>以下の項目をご入力いただくと、サービス詳細資料をダウンロードできます。</p>
    <form id="download-form" action="https://digitool-lab.com/send_lead.php" method="POST">
      <div class="form-group">
        <label for="modal-name">お名前 *</label>
        <input type="text" id="modal-name" name="name" required>
      </div>
      <div class="form-group">
        <label for="modal-company">会社名 *</label>
        <input type="text" id="modal-company" name="company" required>
      </div>
      <div class="form-group">
        <label for="modal-department">部署・役職</label>
        <input type="text" id="modal-department" name="department" placeholder="例：営業部 部長">
      </div>
      <div class="form-group">
        <label for="modal-email">メールアドレス *</label>
        <input type="email" id="modal-email" name="email" required>
      </div>
      <div class="form-group">
        <label for="modal-phone">電話番号</label>
        <input type="tel" id="modal-phone" name="phone" placeholder="例：03-1234-5678">
      </div>
      <div class="form-group">
        <label for="modal-employees">従業員数</label>
        <select id="modal-employees" name="employees">
          <option value="">選択してください</option>
          <option value="1-10">1〜10名</option>
          <option value="11-50">11〜50名</option>
          <option value="51-100">51〜100名</option>
          <option value="101-300">101〜300名</option>
          <option value="301-1000">301〜1,000名</option>
          <option value="1001+">1,001名以上</option>
        </select>
      </div>
      <div class="form-group">
        <label for="modal-interest">興味のあるサービス</label>
        <select id="modal-interest" name="interest">
          <option value="">選択してください</option>
          <option value="dx-consulting">DX伴走サポート</option>
          <option value="ai-training">AI研修</option>
          <option value="development">開発・デジタル支援</option>
          <option value="all">すべてのサービス</option>
        </select>
      </div>
      <div class="form-group">
        <label class="checkbox-label">
          <input type="checkbox" id="modal-privacy-agree" name="privacy_agree" required>
          <a href="./privacy-policy.html" target="_blank">プライバシーポリシー</a>に同意する *
        </label>
      </div>
      <button type="submit" class="btn btn-primary btn-block">資料をダウンロード</button>
    </form>
  </div>
</div>
`;

// ページ読み込み時にモーダルを挿入
document.addEventListener('DOMContentLoaded', function() {
  // 既存のモーダルがあれば削除
  const existingModal = document.getElementById('download-modal');
  if (existingModal) {
    existingModal.remove();
  }
  
  // 新しいモーダルを挿入
  document.body.insertAdjacentHTML('beforeend', DOWNLOAD_MODAL_HTML);

  // --- New Modal Control Logic ---
  const modal = document.getElementById('download-modal');
  const openModalButtons = document.querySelectorAll('.open-download-modal');
  const closeModalButton = document.getElementById('close-modal');

  if (modal && openModalButtons.length > 0 && closeModalButton) {
    // Function to open the modal
    const openModal = (e) => {
      e.preventDefault();
      modal.style.display = 'flex';
      const firstInput = modal.querySelector('input[type="text"]');
      if (firstInput) {
        firstInput.focus();
      }
    };

    // Function to close the modal
    const closeModal = () => {
      modal.style.display = 'none';
    };

    // Attach event listeners to all open buttons
    openModalButtons.forEach(button => {
      button.addEventListener('click', openModal);
    });

    // Attach event listener to close button
    closeModalButton.addEventListener('click', closeModal);

    // Close modal on escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.style.display === 'flex') {
        closeModal();
      }
    });

    // Close modal on overlay click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Handle form submission
    const downloadForm = document.getElementById('download-form');
    if (downloadForm) {
      downloadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Show success message
        const formData = new FormData(downloadForm);
        const name = formData.get('name');
        
        alert(`ありがとうございます、${name}様。\n資料のダウンロードを開始します。`);
        
        // Close modal
        closeModal();
        
        // Start download
        const downloadLink = document.createElement('a');
        downloadLink.href = 'https://digitool-lab.com/documents/digitool-lab-service-guide.pdf';
        downloadLink.download = 'デジタルツール研究所_サービス詳細資料.pdf';
        downloadLink.click();
        
        // Reset form
        downloadForm.reset();
      });
    }
  }
}); 