@extends('layouts.email')

@section('content')
    <h2>{{ __('emails.verify.title', [], app()->getLocale()) }}</h2>
    
    <p>{{ __('emails.verify.greeting', ['name' => $user->name], app()->getLocale()) }}</p>
    
    <p>{{ __('emails.verify.message', [], app()->getLocale()) }}</p>
    
    <div class="btn-center">
        <a href="{{ $verificationUrl }}" class="btn">
            {{ __('emails.verify.button', [], app()->getLocale()) }}
        </a>
    </div>
    
    <div class="divider"></div>
    
    <p style="font-size: 14px; color: #718096;">
        {{ __('emails.verify.alternative_text', [], app()->getLocale()) }}
    </p>
    
    <p style="font-size: 14px; color: #718096; word-break: break-all;">
        {{ $verificationUrl }}
    </p>
    
    <div class="divider"></div>
    
    <p style="font-size: 14px; color: #718096;">
        {{ __('emails.verify.expiry_notice', [], app()->getLocale()) }}
    </p>
    
    <p style="font-size: 14px; color: #718096;">
        {{ __('emails.verify.ignore_notice', [], app()->getLocale()) }}
    </p>
@endsection
