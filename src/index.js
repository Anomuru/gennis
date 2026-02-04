import React from 'react';
import ReactDOM from 'react-dom/client';
import App from "./components/app/App"
import { Provider } from "react-redux"

import "./styles/style.sass"
import { BrowserRouter as Router } from "react-router-dom";
import store from "./store";
import { DevSupport } from "@react-buddy/ide-toolbox";
import { ComponentPreviews, useInitial } from "dev";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <Router basename={"/"}>
            <Provider store={store}>
                <DevSupport
                    ComponentPreviews={ComponentPreviews}
                    useInitialHook={useInitial}
                >
                    <App />
                </DevSupport>
            </Provider>
        </Router>
    </React.StrictMode>
);

