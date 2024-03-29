import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider, Helmet } from "react-helmet-async";

import { Toaster } from "sonner";
import { setDefaultOptions } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { ThemeProvider } from "./app/contexts/theme-context";

import { queryClient } from "./app/lib/react-query";

import { router } from "./routes";

setDefaultOptions({
  locale: ptBR,
})

export function App() {
  return (
    <HelmetProvider>
      <ThemeProvider storageKey="pizzashop-theme" defaultTheme="system">
        <Helmet titleTemplate="%s | pizza.shop" />
        <Toaster richColors closeButton />

        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}
