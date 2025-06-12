import { useAuth } from '@/hooks/use-auth';
import { Redirect, Route } from 'wouter';

export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  const { token } = useAuth();

  return (
    <Route path={path}>{token ? <Component /> : <Redirect to="/auth" />}</Route>
  );
}
