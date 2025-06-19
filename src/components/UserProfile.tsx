
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { User, Award, TrendingUp, Calendar } from 'lucide-react';
import { codeforcesApi, getRatingClass, getRatingTitle } from '@/services/codeforcesApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

interface UserData {
  handle: string;
  rating: number;
  maxRating: number;
  rank: string;
  maxRank: string;
  avatar: string;
  firstName?: string;
  lastName?: string;
}

const UserProfile = () => {
  const [handle, setHandle] = useState(() => localStorage.getItem('cf_handle') || '');
  const [inputHandle, setInputHandle] = useState(handle);

  const { data: userData, isLoading, error } = useQuery({
    queryKey: ['user', handle],
    queryFn: async () => {
      if (!handle) return null;
      const users = await codeforcesApi.getUserInfo(handle);
      return users[0] as UserData;
    },
    enabled: !!handle,
  });

  const { data: userStats } = useQuery({
    queryKey: ['userStats', handle],
    queryFn: async () => {
      if (!handle) return null;
      const submissions = await codeforcesApi.getUserStatus(handle, 1, 5000);
      const solved = new Set();
      const ratingSum = submissions.reduce((sum: number, sub: any) => {
        if (sub.verdict === 'OK' && sub.problem.rating) {
          const problemKey = `${sub.problem.contestId}-${sub.problem.index}`;
          if (!solved.has(problemKey)) {
            solved.add(problemKey);
            return sum + sub.problem.rating;
          }
        }
        return sum;
      }, 0);
      
      return {
        totalSolved: solved.size,
        averageRating: solved.size > 0 ? Math.round(ratingSum / solved.size) : 0,
        submissions: submissions.length
      };
    },
    enabled: !!handle,
  });

  const handleSetUser = () => {
    if (inputHandle.trim()) {
      setHandle(inputHandle.trim());
      localStorage.setItem('cf_handle', inputHandle.trim());
    }
  };

  if (!handle) {
    return (
      <Card className="terminal-window">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <User className="w-8 h-8 text-green-400" />
            <div className="flex-1">
              <Input
                placeholder="Enter Codeforces handle..."
                value={inputHandle}
                onChange={(e) => setInputHandle(e.target.value)}
                className="bg-black/50 border-green-400/30 text-green-400 placeholder-green-400/50"
                onKeyPress={(e) => e.key === 'Enter' && handleSetUser()}
              />
            </div>
            <Button 
              onClick={handleSetUser}
              className="cyber-button"
              disabled={!inputHandle.trim()}
            >
              Connect Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="terminal-window">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-green-400/20 rounded-full animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-4 bg-green-400/20 rounded w-32 animate-pulse"></div>
              <div className="h-3 bg-green-400/20 rounded w-24 animate-pulse"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !userData) {
    return (
      <Card className="terminal-window border-red-500/50">
        <CardContent className="p-6">
          <div className="text-red-400 text-sm">
            Failed to load profile for "{handle}". 
            <Button 
              variant="link" 
              className="text-green-400 p-0 ml-2 h-auto"
              onClick={() => {
                setHandle('');
                localStorage.removeItem('cf_handle');
              }}
            >
              Change Handle
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="terminal-window">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={userData.avatar || `https://userpic.codeforces.org/no-title.jpg`}
              alt={userData.handle}
              className="w-16 h-16 rounded-full border-2 border-green-400 pulse-neon"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
              <Award className="w-3 h-3 text-black" />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-orbitron font-bold text-green-400">
                {userData.handle}
              </h3>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-gray-400 hover:text-green-400 p-1 h-auto"
                onClick={() => {
                  setHandle('');
                  localStorage.removeItem('cf_handle');
                }}
              >
                Change
              </Button>
            </div>
            
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                <span className={`text-sm font-bold px-2 py-1 rounded ${getRatingClass(userData.rating)}`}>
                  {userData.rating} ({getRatingTitle(userData.rating)})
                </span>
              </div>
              
              {userStats && (
                <div className="flex items-center space-x-3 text-sm text-gray-400">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>Solved: <span className="text-green-400 font-bold">{userStats.totalSolved}</span></span>
                  </span>
                  <span>Avg: <span className="text-purple-400 font-bold">{userStats.averageRating}</span></span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
