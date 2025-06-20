import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy, Medal, Award, CheckCircle, Crown } from 'lucide-react';
import { codeforcesApi, getRatingClass, getRatingTitle } from '@/services/codeforcesApi';
import { getVerificationBadge } from '@/services/verificationService';

interface LeaderboardUser {
  handle: string;
  rating?: number;
  maxRating?: number;
  rank?: string;
  country?: string;
  city?: string;
  avatar: string;
  firstName?: string;
  lastName?: string;
}

const Leaderboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [countryFilter, setCountryFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [users, setUsers] = useState<string[]>([
    'tourist', 'Benq', 'Um_nik', 'jiangly', 'Radewoosh', 'SiamAhmedOlied',
    'mnbvmar', 'scott_wu', 'Petr', 'apiad', 'ecnerwala', 'ksun48'
  ]);

  const { data: leaderboardData, isLoading } = useQuery({
    queryKey: ['leaderboard', users],
    queryFn: async () => {
      try {
        const userHandles = users.join(';');
        const userData = await codeforcesApi.getUserInfo(userHandles);
        return userData.sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0));
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return [];
      }
    },
    enabled: users.length > 0,
  });

  const addUser = () => {
    if (searchQuery.trim() && !users.includes(searchQuery.trim())) {
      setUsers([...users, searchQuery.trim()]);
      setSearchQuery('');
    }
  };

  // Get unique countries and cities for filters with proper typing
  const countries: string[] = leaderboardData ? 
    [...new Set(
      leaderboardData
        .map((user: any) => user.country)
        .filter((country): country is string => typeof country === 'string' && country.length > 0)
    )] : [];
  
  const cities: string[] = leaderboardData ?
    [...new Set(
      leaderboardData
        .map((user: any) => user.city)
        .filter((city): city is string => typeof city === 'string' && city.length > 0)
    )] : [];

  // Filter users based on search and location filters
  const filteredUsers = leaderboardData?.filter((user: any) => {
    const matchesSearch = !searchQuery || 
      user.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCountry = countryFilter === 'all' || user.country === countryFilter;
    const matchesCity = cityFilter === 'all' || user.city === cityFilter;
    
    return matchesSearch && matchesCountry && matchesCity;
  }) || [];

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (index === 1) return <Medal className="w-5 h-5 text-gray-400" />;
    if (index === 2) return <Award className="w-5 h-5 text-amber-600" />;
    return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-400">#{index + 1}</span>;
  };

  const VerificationBadgeComponent = ({ handle, rating }: { handle: string; rating?: number }) => {
    const badge = getVerificationBadge(handle, rating);
    
    if (badge.type === 'none') return null;
    
    return (
      <div className="relative inline-block" title={badge.description}>
        {badge.type === 'golden' ? (
          <Crown className="w-4 h-4 text-yellow-500" />
        ) : (
          <CheckCircle className="w-4 h-4 text-blue-500" />
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card className="terminal-window">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-400/20 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-green-400/20 rounded w-1/3"></div>
                  <div className="h-3 bg-green-400/20 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="terminal-window">
      <CardHeader>
        <CardTitle className="text-green-400 font-orbitron flex items-center space-x-2">
          <Trophy className="w-6 h-6" />
          <span>Global Leaderboard</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="flex space-x-2">
            <Input
              placeholder="Add user handle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-black/50 border-green-400/30 text-green-400"
              onKeyPress={(e) => e.key === 'Enter' && addUser()}
            />
            <Button onClick={addUser} className="cyber-button px-4">
              Add
            </Button>
          </div>
          
          <Select value={countryFilter} onValueChange={setCountryFilter}>
            <SelectTrigger className="bg-black/50 border-green-400/30 text-green-400">
              <SelectValue placeholder="Filter by Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              {countries.map((country) => (
                <SelectItem key={country} value={country}>{country}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={cityFilter} onValueChange={setCityFilter}>
            <SelectTrigger className="bg-black/50 border-green-400/30 text-green-400">
              <SelectValue placeholder="Filter by City" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={() => {
              setCountryFilter('all');
              setCityFilter('all');
              setSearchQuery('');
            }}
            variant="outline"
            className="border-green-400/30 text-green-400 hover:bg-green-400/10"
          >
            Clear Filters
          </Button>
        </div>

        {/* Leaderboard Table */}
        <div className="rounded-lg border border-green-400/30 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-green-400/30 hover:bg-green-400/5">
                <TableHead className="text-green-400">Rank</TableHead>
                <TableHead className="text-green-400">User</TableHead>
                <TableHead className="text-green-400">Rating</TableHead>
                <TableHead className="text-green-400">Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user: any, index) => {
                const verificationBadge = getVerificationBadge(user.handle, user.rating);
                const ratingClass = getRatingClass(user.rating || 0);
                
                return (
                  <TableRow 
                    key={user.handle} 
                    className="border-green-400/20 hover:bg-green-400/5 cursor-pointer"
                    onClick={() => window.open(`https://codeforces.com/profile/${user.handle}`, '_blank')}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        {getRankIcon(index)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <img
                          src={user.avatar || 'https://userpic.codeforces.org/no-title.jpg'}
                          alt={user.handle}
                          className="w-8 h-8 rounded-full border border-green-400/50"
                        />
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-white">{user.handle}</span>
                          <VerificationBadgeComponent handle={user.handle} rating={user.rating} />
                        </div>
                        {(user.firstName || user.lastName) && (
                          <span className="text-gray-400 text-sm">
                            {user.firstName} {user.lastName}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${ratingClass} text-xs`}>
                        {user.rating || 'Unrated'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-400">
                      <div className="text-sm">
                        {user.country && <div>{user.country}</div>}
                        {user.city && <div className="text-xs text-gray-500">{user.city}</div>}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No users found matching your criteria.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
