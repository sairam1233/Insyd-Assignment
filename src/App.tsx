import { Route, Routes, Navigate } from 'react-router-dom';
import NotificationsPage from './pages/NotificationsPage';
import CreateEventPage from './pages/CreateEventPage';
import Header from './components/Header';

export default function App() {
  return (
    <div className="container">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/notifications" replace />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/create" element={<CreateEventPage />} />
        </Routes>
      </main>
    </div>
  );
}
