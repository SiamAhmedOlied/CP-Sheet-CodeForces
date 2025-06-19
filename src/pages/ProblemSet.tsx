
import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navigation from '@/components/Navigation';
import UserProfile from '@/components/UserProfile';
import ProblemFilters from '@/components/ProblemFilters';
import ProblemCard from '@/components/ProblemCard';
import { codeforcesApi } from '@/services/codeforcesApi';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Problem {
  contestId: number;
  index: string;
  name: string;
  rating?: number;
  tags: string[];
  solvedCount?: number;
}

const ProblemSet = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['problemset'],
    queryFn: async () => {
      const response = await codeforcesApi.getProblems();
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const problems = data?.problems || [];
  const problemStatistics = data?.problemStatistics || [];

  // Combine problems with their statistics
  const enrichedProblems = useMemo(() => {
    return problems.map((problem: Problem) => {
      const stats = problemStatistics.find((stat: any) => 
        stat.contestId === problem.contestId && stat.index === problem.index
      );
      return {
        ...problem,
        solvedCount: stats?.solvedCount || 0
      };
    });
  }, [problems, problemStatistics]);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    enrichedProblems.forEach((problem: Problem) => {
      problem.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [enrichedProblems]);

  // Filter problems based on current filters
  const filteredProblems = useMemo(() => {
    let filtered = enrichedProblems;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((problem: Problem) =>
        problem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        problem.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Rating filter
    if (ratingFilter) {
      if (ratingFilter === '2100+') {
        filtered = filtered.filter((problem: Problem) => problem.rating && problem.rating >= 2100);
      } else {
        const [min, max] = ratingFilter.split('-').map(Number);
        filtered = filtered.filter((problem: Problem) => 
          problem.rating && problem.rating >= min && problem.rating <= max
        );
      }
    }

    // Tag filter
    if (tagFilter) {
      filtered = filtered.filter((problem: Problem) =>
        problem.tags.includes(tagFilter)
      );
    }

    // Status filter
    if (statusFilter) {
      const completedProblems = JSON.parse(localStorage.getItem('completed_problems') || '{}');
      filtered = filtered.filter((problem: Problem) => {
        const problemKey = `${problem.contestId}-${problem.index}`;
        const isCompleted = completedProblems[problemKey] || false;
        
        if (statusFilter === 'completed') return isCompleted;
        if (statusFilter === 'not-completed') return !isCompleted;
        return true;
      });
    }

    // Sort by rating (ascending) and then by solved count (descending)
    return filtered
      .filter((problem: Problem) => problem.rating) // Only show problems with ratings
      .sort((a: Problem, b: Problem) => {
        if (a.rating !== b.rating) {
          return (a.rating || 0) - (b.rating || 0);
        }
        return (b.solvedCount || 0) - (a.solvedCount || 0);
      });
  }, [enrichedProblems, searchTerm, ratingFilter, tagFilter, statusFilter]);

  if (error) {
    return (
      <div className="min-h-screen matrix-bg">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Alert className="border-red-500/50 bg-red-500/10">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-400">
              Failed to load problems. Please check your internet connection and try again.
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
          <h1 className="text-4xl font-orbitron font-bold neon-text glitch-effect mb-4" data-text="PROBLEM SET">
            PROBLEM SET
          </h1>
          <p className="text-gray-400 font-mono">
            {isLoading ? 'Loading problems...' : `${filteredProblems.length} problems available`}
          </p>
        </div>

        {/* User Profile */}
        <div className="mb-8">
          <UserProfile />
        </div>

        {/* Filters */}
        <ProblemFilters
          onSearch={setSearchTerm}
          onRatingFilter={setRatingFilter}
          onTagFilter={setTagFilter}
          onStatusFilter={setStatusFilter}
          tags={allTags}
        />

        {/* Problems Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-green-400" />
            <span className="ml-2 text-green-400 font-mono">Loading problems...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProblems.map((problem: Problem) => (
              <ProblemCard
                key={`${problem.contestId}-${problem.index}`}
                problem={problem}
                isContest={false}
              />
            ))}
          </div>
        )}

        {filteredProblems.length === 0 && !isLoading && (
          <div className="text-center py-20">
            <AlertCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 font-mono">No problems found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemSet;
