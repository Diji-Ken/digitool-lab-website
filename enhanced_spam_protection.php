<?php
// 迷惑メール詳細ログ機能
class SpamLogger {
    private $log_file = 'spam_log.txt';
    
    public function logSpamAttempt($data) {
        $log_entry = [
            'timestamp' => date('Y-m-d H:i:s'),
            'ip' => $_SERVER['REMOTE_ADDR'] ?? 'Unknown',
            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown',
            'referer' => $_SERVER['HTTP_REFERER'] ?? 'Direct',
            'data' => $data,
            'country' => $this->getCountryFromIP($_SERVER['REMOTE_ADDR'] ?? ''),
            'blocked_reason' => $this->getBlockedReason($data)
        ];
        
        file_put_contents($this->log_file, json_encode($log_entry) . "\n", FILE_APPEND | LOCK_EX);
    }
    
    private function getCountryFromIP($ip) {
        if (empty($ip) || $ip === 'Unknown') return 'Unknown';
        
        // IP-APIを使用して国を取得
        $response = @file_get_contents("http://ip-api.com/json/{$ip}");
        if ($response) {
            $data = json_decode($response, true);
            return $data['country'] ?? 'Unknown';
        }
        return 'Unknown';
    }
    
    private function getBlockedReason($data) {
        $reasons = [];
        
        // IPアドレスチェック
        $ip = $_SERVER['REMOTE_ADDR'] ?? '';
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
                $reasons[] = "Blocked IP range: {$range}";
                break;
            }
        }
        
        // メールドメインチェック
        if (isset($data['email'])) {
            $domain = substr(strrchr($data['email'], "@"), 1);
            $blocked_domains = ['mail.ru', 'yandex.ru', 'rambler.ru', 'gmail.com'];
            if (in_array($domain, $blocked_domains)) {
                $reasons[] = "Blocked email domain: {$domain}";
            }
        }
        
        // スパムキーワードチェック
        $spam_keywords = ['viagra', 'casino', 'loan', 'bitcoin', 'crypto', 'investment', 'profit'];
        $full_content = implode(' ', array_values($data));
        $content_lower = strtolower($full_content);
        
        foreach ($spam_keywords as $keyword) {
            if (strpos($content_lower, $keyword) !== false) {
                $reasons[] = "Spam keyword detected: {$keyword}";
                break;
            }
        }
        
        // ホニーポットチェック
        if (!empty($data['website'])) {
            $reasons[] = "Honeypot triggered";
        }
        
        return empty($reasons) ? 'Unknown' : implode(', ', $reasons);
    }
    
    public function getSpamStats() {
        if (!file_exists($this->log_file)) {
            return ['total' => 0, 'recent' => 0, 'countries' => [], 'reasons' => []];
        }
        
        $lines = file($this->log_file, FILE_IGNORE_NEW_LINES);
        $total = count($lines);
        $recent = 0;
        $countries = [];
        $reasons = [];
        
        $one_hour_ago = time() - 3600;
        
        foreach ($lines as $line) {
            $entry = json_decode($line, true);
            if ($entry) {
                // 最近1時間の統計
                if (strtotime($entry['timestamp']) > $one_hour_ago) {
                    $recent++;
                }
                
                // 国別統計
                $country = $entry['country'] ?? 'Unknown';
                $countries[$country] = ($countries[$country] ?? 0) + 1;
                
                // 理由別統計
                $reason = $entry['blocked_reason'] ?? 'Unknown';
                $reasons[$reason] = ($reasons[$reason] ?? 0) + 1;
            }
        }
        
        return [
            'total' => $total,
            'recent' => $recent,
            'countries' => $countries,
            'reasons' => $reasons
        ];
    }
}

// より厳格な迷惑メール対策
class EnhancedSpamProtection {
    private $logger;
    
    public function __construct() {
        $this->logger = new SpamLogger();
    }
    
    public function isSpamSubmission($data) {
        $ip = $_SERVER['REMOTE_ADDR'] ?? '';
        
        // 1. IPアドレスチェック（より厳格）
        if ($this->isBlockedIP($ip)) {
            $this->logger->logSpamAttempt($data);
            return true;
        }
        
        // 2. レート制限チェック（より厳格）
        if ($this->isRateLimited($ip)) {
            $this->logger->logSpamAttempt($data);
            return true;
        }
        
        // 3. ホニーポットチェック
        if (!empty($data['website'])) {
            $this->logger->logSpamAttempt($data);
            return true;
        }
        
        // 4. メールドメインチェック
        if (isset($data['email']) && $this->isBlockedEmail($data['email'])) {
            $this->logger->logSpamAttempt($data);
            return true;
        }
        
        // 5. コンテンツチェック
        if ($this->containsSpamContent($data)) {
            $this->logger->logSpamAttempt($data);
            return true;
        }
        
        // 6. User-Agentチェック
        $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? '';
        if ($this->isSuspiciousUserAgent($user_agent)) {
            $this->logger->logSpamAttempt($data);
            return true;
        }
        
        // 7. Refererチェック
        $referer = $_SERVER['HTTP_REFERER'] ?? '';
        if ($this->isSuspiciousReferer($referer)) {
            $this->logger->logSpamAttempt($data);
            return true;
        }
        
        return false;
    }
    
    private function isBlockedIP($ip) {
        // より包括的なIP範囲ブロック
        $blocked_ranges = [
            // ロシア
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
            '217.118.', '217.119.', '217.120.', '217.121.', '217.122.', '217.123.', '217.124.', '217.125.',
            // その他の迷惑メールが多い国
            '103.21.', '103.22.', '103.23.', '103.24.', '103.25.', '103.26.', '103.27.', '103.28.',
            '104.16.', '104.17.', '104.18.', '104.19.', '104.20.', '104.21.', '104.22.', '104.23.',
            '104.24.', '104.25.', '104.26.', '104.27.', '104.28.', '104.29.', '104.30.', '104.31.'
        ];
        
        foreach ($blocked_ranges as $range) {
            if (strpos($ip, $range) === 0) {
                return true;
            }
        }
        
        return false;
    }
    
    private function isRateLimited($ip) {
        $rate_limit_file = 'rate_limit_' . md5($ip) . '.txt';
        $current_time = time();
        $limit_time = 1800; // 30分に短縮
        $max_attempts = 2; // 最大2回に削減
        
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
    
    private function isBlockedEmail($email) {
        $domain = substr(strrchr($email, "@"), 1);
        $blocked_domains = [
            'mail.ru', 'yandex.ru', 'rambler.ru', 'gmail.com',
            'outlook.com', 'hotmail.com', 'yahoo.com', 'aol.com',
            'protonmail.com', 'tutanota.com', 'guerrillamail.com',
            '10minutemail.com', 'tempmail.org', 'mailinator.com'
        ];
        
        return in_array($domain, $blocked_domains);
    }
    
    private function containsSpamContent($data) {
        $spam_keywords = [
            'viagra', 'casino', 'loan', 'bitcoin', 'crypto', 'investment', 'profit',
            'click here', 'buy now', 'free money', 'make money', 'work from home',
            'weight loss', 'diet pills', 'pharmacy', 'prescription', 'medication',
            'lottery', 'winner', 'congratulations', 'urgent', 'limited time',
            'act now', 'don\'t miss', 'exclusive offer', 'guaranteed'
        ];
        
        $full_content = implode(' ', array_values($data));
        $content_lower = strtolower($full_content);
        
        foreach ($spam_keywords as $keyword) {
            if (strpos($content_lower, $keyword) !== false) {
                return true;
            }
        }
        
        return false;
    }
    
    private function isSuspiciousUserAgent($user_agent) {
        $suspicious_patterns = [
            'bot', 'crawler', 'spider', 'scraper', 'scanner',
            'python', 'curl', 'wget', 'http', 'request',
            'automated', 'script', 'tool', 'test'
        ];
        
        $user_agent_lower = strtolower($user_agent);
        
        foreach ($suspicious_patterns as $pattern) {
            if (strpos($user_agent_lower, $pattern) !== false) {
                return true;
            }
        }
        
        return false;
    }
    
    private function isSuspiciousReferer($referer) {
        // 空のRefererや不審なRefererをチェック
        if (empty($referer)) {
            return true;
        }
        
        $suspicious_domains = [
            'spam.com', 'malicious.com', 'fake.com'
        ];
        
        foreach ($suspicious_domains as $domain) {
            if (strpos($referer, $domain) !== false) {
                return true;
            }
        }
        
        return false;
    }
}
?>

