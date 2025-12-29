import ReactDOM from "react-dom/client";
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from "@/providers/Auth";
import { ThemeProvider } from "@/providers/Theme";
import AppRoutes from "@/router";
import { Toaster } from "react-hot-toast";
import LinkedInCreators from "@/components/LinkedInCreators";

import "@/styles/app.css";

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <main className="bg-light-primary dark:bg-dark-secondary flex flex-col w-full h-full">
            <AppRoutes />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
            <LinkedInCreators />
          </main>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
