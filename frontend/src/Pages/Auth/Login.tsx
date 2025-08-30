import { useState, FormEventHandler, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import CoreLayout from "@/Layouts/Core";
import { useAuth } from "@/Providers/Auth";

interface LoginFormData {
  email: string;
  password: string;
  remember: boolean;
}

interface FormErrors {
  [key: string]: string;
}

export default function Login() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    remember: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [canResetPassword, setCanResetPassword] = useState(false);

  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const updateFormData = (field: keyof LoginFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = "E-posta adresi gereklidir";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Geçerli bir e-posta adresi giriniz";
    }

    if (!formData.password) {
      newErrors.password = "Şifre gereklidir";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    setTimeout(async () => {
      try {
        const success = await login(formData.email, formData.password);
        if (success) {
          navigate("/", { replace: true });
        } else {
          setErrors({
            general: "E-posta adresi veya şifre hatalı. Lütfen tekrar deneyiniz.",
          });
          setCanResetPassword(true);
        }
      } catch (error) {
        setErrors({
          general: "Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyiniz.",
        });
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  return (
    <CoreLayout title="Giriş Yap">
      <div className="w-full h-full flex items-center justify-center">
        <div className="max-w-md mt-14 w-full space-y-8 animate-fade-in">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary/10 dark:bg-secondary/10 mb-4">
              <svg className="h-6 w-6 text-primary dark:text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-light-text dark:text-dark-text">Hoş Geldiniz</h2>
            <p className="mt-2 text-neutral-600 dark:text-neutral-400">Hesabınıza giriş yapın</p>
          </div>

          {/* Form Card */}
          <div className="bg-white dark:bg-dark-primary p-8 rounded-2xl shadow-xl border border-light-surface dark:border-dark-surface">
            {/* General Error */}
            {errors.general && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800 dark:text-red-200">{errors.general}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-light-text dark:text-dark-text mb-2">
                  E-posta Adresi
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    className={`
                      w-full px-4 py-3 rounded-lg border transition
                      bg-transparent
                      text-light-text dark:text-dark-text
                      placeholder:text-neutral-500 dark:placeholder:text-neutral-400
                      focus:ring-0 focus:outline-none
                      focus:border-primary dark:focus:border-secondary
                      ${errors.email ? "border-red-300 dark:border-red-600" : "border-light-surface dark:border-dark-surface"}
                    `}
                    placeholder="ornek@email.com"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg
                      className={`h-5 w-5 ${errors.email ? "text-red-400" : "text-neutral-400"}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-light-text dark:text-dark-text mb-2">
                  Şifre
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={(e) => updateFormData("password", e.target.value)}
                    className={`
                      w-full px-4 py-3 rounded-lg border transition
                      bg-transparent
                      text-light-text dark:text-dark-text
                      placeholder:text-neutral-500 dark:placeholder:text-neutral-400
                      focus:ring-0 focus:outline-none
                      focus:border-primary dark:focus:border-secondary
                      ${errors.password ? "border-red-300 dark:border-red-600" : "border-light-surface dark:border-dark-surface"}
                    `}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M9.878 9.878a3 3 0 00-.007 4.243m4.242-4.242L15.536 15.536m0 0l1.414-1.414M15.536 15.536a3 3 0 00-4.243-.007m6.364-4.364a10.05 10.05 0 01-1.563 3.029"
                        />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember me and Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center group cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.remember}
                    onChange={(e) => updateFormData("remember", e.target.checked)}
                    className="h-4 w-4 text-primary dark:text-secondary focus:ring-primary/20 border-neutral-300 dark:border-secondary rounded bg-transparent"
                  />
                  <span className="ml-2 text-sm text-neutral-700 dark:text-neutral-300 group-hover:text-light-text dark:group-hover:text-dark-text transition-colors">
                    Beni hatırla
                  </span>
                </label>

                {canResetPassword && (
                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary/80 hover:text-primary dark:text-secondary/80 dark:hover:text-secondary transition-colors"
                  >
                    Şifremi unuttum
                  </Link>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`
                  w-full flex justify-center items-center py-3 px-4 rounded-lg text-white font-semib    old
                  transition-all duration-200 transform
                bg-primary hover:bg-primary/90 dark:bg-secondary dark:hover:bg-secondary/90 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl              
                `}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Giriş yapılıyor...
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                      />
                    </svg>
                    Giriş Yap
                  </>
                )}
              </button>
            </form>

            {/* Register Link */}
            <div className="mt-8 text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-200 dark:border-neutral-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400">veya</span>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-neutral-600 dark:text-neutral-400 text-sm">
                  Hesabınız yok mu?{" "}
                  <Link
                    to="/register"
                    className="text-primary hover:text-primary/80 dark:text-secondary/80 dark:hover:text-secondary font-semibold transition-colors"
                  >
                    Kayıt olun
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CoreLayout>
  );
}
