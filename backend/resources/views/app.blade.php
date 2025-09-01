<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name') }} - API Backend</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f8f9fa; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #2d3748; margin-bottom: 20px; }
        .info { background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .endpoint { background: #f5f5f5; padding: 10px; border-radius: 5px; font-family: monospace; margin: 10px 0; }
        a { color: #3182ce; text-decoration: none; }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 {{ config('app.name') }} API Backend</h1>
        
        <div class="info">
            <strong>📡 API Durumu:</strong> Aktif ve çalışıyor
        </div>
        
        <div class="info">
            <strong>🌐 Frontend Uygulaması:</strong> 
            <a href="http://localhost:3000" target="_blank">http://localhost:3000</a>
        </div>
        
        <h3>📋 API Endpoints:</h3>
        <div class="endpoint">GET /api/movie - Film listesi</div>
        <div class="endpoint">GET /api/movie/{id} - Film detayı</div>
        <div class="endpoint">POST /api/auth/login - Giriş</div>
        <div class="endpoint">POST /api/auth/register - Kayıt</div>
        
        <div class="info">
            <strong>📚 API Dokumentasyonu:</strong> 
            <a href="/api/documentation" target="_blank">API Docs</a>
        </div>
    </div>
</body>
</html>