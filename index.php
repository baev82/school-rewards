<?php
/**
 * School Rewards — Main Router
 * Works with: php -S 0.0.0.0:8000 index.php
 * Also works when called by Apache/Nginx rewrite
 */

$requestUri = $_SERVER['REQUEST_URI'] ?? '/';
$path = parse_url($requestUri, PHP_URL_PATH);
$query = parse_url($requestUri, PHP_URL_QUERY);

// API routes → api.php
if (preg_match('#^/api(/.*)?$#', $path, $m)) {
    $apiPath = isset($m[1]) && $m[1] !== '' ? $m[1] : '/';
    $_SERVER['REQUEST_URI'] = $apiPath . ($query ? '?'.$query : '');
    require __DIR__ . '/api.php';
    exit;
}

// Uploaded files
if (strpos($path, '/uploads/') === 0) {
    $file = __DIR__ . $path;
    if (is_file($file)) {
        $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
        $types = [
            'jpg'=>'image/jpeg','jpeg'=>'image/jpeg','png'=>'image/png',
            'gif'=>'image/gif','webp'=>'image/webp','svg'=>'image/svg+xml'
        ];
        header('Content-Type: ' . ($types[$ext] ?? 'application/octet-stream'));
        readfile($file);
        exit;
    }
    http_response_code(404);
    exit;
}

// Favicon
if ($path === '/favicon.svg' || $path === '/favicon.ico') {
    $svgFile = __DIR__ . '/favicon.svg';
    if (is_file($svgFile)) {
        header('Content-Type: image/svg+xml');
        readfile($svgFile);
    } else {
        http_response_code(404);
    }
    exit;
}

// Everything else → SPA
header('Content-Type: text/html; charset=utf-8');
readfile(__DIR__ . '/app.html');
