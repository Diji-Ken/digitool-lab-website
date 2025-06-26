/**
 * 記事管理ツール
 * article_management.jsonを活用した記事と画像の管理システム
 */

class ArticleManager {
    constructor() {
        this.articlesData = null;
        this.loadArticlesData();
    }

    /**
     * 記事データを読み込む
     */
    async loadArticlesData() {
        try {
            const response = await fetch('../data/article_management.json');
            this.articlesData = await response.json();
            console.log('記事データが正常に読み込まれました');
        } catch (error) {
            console.error('記事データの読み込みに失敗しました:', error);
        }
    }

    /**
     * 記事番号から記事情報を取得
     */
    getArticleByNumber(number) {
        if (!this.articlesData) {
            console.error('記事データが読み込まれていません');
            return null;
        }

        const paddedNumber = String(number).padStart(3, '0');
        return this.articlesData.articles.find(article => article.number === paddedNumber);
    }

    /**
     * 記事番号から画像ファイル名を生成
     */
    generateImageFileName(number, imageType) {
        const article = this.getArticleByNumber(number);
        if (!article) {
            console.error(`記事番号 ${number} が見つかりません`);
            return null;
        }

        const template = this.articlesData.image_naming_convention[imageType];
        if (!template) {
            console.error(`画像タイプ ${imageType} が見つかりません`);
            return null;
        }

        return template.replace('{image_prefix}', article.image_prefix);
    }

    /**
     * 記事の完全な画像セットを生成
     */
    generateAllImageNames(number) {
        const article = this.getArticleByNumber(number);
        if (!article) return null;

        const imageNames = {};
        for (const [imageType, template] of Object.entries(this.articlesData.image_naming_convention)) {
            imageNames[imageType] = template.replace('{image_prefix}', article.image_prefix);
        }

        return {
            article: article,
            images: imageNames
        };
    }

    /**
     * カテゴリ別記事一覧を取得
     */
    getArticlesByCategory(category) {
        if (!this.articlesData) return [];
        
        return this.articlesData.articles.filter(article => article.category === category);
    }

    /**
     * 記事一覧をHTMLテーブルとして生成
     */
    generateArticleTable() {
        if (!this.articlesData) return '';

        let html = `
        <table class="article-management-table">
            <thead>
                <tr>
                    <th>番号</th>
                    <th>タイトル</th>
                    <th>カテゴリ</th>
                    <th>ファイル名</th>
                    <th>画像プレフィックス</th>
                    <th>作成日</th>
                    <th>ステータス</th>
                </tr>
            </thead>
            <tbody>
        `;

        this.articlesData.articles.forEach(article => {
            html += `
                <tr>
                    <td>${article.number}</td>
                    <td>${article.title}</td>
                    <td><span class="category-tag" style="background-color: ${this.articlesData.categories[article.category]?.color || '#666'}">${article.category}</span></td>
                    <td><a href="../${article.filename}" target="_blank">${article.filename}</a></td>
                    <td><code>${article.image_prefix}</code></td>
                    <td>${article.created_date}</td>
                    <td><span class="status-${article.status}">${article.status}</span></td>
                </tr>
            `;
        });

        html += `
            </tbody>
        </table>
        `;

        return html;
    }

    /**
     * 画像ファイル名のチェックリストを生成
     */
    generateImageChecklist(number) {
        const result = this.generateAllImageNames(number);
        if (!result) return '';

        let html = `
        <div class="image-checklist">
            <h3>記事 ${result.article.number}: ${result.article.title}</h3>
            <p>必要な画像ファイル:</p>
            <ul>
        `;

        for (const [imageType, fileName] of Object.entries(result.images)) {
            html += `<li><input type="checkbox" id="${imageType}_${number}"> <label for="${imageType}_${number}"><code>${fileName}</code> (${imageType})</label></li>`;
        }

        html += `
            </ul>
            <p>画像保存先: <code>images/case-studies/</code></p>
        </div>
        `;

        return html;
    }

    /**
     * 次の記事番号を取得
     */
    getNextArticleNumber() {
        if (!this.articlesData) return '001';
        return this.articlesData.meta_info.next_article_number;
    }

    /**
     * 新しい記事のテンプレートを生成
     */
    generateNewArticleTemplate(title, category) {
        const nextNumber = this.getNextArticleNumber();
        const today = new Date().toISOString().split('T')[0];

        return {
            number: nextNumber,
            title: title,
            category: category,
            filename: `case-${nextNumber}.html`,
            image_prefix: `case-${nextNumber}`,
            description: "", // 後で入力
            created_date: today,
            status: "draft"
        };
    }

    /**
     * 記事データをJSON形式でエクスポート
     */
    exportArticleData() {
        if (!this.articlesData) return null;
        
        return JSON.stringify(this.articlesData, null, 2);
    }
}

// 使用例とヘルパー関数
const articleManager = new ArticleManager();

/**
 * 記事番号から画像ファイル名を簡単に取得する関数
 */
function getImageName(articleNumber, imageType) {
    return articleManager.generateImageFileName(articleNumber, imageType);
}

/**
 * 記事の全画像を取得する関数
 */
function getAllImages(articleNumber) {
    return articleManager.generateAllImageNames(articleNumber);
}

// グローバルに公開
window.ArticleManager = ArticleManager;
window.articleManager = articleManager;
window.getImageName = getImageName;
window.getAllImages = getAllImages;

console.log('記事管理ツールが読み込まれました');
console.log('使用例:');
console.log('- getImageName(1, "hero_image") // "case-001-hero.jpg"');
console.log('- getAllImages(1) // 記事1の全画像ファイル名');
console.log('- articleManager.getArticleByNumber(1) // 記事1の詳細情報'); 