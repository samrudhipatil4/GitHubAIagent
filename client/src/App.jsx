import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import AppLayout from './layouts/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import GuestRoute from './components/GuestRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Repositories from './pages/Repositories';
import RepositoryDetail from './pages/RepositoryDetail';
import PullRequests from './pages/PullRequests';
import PullRequestDetail from './pages/PullRequestDetail';
import Issues from './pages/Issues';
import Commits from './pages/Commits';
import Chat from './pages/Chat';
import CodeReview from './pages/CodeReview';
import SettingsPage from './pages/Settings';

export default function App() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Login />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/repositories" element={<Repositories />} />
          <Route path="/repositories/:owner/:repo" element={<RepositoryDetail />} />
          <Route path="/pull-requests" element={<PullRequests />} />
          <Route path="/pull-requests/:owner/:repo/:number" element={<PullRequestDetail />} />
          <Route path="/issues" element={<Issues />} />
          <Route path="/commits" element={<Commits />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/code-review" element={<CodeReview />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
