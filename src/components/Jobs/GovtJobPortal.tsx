import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  Briefcase, 
  Calendar, 
  MapPin, 
  GraduationCap, 
  IndianRupee,
  ExternalLink,
  Search,
  Filter
} from 'lucide-react';
import { jobsService, type GovtJob } from '../../services/jobsService';

const GovtJobPortal: React.FC = () => {
  const { theme } = useTheme();
  const [jobs, setJobs] = useState<GovtJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    category: 'all',
    location: 'all',
    qualification: 'all'
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch jobs from API or local data
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const jobs = await jobsService.getJobs();
      setJobs(jobs);
    } catch (err) {
      setError('Failed to fetch jobs. Please try again later.');
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // Refresh jobs every hour to update expiry status
    const interval = setInterval(fetchJobs, 3600000);
    return () => clearInterval(interval);
  }, []);

  const filteredJobs = jobs.filter(job => {
    // Category filter
    if (
      filters.category !== 'all' &&
      job.category.toLowerCase() !== filters.category.toLowerCase()
    ) return false;

    // Location filter
    if (
      filters.location !== 'all' &&
      !job.location.toLowerCase().includes(filters.location.toLowerCase())
    ) return false;

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        job.title.toLowerCase().includes(query) ||
        job.department.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query) ||
        job.qualification.toLowerCase().includes(query) ||
        job.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return true;
  });

  const getDaysRemaining = (lastDate: string) => {
    const remaining = Math.ceil(
      (new Date(lastDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return remaining;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Government Jobs Portal</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Latest government jobs in Computer Science, IT, and Hardware Engineering
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search jobs by title, department, location, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>
          <select
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
          >
            <option value="all">All Categories</option>
            <option value="cs">Computer Science</option>
            <option value="it">Information Technology</option>
            <option value="hardware">Hardware</option>
            <option value="software">Software</option>
          </select>
          <select
            value={filters.location}
            onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
          >
            <option value="all">All Locations</option>
            <option value="delhi">Delhi</option>
            <option value="mumbai">Mumbai</option>
            <option value="bangalore">Bangalore</option>
            <option value="hyderabad">Hyderabad</option>
            <option value="pune">Pune</option>
            <option value="chennai">Chennai</option>
            <option value="kolkata">Kolkata</option>
            <option value="noida">Noida</option>
            <option value="gurgaon">Gurgaon</option>
          </select>
        </div>
      </div>

      {/* Jobs List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading jobs...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-600 dark:text-red-400">
          {error}
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-8 text-gray-600 dark:text-gray-400">
          No jobs found matching your criteria.
        </div>
      ) : (
        <div className="space-y-6">
          {filteredJobs.map(job => (
            <div
              key={job.id}
              className={`p-6 rounded-lg border ${
                theme.mode === 'dark' 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              } shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
                  <p className="text-gray-600 dark:text-gray-400">{job.department}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    getDaysRemaining(job.lastDate) <= 7
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                      : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                  }`}>
                    {getDaysRemaining(job.lastDate)} days left
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="text-gray-400" size={18} />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <GraduationCap className="text-gray-400" size={18} />
                  <span>{job.qualification}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <IndianRupee className="text-gray-400" size={18} />
                  <span>{job.salary}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Briefcase className="text-gray-400" size={18} />
                  <span>{job.vacancies} vacancies</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {job.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Posted on {new Date(job.postedDate).toLocaleDateString()}
                </div>
                <div className="space-x-4">
                  <a
                    href={job.notificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    View Notification
                  </a>
                  <a
                    href={job.applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Apply Now <ExternalLink className="ml-2" size={16} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GovtJobPortal; 