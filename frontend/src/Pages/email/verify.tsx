import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const EmailVerifyPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verificationUrl = searchParams.get('verification_url');
    
    if (!verificationUrl) {
      setStatus('error');
      setMessage('Geçersiz doğrulama linki');
      return;
    }

    // Backend'deki doğrulama endpoint'ini çağır
    fetch(verificationUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })
    .then(response => response.json())
    .then(data => {
      if (data.verified) {
        setStatus('success');
        setMessage(data.message || 'Email başarıyla doğrulandı!');
        
        // 3 saniye sonra ana sayfaya yönlendir
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } else {
        setStatus('error');
        setMessage(data.message || 'Doğrulama başarısız');
      }
    })
    .catch(error => {
      console.error('Verification error:', error);
      setStatus('error');
      setMessage('Doğrulama sırasında bir hata oluştu');
    });
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Email Doğrulama
          </h2>
          
          {status === 'loading' && (
            <div className="mt-4">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Email doğrulanıyor...</p>
            </div>
          )}
          
          {status === 'success' && (
            <div className="mt-4">
              <div className="text-green-600 text-6xl mb-4">✓</div>
              <p className="text-green-600 font-semibold">{message}</p>
              <p className="mt-2 text-gray-600">Ana sayfaya yönlendiriliyorsunuz...</p>
            </div>
          )}
          
          {status === 'error' && (
            <div className="mt-4">
              <div className="text-red-600 text-6xl mb-4">✗</div>
              <p className="text-red-600 font-semibold">{message}</p>
              <button 
                onClick={() => navigate('/login')}
                className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Giriş Sayfasına Dön
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerifyPage;
