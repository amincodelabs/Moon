import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource-variable/vazirmatn";
import "./styles.css";
import "./motion.css";
import "./scroll-story.css";
import "./account.css";
import App from "./App";
import { appPath } from "./site";
const StoreApp = React.lazy(() => import("./store/StoreApp"));
const pathname = appPath();
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {pathname === "/store" || pathname.startsWith("/store/") ? (
      <React.Suspense
        fallback={
          <div role="status" style={{ padding: 40 }}>
            AvaStar / آوااستار
          </div>
        }
      >
        <StoreApp />
      </React.Suspense>
    ) : (
      <App />
    )}
  </React.StrictMode>,
);
