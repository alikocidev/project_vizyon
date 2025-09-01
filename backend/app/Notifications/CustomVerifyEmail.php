<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\URL;

class CustomVerifyEmail extends VerifyEmail
{
    use Queueable;

    /**
     * Build the mail representation of the notification.
     */
    public function toMail($notifiable): MailMessage
    {
        $verificationUrl = $this->verificationUrl($notifiable);
        
        $locale = app()->getLocale();

        return (new MailMessage)
            ->subject(__('emails.verify.title', [], $locale))
            ->greeting(__('emails.verify.greeting', ['name' => $notifiable->name], $locale))
            ->line(__('emails.verify.message', [], $locale))
            ->action(__('emails.verify.button', [], $locale), $verificationUrl)
            ->line(__('emails.verify.expiry_notice', [], $locale))
            ->line(__('emails.verify.ignore_notice', [], $locale))
            ->salutation(__('emails.verify.regards', [], $locale) . ' ' . config('app.name'));
    }

    /**
     * Get the verification URL for the given notifiable.
     */
    protected function verificationUrl($notifiable): string
    {
        $frontendUrl = config('app.frontend_url', 'http://localhost:3000');
        
        $apiVerificationUrl = URL::temporarySignedRoute(
            'verification.verify',
            Carbon::now()->addMinutes(Config::get('auth.verification.expire', 60)),
            [
                'id' => $notifiable->getKey(),
                'hash' => sha1($notifiable->getEmailForVerification()),
            ]
        );

        // URL'dan signature, expires ve diğer parametreleri çıkar
        $parsedUrl = parse_url($apiVerificationUrl);
        parse_str($parsedUrl['query'], $queryParams);
        
        // Frontend'e sadece gerekli parametreleri gönder
        $verificationParams = http_build_query([
            'id' => $notifiable->getKey(),
            'hash' => sha1($notifiable->getEmailForVerification()),
            'expires' => $queryParams['expires'],
            'signature' => $queryParams['signature']
        ]);

        return $frontendUrl . '/email/verify?' . $verificationParams;
    }
}
