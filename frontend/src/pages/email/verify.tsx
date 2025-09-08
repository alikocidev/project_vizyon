import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import CoreLayout from '@/layouts/Core';
import { useAuth } from '@/hooks/useAuth';

const EmailVerifyPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const id = searchParams.get('id');
    const hash = searchParams.get('hash');
    const expires = searchParams.get('expires');
    const signature = searchParams.get('signature');
    
    if (!id || !hash || !expires || !signature) {
      setStatus('error');
      setMessage('Geçersiz doğrulama linki - eksik parametreler');
      return;
    }

    const verificationUrl = `${import.meta.env.VITE_API_URL}/email/verify/${id}/${hash}?expires=${expires}&signature=${signature}`;
    
    fetch(verificationUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      if (data.verified) {
        setStatus('success');
        setMessage(data.message || 'Email başarıyla doğrulandı!');
        
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        setStatus('error');
        setMessage(data.message || 'Doğrulama başarısız');
      }
    })
    .catch(error => {
      console.error('Verification error:', error);
      setStatus('error');
      if (error.message.includes('401')) {
        setMessage('Yetkilendirme hatası - Lütfen giriş yapın');
      } else if (error.message.includes('400')) {
        setMessage('Geçersiz doğrulama linki');
      } else if (error.message.includes('404')) {
        setMessage('Doğrulama linki bulunamadı');
      } else {
        setMessage('Doğrulama sırasında bir hata oluştu: ' + error.message);
      }
    });
  }, [searchParams, navigate]);

  return (
    <CoreLayout user={user} title="Email Doğrulama">
      <div className="w-full h-full flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 animate-fade-in">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-primary/10 dark:bg-secondary/10 mb-6">
              {status === 'loading' && (
                <svg className="animate-spin h-8 w-8 text-primary dark:text-secondary" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {status === 'success' && (
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {status === 'error' && (
                <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <h2 className="text-3xl font-bold text-light-text dark:text-dark-text">Email Doğrulama</h2>
          </div>

          {/* Status Card */}
          <div className="bg-white dark:bg-dark-primary p-8 rounded-2xl shadow-xl border border-light-surface dark:border-dark-surface">
            {status === 'loading' && (
              <div className="text-center">
                <p className="text-neutral-600 dark:text-neutral-400 text-lg mb-4">
                  Email adresiniz doğrulanıyor...
                </p>
                <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                  <div className="bg-primary dark:bg-secondary h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                </div>
              </div>
            )}
            
            {status === 'success' && (
              <div className="text-center">
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-green-600 mb-2">Başarılı!</h3>
                  <p className="text-neutral-700 dark:text-neutral-300">{message}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <p className="text-sm text-green-700 dark:text-green-300 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    3 saniye içinde ana sayfaya yönlendirileceksiniz...
                  </p>
                </div>
              </div>
            )}
            
            {status === 'error' && (
              <div className="text-center">
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
                    <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-red-600 mb-2">Doğrulama Başarısız</h3>
                  <p className="text-neutral-700 dark:text-neutral-300 mb-6">{message}</p>
                </div>
                <div className="space-y-3">
                  <button 
                    onClick={() => navigate('/login')}
                    className="w-full bg-primary hover:bg-primary/90 dark:bg-secondary dark:hover:bg-secondary/90 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                  >
                    Giriş Sayfasına Dön
                  </button>
                  <button 
                    onClick={() => navigate('/')}
                    className="w-full bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 px-6 py-3 rounded-lg font-semibold border border-neutral-300 dark:border-neutral-600 transition-colors"
                  >
                    Ana Sayfaya Git
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </CoreLayout>
  );
};

export default EmailVerifyPage;
