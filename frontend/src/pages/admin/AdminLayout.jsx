import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Calendar, Users, Settings, Tag, LogOut, ClipboardCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { admin, adminLogout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { to: '/admin/calendar', label: 'Calendar', icon: Calendar },
    { to: '/admin/clients',  label: 'Clients',  icon: Users },
    { to: '/admin/types',    label: 'Services', icon: Tag },
    // Review queue visible to admin and assistant roles
    ...(admin?.role === 'admin' || admin?.role === 'assistant'
      ? [{ to: '/admin/review', label: 'Review Queue', icon: ClipboardCheck }]
      : []),
    { to: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-brand-50">
      {/* Sidebar */}
      <aside className="hidden md:flex md:w-60 lg:w-64 flex-col bg-brand-950 text-brand-100">
        <div className="h-16 flex items-center gap-2 px-5 border-b border-white/10">
          <div className="h-8 w-8 rounded bg-brand-700 text-white flex items-center justify-center font-serif">L</div>
          <div className="font-serif text-lg text-white">Legal Ops</div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive ? 'bg-white/10 text-white' : 'text-brand-200 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <n.icon className="h-4 w-4" />
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10">
          <div className="px-2 py-2 text-xs text-brand-300 truncate">{admin?.email}</div>
          <button
            onClick={() => {
              adminLogout();
              navigate('/');
            }}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm text-brand-200 hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden bg-white border-b border-border h-14 flex items-center px-4 gap-2 overflow-x-auto">
          {navItems.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm whitespace-nowrap ${
                  isActive ? 'bg-brand-700 text-white' : 'text-brand-800 hover:bg-brand-50'
                }`
              }
            >
              <n.icon className="h-4 w-4" />
              {n.label}
            </NavLink>
          ))}
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
