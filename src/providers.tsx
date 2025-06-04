import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from '~/src/auth/authContext';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 2 } },
});

export const Providers: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>{children}</SessionProvider>
    </QueryClientProvider>
  );
};
