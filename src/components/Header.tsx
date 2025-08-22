import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  return (
    <header className="nav">
      <h1>Insyd Notifications</h1>
      <nav>
        <Link to="/notifications" className={location.pathname.includes('/notifications') ? 'active' : ''}>
          Notifications
        </Link>
        <Link to="/create" className={location.pathname.includes('/create') ? 'active' : ''}>
          Create Event
        </Link>
      </nav>
    </header>
  );
}
