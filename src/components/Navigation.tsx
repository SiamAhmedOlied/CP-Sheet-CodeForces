
import { Link, useLocation } from 'react-router-dom';
import { Terminal, Trophy, Target, User, Users } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Terminal },
    { path: '/problemset', label: 'Problem Set', icon: Target },
    { path: '/contest', label: 'Contests', icon: Trophy },
    { path: '/leaderboard', label: 'Leaderboard', icon: Users },
  ];

  return (
    <nav className="bg-black/80 backdrop-blur-sm border-b neon-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <Terminal className="w-8 h-8 text-green-400 group-hover:text-green-300 transition-colors" />
            <span className="text-2xl font-orbitron font-bold neon-text glitch-effect" data-text="CP SHEETS">
              CP SHEETS
            </span>
          </Link>
          
          <div className="flex items-center space-x-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-mono transition-all duration-300 ${
                  location.pathname === path
                    ? 'bg-green-400/20 text-green-400 neon-border'
                    : 'text-gray-400 hover:text-green-400 hover:bg-green-400/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
