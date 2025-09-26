<?php
// Set character encoding
date_default_timezone_set('Asia/Tokyo');
mb_language("uni");
mb_internal_encoding("UTF-8");

// 強化された迷惑メール対策を読み込み
require_once 'enhanced_spam_protection.php';

// Check if it's a POST request
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    $spam_protection = new EnhancedSpamProtection();
    
    // フォームデータの取得
    $form_data = [
        'name' => isset($_POST['name']) ? htmlspecialchars($_POST['name'], ENT_QUOTES, 'UTF-8') : '',
        'company' => isset($_POST['company']) ? htmlspecialchars($_POST['company'], ENT_QUOTES, 'UTF-8') : '',
        'department' => isset($_POST['department']) ? htmlspecialchars($_POST['department'], ENT_QUOTES, 'UTF-8') : '',
        'email' => isset($_POST['email']) ? htmlspecialchars($_POST['email'], ENT_QUOTES, 'UTF-8') : '',
        'phone' => isset($_POST['phone']) ? htmlspecialchars($_POST['phone'], ENT_QUOTES, 'UTF-8') : '',
        'employees' => isset($_POST['employees']) ? htmlspecialchars($_POST['employees'], ENT_QUOTES, 'UTF-8') : '',
        'interest' => isset($_POST['interest']) ? htmlspecialchars($_POST['interest'], ENT_QUOTES, 'UTF-8') : '',
        'website' => isset($_POST['website']) ? htmlspecialchars($_POST['website'], ENT_QUOTES, 'UTF-8') : '' // ホニーポット
    ];
    
    // 強化された迷惑メールチェック
    if ($spam_protection->isSpamSubmission($form_data)) {
        error_log("Enhanced spam submission blocked from IP: " . ($_SERVER['REMOTE_ADDR'] ?? 'Unknown'));
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

    $privacy_agree = isset($_POST['privacy_agree']) ? "同意" : "未同意";

    // Basic validation
    if (empty($form_data['name']) || empty($form_data['company']) || empty($form_data['email']) || !filter_var($form_data['email'], FILTER_VALIDATE_EMAIL) || $privacy_agree !== "同意") {
        // Simple error handling: redirect back to contact page with an error flag
        header("Location: contact.html?status=error");
        exit;
    }

    // Compose email body
    $body = "ウェブサイトの資料ダウンロードフォームから以下の内容で送信がありました。\n\n";
    $body .= "------------------------------------------------------------\n";
    $body .= "お名前: " . $form_data['name'] . "\n";
    $body .= "会社名: " . $form_data['company'] . "\n";
    $body .= "部署・役職: " . $form_data['department'] . "\n";
    $body .= "メールアドレス: " . $form_data['email'] . "\n";
    $body .= "電話番号: " . $form_data['phone'] . "\n";
    $body .= "従業員数: " . $form_data['employees'] . "\n";
    $body .= "興味のあるサービス: " . $form_data['interest'] . "\n";
    $body .= "プライバシーポリシーへの同意: " . $privacy_agree . "\n";
    $body .= "------------------------------------------------------------\n\n";
    $body .= "送信日時: " . date("Y-m-d H:i:s") . "\n";
    $body .= "送信者IP: " . $_SERVER['REMOTE_ADDR'] . "\n";
    $body .= "User-Agent: " . ($_SERVER['HTTP_USER_AGENT'] ?? 'Unknown') . "\n";

    // Set email headers
    $headers = "From: " . $from_name . " <" . $from_email . ">\r\n";
    $headers .= "Reply-To: " . $form_data['email'] . "\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8";

    // Send the email to the administrator
    mb_send_mail($recipient_email, $subject, $body, $headers);

    // --- Send auto-reply email to the user ---
    $user_subject = "【株式会社デジタルツール研究所】資料ダウンロードのご請求ありがとうございます";
    $user_body = $form_data['name'] . " 様\n\n";
    $user_body .= "この度は、株式会社デジタルツール研究所のサービス詳細資料にご請求いただき、誠にありがとうございます。\n\n";
    $user_body .= "以下の内容でご入力情報を受け付けました。\n";
    $user_body .= "------------------------------------------------------------\n";
    $user_body .= "お名前: " . $form_data['name'] . "\n";
    $user_body .= "会社名: " . $form_data['company'] . "\n";
    $user_body .= "メールアドレス: " . $form_data['email'] . "\n";
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
    mb_send_mail($form_data['email'], $user_subject, $user_body, $user_headers);

    // Redirect to the thank you page
    header("Location: https://digitool-lab.com/download_thanks.html");
    exit;

} else {
    // If not a POST request, redirect to the top page
    header("Location: index.html");
    exit;
} 