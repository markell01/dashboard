import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import ruRU from "antd/locale/ru_RU";
import { ConfigProvider } from "antd";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfigProvider locale={ruRU} theme={{ token: {} }}>
      <App />
    </ConfigProvider>
  </StrictMode>,
);
