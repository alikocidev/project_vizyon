<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name') }}</title>
    
    <style>
        /* Reset styles */
        body, table, td, p, a, li, blockquote {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        
        table, td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }
        
        /* Base styles */
        body {
            margin: 0;
            padding: 0;
            width: 100% !important;
            height: 100% !important;
            background-color: #f8fafc;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }
        
        .email-wrapper {
            width: 100%;
            background-color: #f8fafc;
            padding: 32px 0;
        }
        
        .email-content {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        
        .email-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 32px;
            text-align: center;
        }
        
        .email-header h1 {
            color: #ffffff;
            font-size: 28px;
            font-weight: 600;
            margin: 0;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .email-header p {
            color: #e2e8f0;
            font-size: 16px;
            margin: 8px 0 0 0;
        }
        
        .email-body {
            padding: 40px 32px;
        }
        
        .email-body h2 {
            color: #2d3748;
            font-size: 24px;
            font-weight: 600;
            margin: 0 0 16px 0;
        }
        
        .email-body p {
            color: #4a5568;
            font-size: 16px;
            line-height: 1.6;
            margin: 0 0 16px 0;
        }
        
        .btn {
            display: inline-block;
            padding: 16px 32px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
        }
        
        .btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }
        
        .btn-center {
            text-align: center;
            margin: 32px 0;
        }
        
        .email-footer {
            background-color: #f7fafc;
            padding: 24px 32px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
        }
        
        .email-footer p {
            color: #718096;
            font-size: 14px;
            margin: 0;
        }
        
        .divider {
            height: 1px;
            background-color: #e2e8f0;
            margin: 24px 0;
        }
        
        /* Responsive */
        @media only screen and (max-width: 600px) {
            .email-content {
                margin: 0 16px;
            }
            
            .email-header, .email-body, .email-footer {
                padding: 24px 20px;
            }
            
            .email-header h1 {
                font-size: 24px;
            }
            
            .btn {
                padding: 14px 24px;
                font-size: 14px;
            }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="email-content">
            <!-- Header -->
            <div class="email-header">
                <h1>{{ config('app.name') }}</h1>
                <p>{{ __('emails.tagline', [], app()->getLocale()) }}</p>
            </div>
            
            <!-- Content -->
            <div class="email-body">
                @yield('content')
            </div>
            
            <!-- Footer -->
            <div class="email-footer">
                <p>© {{ date('Y') }} {{ config('app.name') }}. {{ __('emails.all_rights_reserved', [], app()->getLocale()) }}</p>
                <p>{{ __('emails.contact_info', [], app()->getLocale()) }}</p>
            </div>
        </div>
    </div>
</body>
</html>
