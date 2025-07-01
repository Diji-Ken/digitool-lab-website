<?php
// Set character encoding for Japanese
mb_language("Japanese");
mb_internal_encoding("UTF-8");

// Check if it's a POST request
if ($_SERVER["REQUEST_METHOD"] == "POST") {

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

    // Encode subject and from name for Japanese
    $encoded_subject = mb_encode_mimeheader($subject, "UTF-8");
    $encoded_from_name = mb_encode_mimeheader($from_name, "UTF-8");

    // Set email headers
    $headers = "From: " . $encoded_from_name . " <" . $from_email . ">\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8";

    // Send the email to the administrator
    mb_send_mail($recipient_email, $encoded_subject, $body, $headers);

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

    $user_encoded_subject = mb_encode_mimeheader($user_subject, "UTF-8");
    
    // Set user email headers
    $user_headers = "From: " . $encoded_from_name . " <" . $from_email . ">\r\n";
    $user_headers .= "Content-Type: text/plain; charset=UTF-8";

    // Send the auto-reply email to the user
    mb_send_mail($email, $user_encoded_subject, $user_body, $user_headers);

    // Redirect to the thank you page
    header("Location: https://digitool-lab.com/download_thanks.html");
    exit;

} else {
    // If not a POST request, redirect to the top page
    header("Location: index.html");
    exit;
} 