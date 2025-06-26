<?php
// 日本語の文字化け対策
mb_language("Japanese");
mb_internal_encoding("UTF-8");

// POSTデータを取得
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = trim($_POST['name']);
    $company = trim($_POST['company']);
    $email = trim($_POST['email']);
    $phone = trim($_POST['phone']);
    $message = trim($_POST['message']);
    
    // バリデーション
    $errors = [];
    
    if (empty($name)) {
        $errors[] = "お名前を入力してください。";
    }
    
    if (empty($email)) {
        $errors[] = "メールアドレスを入力してください。";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "正しいメールアドレスを入力してください。";
    }
    
    if (empty($message)) {
        $errors[] = "お問い合わせ内容を入力してください。";
    }
    
    if (empty($errors)) {
        // 管理者へのメール送信
        $to_admin = "contact@digitool-lab.com";
        $subject_admin = "お問い合わせフォームから新しいメッセージが届きました";
        
        $body_admin = "お問い合わせフォームから新しいメッセージが届きました。\n\n";
        $body_admin .= "お名前: " . $name . "\n";
        $body_admin .= "会社名: " . ($company ? $company : "未入力") . "\n";
        $body_admin .= "メールアドレス: " . $email . "\n";
        $body_admin .= "電話番号: " . ($phone ? $phone : "未入力") . "\n";
        $body_admin .= "お問い合わせ内容:\n" . $message . "\n\n";
        $body_admin .= "送信日時: " . date('Y年m月d日 H:i:s') . "\n";
        
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