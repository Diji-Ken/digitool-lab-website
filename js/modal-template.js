// 共通のダウンロードモーダルテンプレート
const DOWNLOAD_MODAL_HTML = `
<div id="download-modal" class="modal-overlay" style="display: none;">
  <div class="modal-content">
    <button id="close-modal" class="modal-close">&times;</button>
    <h3>サービス詳細資料のダウンロード</h3>
    <p>以下の項目をご入力いただくと、サービス詳細資料をダウンロードできます。</p>
    <form id="download-form" action="send_lead.php" method="POST">
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
}); 