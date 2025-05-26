import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface RtCampCriteria {
  openSourceContributions: number;
  wordPressContributions: number;
  consistentActivity: boolean;
  qualityScore: number;
  hasWordPressProjects: boolean;
  hasReactProjects: boolean;
  hasPHPProjects: boolean;
  stackOverflowScore?: number;
  longTermContribution: boolean;
  communityEngagement: number;
}

interface RtCampEligibilityProps {
  githubUsername: string;
  githubStats: any;
  githubToken?: string;
}

const RtCampEligibility: React.FC<RtCampEligibilityProps> = ({ 
  githubUsername, 
  githubStats,
  githubToken 
}) => {
  const { theme } = useTheme();
  const [criteria, setCriteria] = React.useState<RtCampCriteria | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const analyzeGitHubProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate GitHub username
      if (!githubUsername) {
        throw new Error('GitHub username is required');
      }

      // Prepare headers with proper error handling
      const headers: HeadersInit = {
        'Accept': 'application/vnd.github.v3+json',
      };
      
      // Use provided token if available, otherwise try environment variable
      const token = githubToken || import.meta.env.VITE_GITHUB_TOKEN;
      if (token) {
        headers['Authorization'] = `token ${token}`; // Changed from 'Bearer' to 'token'
        console.log('Using GitHub token:', token.substring(0, 4) + '...');
      } else {
        console.warn('No GitHub token provided');
      }

      console.log('Fetching GitHub user data...');
      // First check if the user exists and validate token
      const userResponse = await fetch(`https://api.github.com/user`, { 
        headers,
        method: 'GET'
      });

      if (!userResponse.ok) {
        const errorData = await userResponse.json().catch(() => ({}));
        console.error('GitHub API Error:', {
          status: userResponse.status,
          statusText: userResponse.statusText,
          error: errorData
        });

        if (userResponse.status === 401) {
          throw new Error('Invalid GitHub token. Please check your token and try again.');
        } else if (userResponse.status === 403) {
          throw new Error('Rate limit exceeded. Please wait a while or check your token permissions.');
        }
        throw new Error(`GitHub API Error: ${errorData.message || userResponse.statusText}`);
      }

      console.log('Fetching repositories...');
      // Fetch repositories with proper error handling
      const reposResponse = await fetch(
        `https://api.github.com/users/${githubUsername}/repos?per_page=100&sort=updated`,
        { headers }
      );

      if (!reposResponse.ok) {
        const errorData = await reposResponse.json().catch(() => ({}));
        console.error('GitHub Repos Error:', {
          status: reposResponse.status,
          statusText: reposResponse.statusText,
          error: errorData
        });
        throw new Error('Failed to fetch repositories: ' + (errorData.message || reposResponse.statusText));
      }

      const repos = await reposResponse.json();
      console.log(`Found ${repos.length} repositories`);

      console.log('Fetching user events...');
      // Fetch user's events with proper error handling
      const eventsResponse = await fetch(
        `https://api.github.com/users/${githubUsername}/events?per_page=100`,
        { headers }
      );

      if (!eventsResponse.ok) {
        const errorData = await eventsResponse.json().catch(() => ({}));
        console.error('GitHub Events Error:', {
          status: eventsResponse.status,
          statusText: eventsResponse.statusText,
          error: errorData
        });
        throw new Error('Failed to fetch user events: ' + (errorData.message || eventsResponse.statusText));
      }

      const events = await eventsResponse.json();
      console.log(`Found ${events.length} events`);

      // Analyze WordPress, React, and PHP related repositories
      const wordPressRepos = repos.filter((repo: any) => 
        repo.description?.toLowerCase().includes('wordpress') ||
        repo.topics?.includes('wordpress') ||
        repo.name.toLowerCase().includes('wordpress')
      ).length;

      const reactRepos = repos.filter((repo: any) =>
        repo.description?.toLowerCase().includes('react') ||
        repo.topics?.includes('react') ||
        repo.name.toLowerCase().includes('react')
      ).length;

      const phpRepos = repos.filter((repo: any) =>
        repo.language?.toLowerCase() === 'php' ||
        repo.topics?.includes('php')
      ).length;

      // Calculate contribution consistency
      const contributionDates = events
        .filter((event: any) => event.type === 'PushEvent')
        .map((event: any) => new Date(event.created_at).toISOString().split('T')[0]);
      const uniqueDates = new Set(contributionDates);
      const consistentActivity = uniqueDates.size >= 15; // At least 15 days of activity

      // Calculate quality score based on various factors
      const qualityScore = calculateQualityScore(repos, events);

      // Analyze long-term contribution
      const oldestRepo = repos.reduce((oldest: any, repo: any) => {
        const repoDate = new Date(repo.created_at);
        return oldest && new Date(oldest.created_at) < repoDate ? oldest : repo;
      }, null);
      const longTermContribution = oldestRepo && 
        (new Date().getTime() - new Date(oldestRepo.created_at).getTime()) > (180 * 24 * 60 * 60 * 1000); // 6 months

      // Calculate community engagement
      const communityEngagement = calculateCommunityEngagement(repos, events);

      console.log('Analysis complete, updating criteria...');
      setCriteria({
        openSourceContributions: events.filter((e: any) => e.type === 'PushEvent').length,
        wordPressContributions: wordPressRepos,
        consistentActivity,
        qualityScore,
        hasWordPressProjects: wordPressRepos > 0,
        hasReactProjects: reactRepos > 0,
        hasPHPProjects: phpRepos > 0,
        longTermContribution,
        communityEngagement
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze GitHub profile';
      setError(errorMessage);
      console.error('RtCamp Analysis Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateQualityScore = (repos: any[], events: any[]): number => {
    let score = 0;
    
    // Score based on repository quality
    repos.forEach((repo: any) => {
      if (!repo.fork) { // Original repositories
        score += 2;
        score += repo.stargazers_count * 0.5;
        score += repo.forks_count * 0.3;
        if (repo.language === 'PHP') score += 1;
        if (repo.topics?.includes('wordpress')) score += 2;
      }
    });

    // Score based on contribution types
    events.forEach((event: any) => {
      switch (event.type) {
        case 'PushEvent':
          score += 0.5;
          break;
        case 'PullRequestEvent':
          score += 1;
          break;
        case 'IssuesEvent':
          score += 0.3;
          break;
        case 'IssueCommentEvent':
          score += 0.2;
          break;
      }
    });

    return Math.min(100, score); // Cap at 100
  };

  const calculateCommunityEngagement = (repos: any[], events: any[]): number => {
    let engagement = 0;
    
    // Engagement through repository interactions
    repos.forEach((repo: any) => {
      engagement += repo.watchers_count * 0.2;
      engagement += repo.open_issues_count * 0.3;
    });

    // Engagement through events
    const commentEvents = events.filter((e: any) => 
      e.type === 'IssueCommentEvent' || 
      e.type === 'CommitCommentEvent'
    ).length;
    
    engagement += commentEvents * 0.5;

    return Math.min(100, engagement);
  };

  React.useEffect(() => {
    if (githubUsername) {
      analyzeGitHubProfile();
    }
  }, [githubUsername]);

  const getEligibilityStatus = (): { status: 'high' | 'medium' | 'low'; message: string } => {
    if (!criteria) return { status: 'low', message: 'Unable to determine eligibility' };

    const {
      openSourceContributions,
      wordPressContributions,
      consistentActivity,
      qualityScore,
      hasWordPressProjects,
      hasReactProjects,
      hasPHPProjects,
      longTermContribution,
      communityEngagement
    } = criteria;

    if (
      qualityScore >= 70 &&
      (hasWordPressProjects || hasReactProjects || hasPHPProjects) &&
      consistentActivity &&
      longTermContribution &&
      communityEngagement >= 60
    ) {
      return {
        status: 'high',
        message: 'Strong candidate for rtCamp! Your profile shows consistent high-quality contributions.'
      };
    }

    if (
      qualityScore >= 40 &&
      (hasWordPressProjects || hasReactProjects || hasPHPProjects) &&
      (consistentActivity || longTermContribution) &&
      communityEngagement >= 30
    ) {
      return {
        status: 'medium',
        message: 'Moderate chance for rtCamp. Consider increasing your WordPress/React contributions.'
      };
    }

    return {
      status: 'low',
      message: 'Need more open source contributions aligned with rtCamp\'s requirements.'
    };
  };

  if (loading) {
    return (
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-600 dark:text-gray-400">Analyzing GitHub profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (!criteria) {
    return null;
  }

  const eligibility = getEligibilityStatus();

  return (
    <div className="mt-6 space-y-4">
      <div className={`p-6 rounded-lg ${
        eligibility.status === 'high' 
          ? 'bg-green-50 dark:bg-green-900/20' 
          : eligibility.status === 'medium'
          ? 'bg-yellow-50 dark:bg-yellow-900/20'
          : 'bg-red-50 dark:bg-red-900/20'
      }`}>
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          rtCamp Eligibility Analysis
          {eligibility.status === 'high' && <CheckCircle className="w-5 h-5 text-green-500" />}
          {eligibility.status === 'medium' && <AlertCircle className="w-5 h-5 text-yellow-500" />}
          {eligibility.status === 'low' && <XCircle className="w-5 h-5 text-red-500" />}
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4">{eligibility.message}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium">Profile Strengths</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              {criteria.hasWordPressProjects && (
                <li className="text-green-600 dark:text-green-400">Has WordPress projects</li>
              )}
              {criteria.hasReactProjects && (
                <li className="text-green-600 dark:text-green-400">Has React projects</li>
              )}
              {criteria.hasPHPProjects && (
                <li className="text-green-600 dark:text-green-400">Has PHP projects</li>
              )}
              {criteria.consistentActivity && (
                <li className="text-green-600 dark:text-green-400">Shows consistent activity</li>
              )}
              {criteria.longTermContribution && (
                <li className="text-green-600 dark:text-green-400">Long-term contributor</li>
              )}
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">Areas for Improvement</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              {!criteria.hasWordPressProjects && (
                <li className="text-red-600 dark:text-red-400">Add WordPress projects</li>
              )}
              {!criteria.consistentActivity && (
                <li className="text-red-600 dark:text-red-400">Increase contribution consistency</li>
              )}
              {criteria.communityEngagement < 60 && (
                <li className="text-red-600 dark:text-red-400">Increase community engagement</li>
              )}
              {criteria.qualityScore < 70 && (
                <li className="text-red-600 dark:text-red-400">Improve contribution quality</li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400">Quality Score</div>
            <div className="text-2xl font-bold">{Math.round(criteria.qualityScore)}/100</div>
          </div>
          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400">Community Engagement</div>
            <div className="text-2xl font-bold">{Math.round(criteria.communityEngagement)}/100</div>
          </div>
          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400">WordPress Projects</div>
            <div className="text-2xl font-bold">{criteria.wordPressContributions}</div>
          </div>
          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400">Open Source Contributions</div>
            <div className="text-2xl font-bold">{criteria.openSourceContributions}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RtCampEligibility; 