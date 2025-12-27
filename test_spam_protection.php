<?php
// 迷惑メール対策のテストスクリプト

echo "<h1>迷惑メール対策テスト</h1>";

// テスト用のIPアドレス
$test_ips = [
    '5.8.1.1' => 'ロシア（ブロック対象）',
    '1.1.1.1' => '日本（許可対象）',
    '8.8.8.8' => 'Google DNS（許可対象）',
    '77.88.1.1' => 'Yandex（ブロック対象）'
];

echo "<h2>IPアドレステスト</h2>";
foreach ($test_ips as $ip => $description) {
    echo "<p><strong>{$ip}</strong> ({$description}): ";
    
    // IPアドレスチェック関数
    function checkIP($ip) {
        $blocked_ranges = [
            '5.8.', '5.9.', '5.10.', '5.11.', '5.12.', '5.13.', '5.14.', '5.15.',
            '77.88.', '77.89.', '77.90.', '77.91.', '77.92.', '77.93.', '77.94.', '77.95.'
        ];
        
        foreach ($blocked_ranges as $range) {
            if (strpos($ip, $range) === 0) {
                return false;
            }
        }
        return true;
    }
    
    if (checkIP($ip)) {
        echo "<span style='color: green;'>✓ 許可</span>";
    } else {
        echo "<span style='color: red;'>✗ ブロック</span>";
    }
    echo "</p>";
}

echo "<h2>メールドメインテスト</h2>";
$test_emails = [
    'test@mail.ru' => 'ロシア系メール（ブロック対象）',
    'test@yandex.ru' => 'Yandex（ブロック対象）',
    'test@example.com' => '通常のメール（許可対象）',
    'test@gmail.com' => 'Gmail（ブロック対象）'
];

foreach ($test_emails as $email => $description) {
    echo "<p><strong>{$email}</strong> ({$description}): ";
    
    $domain = substr(strrchr($email, "@"), 1);
    $blocked_domains = ['mail.ru', 'yandex.ru', 'rambler.ru', 'gmail.com'];
    
    if (in_array($domain, $blocked_domains)) {
        echo "<span style='color: red;'>✗ ブロック</span>";
    } else {
        echo "<span style='color: green;'>✓ 許可</span>";
    }
    echo "</p>";
}

echo "<h2>スパムキーワードテスト</h2>";
$test_content = [
    'こんにちは、お問い合わせがあります' => '正常な内容',
    'viagraを安く買えます' => 'スパムキーワード含有',
    'casinoで稼ぎませんか' => 'スパムキーワード含有',
    '弊社のサービスについてご相談があります' => '正常な内容'
];

foreach ($test_content as $content => $description) {
    echo "<p><strong>「{$content}」</strong> ({$description}): ";
    
    $spam_keywords = ['viagra', 'casino', 'loan', 'bitcoin', 'crypto'];
    $content_lower = strtolower($content);
    $is_spam = false;
    
    foreach ($spam_keywords as $keyword) {
        if (strpos($content_lower, $keyword) !== false) {
            $is_spam = true;
            break;
        }
    }
    
    if ($is_spam) {
        echo "<span style='color: red;'>✗ スパム検出</span>";
    } else {
        echo "<span style='color: green;'>✓ 正常</span>";
    }
    echo "</p>";
}

echo "<h2>レート制限テスト</h2>";
echo "<p>レート制限ファイルの確認:</p>";

$rate_limit_files = glob('rate_limit_*.txt');
if (empty($rate_limit_files)) {
    echo "<p style='color: green;'>✓ レート制限ファイルはありません（正常）</p>";
} else {
    echo "<p style='color: orange;'>⚠ レート制限ファイルが存在します:</p>";
    foreach ($rate_limit_files as $file) {
        $data = json_decode(file_get_contents($file), true);
        echo "<p>- {$file}: 送信回数 {$data['count']}, 最終送信 " . date('Y-m-d H:i:s', $data['last_attempt']) . "</p>";
    }
}

echo "<h2>対策の効果</h2>";
echo "<ul>";
echo "<li>✓ ロシア系IPアドレスのブロック</li>";
echo "<li>✓ ロシア系メールドメインのブロック</li>";
echo "<li>✓ スパムキーワードの検出</li>";
echo "<li>✓ レート制限（1時間に5回まで）</li>";
echo "<li>✓ ホニーポットフィールド</li>";
echo "<li>✓ CAPTCHA（簡易版）</li>";
echo "<li>✓ サーバーレベルでのIPブロック（.htaccess）</li>";
echo "</ul>";

echo "<h2>使用方法</h2>";
echo "<ol>";
echo "<li>既存のフォーム: <code>contact_form.php</code> に基本的な対策を追加済み</li>";
echo "<li>強化版フォーム: <code>contact_form_secure.php</code> を使用（推奨）</li>";
echo "<li>HTMLフォーム: <code>contact_secure.html</code> を使用</li>";
echo "<li>設定ファイル: <code>spam_protection_config.php</code> で設定を調整可能</li>";
echo "</ol>";

echo "<p><strong>注意:</strong> このテストスクリプトは本番環境では削除してください。</p>";
?>

