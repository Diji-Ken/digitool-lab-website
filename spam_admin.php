<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>迷惑メール対策 - 管理画面</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            border-bottom: 3px solid #007bff;
            padding-bottom: 10px;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        .stat-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
        }
        .stat-card h3 {
            margin: 0 0 10px 0;
            font-size: 14px;
            opacity: 0.9;
        }
        .stat-card .number {
            font-size: 2.5em;
            font-weight: bold;
            margin: 10px 0;
        }
        .chart-container {
            margin: 30px 0;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 10px;
        }
        .country-list, .reason-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }
        .country-item, .reason-item {
            background: white;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #007bff;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .country-item .name, .reason-item .name {
            font-weight: bold;
            color: #333;
        }
        .country-item .count, .reason-item .count {
            color: #666;
            font-size: 0.9em;
        }
        .refresh-btn {
            background: #007bff;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
        }
        .refresh-btn:hover {
            background: #0056b3;
        }
        .alert {
            background: #d4edda;
            color: #155724;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
            border: 1px solid #c3e6cb;
        }
        .warning {
            background: #fff3cd;
            color: #856404;
            border-color: #ffeaa7;
        }
        .danger {
            background: #f8d7da;
            color: #721c24;
            border-color: #f5c6cb;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🛡️ 迷惑メール対策 - 管理画面</h1>
        
        <button class="refresh-btn" onclick="location.reload()">🔄 最新データを取得</button>
        
        <?php
        require_once 'enhanced_spam_protection.php';
        
        $logger = new SpamLogger();
        $stats = $logger->getSpamStats();
        
        // アラート表示
        if ($stats['recent'] > 10) {
            echo '<div class="alert danger">';
            echo '<strong>⚠️ 警告:</strong> 過去1時間で' . $stats['recent'] . '件のスパム送信が検出されました。';
            echo '</div>';
        } elseif ($stats['recent'] > 5) {
            echo '<div class="alert warning">';
            echo '<strong>⚠️ 注意:</strong> 過去1時間で' . $stats['recent'] . '件のスパム送信が検出されました。';
            echo '</div>';
        } else {
            echo '<div class="alert">';
            echo '<strong>✅ 良好:</strong> 過去1時間のスパム送信は' . $stats['recent'] . '件です。';
            echo '</div>';
        }
        ?>
        
        <div class="stats-grid">
            <div class="stat-card">
                <h3>総ブロック数</h3>
                <div class="number"><?php echo number_format($stats['total']); ?></div>
                <small>全期間</small>
            </div>
            <div class="stat-card">
                <h3>過去1時間</h3>
                <div class="number"><?php echo number_format($stats['recent']); ?></div>
                <small>ブロック数</small>
            </div>
            <div class="stat-card">
                <h3>ブロック国数</h3>
                <div class="number"><?php echo count($stats['countries']); ?></div>
                <small>異なる国</small>
            </div>
            <div class="stat-card">
                <h3>ブロック理由</h3>
                <div class="number"><?php echo count($stats['reasons']); ?></div>
                <small>異なる理由</small>
            </div>
        </div>
        
        <div class="chart-container">
            <h2>🌍 国別ブロック統計</h2>
            <div class="country-list">
                <?php
                arsort($stats['countries']);
                foreach ($stats['countries'] as $country => $count) {
                    echo '<div class="country-item">';
                    echo '<div class="name">' . htmlspecialchars($country) . '</div>';
                    echo '<div class="count">' . number_format($count) . ' 件</div>';
                    echo '</div>';
                }
                ?>
            </div>
        </div>
        
        <div class="chart-container">
            <h2>🚫 ブロック理由別統計</h2>
            <div class="reason-list">
                <?php
                arsort($stats['reasons']);
                foreach ($stats['reasons'] as $reason => $count) {
                    echo '<div class="reason-item">';
                    echo '<div class="name">' . htmlspecialchars($reason) . '</div>';
                    echo '<div class="count">' . number_format($count) . ' 件</div>';
                    echo '</div>';
                }
                ?>
            </div>
        </div>
        
        <div class="chart-container">
            <h2>📊 対策の効果</h2>
            <div style="background: white; padding: 20px; border-radius: 8px;">
                <h3>実装済み対策</h3>
                <ul>
                    <li>✅ IPアドレスブロック（ロシア系IP範囲）</li>
                    <li>✅ メールドメインブロック（mail.ru、yandex.ru等）</li>
                    <li>✅ レート制限（30分に2回まで）</li>
                    <li>✅ ホニーポットフィールド</li>
                    <li>✅ スパムキーワード検出</li>
                    <li>✅ User-Agentチェック</li>
                    <li>✅ Refererチェック</li>
                    <li>✅ サーバーレベルでのIPブロック（.htaccess）</li>
                </ul>
                
                <h3>推奨事項</h3>
                <ul>
                    <li>🔍 定期的なログの確認</li>
                    <li>📈 ブロック統計の監視</li>
                    <li>⚙️ 必要に応じた設定の調整</li>
                    <li>🔄 定期的な対策の見直し</li>
                </ul>
            </div>
        </div>
        
        <div class="chart-container">
            <h2>📝 最近のログ（最新10件）</h2>
            <div style="background: white; padding: 20px; border-radius: 8px;">
                <?php
                if (file_exists('spam_log.txt')) {
                    $lines = file('spam_log.txt', FILE_IGNORE_NEW_LINES);
                    $recent_lines = array_slice(array_reverse($lines), 0, 10);
                    
                    if (empty($recent_lines)) {
                        echo '<p>ログがありません。</p>';
                    } else {
                        echo '<table style="width: 100%; border-collapse: collapse;">';
                        echo '<tr style="background: #f8f9fa;">';
                        echo '<th style="padding: 10px; border: 1px solid #ddd;">日時</th>';
                        echo '<th style="padding: 10px; border: 1px solid #ddd;">IP</th>';
                        echo '<th style="padding: 10px; border: 1px solid #ddd;">国</th>';
                        echo '<th style="padding: 10px; border: 1px solid #ddd;">理由</th>';
                        echo '</tr>';
                        
                        foreach ($recent_lines as $line) {
                            $entry = json_decode($line, true);
                            if ($entry) {
                                echo '<tr>';
                                echo '<td style="padding: 8px; border: 1px solid #ddd;">' . htmlspecialchars($entry['timestamp']) . '</td>';
                                echo '<td style="padding: 8px; border: 1px solid #ddd;">' . htmlspecialchars($entry['ip']) . '</td>';
                                echo '<td style="padding: 8px; border: 1px solid #ddd;">' . htmlspecialchars($entry['country']) . '</td>';
                                echo '<td style="padding: 8px; border: 1px solid #ddd;">' . htmlspecialchars($entry['blocked_reason']) . '</td>';
                                echo '</tr>';
                            }
                        }
                        echo '</table>';
                    }
                } else {
                    echo '<p>ログファイルが存在しません。</p>';
                }
                ?>
            </div>
        </div>
    </div>
    
    <script>
        // 自動リフレッシュ（5分間隔）
        setTimeout(function() {
            location.reload();
        }, 300000);
    </script>
</body>
</html>
