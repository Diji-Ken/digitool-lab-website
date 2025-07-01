<?php
// Set character encoding for Japanese
mb_language("Japanese");
mb_internal_encoding("UTF-8");

// Check if it's a POST request
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // --- Configuration ---
    // ▼▼▼【重要】通知を受け取りたいご自身のメールアドレスに変更してください ▼▼▼
    $recipient_email = "info@digitool-lab.com"; 
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

    // Set email headers from a generic address on your domain
    $headers = "From: no-reply@digitool-lab.com\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8";

    // Send the email
    $mail_sent = mb_send_mail($recipient_email, $subject, $body, $headers);

    // Redirect to the presentation after sending email, regardless of mail success
    // This ensures the user gets the content. Mail sending issues can be checked on the server.
    header("Location: presentation.html");
    exit;

} else {
    // If not a POST request, redirect to the top page
    header("Location: index.html");
    exit;
}
?> 