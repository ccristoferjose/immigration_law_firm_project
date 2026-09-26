import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, User, LogOut, ChevronLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/dashboard/appointments', label: 'Appointments', icon: Calendar },
  { to: '/dashboard/profile', label: 'Profile', icon: User },
];

export default function DashboardLayout() {
  const { clientProfile, client, clientSignOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await clientSignOut();
    navigate('/');
  }

  const displayName =
    clientProfile?.full_name || client?.displayName || client?.email || 'Your account';

  return (
    <div className="min-h-screen bg-brand-50/50">
      <header className="bg-white border-b border-border">
        <div className="container mx-auto h-16 px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-brand-800 hover:text-brand-600">
            <ChevronLeft className="h-5 w-5" /> Back to site
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {displayName}
            </span>
            <button
              onClick={handleSignOut}
              className="text-sm text-muted-foreground hover:text-brand-700 flex items-center gap-1"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 grid md:grid-cols-[220px_1fr] gap-8">
        <aside>
          <nav className="flex md:flex-col gap-1 flex-wrap">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? 'bg-brand-700 text-white'
                      : 'text-brand-900 hover:bg-brand-50'
                  }`
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
