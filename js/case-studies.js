document.addEventListener('DOMContentLoaded', function() {
    console.log('Case Studies JS loaded - Version: 2024120503');
    console.log('Location:', window.location.href);
    
    const grid = document.getElementById('case-studies-grid');
    const tagContainer = document.getElementById('tag-filter-container');
    let allCases = [];
    let filteredCases = [];
    let allTags = new Set();
    let currentPage = 1;
    const itemsPerPage = 12; // 1ページあたりの表示件数

    if (!grid) {
        console.error('Error: Target element for case studies not found.');
        return;
    }

    // URLパラメータからタグを取得
    const urlParams = new URLSearchParams(window.location.search);
    const selectedTag = urlParams.get('tag');

    fetch('data/case-studies.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(cases => {
            allCases = cases;
            
            // ★★★ 追加: 日付の降順（新しいものが先）にソート ★★★
            allCases.sort((a, b) => new Date(b.date) - new Date(a.date));
            // ★★★ ここまで ★★★

            if (cases.length === 0) {
                grid.innerHTML = '<p>現在、公開中のご支援事例はありません。</p>';
                return;
            }

            // 全てのタグを収集
            cases.forEach(study => {
                if (study.tags && Array.isArray(study.tags)) {
                    study.tags.forEach(tag => allTags.add(tag));
                }
            });

            // タグフィルターを作成
            createTagFilter();

            // 初期表示（選択されたタグがある場合はフィルター適用）
            if (selectedTag) {
                filterByTag(selectedTag);
                highlightSelectedTag(selectedTag);
            } else {
                filteredCases = [...allCases];
                displayCasesWithPagination();
            }
        })
        .catch(error => {
            console.error('Error fetching or parsing case studies:', error);
            grid.innerHTML = '<p>事例の読み込み中にエラーが発生しました。時間をおいて再度お試しください。</p>';
        });

    function createTagFilter() {
        if (!tagContainer) return;

        const sortedTags = Array.from(allTags).sort();
        
        let filterHTML = `
            <div class="tag-filter-section">
                <h3>カテゴリーで絞り込み</h3>
                <div class="tag-buttons">
                    <button class="tag-button active" data-tag="all">すべて</button>
        `;
        
        sortedTags.forEach(tag => {
            filterHTML += `<button class="tag-button" data-tag="${tag}">${tag}</button>`;
        });
        
        filterHTML += `
                </div>
            </div>
        `;
        
        tagContainer.innerHTML = filterHTML;

        // タグボタンのクリックイベント
        const tagButtons = tagContainer.querySelectorAll('.tag-button');
        tagButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tag = this.getAttribute('data-tag');
                
                // ボタンの状態を更新
                tagButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // URLを更新（ページリロードなし）
                const url = new URL(window.location);
                if (tag === 'all') {
                    url.searchParams.delete('tag');
                } else {
                    url.searchParams.set('tag', tag);
                }
                window.history.pushState({}, '', url);
                
                // フィルター実行
                currentPage = 1; // ページをリセット
                if (tag === 'all') {
                    filteredCases = [...allCases];
                } else {
                    filterByTag(tag);
                }
                displayCasesWithPagination();
            });
        });
    }

    function highlightSelectedTag(selectedTag) {
        if (!tagContainer) return;
        
        const tagButtons = tagContainer.querySelectorAll('.tag-button');
        tagButtons.forEach(button => {
            button.classList.remove('active');
            if (button.getAttribute('data-tag') === selectedTag) {
                button.classList.add('active');
            }
        });
    }

    function filterByTag(tag) {
        console.log('filterByTag called with tag:', tag);
        console.log('allCases.length:', allCases.length);
        
        filteredCases = allCases.filter(study => {
            const hasTag = study.tags && study.tags.includes(tag);
            if (hasTag) {
                console.log('Study matches tag:', study.title, 'tags:', study.tags);
            }
            return hasTag;
        });
        
        console.log('filteredCases after filtering:', filteredCases.length);
    }

    function displayCasesWithPagination() {
        console.log('displayCasesWithPagination called');
        console.log('filteredCases.length:', filteredCases.length);
        
        if (filteredCases.length === 0) {
            grid.innerHTML = '<p>該当する事例が見つかりませんでした。</p>';
            return;
        }

        const totalPages = Math.ceil(filteredCases.length / itemsPerPage);
        console.log('totalPages calculated:', totalPages);
        
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const casesToShow = filteredCases.slice(startIndex, endIndex);
        
        console.log('casesToShow.length:', casesToShow.length);

        displayCases(casesToShow);
        createPagination(totalPages);
    }

    function displayCases(cases) {
        let html = '';
        cases.forEach(study => {
            // タグを表示用HTML作成
            let tagsHTML = '';
            if (study.tags && Array.isArray(study.tags)) {
                tagsHTML = study.tags.slice(0, 3).map(tag => 
                    `<span class="case-tag" data-tag="${tag}">${tag}</span>`
                ).join('');
                if (study.tags.length > 3) {
                    tagsHTML += `<span class="case-tag-more">+${study.tags.length - 3}</span>`;
                }
            }

            html += `
            <a href="${study.url}" class="case-study-card" data-aos="fade-up">
                <div class="card-image-wrapper">
                    <img src="${study.thumbnail}" alt="${study.title}" loading="lazy" 
                         onerror="this.onerror=null; this.src='images/case-placeholder.svg'; this.style.backgroundColor='#f3f4f6'; this.style.objectFit='contain';">
                </div>
                <div class="card-content">
                    <div class="card-meta">
                        <span class="card-category">${study.industry}</span>
                        <time class="card-date">${study.date}</time>
                    </div>
                    <h3 class="card-title">${study.title}</h3>
                    <p class="card-summary">${study.summary}</p>
                    ${tagsHTML ? `<div class="card-tags">${tagsHTML}</div>` : ''}
                </div>
            </a>
            `;
        });
        grid.innerHTML = html;

        // タグクリックイベントを追加
        const caseTags = grid.querySelectorAll('.case-tag');
        caseTags.forEach(tag => {
            // マウスイベントとタッチイベントの両方に対応
            const handleTagClick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation(); // 他のイベントリスナーもブロック
                
                const tagName = this.getAttribute('data-tag');
                console.log('Card tag clicked:', tagName);
                
                // フィルターボタンの状態を更新
                if (tagContainer) {
                    const tagButtons = tagContainer.querySelectorAll('.tag-button');
                    tagButtons.forEach(btn => {
                        btn.classList.remove('active');
                        if (btn.getAttribute('data-tag') === tagName) {
                            btn.classList.add('active');
                        }
                    });
                }
                
                // URLを更新（ページリロードなし）
                const url = new URL(window.location);
                url.searchParams.set('tag', tagName);
                window.history.pushState({}, '', url);
                
                // フィルター実行（フィルターボタンと同じ処理）
                currentPage = 1; // ページをリセット
                filterByTag(tagName);
                displayCasesWithPagination();
                
                return false; // 確実にイベント伝播を停止
            };
            
            // クリックイベントとタッチイベントの両方を設定
            tag.addEventListener('click', handleTagClick, true); // キャプチャフェーズで実行
            tag.addEventListener('touchend', handleTagClick, true); // タッチ終了時も処理
        });
    }

    function createPagination(totalPages) {
        console.log('createPagination called with totalPages:', totalPages);
        console.log('filteredCases.length:', filteredCases.length);
        console.log('itemsPerPage:', itemsPerPage);
        console.log('currentPage:', currentPage);
        
        if (totalPages <= 1) {
            console.log('Pagination skipped: totalPages <= 1');
            return;
        }

        const paginationContainer = document.createElement('div');
        paginationContainer.className = 'pagination-container';
        paginationContainer.style.cssText = `
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 0.5rem;
            margin-top: 3rem;
            padding: 2rem 0;
        `;

        let paginationHTML = '';

        // 前へボタン
        if (currentPage > 1) {
            paginationHTML += `<button class="pagination-btn" data-page="${currentPage - 1}">前へ</button>`;
        }

        // ページ番号
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, currentPage + 2);

        if (startPage > 1) {
            paginationHTML += `<button class="pagination-btn" data-page="1">1</button>`;
            if (startPage > 2) {
                paginationHTML += `<span class="pagination-ellipsis">...</span>`;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            const activeClass = i === currentPage ? 'active' : '';
            paginationHTML += `<button class="pagination-btn ${activeClass}" data-page="${i}">${i}</button>`;
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHTML += `<span class="pagination-ellipsis">...</span>`;
            }
            paginationHTML += `<button class="pagination-btn" data-page="${totalPages}">${totalPages}</button>`;
        }

        // 次へボタン
        if (currentPage < totalPages) {
            paginationHTML += `<button class="pagination-btn" data-page="${currentPage + 1}">次へ</button>`;
        }

        paginationContainer.innerHTML = paginationHTML;

        // 既存のページネーションを削除
        const existingPagination = document.querySelector('.pagination-container');
        if (existingPagination) {
            existingPagination.remove();
        }

        // 新しいページネーションを追加
        console.log('Adding pagination to:', grid.parentNode);
        grid.parentNode.appendChild(paginationContainer);
        console.log('Pagination HTML:', paginationHTML);

        // ページネーションのクリックイベント
        const paginationBtns = paginationContainer.querySelectorAll('.pagination-btn');
        paginationBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const page = parseInt(this.getAttribute('data-page'));
                currentPage = page;
                displayCasesWithPagination();
                
                // ページトップにスクロール
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });
    }
}); 