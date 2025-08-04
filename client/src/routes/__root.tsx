import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import TanStackQueryLayout from '../integrations/tanstack-query/layout.tsx';

import type { QueryClient } from '@tanstack/react-query';

import SpecialOfferAlert from '@/components/Alert/SpecialOfferAlert.tsx';
import Footer from '@/components/Footer.tsx';
import Header from '@/components/Header.tsx';
import NewsLetter from '@/components/NewsLetter.tsx';
import ThemeProvider from '@/components/Providers/ThemeProvider.tsx';
import { Toaster } from 'react-hot-toast';

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <div className="container mx-auto">
      <ThemeProvider>
        <SpecialOfferAlert />
        <Header />
        <Outlet />
        <div className="relative pt-10 px-4">
          <NewsLetter />
          <Footer />
        </div>
        <Toaster position="bottom-center" />
      </ThemeProvider>
      <TanStackRouterDevtools />
      <TanStackQueryLayout />
    </div>
  ),
});
