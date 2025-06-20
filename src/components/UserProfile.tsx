import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { User, Award, TrendingUp, Calendar } from 'lucide-react';
import { codeforcesApi, getRatingClass, getRatingTitle } from '@/services/codeforcesApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { getVerificationBadge } from '@/services/verificationService';
import { CheckCircle, Crown } from 'lucide-react';

interface UserData {
  handle: string;
  rating?: number;
  maxRating?: number;
  rank?: string;
  maxRank?: string;
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
      console.log('User data from API:', users[0]); // Debug log
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

  const handleProfileClick = () => {
    if (userData?.handle) {
      window.open(`https://codeforces.com/profile/${userData.handle}`, '_blank');
    }
  };

  // Function to get the appropriate badge based on rating
  const getRatingBadge = (rating: number | undefined) => {
    // Handle undefined or null rating values
    const actualRating = rating || 0;
    console.log('Rating for badge calculation:', actualRating); // Debug log
    
    if (actualRating === 0) return { text: 'Unrated', class: 'rating-newbie' };
    if (actualRating < 1200) return { text: 'Newbie', class: 'rating-newbie' };
    if (actualRating < 1400) return { text: 'Pupil', class: 'rating-pupil' };
    if (actualRating < 1600) return { text: 'Specialist', class: 'rating-specialist' };
    if (actualRating < 1900) return { text: 'Expert', class: 'rating-expert' };
    if (actualRating < 2100) return { text: 'Candidate Master', class: 'rating-candidate-master' };
    if (actualRating < 2300) return { text: 'Master', class: 'rating-master' };
    if (actualRating < 2400) return { text: 'International Master', class: 'rating-international-master' };
    if (actualRating < 2600) return { text: 'Grandmaster', class: 'rating-grandmaster' };
    if (actualRating < 3000) return { text: 'International Grandmaster', class: 'rating-international-grandmaster' };
    return { text: 'Legendary Grandmaster', class: 'rating-legendary-grandmaster' };
  };

  // Verification Badge Component
  const VerificationBadge = ({ handle, rating }: { handle: string; rating?: number }) => {
    const badge = getVerificationBadge(handle, rating);
    
    if (badge.type === 'none') return null;
    
    return (
      <div 
        className="absolute -top-1 -right-1 cursor-pointer hover:scale-110 transition-transform duration-200"
        onClick={handleProfileClick}
        title={badge.description}
      >
        {badge.type === 'golden' ? (
          <Crown className="w-5 h-5 text-yellow-500 drop-shadow-lg" />
        ) : (
          <CheckCircle className="w-5 h-5 text-blue-500 drop-shadow-lg" />
        )}
      </div>
    );
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

  const ratingBadge = getRatingBadge(userData?.rating);
  const currentRating = userData?.rating || 0;

  return (
    <Card className="terminal-window">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={userData.avatar || `https://userpic.codeforces.org/no-title.jpg`}
              alt={userData.handle}
              className="w-16 h-16 rounded-full border-2 border-green-400 pulse-neon cursor-pointer hover:scale-105 transition-transform duration-200"
              onClick={handleProfileClick}
              title="Click to visit Codeforces profile"
            />
            <div 
              className={`absolute -bottom-1 -right-1 px-2 py-1 rounded-full text-xs font-bold cursor-pointer hover:scale-110 transition-transform duration-200 ${ratingBadge.class}`}
              onClick={handleProfileClick}
              title={`${ratingBadge.text} (${currentRating})`}
            >
              <Award className="w-3 h-3" />
            </div>
            <VerificationBadge handle={userData.handle} rating={userData.rating} />
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
                <span 
                  className={`text-sm font-bold px-3 py-1 rounded cursor-pointer hover:scale-105 transition-transform duration-200 ${ratingBadge.class}`}
                  onClick={handleProfileClick}
                  title="Click to visit Codeforces profile"
                >
                  {currentRating} ({ratingBadge.text})
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
