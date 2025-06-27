document.addEventListener('DOMContentLoaded', function() {
    console.log('Simple case studies script loaded');
    
    const grid = document.getElementById('case-studies-grid');
    console.log('Grid element found:', !!grid);
    
    if (!grid) {
        console.error('Grid element not found!');
        return;
    }
    
    // テスト用の固定データ
    const testCases = [
        {
            id: 'test-001',
            title: 'テストケース1：サンプル事例',
            summary: 'これはテスト用の事例です。JavaScriptが正常に動作しているかを確認するためのサンプルデータです。',
            industry: 'テスト業界',
            date: '2024-01-01',
            tags: ['テスト', 'サンプル'],
            thumbnail: 'images/case-placeholder.svg'
        },
        {
            id: 'test-002',
            title: 'テストケース2：グリッド表示確認',
            summary: '2番目のテストケースです。グリッドレイアウトが正しく3列で表示されるかを確認します。',
            industry: 'サンプル業界',
            date: '2024-01-02',
            tags: ['グリッド', 'レイアウト'],
            thumbnail: 'images/case-placeholder.svg'
        },
        {
            id: 'test-003',
            title: 'テストケース3：レスポンシブ対応',
            summary: '3番目のテストケースです。モバイル表示で1列になるかを確認します。',
            industry: 'モバイル業界',
            date: '2024-01-03',
            tags: ['レスポンシブ', 'モバイル'],
            thumbnail: 'images/case-placeholder.svg'
        }
    ];
    
    console.log('Test cases:', testCases);
    
    // HTMLを生成
    let html = '';
    testCases.forEach(study => {
        html += `
        <a href="${study.id}.html" class="case-study-card">
            <div class="card-image-wrapper">
                <img src="${study.thumbnail}" alt="${study.title}">
            </div>
            <div class="card-content">
                <div class="card-meta">
                    <span class="card-category">${study.industry}</span>
                    <time class="card-date">${study.date}</time>
                </div>
                <h3 class="card-title">${study.title}</h3>
                <p class="card-summary">${study.summary}</p>
            </div>
        </a>
        `;
    });
    
    console.log('Generated HTML length:', html.length);
    grid.innerHTML = html;
    console.log('HTML inserted into grid');
    
    // 生成されたカードを確認
    const cards = grid.querySelectorAll('.case-study-card');
    console.log('Cards in grid:', cards.length);
    
    cards.forEach((card, index) => {
        console.log(`Card ${index + 1}:`, card);
    });
}); 