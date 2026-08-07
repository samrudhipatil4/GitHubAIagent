import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-github-bg px-4">
      <Outlet />
    </div>
  );
}
