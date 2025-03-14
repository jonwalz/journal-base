import { MetricType, GoalStatus } from '~/types/goals';
import './goal-animations.css';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Button } from '~/components/ui/button';

type FiltersState = {
  status: GoalStatus | 'all';
  dateRange: 'today' | 'week' | 'month' | 'all';
  metricType: MetricType | 'all';
};

interface GoalFiltersProps {
  filters: FiltersState;
  setFilters: React.Dispatch<React.SetStateAction<FiltersState>>;
}

interface FilterDropdownProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

function FilterDropdown({ label, value, options, onChange }: FilterDropdownProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-black dark:text-white mb-1">
        {label}
      </label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="default"
            className="w-full justify-between"
          >
            <span>{options.find(opt => opt.value === value)?.label}</span>
            <ChevronDown className="ml-auto h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-background dark:bg-secondaryBlack"
          align="start"
          side="bottom"
          sideOffset={4}
        >
          {options.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onChange(option.value)}
              className="gap-2 p-2 mb-2 cursor-pointer"
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default function GoalFilters({ filters, setFilters }: GoalFiltersProps) {
  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'suggested', label: 'Suggested' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'completed', label: 'Completed' },
    { value: 'deleted', label: 'Deleted' },
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
  ];

  const metricOptions = [
    { value: 'all', label: 'All Metrics' },
    { value: 'resilience', label: 'Resilience' },
    { value: 'effort', label: 'Effort' },
    { value: 'challenge', label: 'Challenge' },
    { value: 'feedback', label: 'Feedback' },
    { value: 'learning', label: 'Learning' },
  ];

  return (
    <div className="rounded-base border-2 border-border dark:border-gray-700 bg-white dark:bg-gray-800 p-4 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FilterDropdown
          label="Status"
          value={filters.status}
          options={statusOptions}
          onChange={(value) => handleFilterChange('status', value)}
        />
        <FilterDropdown
          label="Date Range"
          value={filters.dateRange}
          options={dateRangeOptions}
          onChange={(value) => handleFilterChange('dateRange', value)}
        />
        <FilterDropdown
          label="Growth Metric"
          value={filters.metricType}
          options={metricOptions}
          onChange={(value) => handleFilterChange('metricType', value)}
        />
      </div>
    </div>
  );
}
