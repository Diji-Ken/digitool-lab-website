<?php
// 日本語の文字化け対策
mb_language("Japanese");
mb_internal_encoding("UTF-8");

// セッション開始
session_start();

// 迷惑メール対策クラス
class SpamProtection {
    private $blocked_countries = ['RU', 'BY', 'KZ', 'KG', 'TJ', 'UZ', 'AM', 'AZ', 'GE', 'MD']; // ロシアとその周辺国
    private $blocked_domains = ['mail.ru', 'yandex.ru', 'rambler.ru', 'gmail.com']; // ロシア系メールドメイン
    private $spam_keywords = ['viagra', 'casino', 'loan', 'bitcoin', 'crypto', 'investment', 'profit'];
    
    public function checkIP($ip) {
        // IPアドレスから国を取得
        $country = $this->getCountryFromIP($ip);
        if (in_array($country, $this->blocked_countries)) {
            return false;
        }
        return true;
    }
    
    public function checkEmail($email) {
        $domain = substr(strrchr($email, "@"), 1);
        return !in_array($domain, $this->blocked_domains);
    }
    
    public function checkContent($content) {
        $content_lower = strtolower($content);
        foreach ($this->spam_keywords as $keyword) {
            if (strpos($content_lower, $keyword) !== false) {
                return false;
            }
        }
        return true;
    }
    
    public function checkRateLimit($ip) {
        $file = 'rate_limit_' . md5($ip) . '.txt';
        $current_time = time();
        $limit_time = 3600; // 1時間
        $max_attempts = 3; // 最大3回
        
        if (file_exists($file)) {
            $data = json_decode(file_get_contents($file), true);
            if ($data['count'] >= $max_attempts && ($current_time - $data['last_attempt']) < $limit_time) {
                return false;
            }
            if (($current_time - $data['last_attempt']) >= $limit_time) {
                $data = ['count' => 0, 'last_attempt' => $current_time];
            }
        } else {
            $data = ['count' => 0, 'last_attempt' => $current_time];
        }
        
        $data['count']++;
        $data['last_attempt'] = $current_time;
        file_put_contents($file, json_encode($data));
        
        return $data['count'] <= $max_attempts;
    }
    
    private function getCountryFromIP($ip) {
        // 簡易的な国コード取得（実際の実装では外部APIを使用）
        $geoip_data = @file_get_contents("http://ip-api.com/json/{$ip}");
        if ($geoip_data) {
            $data = json_decode($geoip_data, true);
            return $data['countryCode'] ?? 'US';
        }
        return 'US'; // デフォルト
    }
}

// POSTデータを取得
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $spam_protection = new SpamProtection();
    
    // 基本的なセキュリティチェック
    $ip = $_SERVER['REMOTE_ADDR'];
    $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? '';
    
    // 1. IPアドレスチェック
    if (!$spam_protection->checkIP($ip)) {
        error_log("Blocked submission from blocked country: {$ip}");
        header("Location: contact.html?status=blocked");
        exit;
    }
    
    // 2. レート制限チェック
    if (!$spam_protection->checkRateLimit($ip)) {
        error_log("Rate limit exceeded for IP: {$ip}");
        header("Location: contact.html?status=rate_limit");
        exit;
    }
    
    // 3. ホニーポットチェック（隠しフィールド）
    if (!empty($_POST['website'])) {
        error_log("Honeypot triggered for IP: {$ip}");
        header("Location: contact.html?status=success"); // 成功ページにリダイレクトしてスパマーを騙す
        exit;
    }
    
    // 4. CAPTCHAチェック（簡易版）
    if (!isset($_POST['captcha_answer']) || $_POST['captcha_answer'] !== $_SESSION['captcha_answer']) {
        error_log("CAPTCHA failed for IP: {$ip}");
        header("Location: contact.html?status=captcha_error");
        exit;
    }
    
    // フォームデータの取得とサニタイズ
    $name = trim($_POST['name']);
    $company = trim($_POST['company']);
    $email = trim($_POST['email']);
    $phone = trim($_POST['phone']);
    $message = trim($_POST['message']);
    
    // 5. メールアドレスチェック
    if (!$spam_protection->checkEmail($email)) {
        error_log("Blocked email domain: {$email} from IP: {$ip}");
        header("Location: contact.html?status=blocked");
        exit;
    }
    
    // 6. コンテンツチェック
    $full_content = $name . ' ' . $company . ' ' . $message;
    if (!$spam_protection->checkContent($full_content)) {
        error_log("Spam content detected from IP: {$ip}");
        header("Location: contact.html?status=blocked");
        exit;
    }
    
    // バリデーション
    $errors = [];
    
    if (empty($name) || strlen($name) < 2) {
        $errors[] = "お名前を正しく入力してください。";
    }
    
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "正しいメールアドレスを入力してください。";
    }
    
    if (empty($message) || strlen($message) < 10) {
        $errors[] = "お問い合わせ内容を10文字以上で入力してください。";
    }
    
    // 名前の長さチェック（異常に長い名前はスパムの可能性）
    if (strlen($name) > 50) {
        $errors[] = "お名前が長すぎます。";
    }
    
    // メッセージの長さチェック（異常に長いメッセージはスパムの可能性）
    if (strlen($message) > 2000) {
        $errors[] = "お問い合わせ内容が長すぎます。";
    }
    
    if (empty($errors)) {
        // 管理者へのメール送信
        $to_admin = "contact@digitool-lab.com";
        $subject_admin = "お問い合わせフォームから新しいメッセージが届きました";
        
        $body_admin = "お問い合わせフォームから新しいメッセージが届きました。\n\n";
        $body_admin .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
        $body_admin .= "【送信者情報】\n";
        $body_admin .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
        $body_admin .= "お名前: " . $name . "\n";
        $body_admin .= "会社名: " . ($company ? $company : "未入力") . "\n";
        $body_admin .= "メールアドレス: " . $email . "\n";
        $body_admin .= "電話番号: " . ($phone ? $phone : "未入力") . "\n";
        $body_admin .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
        $body_admin .= "【お問い合わせ内容】\n";
        $body_admin .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
        $body_admin .= $message . "\n";
        $body_admin .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
        $body_admin .= "【システム情報】\n";
        $body_admin .= "送信日時: " . date('Y年m月d日 H:i:s') . "\n";
        $body_admin .= "送信者IP: " . $ip . "\n";
        $body_admin .= "User-Agent: " . $user_agent . "\n";
        $body_admin .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
        
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
        $body_customer .= "会社名: " . ($company ? $company : "未入力") . "\n";
        $body_customer .= "メールアドレス: " . $email . "\n";
        $body_customer .= "電話番号: " . ($phone ? $phone : "未入力") . "\n";
        $body_customer .= "お問い合わせ内容:\n" . $message . "\n";
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
} else {
    // CAPTCHA生成
    $captcha_num1 = rand(1, 10);
    $captcha_num2 = rand(1, 10);
    $captcha_answer = $captcha_num1 + $captcha_num2;
    $_SESSION['captcha_answer'] = $captcha_answer;
}
?>

<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>お問い合わせエラー - 株式会社デジタルツール研究所</title>
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
