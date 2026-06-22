import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);

import "./i18n";
import { LoadingSpinner } from "./components/Loading";

async function enableMocks() {
  if (import.meta.env.VITE_ENABLE_MSW !== "true") {
    return;
  }

  const { worker } = await import("./mocks/browser");
  await worker.start();
}

await enableMocks();

root.render(
  <React.StrictMode>
    <React.Suspense fallback={<LoadingSpinner />}>
      <App />
    </React.Suspense>
  </React.StrictMode>,
);
