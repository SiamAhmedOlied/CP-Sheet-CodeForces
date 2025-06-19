
import { useState } from 'react';
import { Search, Filter, SlidersHorizontal } from 'luc';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

interface FilterProps {
  onSearch: (term: string) => void;
  onRatingFilter: (rating: string) => void;
  onTagFilter: (tag: string) => void;
  onStatusFilter: (status: string) => void;
  tags: string[];
}

const ProblemFilters = ({ onSearch, onRatingFilter, onTagFilter, onStatusFilter, tags }: FilterProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const ratingRanges = [
    { label: 'All Ratings', value: '' },
    { label: '800-1200 (Newbie)', value: '800-1200' },
    { label: '1200-1400 (Pupil)', value: '1200-1400' },
    { label: '1400-1600 (Specialist)', value: '1400-1600' },
    { label: '1600-1900 (Expert)', value: '1600-1900' },
    { label: '1900-2100 (CM)', value: '1900-2100' },
    { label: '2100+ (Master+)', value: '2100+' },
  ];

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <Card className="terminal-window mb-6">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search problems by name..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 bg-black/50 border-green-400/30 text-green-400 placeholder-green-400/50"
            />
          </div>
          
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className="flex items-center space-x-2 border-purple-400/30 text-purple-400 hover:bg-purple-400/10"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </Button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-700">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Rating Range</label>
              <Select onValueChange={onRatingFilter}>
                <SelectTrigger className="bg-black/50 border-gray-600 text-white">
                  <SelectValue placeholder="Select rating range" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  {ratingRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value} className="text-white hover:bg-gray-800">
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Problem Tag</label>
              <Select onValueChange={onTagFilter}>
                <SelectTrigger className="bg-black/50 border-gray-600 text-white">
                  <SelectValue placeholder="Select tag" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700 max-h-60">
                  <SelectItem value="" className="text-white hover:bg-gray-800">All Tags</SelectItem>
                  {tags.slice(0, 20).map((tag) => (
                    <SelectItem key={tag} value={tag} className="text-white hover:bg-gray-800">
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <Select onValueChange={onStatusFilter}>
                <SelectTrigger className="bg-black/50 border-gray-600 text-white">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="" className="text-white hover:bg-gray-800">All Problems</SelectItem>
                  <SelectItem value="completed" className="text-white hover:bg-gray-800">Completed</SelectItem>
                  <SelectItem value="not-completed" className="text-white hover:bg-gray-800">Not Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProblemFilters;
