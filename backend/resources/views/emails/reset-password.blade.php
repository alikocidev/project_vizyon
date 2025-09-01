@extends('layouts.email')

@section('content')
    <h2>{{ __('emails.reset.title', [], app()->getLocale()) }}</h2>
    
    <p>{{ __('emails.reset.greeting', ['name' => $user->name ?? 'Kullanıcı'], app()->getLocale()) }}</p>
    
    <p>{{ __('emails.reset.message', [], app()->getLocale()) }}</p>
    
    <div class="btn-center">
        <a href="{{ $resetUrl }}" class="btn">
            {{ __('emails.reset.button', [], app()->getLocale()) }}
        </a>
    </div>
    
    <div class="divider"></div>
    
    <p style="font-size: 14px; color: #718096;">
        {{ __('emails.reset.alternative_text', [], app()->getLocale()) }}
    </p>
    
    <p style="font-size: 14px; color: #718096; word-break: break-all;">
        {{ $resetUrl }}
    </p>
    
    <div class="divider"></div>
    
    <p style="font-size: 14px; color: #718096;">
        {{ __('emails.reset.expiry_notice', [], app()->getLocale()) }}
    </p>
    
    <p style="font-size: 14px; color: #718096;">
        {{ __('emails.reset.ignore_notice', [], app()->getLocale()) }}
    </p>
@endsection
