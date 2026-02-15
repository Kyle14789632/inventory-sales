import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import React from "react";
import ReactDOM from "react-dom/client";

import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import App from "./app/App.jsx";
import { theme } from "./theme";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Notifications position="top-right" />
        <ModalsProvider>
          <App />
        </ModalsProvider>
      </QueryClientProvider>
    </MantineProvider>
  </React.StrictMode>,
);
