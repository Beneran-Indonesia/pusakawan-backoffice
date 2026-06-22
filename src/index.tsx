import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);

import "./i18n";
import { LoadingSpinner } from "./components/Loading";

const { worker } = await import("./mocks/browser");
await worker.start({
  onUnhandledRequest: "bypass",
});

root.render(
  <React.StrictMode>
    <React.Suspense fallback={<LoadingSpinner />}>
      <App />
    </React.Suspense>
  </React.StrictMode>,
);
