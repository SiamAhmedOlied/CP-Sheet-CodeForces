
import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import UserProfile from '@/components/UserProfile';
import UserStatistics from '@/components/UserStatistics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Trophy, Target, TrendingUp, Calendar } from 'lucide-react';

const Index = () => {
  const [userHandle, setUserHandle] = useState(() => localStorage.getItem('cf_handle') || '');

  // Listen for changes to the stored handle
  useEffect(() => {
    const handleStorageChange = () => {
      setUserHandle(localStorage.getItem('cf_handle') || '');
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for direct localStorage changes in the same tab
    const interval = setInterval(() => {
      const currentHandle = localStorage.getItem('cf_handle') || '';
      if (currentHandle !== userHandle) {
        setUserHandle(currentHandle);
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [userHandle]);

  // Mock data for charts when no user is selected
  const defaultRatingData = [
    { rating: '800-1200', count: 45, color: '#6b7280' },
    { rating: '1200-1400', count: 32, color: '#10b981' },
    { rating: '1400-1600', count: 28, color: '#06b6d4' },
    { rating: '1600-1900', count: 15, color: '#3b82f6' },
    { rating: '1900+', count: 8, color: '#8b5cf6' },
  ];

  const defaultTagData = [
    { name: 'Implementation', value: 35, color: '#00ff41' },
    { name: 'Math', value: 28, color: '#8b5cf6' },
    { name: 'Greedy', value: 22, color: '#00bfff' },
    { name: 'DP', value: 18, color: '#ff6b6b' },
    { name: 'Graph', value: 12, color: '#ffd93d' },
    { name: 'Others', value: 15, color: '#6c757d' },
  ];

  return (
    <div className="min-h-screen matrix-bg">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-orbitron font-bold neon-text glitch-effect mb-4" data-text="COMPETITIVE PROGRAMMING DASHBOARD">
            COMPETITIVE PROGRAMMING DASHBOARD
          </h1>
          <p className="text-gray-400 font-mono">Track your journey to becoming a competitive programming master</p>
        </div>

        {/* User Profile */}
        <div className="mb-8">
          <UserProfile />
        </div>

        {/* User Statistics - Only show if user is connected */}
        {userHandle && (
          <UserStatistics handle={userHandle} />
        )}

        {/* Default Charts - Show when no user is connected */}
        {!userHandle && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card className="terminal-window">
              <CardHeader>
                <CardTitle className="text-green-400 font-orbitron">Sample Problems by Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={defaultRatingData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="rating" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #00ff41',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="count" fill="#00ff41" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="terminal-window">
              <CardHeader>
                <CardTitle className="text-purple-400 font-orbitron">Sample Problems by Tag</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={defaultTagData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {defaultTagData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #8b5cf6',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <Card className="terminal-window">
          <CardHeader>
            <CardTitle className="text-blue-400 font-orbitron">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="cyber-button p-6 text-left">
                <Target className="w-8 h-8 mb-2 text-green-400" />
                <h3 className="font-semibold mb-1">Practice Problems</h3>
                <p className="text-sm text-gray-400">Solve problems based on your skill level</p>
              </button>
              
              <button className="cyber-button p-6 text-left">
                <Trophy className="w-8 h-8 mb-2 text-purple-400" />
                <h3 className="font-semibold mb-1">Virtual Contests</h3>
                <p className="text-sm text-gray-400">Participate in past contests</p>
              </button>
              
              <button className="cyber-button p-6 text-left">
                <TrendingUp className="w-8 h-8 mb-2 text-blue-400" />
                <h3 className="font-semibold mb-1">Progress Analysis</h3>
                <p className="text-sm text-gray-400">Track your improvement over time</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
