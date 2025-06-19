
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { codeforcesApi, getRatingClass, getRatingTitle } from '@/services/codeforcesApi';
import { Trophy, Target, TrendingUp, Calendar, Award, Clock } from 'lucide-react';

interface UserStatisticsProps {
  handle: string;
}

const UserStatistics = ({ handle }: UserStatisticsProps) => {
  const { data: userInfo, isLoading } = useQuery({
    queryKey: ['userInfo', handle],
    queryFn: async () => {
      if (!handle) return null;
      const users = await codeforcesApi.getUserInfo(handle);
      return users[0];
    },
    enabled: !!handle,
  });

  const { data: userSubmissions } = useQuery({
    queryKey: ['userSubmissions', handle],
    queryFn: async () => {
      if (!handle) return null;
      return await codeforcesApi.getUserStatus(handle, 1, 10000);
    },
    enabled: !!handle,
  });

  const { data: userRatingHistory } = useQuery({
    queryKey: ['userRating', handle],
    queryFn: async () => {
      if (!handle) return null;
      try {
        return await codeforcesApi.getUserRating(handle);
      } catch (error) {
        // User might not have participated in rated contests
        return [];
      }
    },
    enabled: !!handle,
  });

  if (!handle || isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="terminal-window">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-green-400/20 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-green-400/20 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!userInfo) {
    return null;
  }

  // Calculate statistics
  const solvedProblems = new Set();
  const ratingDistribution: Record<string, number> = {};
  const tagDistribution: Record<string, number> = {};
  let totalSubmissions = 0;
  let acceptedSubmissions = 0;

  if (userSubmissions) {
    totalSubmissions = userSubmissions.length;
    
    userSubmissions.forEach((submission: any) => {
      if (submission.verdict === 'OK') {
        acceptedSubmissions++;
        const problemKey = `${submission.problem.contestId}-${submission.problem.index}`;
        if (!solvedProblems.has(problemKey)) {
          solvedProblems.add(problemKey);
          
          // Rating distribution
          if (submission.problem.rating) {
            const ratingRange = Math.floor(submission.problem.rating / 200) * 200;
            const rangeKey = `${ratingRange}-${ratingRange + 199}`;
            ratingDistribution[rangeKey] = (ratingDistribution[rangeKey] || 0) + 1;
          }
          
          // Tag distribution
          if (submission.problem.tags) {
            submission.problem.tags.forEach((tag: string) => {
              tagDistribution[tag] = (tagDistribution[tag] || 0) + 1;
            });
          }
        }
      }
    });
  }

  const acceptanceRate = totalSubmissions > 0 ? Math.round((acceptedSubmissions / totalSubmissions) * 100) : 0;
  const contestsParticipated = userRatingHistory ? userRatingHistory.length : 0;
  const maxRating = userInfo.maxRating || userInfo.rating || 0;
  const currentRating = userInfo.rating || 0;

  // Get most solved rating range
  const mostSolvedRating = Object.entries(ratingDistribution)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';

  // Get favorite tags (top 3)
  const favoriteTags = Object.entries(tagDistribution)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([tag]) => tag);

  const registrationDate = new Date(userInfo.registrationTimeSeconds * 1000);
  const daysSinceRegistration = Math.floor((Date.now() - registrationDate.getTime()) / (1000 * 60 * 60 * 24));

  const stats = [
    {
      label: 'Problems Solved',
      value: solvedProblems.size.toString(),
      icon: Trophy,
      color: 'text-green-400',
    },
    {
      label: 'Current Rating',
      value: currentRating.toString(),
      icon: TrendingUp,
      color: 'text-purple-400',
      badge: getRatingTitle(currentRating),
      badgeClass: getRatingClass(currentRating),
    },
    {
      label: 'Max Rating',
      value: maxRating.toString(),
      icon: Award,
      color: 'text-blue-400',
      badge: getRatingTitle(maxRating),
      badgeClass: getRatingClass(maxRating),
    },
    {
      label: 'Contests',
      value: contestsParticipated.toString(),
      icon: Target,
      color: 'text-orange-400',
    },
    {
      label: 'Total Submissions',
      value: totalSubmissions.toString(),
      icon: Calendar,
      color: 'text-cyan-400',
    },
    {
      label: 'Acceptance Rate',
      value: `${acceptanceRate}%`,
      icon: TrendingUp,
      color: 'text-pink-400',
    },
    {
      label: 'Days Active',
      value: daysSinceRegistration.toString(),
      icon: Clock,
      color: 'text-yellow-400',
    },
    {
      label: 'Favorite Rating',
      value: mostSolvedRating,
      icon: Target,
      color: 'text-indigo-400',
    },
  ];

  return (
    <>
      {/* Main Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="terminal-window">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
                  <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                  {stat.badge && (
                    <Badge className={`mt-2 ${stat.badgeClass} text-xs`}>
                      {stat.badge}
                    </Badge>
                  )}
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Information Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Favorite Tags */}
        <Card className="terminal-window">
          <CardHeader>
            <CardTitle className="text-green-400 font-orbitron">Favorite Problem Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {favoriteTags.length > 0 ? favoriteTags.map((tag) => (
                <Badge key={tag} variant="outline" className="border-green-400/30 text-green-400">
                  {tag} ({tagDistribution[tag]})
                </Badge>
              )) : (
                <p className="text-gray-400">No solved problems yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card className="terminal-window">
          <CardHeader>
            <CardTitle className="text-purple-400 font-orbitron">Account Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Handle:</span>
                <span className="text-white font-mono">{userInfo.handle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Registered:</span>
                <span className="text-white">{registrationDate.toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Contribution:</span>
                <span className={`font-bold ${userInfo.contribution >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {userInfo.contribution}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Friends:</span>
                <span className="text-white">{userInfo.friendOfCount || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default UserStatistics;
