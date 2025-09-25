<?php
// Set character encoding
date_default_timezone_set('Asia/Tokyo');
mb_language("uni");
mb_internal_encoding("UTF-8");

// 基本的な迷惑メール対策
function isSpamSubmission() {
    $ip = $_SERVER['REMOTE_ADDR'];
    
    // ロシア系IPアドレスの簡易チェック
    $blocked_ranges = [
        '5.8.', '5.9.', '5.10.', '5.11.', '5.12.', '5.13.', '5.14.', '5.15.',
        '31.40.', '31.41.', '31.42.', '31.43.', '31.44.', '31.45.', '31.46.', '31.47.',
        '46.17.', '46.18.', '46.19.', '46.20.', '46.21.', '46.22.', '46.23.', '46.24.',
        '77.88.', '77.89.', '77.90.', '77.91.', '77.92.', '77.93.', '77.94.', '77.95.',
        '78.108.', '78.109.', '78.110.', '78.111.', '78.112.', '78.113.', '78.114.', '78.115.',
        '85.26.', '85.27.', '85.28.', '85.29.', '85.30.', '85.31.', '85.32.', '85.33.',
        '91.121.', '91.122.', '91.123.', '91.124.', '91.125.', '91.126.', '91.127.', '91.128.',
        '95.84.', '95.85.', '95.86.', '95.87.', '95.88.', '95.89.', '95.90.', '95.91.',
        '109.207.', '109.208.', '109.209.', '109.210.', '109.211.', '109.212.', '109.213.', '109.214.',
        '176.59.', '176.60.', '176.61.', '176.62.', '176.63.', '176.64.', '176.65.', '176.66.',
        '178.154.', '178.155.', '178.156.', '178.157.', '178.158.', '178.159.', '178.160.', '178.161.',
        '185.4.', '185.5.', '185.6.', '185.7.', '185.8.', '185.9.', '185.10.', '185.11.',
        '188.64.', '188.65.', '188.66.', '188.67.', '188.68.', '188.69.', '188.70.', '188.71.',
        '195.211.', '195.212.', '195.213.', '195.214.', '195.215.', '195.216.', '195.217.', '195.218.',
        '212.164.', '212.165.', '212.166.', '212.167.', '212.168.', '212.169.', '212.170.', '212.171.',
        '213.87.', '213.88.', '213.89.', '213.90.', '213.91.', '213.92.', '213.93.', '213.94.',
        '217.118.', '217.119.', '217.120.', '217.121.', '217.122.', '217.123.', '217.124.', '217.125.'
    ];
    
    foreach ($blocked_ranges as $range) {
        if (strpos($ip, $range) === 0) {
            return true;
        }
    }
    
    // レート制限チェック
    $rate_limit_file = 'rate_limit_' . md5($ip) . '.txt';
    $current_time = time();
    $limit_time = 3600; // 1時間
    $max_attempts = 5; // 最大5回
    
    if (file_exists($rate_limit_file)) {
        $data = json_decode(file_get_contents($rate_limit_file), true);
        if ($data['count'] >= $max_attempts && ($current_time - $data['last_attempt']) < $limit_time) {
            return true;
        }
        if (($current_time - $data['last_attempt']) >= $limit_time) {
            $data = ['count' => 0, 'last_attempt' => $current_time];
        }
    } else {
        $data = ['count' => 0, 'last_attempt' => $current_time];
    }
    
    $data['count']++;
    $data['last_attempt'] = $current_time;
    file_put_contents($rate_limit_file, json_encode($data));
    
    return $data['count'] > $max_attempts;
}

// Check if it's a POST request
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // 迷惑メールチェック
    if (isSpamSubmission()) {
        error_log("Spam submission blocked from IP: " . $_SERVER['REMOTE_ADDR']);
        header("Location: https://digitool-lab.com/download_thanks.html"); // 成功ページにリダイレクトしてスパマーを騙す
        exit;
    }
    
    // ホニーポットチェック（隠しフィールド）
    if (!empty($_POST['website'])) {
        error_log("Honeypot triggered for IP: " . $_SERVER['REMOTE_ADDR']);
        header("Location: https://digitool-lab.com/download_thanks.html"); // 成功ページにリダイレクトしてスパマーを騙す
        exit;
    }

    // --- Configuration ---
    // ▼▼▼【重要】通知を受け取りたいご自身のメールアドレスに変更してください ▼▼▼
    $recipient_email = "info@digitool-lab.com"; 
    $from_email = "no-reply@digitool-lab.com";
    $from_name = "株式会社デジタルツール研究所";
    $subject = "【digitool-lab.com】資料ダウンロード通知";
    // --- End Configuration ---

    // Sanitize and get form data
    $name = isset($_POST['name']) ? htmlspecialchars($_POST['name'], ENT_QUOTES, 'UTF-8') : '';
    $company = isset($_POST['company']) ? htmlspecialchars($_POST['company'], ENT_QUOTES, 'UTF-8') : '';
    $department = isset($_POST['department']) ? htmlspecialchars($_POST['department'], ENT_QUOTES, 'UTF-8') : '';
    $email = isset($_POST['email']) ? htmlspecialchars($_POST['email'], ENT_QUOTES, 'UTF-8') : '';
    $phone = isset($_POST['phone']) ? htmlspecialchars($_POST['phone'], ENT_QUOTES, 'UTF-8') : '';
    $employees = isset($_POST['employees']) ? htmlspecialchars($_POST['employees'], ENT_QUOTES, 'UTF-8') : '';
    $interest = isset($_POST['interest']) ? htmlspecialchars($_POST['interest'], ENT_QUOTES, 'UTF-8') : '';
    $privacy_agree = isset($_POST['privacy_agree']) ? "同意" : "未同意";

    // Basic validation
    if (empty($name) || empty($company) || empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL) || $privacy_agree !== "同意") {
        // Simple error handling: redirect back to contact page with an error flag
        header("Location: contact.html?status=error");
        exit;
    }

    // Compose email body
    $body = "ウェブサイトの資料ダウンロードフォームから以下の内容で送信がありました。\n\n";
    $body .= "------------------------------------------------------------\n";
    $body .= "お名前: " . $name . "\n";
    $body .= "会社名: " . $company . "\n";
    $body .= "部署・役職: " . $department . "\n";
    $body .= "メールアドレス: " . $email . "\n";
    $body .= "電話番号: " . $phone . "\n";
    $body .= "従業員数: " . $employees . "\n";
    $body .= "興味のあるサービス: " . $interest . "\n";
    $body .= "プライバシーポリシーへの同意: " . $privacy_agree . "\n";
    $body .= "------------------------------------------------------------\n\n";
    $body .= "送信日時: " . date("Y-m-d H:i:s") . "\n";
    $body .= "送信者IP: " . $_SERVER['REMOTE_ADDR'] . "\n";
    $body .= "User-Agent: " . ($_SERVER['HTTP_USER_AGENT'] ?? 'Unknown') . "\n";

    // Set email headers
    $headers = "From: " . $from_name . " <" . $from_email . ">\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8";

    // Send the email to the administrator
    mb_send_mail($recipient_email, $subject, $body, $headers);

    // --- Send auto-reply email to the user ---
    $user_subject = "【株式会社デジタルツール研究所】資料ダウンロードのご請求ありがとうございます";
    $user_body = $name . " 様\n\n";
    $user_body .= "この度は、株式会社デジタルツール研究所のサービス詳細資料にご請求いただき、誠にありがとうございます。\n\n";
    $user_body .= "以下の内容でご入力情報を受け付けました。\n";
    $user_body .= "------------------------------------------------------------\n";
    $user_body .= "お名前: " . $name . "\n";
    $user_body .= "会社名: " . $company . "\n";
    $user_body .= "メールアドレス: " . $email . "\n";
    $user_body .= "------------------------------------------------------------\n\n";
    $user_body .= "資料は、以下のページよりご覧いただけます。\n";
    $user_body .= "https://digitool-lab.com/download_thanks.html\n\n";
    $user_body .= "※本メールは送信専用です。ご返信いただいてもお答えできませんのでご了承ください。\n";
    $user_body .= "ご不明な点がございましたら、お手数ですが下記ウェブサイトのお問い合わせフォームよりご連絡ください。\n";
    $user_body .= "https://digitool-lab.com/contact.html\n\n";
    $user_body .= "------------------------------------------------------------\n";
    $user_body .= "株式会社デジタルツール研究所\n";
    $user_body .= "Web: https://digitool-lab.com/\n";
    $user_body .= "------------------------------------------------------------\n";

    // Set user email headers
    $user_headers = "From: " . $from_name . " <" . $from_email . ">\r\n";
    $user_headers .= "Content-Type: text/plain; charset=UTF-8";

    // Send the auto-reply email to the user
    mb_send_mail($email, $user_subject, $user_body, $user_headers);

    // Redirect to the thank you page
    header("Location: https://digitool-lab.com/download_thanks.html");
    exit;

} else {
    // If not a POST request, redirect to the top page
    header("Location: index.html");
    exit;
} 