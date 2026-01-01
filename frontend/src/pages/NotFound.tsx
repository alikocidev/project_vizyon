import { useAuth } from "@/hooks/useAuth";
import CoreLayout from "@/layouts/Core";
import { Link } from "react-router-dom";

export default function NotFound() {
  const { user, loading } = useAuth();

  return (
    <CoreLayout title="Sayfa Bulunamadı" user={user} loading={loading}>
      <div className="absolute flex flex-col items-center justify-center text-center top-1/2 left-1/2 -translate-x-1/2 translate-y-1/2">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary dark:text-secondary">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-light-text dark:text-dark-text mt-4">
            Sayfa Bulunamadı
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 mt-2">
            Aradığınız sayfa mevcut değil veya taşınmış olabilir.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to="/"
            className="inline-block w-full bg-primary dark:bg-secondary/90 hover:bg-primary/90 dark:hover:bg-secondary text-white py-3 px-16 rounded-lg font-medium transition-colors"
          >
            Ana Sayfaya Dön
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-block w-full border border-neutral-300 dark:border-neutral-600 text-light-text dark:text-dark-text py-3 px-16 rounded-lg font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            Geri Dön
          </button>
        </div>
      </div>
    </CoreLayout>
  );
}
