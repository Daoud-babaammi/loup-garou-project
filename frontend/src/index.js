import React from "react";
import ReactDOM from "react-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux'
import "./index.css";
import { App } from "./App";
import { store } from "./store";

const queryClient = new QueryClient();

ReactDOM.render(
    <Provider store={store}>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </QueryClientProvider>
    </Provider>,
  document.getElementById("root")
);
