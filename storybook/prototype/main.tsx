import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../../tokens/tokens.css";
import "../src/styles/components.css";
import "./prototype.css";
import { App } from "./App";
import { Gate } from "./Gate";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Gate>
      <App />
    </Gate>
  </StrictMode>,
);
