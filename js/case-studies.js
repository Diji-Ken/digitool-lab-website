document.addEventListener('DOMContentLoaded', function() {
    const state = {
        allCases: [],
        filteredCases: [],
        activeCategory: 'all',
        activeIndustry: 'all',
        activeKeyword: '',
        currentPage: 1,
        itemsPerPageDesktop: 12,
        itemsPerPageMobile: 10,
    };

    const selectors = {
        grid: '#case-studies-grid',
        noResults: '#no-results-message',
        keywordInput: '#keyword-search',
        searchButton: '#search-button',
        desktopTabs: '#desktop-filter-tabs .filter-tab',
        categoryGroup: '#filter-group-category',
        industryGroup: '#filter-group-industry',
        categoryTagsContainer: '#category-tags',
        industryTagsContainer: '#industry-tags',
        mobileCategoryDropdown: '#mobile-category-filter',
        mobileIndustryDropdown: '#mobile-industry-filter',
        activeFiltersContainer: '#active-filters-container',
        activeFiltersList: '#active-filters-list',
        clearFiltersButton: '#clear-filters-button',
        filterSection: '.filter-section', // Added selector
    };

    const elements = {};
    for (const key in selectors) {
        elements[key] = document.querySelectorAll(selectors[key]).length > 1 
            ? document.querySelectorAll(selectors[key]) 
            : document.querySelector(selectors[key]);
    }

    let isScrolling;

    function init() {
        if (!elements.grid) {
            console.error('Case studies grid not found.');
            return;
        }
        fetchData();
        addEventListeners();
    }

    function fetchData() {
        fetch('data/case-studies.json')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok.');
                return response.json();
            })
            .then(data => {
                state.allCases = data.sort((a, b) => new Date(b.date) - new Date(a.date));
                state.filteredCases = [...state.allCases];
                populateFilters();
                render();
            })
            .catch(error => {
                console.error('Error fetching case studies:', error);
                if (elements.grid) {
                    elements.grid.innerHTML = '<p>事例の読み込み中にエラーが発生しました。</p>';
                }
            });
    }

    function populateFilters() {
        const categories = new Set();
        const industries = new Set();

        state.allCases.forEach(c => {
            c.tags.forEach(tag => categories.add(tag));
            industries.add(c.industry);
        });

        const sortedCategories = [...categories].sort();
        const sortedIndustries = [...industries].sort();

        populateTags(elements.categoryTagsContainer, sortedCategories, 'category');
        populateTags(elements.industryTagsContainer, sortedIndustries, 'industry');
        
        populateDropdown(elements.mobileCategoryDropdown, sortedCategories, '課題');
        populateDropdown(elements.mobileIndustryDropdown, sortedIndustries, '業界');
    }

    function populateTags(container, items, type) {
        let html = `<button class="filter-tag active" data-type="${type}" data-value="all">すべて</button>`;
        items.forEach(item => {
            html += `<button class="filter-tag" data-type="${type}" data-value="${item}">${item}</button>`;
        });
        container.innerHTML = html;
    }
    
    function populateDropdown(selectElement, items, label) {
        let html = `<option value="all">すべての${label}</option>`;
        items.forEach(item => {
            html += `<option value="${item}">${item}</option>`;
        });
        selectElement.innerHTML = html;
    }

    function addEventListeners() {
        // Keyword Search
        elements.searchButton.addEventListener('click', handleSearch);
        elements.keywordInput.addEventListener('keyup', e => {
            if (e.key === 'Enter') handleSearch();
        });

        // Desktop Tabs
        elements.desktopTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const group = tab.dataset.filterGroup;
                
                elements.desktopTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                elements.categoryGroup.classList.toggle('active', group === 'category');
                elements.industryGroup.classList.toggle('active', group === 'industry');
            });
        });
        
        // Filter Tags (Event Delegation)
        elements.categoryTagsContainer.addEventListener('click', handleTagClick);
        elements.industryTagsContainer.addEventListener('click', handleTagClick);

        // Mobile Dropdowns
        elements.mobileCategoryDropdown.addEventListener('change', handleDropdownChange);
        elements.mobileIndustryDropdown.addEventListener('change', handleDropdownChange);
        
        // Clear Filters
        elements.clearFiltersButton.addEventListener('click', clearAllFilters);
        elements.activeFiltersList.addEventListener('click', handleRemoveActiveFilter);

        // Scroll listener for mini-header
        window.addEventListener('scroll', () => {
            if (!isScrolling) {
                window.requestAnimationFrame(() => {
                    handleScroll();
                    isScrolling = false;
                });
                isScrolling = true;
            }
        });
    }

    function handleScroll() {
        if (window.scrollY > 150) {
            elements.filterSection.classList.add('mini-header');
        } else {
            elements.filterSection.classList.remove('mini-header');
        }
    }

    function handleTagClick(e) {
        const target = e.target;
        if (!target.classList.contains('filter-tag')) return;

        const { type, value } = target.dataset;

        if (type === 'category') {
            state.activeCategory = value;
        } else if (type === 'industry') {
            state.activeIndustry = value;
        }

        // Update active class on tags within the same group
        const container = type === 'category' ? elements.categoryTagsContainer : elements.industryTagsContainer;
        container.querySelectorAll('.filter-tag').forEach(tag => tag.classList.remove('active'));
        target.classList.add('active');

        // Sync mobile dropdown
        const dropdown = type === 'category' ? elements.mobileCategoryDropdown : elements.mobileIndustryDropdown;
        dropdown.value = value;
        
        applyFilters();
    }

    function handleDropdownChange(e) {
        const select = e.target;
        const value = select.value;
        const type = select.id.includes('category') ? 'category' : 'industry';

        if (type === 'category') {
            state.activeCategory = value;
        } else {
            state.activeIndustry = value;
        }

        // Sync desktop tags
        const container = type === 'category' ? elements.categoryTagsContainer : elements.industryTagsContainer;
        container.querySelectorAll('.filter-tag').forEach(tag => {
            tag.classList.toggle('active', tag.dataset.value === value);
        });
        
        applyFilters();
    }

    function handleSearch() {
        state.activeKeyword = elements.keywordInput.value.trim().toLowerCase();
        applyFilters();
    }
    
    function handleRemoveActiveFilter(e) {
        const target = e.target.closest('.remove-filter-button');
        if (!target) return;
        
        const { type } = target.dataset;
        if (type === 'keyword') {
            elements.keywordInput.value = '';
            state.activeKeyword = '';
        } else if (type === 'category') {
            state.activeCategory = 'all';
            elements.mobileCategoryDropdown.value = 'all';
            elements.categoryTagsContainer.querySelectorAll('.filter-tag').forEach(t => t.classList.toggle('active', t.dataset.value === 'all'));
        } else if (type === 'industry') {
            state.activeIndustry = 'all';
            elements.mobileIndustryDropdown.value = 'all';
            elements.industryTagsContainer.querySelectorAll('.filter-tag').forEach(t => t.classList.toggle('active', t.dataset.value === 'all'));
        }
        applyFilters();
    }

    function clearAllFilters() {
        elements.keywordInput.value = '';
        state.activeKeyword = '';
        
        state.activeCategory = 'all';
        elements.mobileCategoryDropdown.value = 'all';
        elements.categoryTagsContainer.querySelectorAll('.filter-tag').forEach(t => t.classList.toggle('active', t.dataset.value === 'all'));
        
        state.activeIndustry = 'all';
        elements.mobileIndustryDropdown.value = 'all';
        elements.industryTagsContainer.querySelectorAll('.filter-tag').forEach(t => t.classList.toggle('active', t.dataset.value === 'all'));

        applyFilters();
    }

    function applyFilters() {
        const { activeKeyword, activeCategory, activeIndustry } = state;

        state.filteredCases = state.allCases.filter(c => {
            const keywordMatch = !activeKeyword || 
                c.title.toLowerCase().includes(activeKeyword) ||
                c.summary.toLowerCase().includes(activeKeyword) ||
                c.tags.some(t => t.toLowerCase().includes(activeKeyword)) ||
                c.industry.toLowerCase().includes(activeKeyword);

            const categoryMatch = activeCategory === 'all' || c.tags.includes(activeCategory);
            const industryMatch = activeIndustry === 'all' || c.industry === activeIndustry;

            return keywordMatch && categoryMatch && industryMatch;
        });
        state.currentPage = 1; // フィルター変更時はページを1に戻す
        render();
    }

    function render() {
        renderCards();
        updateActiveFiltersDisplay();
    }

    function renderCards() {
        if (state.filteredCases.length === 0) {
            elements.grid.innerHTML = '';
            elements.noResults.style.display = 'block';
        } else {
            elements.noResults.style.display = 'none';
            
            // ページネーション計算
            const itemsPerPage = window.innerWidth <= 768 ? state.itemsPerPageMobile : state.itemsPerPageDesktop;
            const startIndex = (state.currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const paginatedCases = state.filteredCases.slice(startIndex, endIndex);
            
            // カードの描画
            elements.grid.innerHTML = paginatedCases.map(study => {
                if (!study) return ''; // ガード節を追加：データが存在しない場合は何も描画しない

                let tagsHTML = study.tags.slice(0, 3).map(tag => 
                    `<span class="case-tag">${tag}</span>`
                ).join('');
                if (study.tags.length > 3) {
                    tagsHTML += `<span class="case-tag-more">+${study.tags.length - 3}</span>`;
                }

                return `
                <a href="${study.url}" class="case-study-card" data-aos="fade-up">
                    <div class="card-image-wrapper">
                        <img src="${study.thumbnail}" alt="${study.title}" loading="lazy" 
                             onerror="this.onerror=null; this.src='images/case-placeholder.svg';">
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
            }).join('');
            
            // ページネーションの描画
            renderPagination();
        }
    }
    
    function renderPagination() {
        const itemsPerPage = window.innerWidth <= 768 ? state.itemsPerPageMobile : state.itemsPerPageDesktop;
        const totalPages = Math.ceil(state.filteredCases.length / itemsPerPage);
        
        if (totalPages <= 1) {
            // ページネーションコンテナがある場合は非表示にする
            const existingPagination = document.querySelector('.pagination-container');
            if (existingPagination) {
                existingPagination.remove();
            }
            return;
        }
        
        let paginationHTML = '<div class="pagination-container">';
        
        // 前へボタン
        paginationHTML += `<button class="pagination-btn" onclick="changePage(${state.currentPage - 1})" ${state.currentPage === 1 ? 'disabled' : ''}>前へ</button>`;
        
        // ページ番号
        const maxVisiblePages = window.innerWidth <= 768 ? 3 : 5;
        let startPage = Math.max(1, state.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        if (startPage > 1) {
            paginationHTML += `<button class="pagination-btn" onclick="changePage(1)">1</button>`;
            if (startPage > 2) {
                paginationHTML += '<span class="pagination-dots">...</span>';
            }
        }
        
        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `<button class="pagination-btn ${i === state.currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
        }
        
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHTML += '<span class="pagination-dots">...</span>';
            }
            paginationHTML += `<button class="pagination-btn" onclick="changePage(${totalPages})">${totalPages}</button>`;
        }
        
        // 次へボタン
        paginationHTML += `<button class="pagination-btn" onclick="changePage(${state.currentPage + 1})" ${state.currentPage === totalPages ? 'disabled' : ''}>次へ</button>`;
        
        paginationHTML += '</div>';
        
        // 既存のページネーションを削除してから新しいものを追加
        const existingPagination = document.querySelector('.pagination-container');
        if (existingPagination) {
            existingPagination.remove();
        }
        
        // コンテンツセクションの最後にページネーションを追加
        const contentSection = document.querySelector('.content-section .container');
        if (contentSection) {
            contentSection.insertAdjacentHTML('beforeend', paginationHTML);
        }
    }
    
    // グローバル関数として定義（onclick用）
    window.changePage = function(page) {
        const itemsPerPage = window.innerWidth <= 768 ? state.itemsPerPageMobile : state.itemsPerPageDesktop;
        const totalPages = Math.ceil(state.filteredCases.length / itemsPerPage);
        
        if (page >= 1 && page <= totalPages) {
            state.currentPage = page;
            renderCards();
            // ページ変更時は上部にスクロール
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    function updateActiveFiltersDisplay() {
        const { activeKeyword, activeCategory, activeIndustry } = state;
        elements.activeFiltersList.innerHTML = '';
        
        let hasActiveFilters = false;

        if (activeKeyword) {
            addActiveFilterTag(`キーワード: "${activeKeyword}"`, 'keyword');
            hasActiveFilters = true;
        }
        if (activeCategory !== 'all') {
            addActiveFilterTag(`課題: ${activeCategory}`, 'category');
            hasActiveFilters = true;
        }
        if (activeIndustry !== 'all') {
            addActiveFilterTag(`業界: ${activeIndustry}`, 'industry');
            hasActiveFilters = true;
        }

        elements.activeFiltersContainer.classList.toggle('show', hasActiveFilters);
    }
    
    function addActiveFilterTag(text, type) {
        const tag = document.createElement('div');
        tag.className = 'active-filter-tag';
        tag.innerHTML = `
            <span>${text}</span>
            <button class="remove-filter-button" data-type="${type}" aria-label="Remove filter">×</button>
        `;
        elements.activeFiltersList.appendChild(tag);
    }

    init();
}); 