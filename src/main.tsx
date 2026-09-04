/// <reference types="vite-plugin-pwa/client" />

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./redux/store/index.ts";
import "./main.scss";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import "bootstrap-icons/font/bootstrap-icons.css";
import { registerSW } from "virtual:pwa-register";

registerSW({ immediate: true });

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ToastContainer position="bottom-right" autoClose={3000} />
    <App />
  </Provider>,
);
