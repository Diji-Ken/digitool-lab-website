<?php
// 日本語の文字化け対策
mb_language("Japanese");
mb_internal_encoding("UTF-8");

// 迷惑メール対策クラス
class SpamProtection {
    // ブロック対象の国コード（ロシアとその周辺国）
    private $blocked_countries = ['RU', 'BY', 'KZ', 'KG', 'TJ', 'UZ', 'AM', 'AZ', 'GE', 'MD', 'UA', 'CN'];

    // ブロック対象のメールドメイン（ロシア系）
    private $blocked_domains = ['mail.ru', 'yandex.ru', 'rambler.ru', 'inbox.ru', 'list.ru', 'bk.ru'];

    // スパムキーワード
    private $spam_keywords = ['viagra', 'casino', 'loan', 'bitcoin', 'crypto', 'investment', 'profit', 'lottery', 'winner', 'click here', 'free money', 'porn', 'sex', 'nude'];

    // レート制限ファイルのディレクトリ
    private $rate_limit_dir;

    public function __construct() {
        // レート制限ファイルの保存先（public_htmlの外、またはtmpディレクトリ）
        $this->rate_limit_dir = sys_get_temp_dir() . '/contact_rate_limit/';
        if (!file_exists($this->rate_limit_dir)) {
            @mkdir($this->rate_limit_dir, 0755, true);
        }
    }

    public function checkIP($ip) {
        $country = $this->getCountryFromIP($ip);
        if (in_array($country, $this->blocked_countries)) {
            error_log("[SpamProtection] Blocked country: {$country} from IP: {$ip}");
            return false;
        }
        return true;
    }

    public function checkEmail($email) {
        $domain = strtolower(substr(strrchr($email, "@"), 1));
        if (in_array($domain, $this->blocked_domains)) {
            error_log("[SpamProtection] Blocked email domain: {$domain}");
            return false;
        }
        return true;
    }

    public function checkContent($content) {
        $content_lower = strtolower($content);
        foreach ($this->spam_keywords as $keyword) {
            if (strpos($content_lower, $keyword) !== false) {
                error_log("[SpamProtection] Spam keyword detected: {$keyword}");
                return false;
            }
        }
        return true;
    }

    public function checkRateLimit($ip) {
        $file = $this->rate_limit_dir . 'rate_' . md5($ip) . '.json';
        $current_time = time();
        $limit_time = 3600; // 1時間
        $max_attempts = 5; // 最大5回（正当なユーザーを考慮して少し緩く）

        if (file_exists($file)) {
            $data = json_decode(file_get_contents($file), true);
            if ($data && isset($data['count']) && isset($data['last_attempt'])) {
                // 制限時間が過ぎていたらリセット
                if (($current_time - $data['last_attempt']) >= $limit_time) {
                    $data = ['count' => 0, 'last_attempt' => $current_time];
                }
                // 上限に達している場合
                if ($data['count'] >= $max_attempts && ($current_time - $data['last_attempt']) < $limit_time) {
                    error_log("[SpamProtection] Rate limit exceeded for IP: {$ip}");
                    return false;
                }
            } else {
                $data = ['count' => 0, 'last_attempt' => $current_time];
            }
        } else {
            $data = ['count' => 0, 'last_attempt' => $current_time];
        }

        $data['count']++;
        $data['last_attempt'] = $current_time;
        @file_put_contents($file, json_encode($data));

        return true;
    }

    public function checkHoneypot($value) {
        if (!empty($value)) {
            error_log("[SpamProtection] Honeypot triggered");
            return false;
        }
        return true;
    }

    private function getCountryFromIP($ip) {
        // IPアドレスから国コードを取得（外部API使用）
        $url = "http://ip-api.com/json/{$ip}?fields=countryCode";
        $context = stream_context_create([
            'http' => [
                'timeout' => 3, // 3秒でタイムアウト
                'ignore_errors' => true
            ]
        ]);
        $response = @file_get_contents($url, false, $context);
        if ($response) {
            $data = json_decode($response, true);
            if (isset($data['countryCode'])) {
                return $data['countryCode'];
            }
        }
        return 'JP'; // API失敗時は日本と仮定（ブロックしない）
    }
}

// POSTデータを取得
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $spam_protection = new SpamProtection();

    // 基本情報
    $ip = $_SERVER['REMOTE_ADDR'];
    $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? '';

    // === スパム対策チェック ===

    // 1. ホニーポットチェック（隠しフィールド）
    if (!$spam_protection->checkHoneypot($_POST['website'] ?? '')) {
        // スパマーを騙すため、成功したように見せる
        header("Location: contact_success.html");
        exit;
    }

    // 2. レート制限チェック
    if (!$spam_protection->checkRateLimit($ip)) {
        $error_message = "短時間での送信回数が上限に達しました。しばらく時間をおいて再度お試しください。";
    }

    // 3. IPアドレス国別チェック
    if (!isset($error_message) && !$spam_protection->checkIP($ip)) {
        $error_message = "申し訳ございませんが、お客様の地域からのお問い合わせは現在受け付けておりません。";
    }

    // フォームデータの取得とサニタイズ
    $name = trim($_POST['name'] ?? '');
    $company = trim($_POST['company'] ?? '');
    $department = trim($_POST['department'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $phone = trim($_POST['phone'] ?? '');
    $employees = trim($_POST['employees'] ?? '');
    $inquiry_type = trim($_POST['inquiry_type'] ?? '');
    $budget = trim($_POST['budget'] ?? '');
    $contact_method = trim($_POST['contact_method'] ?? '');
    $message = trim($_POST['message'] ?? '');

    // 4. メールドメインチェック
    if (!isset($error_message) && !$spam_protection->checkEmail($email)) {
        $error_message = "ご入力いただいたメールアドレスのドメインからはお問い合わせを受け付けておりません。";
    }

    // 5. コンテンツスパムチェック
    $full_content = $name . ' ' . $company . ' ' . $department . ' ' . $message;
    if (!isset($error_message) && !$spam_protection->checkContent($full_content)) {
        // スパマーを騙すため、成功したように見せる
        header("Location: contact_success.html");
        exit;
    }

    // 6. 入力長チェック（異常に長い入力はスパムの可能性）
    if (!isset($error_message)) {
        if (strlen($name) > 100) {
            $errors[] = "お名前が長すぎます。";
        }
        if (strlen($company) > 200) {
            $errors[] = "会社名が長すぎます。";
        }
        if (strlen($message) > 5000) {
            $errors[] = "お問い合わせ内容が長すぎます（5000文字以内）。";
        }
    }

    // === 通常のバリデーション ===
    if (!isset($errors)) {
        $errors = [];
    }

    if (!isset($error_message)) {
        if (empty($name)) {
            $errors[] = "お名前を入力してください。";
        }

        if (empty($company)) {
            $errors[] = "会社名を入力してください。";
        }

        if (empty($email)) {
            $errors[] = "メールアドレスを入力してください。";
        } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors[] = "正しいメールアドレスを入力してください。";
        }

        if (empty($inquiry_type)) {
            $errors[] = "ご相談内容を選択してください。";
        }

        if (empty($message)) {
            $errors[] = "詳細・ご質問内容を入力してください。";
        }
    }

    if (empty($errors) && !isset($error_message)) {
        // お問い合わせ種別の表示名
        $inquiry_type_labels = [
            'dx-consulting' => 'DX伴走サポートについて',
            'ai-training' => 'AI研修について',
            'development' => '開発・デジタル支援について',
            'general' => 'サービス全般について',
            'partnership' => 'パートナーシップについて',
            'media' => 'メディア取材・講演依頼',
            'other' => 'その他'
        ];
        $inquiry_type_label = $inquiry_type_labels[$inquiry_type] ?? $inquiry_type;

        // 予算の表示名
        $budget_labels = [
            'under-50' => '50万円未満',
            '50-100' => '50〜100万円',
            '100-300' => '100〜300万円',
            '300-500' => '300〜500万円',
            '500-1000' => '500〜1,000万円',
            '1000+' => '1,000万円以上',
            'undecided' => '未定・相談したい'
        ];
        $budget_label = $budget_labels[$budget] ?? ($budget ?: '未選択');

        // 連絡方法の表示名
        $contact_method_labels = [
            'email' => 'メール',
            'phone' => '電話',
            'online' => 'オンライン会議',
            'visit' => '訪問'
        ];
        $contact_method_label = $contact_method_labels[$contact_method] ?? ($contact_method ?: '未選択');

        // 管理者へのメール送信
        $to_admin = "contact@digitool-lab.com";
        $subject_admin = "【お問い合わせ】" . $inquiry_type_label . " - " . $company;

        $body_admin = "お問い合わせフォームから新しいメッセージが届きました。\n\n";
        $body_admin .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
        $body_admin .= "【送信者情報】\n";
        $body_admin .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
        $body_admin .= "お名前: " . $name . "\n";
        $body_admin .= "会社名: " . $company . "\n";
        $body_admin .= "部署・役職: " . ($department ?: "未入力") . "\n";
        $body_admin .= "メールアドレス: " . $email . "\n";
        $body_admin .= "電話番号: " . ($phone ?: "未入力") . "\n";
        $body_admin .= "従業員数: " . ($employees ?: "未選択") . "\n";
        $body_admin .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
        $body_admin .= "【ご相談内容】\n";
        $body_admin .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
        $body_admin .= "お問い合わせ種別: " . $inquiry_type_label . "\n";
        $body_admin .= "ご予算感: " . $budget_label . "\n";
        $body_admin .= "希望連絡方法: " . $contact_method_label . "\n";
        $body_admin .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
        $body_admin .= "【詳細・ご質問内容】\n";
        $body_admin .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
        $body_admin .= $message . "\n";
        $body_admin .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
        $body_admin .= "【システム情報】\n";
        $body_admin .= "送信日時: " . date('Y年m月d日 H:i:s') . "\n";
        $body_admin .= "送信者IP: " . $ip . "\n";
        $body_admin .= "User-Agent: " . $user_agent . "\n";

        $headers_admin = "From: noreply@digitool-lab.com\r\n";
        $headers_admin .= "Reply-To: " . $email . "\r\n";
        $headers_admin .= "Content-Type: text/plain; charset=UTF-8\r\n";

        // お客様への受領メール送信
        $to_customer = $email;
        $subject_customer = "お問い合わせありがとうございます - 株式会社デジタルツール研究所";

        $body_customer = $name . " 様\n\n";
        $body_customer .= "この度は、株式会社デジタルツール研究所にお問い合わせいただき、誠にありがとうございます。\n\n";
        $body_customer .= "以下の内容でお問い合わせを承りました。\n";
        $body_customer .= "内容を確認の上、1営業日以内にご返信させていただきます。\n\n";
        $body_customer .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
        $body_customer .= "【お問い合わせ内容】\n";
        $body_customer .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
        $body_customer .= "お名前: " . $name . "\n";
        $body_customer .= "会社名: " . $company . "\n";
        $body_customer .= "メールアドレス: " . $email . "\n";
        $body_customer .= "お問い合わせ種別: " . $inquiry_type_label . "\n";
        $body_customer .= "詳細:\n" . $message . "\n";
        $body_customer .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
        $body_customer .= "もしお急ぎの場合は、以下の方法でもご連絡いただけます：\n";
        $body_customer .= "・無料オンライン相談：https://timerex.net/s/digi-ken/07b69f6b\n";
        $body_customer .= "・LINEでのご相談も承っております\n\n";
        $body_customer .= "今後とも株式会社デジタルツール研究所をよろしくお願いいたします。\n\n";
        $body_customer .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
        $body_customer .= "株式会社デジタルツール研究所\n";
        $body_customer .= "〒110-0004\n";
        $body_customer .= "東京都台東区下谷2丁目23番8号 リベール上野4F\n";
        $body_customer .= "E-mail: contact@digitool-lab.com\n";
        $body_customer .= "Website: https://digitool-lab.com/\n";
        $body_customer .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";

        $headers_customer = "From: contact@digitool-lab.com\r\n";
        $headers_customer .= "Reply-To: contact@digitool-lab.com\r\n";
        $headers_customer .= "Content-Type: text/plain; charset=UTF-8\r\n";

        // メール送信実行
        $admin_sent = mail($to_admin, $subject_admin, $body_admin, $headers_admin);
        $customer_sent = mail($to_customer, $subject_customer, $body_customer, $headers_customer);

        if ($admin_sent && $customer_sent) {
            // 成功ページにリダイレクト
            header("Location: contact_success.html");
            exit();
        } else {
            $error_message = "メールの送信に失敗しました。しばらく時間をおいて再度お試しください。";
        }
    }
}
?>

<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>お問い合わせエラー - 株式会社デジタルツール研究所</title>
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <div class="container" style="max-width: 600px; margin: 50px auto; padding: 20px;">
    <h1>エラーが発生しました</h1>

    <?php if (!empty($errors)): ?>
      <div style="background-color: #fee; border: 1px solid #fcc; padding: 15px; margin: 20px 0; border-radius: 5px;">
        <h3>入力エラー</h3>
        <ul>
          <?php foreach ($errors as $error): ?>
            <li><?php echo htmlspecialchars($error); ?></li>
          <?php endforeach; ?>
        </ul>
      </div>
    <?php endif; ?>

    <?php if (isset($error_message)): ?>
      <div style="background-color: #fee; border: 1px solid #fcc; padding: 15px; margin: 20px 0; border-radius: 5px;">
        <p><?php echo htmlspecialchars($error_message); ?></p>
      </div>
    <?php endif; ?>

    <p><a href="contact.html" class="btn btn-primary">お問い合わせフォームに戻る</a></p>
  </div>
</body>
</html>
