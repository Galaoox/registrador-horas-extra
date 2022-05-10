import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "antd/dist/antd.css";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
            <Suspense fallback={<p>Cargando...</p>}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </Suspense>
    </React.StrictMode>
);
