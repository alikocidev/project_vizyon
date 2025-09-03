import { useAuth } from "@/hooks/useAuth";
import CoreLayout from "@/layouts/Core";
import { useState } from "react";
import { TiTick } from "react-icons/ti";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Profile = () => {
  const { user, loading, updateUser, sendVerificationEmail } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: user?.name || "" });
  const [verificationSent, setVerificationSent] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [message, setMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (!user) return;
    updateUser({ ...user, ...formData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({ name: user?.name || "" });
    setIsEditing(false);
  };

  const handleSendVerificationEmail = async () => {
    if (!user) return;
    if (verificationSent) return;
    setIsWaiting(true);
    const response = await sendVerificationEmail();
    setVerificationSent(true);
    setMessage(response.message || "");
    setIsWaiting(false);
  };

  return (
    <>
      <CoreLayout user={user} title="Profil" loading={loading}>
        <div className="xl:w-3/5 lg:w-3/4 sm:w-11/12 mx-auto mt-4 sm:mt-8 px-4 sm:px-8 z-10 relative">
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="bg-light-primary dark:bg-dark-primary shadow-xl rounded-2xl p-6 border border-light-surface dark:border-dark-surface">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-light-text dark:text-dark-text">Profil Bilgileri</h1>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-primary hover:bg-primary/90 dark:bg-secondary dark:hover:bg-secondary/90 text-white px-4 py-2 rounded-lg"
                  >
                    Düzenle
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-light-text dark:text-dark-text mb-2">Ad Soyad</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border transition bg-transparent text-light-text dark:text-dark-text placeholder:text-neutral-500 dark:placeholder:text-neutral-400 focus:ring-0 focus:outline-none focus:border-primary dark:focus:border-secondary border-light-surface dark:border-dark-surface"
                      placeholder="Ad ve soyadınızı giriniz"
                    />
                  ) : (
                    <p className="text-light-text dark:text-dark-text px-2">{user?.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-light-text dark:text-dark-text mb-2">E-posta</label>
                  {isEditing ? (
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={user?.email || ""}
                        className="w-full px-4 py-3 rounded-lg border transition bg-neutral-50 dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400 border-light-surface dark:border-dark-surface cursor-not-allowed"
                        readOnly
                        disabled
                      />
                      <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 flex items-center">
                        <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        E-posta adresi değiştirilemez
                      </div>
                    </div>
                  ) : (
                    <div className="relative flex items-center justify-between">
                      <p className="text-light-text dark:text-dark-text px-2">{user?.email}</p>
                      {user?.email_verified_at ? (
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium flex items-center">
                          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Doğrulandı
                        </span>
                      ) : (
                        <button
                          className="flex items-center justify-center py-1 px-2 gap-1"
                          onClick={handleSendVerificationEmail}
                          disabled={verificationSent}
                        >
                          {verificationSent && <TiTick className="text-green-500" />}
                          {isWaiting && <AiOutlineLoading3Quarters className="animate-spin text-primary dark:text-secondary mx-1" />}
                          {!verificationSent ? (
                            <h1 className="text-xs text-primary dark:text-secondary underline">Doğrulama E-postası Gönder</h1>
                          ) : (
                            <h1 className="text-xs text-green-700 dark:text-green-500 underline">{message}</h1>
                          )}
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {isEditing && (
                  <div className="flex gap-3 pt-4">
                    <button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-lg">
                      Kaydet
                    </button>
                    <button onClick={handleCancel} className="bg-neutral-600 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg shadow-lg">
                      İptal
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* User Statistics */}
            <div className="bg-light-primary dark:bg-dark-primary shadow-xl rounded-2xl p-6 border border-light-surface dark:border-dark-surface">
              <h2 className="text-xl font-semibold text-light-text dark:text-dark-text mb-4">İstatistikler</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-light-primary dark:bg-dark-secondary rounded-lg border border-light-surface dark:border-dark-surface">
                  <div className="text-2xl font-bold text-primary dark:text-secondary">0</div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">İzlenen Filmler</div>
                </div>
                <div className="text-center p-4 bg-light-primary dark:bg-dark-secondary rounded-lg border border-light-surface dark:border-dark-surface">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">0</div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">Favoriler</div>
                </div>
                <div className="text-center p-4 bg-light-primary dark:bg-dark-secondary rounded-lg border border-light-surface dark:border-dark-surface">
                  <div className="text-2xl font-bold text-light-text dark:text-dark-text">0</div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">Seyir Listesi</div>
                </div>
              </div>
            </div>

            {/* Account Settings */}
            <div className="bg-light-primary dark:bg-dark-primary shadow-xl rounded-2xl p-6 border border-light-surface dark:border-dark-surface">
              <h2 className="text-xl font-semibold text-light-text dark:text-dark-text mb-4">Hesap Ayarları</h2>
              <div className="flex gap-3">
                <button
                  disabled
                  className="disabled:opacity-50 w-full text-left px-4 py-3 bg-light-primary dark:bg-dark-secondary rounded-lg border border-light-surface dark:border-dark-surface"
                >
                  <div className="font-medium text-light-text dark:text-dark-text">Şifre Değiştir</div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">Hesap şifrenizi güncelleyin</div>
                </button>
                <button
                  disabled
                  className="disabled:opacity-50 w-full text-left px-4 py-3 bg-red-200 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800/50"
                >
                  <div className="font-medium text-red-600 dark:text-red-400">Hesabı Sil</div>
                  <div className="text-sm text-red-500 dark:text-red-400">Hesabınızı kalıcı olarak silin</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </CoreLayout>
      <img
        className="absolute inset-0 object-cover w-full h-full z-0 opacity-25 dark:opacity-5 select-none pointer-events-none"
        src="/assets/images/profile_background.jpeg"
        alt="Profile Background"
      />
    </>
  );
};

export default Profile;
