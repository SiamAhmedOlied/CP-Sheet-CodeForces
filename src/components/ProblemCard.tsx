
import { useState } from 'react';
import { ExternalLink, Check, X, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getRatingClass, getProblemUrl } from '@/services/codeforcesApi';

interface Problem {
  contestId: number;
  index: string;
  name: string;
  rating?: number;
  tags: string[];
  solvedCount?: number;
}

interface ProblemCardProps {
  problem: Problem;
  isContest?: boolean;
}

const ProblemCard = ({ problem, isContest = false }: ProblemCardProps) => {
  const problemKey = `${problem.contestId}-${problem.index}`;
  const [isCompleted, setIsCompleted] = useState(() => {
    const completed = JSON.parse(localStorage.getItem('completed_problems') || '{}');
    return completed[problemKey] || false;
  });

  const toggleCompleted = () => {
    const completed = JSON.parse(localStorage.getItem('completed_problems') || '{}');
    completed[problemKey] = !isCompleted;
    localStorage.setItem('completed_problems', JSON.stringify(completed));
    setIsCompleted(!isCompleted);
  };

  const openProblem = () => {
    window.open(getProblemUrl(problem.contestId, problem.index, isContest), '_blank');
  };

  return (
    <Card className={`problem-card ${isCompleted ? 'border-green-400/70 bg-green-400/5' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-gray-400 font-mono text-sm">
                {problem.contestId}{problem.index}
              </span>
              {problem.rating && (
                <span className={`rating-badge ${getRatingClass(problem.rating)}`}>
                  {problem.rating}
                </span>
              )}
              {problem.solvedCount && (
                <span className="text-xs text-gray-500">
                  ×{problem.solvedCount}
                </span>
              )}
            </div>
            
            <h3 className="text-lg font-semibold text-white mb-2 hover:text-green-400 transition-colors cursor-pointer"
                onClick={openProblem}>
              {problem.name}
            </h3>
            
            <div className="flex flex-wrap gap-1 mb-3">
              {problem.tags.slice(0, 4).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 text-xs bg-purple-900/30 text-purple-300 rounded border border-purple-700/30"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
              {problem.tags.length > 4 && (
                <span className="text-xs text-gray-500">+{problem.tags.length - 4} more</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <Button
            onClick={toggleCompleted}
            variant={isCompleted ? "default" : "outline"}
            size="sm"
            className={`flex items-center space-x-2 transition-all duration-300 ${
              isCompleted 
                ? 'bg-green-600 hover:bg-green-700 text-white border-green-600' 
                : 'border-gray-600 text-gray-300 hover:border-green-400 hover:text-green-400'
            }`}
          >
            {isCompleted ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
            <span>{isCompleted ? 'Completed' : 'Mark Done'}</span>
          </Button>
          
          <Button
            onClick={openProblem}
            variant="ghost"
            size="sm"
            className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            Solve
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProblemCard;
