import { MetricType, GoalStatus } from '~/types/goals';
import './goal-animations.css';

type FiltersState = {
  status: GoalStatus | 'all';
  dateRange: 'today' | 'week' | 'month' | 'all';
  metricType: MetricType | 'all';
};

interface GoalFiltersProps {
  filters: FiltersState;
  setFilters: React.Dispatch<React.SetStateAction<FiltersState>>;
}

export default function GoalFilters({ filters, setFilters }: GoalFiltersProps) {
  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div className="rounded-base border-2 border-border dark:border-darkBorder bg-main-50 dark:bg-main-900/20 p-4 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-black dark:text-white mb-1">
            Status
          </label>
          <select
            className="h-10 px-4 py-2 w-full rounded-base text-sm border-2 border-border dark:border-darkBorder bg-main dark:bg-main-700 text-black dark:text-white shadow-light dark:shadow-dark focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="suggested">Suggested</option>
            <option value="accepted">Accepted</option>
            <option value="completed">Completed</option>
            <option value="deleted">Deleted</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-black dark:text-white mb-1">
            Date Range
          </label>
          <select
            className="h-10 px-4 py-2 w-full rounded-base text-sm border-2 border-border dark:border-darkBorder bg-main dark:bg-main-700 text-black dark:text-white shadow-light dark:shadow-dark focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-black dark:text-white mb-1">
            Growth Metric
          </label>
          <select
            className="h-10 px-4 py-2 w-full rounded-base text-sm border-2 border-border dark:border-darkBorder bg-main dark:bg-main-700 text-black dark:text-white shadow-light dark:shadow-dark focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            value={filters.metricType}
            onChange={(e) => handleFilterChange('metricType', e.target.value)}
          >
            <option value="all">All Metrics</option>
            <option value="resilience">Resilience</option>
            <option value="effort">Effort</option>
            <option value="challenge">Challenge</option>
            <option value="feedback">Feedback</option>
            <option value="learning">Learning</option>
          </select>
        </div>
      </div>
    </div>
  );
}
