import ReactDOM from "react-dom/client";
// import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "@/providers/Auth";
import { ThemeProvider } from "@/providers/Theme";
import AppRoutes from "@/router";
import { Toaster } from "react-hot-toast";

import "@/styles/app.css";

function App() {
  return (
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
        </main>
      </AuthProvider>
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
