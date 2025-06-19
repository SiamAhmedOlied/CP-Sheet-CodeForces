
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navigation from '@/components/Navigation';
import UserProfile from '@/components/UserProfile';
import { codeforcesApi } from '@/services/codeforcesApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, AlertCircle, Calendar, Users, Trophy, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Contest {
  id: number;
  name: string;
  type: string;
  phase: string;
  frozen: boolean;
  durationSeconds: number;
  startTimeSeconds: number;
  relativeTimeSeconds: number;
}

const Contest = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [phaseFilter, setPhaseFilter] = useState('');

  const { data: contests, isLoading, error } = useQuery({
    queryKey: ['contests'],
    queryFn: async () => {
      const response = await codeforcesApi.getContests();
      return response as Contest[];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const filteredContests = useMemo(() => {
    if (!contests) return [];
    
    let filtered = contests;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(contest =>
        contest.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Phase filter
    if (phaseFilter) {
      filtered = filtered.filter(contest => contest.phase === phaseFilter);
    }

    // Sort by start time (most recent first)
    return filtered.sort((a, b) => b.startTimeSeconds - a.startTimeSeconds);
  }, [contests, searchTerm, phaseFilter]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'BEFORE': return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
      case 'CODING': return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'PENDING_SYSTEM_TEST': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'SYSTEM_TEST': return 'text-orange-400 bg-orange-400/10 border-orange-400/30';
      case 'FINISHED': return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
    }
  };

  const openContest = (contestId: number) => {
    window.open(`https://codeforces.com/contest/${contestId}`, '_blank');
  };

  if (error) {
    return (
      <div className="min-h-screen matrix-bg">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Alert className="border-red-500/50 bg-red-500/10">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-400">
              Failed to load contests. Please check your internet connection and try again.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen matrix-bg">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-orbitron font-bold neon-text glitch-effect mb-4" data-text="CONTESTS">
            CONTESTS
          </h1>
          <p className="text-gray-400 font-mono">
            {isLoading ? 'Loading contests...' : `${filteredContests.length} contests available`}
          </p>
        </div>

        {/* User Profile */}
        <div className="mb-8">
          <UserProfile />
        </div>

        {/* Filters */}
        <Card className="terminal-window mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search contests by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-black/50 border-green-400/30 text-green-400 placeholder-green-400/50"
                />
              </div>
              
              <div className="flex gap-2">
                {['', 'BEFORE', 'CODING', 'FINISHED'].map((phase) => (
                  <Button
                    key={phase}
                    onClick={() => setPhaseFilter(phase)}
                    variant={phaseFilter === phase ? "default" : "outline"}
                    size="sm"
                    className={`${
                      phaseFilter === phase 
                        ? 'bg-green-400/20 text-green-400 border-green-400' 
                        : 'border-gray-600 text-gray-300 hover:border-green-400 hover:text-green-400'
                    }`}
                  >
                    {phase || 'All'}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contests List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-green-400" />
            <span className="ml-2 text-green-400 font-mono">Loading contests...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredContests.map((contest) => (
              <Card key={contest.id} className="terminal-window">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 
                          className="text-xl font-semibold text-white hover:text-green-400 transition-colors cursor-pointer"
                          onClick={() => openContest(contest.id)}
                        >
                          {contest.name}
                        </h3>
                        <span className={`px-2 py-1 rounded text-xs font-bold border ${getPhaseColor(contest.phase)}`}>
                          {contest.phase.replace('_', ' ')}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(contest.startTimeSeconds)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Trophy className="w-4 h-4" />
                          <span>{formatDuration(contest.durationSeconds)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{contest.type}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => openContest(contest.id)}
                        variant="outline"
                        size="sm"
                        className="border-blue-400/30 text-blue-400 hover:bg-blue-400/10"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        View Contest
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredContests.length === 0 && !isLoading && (
          <div className="text-center py-20">
            <AlertCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 font-mono">No contests found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contest;
