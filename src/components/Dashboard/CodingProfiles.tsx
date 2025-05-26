import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  Github, 
  Code2,
  Trophy,
  CheckCircle2,
  Star,
  Hash,
  Medal,
  Timer,
  Box,
  GitPullRequest,
  Users,
  Flame,
  GitFork,
  Clock,
  LineChart
} from 'lucide-react';
import { Tab } from '@headlessui/react';
import RtCampEligibility from './RtCampEligibility';
import FaangEligibility from './FaangEligibility';
import { motion } from 'framer-motion';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

interface LeetCodeStats {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  acceptanceRate: number;
  ranking: number;
  contributionPoints: number;
  streak: number;
  contestRating: number;
  contestGlobalRanking: number;
  badges: Badge[];
  submissions: {
    lastWeek: number;
    lastMonth: number;
    lastYear: number;
  };
  recentSubmissions: Submission[];
  studyPlans: StudyPlan[];
}

interface Badge {
  name: string;
  description: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  earnedDate: string;
}

interface Submission {
  problemName: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded';
  language: string;
  timestamp: string;
  runtime: string;
  memory: string;
}

interface StudyPlan {
  name: string;
  progress: number;
  totalDays: number;
  completedDays: number;
  topics: string[];
}

interface LanguageData {
  name: string;
  percentage: number;
  color: string;
  bytes: number;
}

interface GitHubStats {
  totalContributions: number;
  currentStreak: number;
  longestStreak: number;
  contributionsLastYear: {
    date: string;
    count: number;
  }[];
  repositories: number;
  stars: number;
  followers: number;
  pullRequests: {
    opened: number;
    merged: number;
  };
  issues: {
    opened: number;
    closed: number;
  };
  forks: number;
  commitHistory: {
    date: string;
    count: number;
  }[];
  languages: {
    [key: string]: number;  // bytes per language
  };
  topLanguages: LanguageData[];
  popularRepos: {
    name: string;
    stars: number;
    forks: number;
    description: string;
    language: string;
  }[];
  commitContributions: number;
  issueContributions: number;
  pullRequestContributions: number;
  pullRequestReviewContributions: number;
  repositoryContributions: number;
}

interface CompanyPreparation {
  company: 'Meta' | 'Apple' | 'Amazon' | 'Netflix' | 'Google';
  requiredTopics: string[];
  commonPatterns: string[];
  solvedProblems: number;
  targetProblems: number;
  readiness: number;
}

interface TopicProgress {
  name: string;
  solved: number;
  total: number;
  lastPracticed: string;
  confidence: number;
  needsReview: boolean;
}

interface InterviewPattern {
  name: string;
  description: string;
  problemsSolved: number;
  totalProblems: number;
  lastPracticed: string;
  confidence: number;
}

interface InterviewPrep {
  systemDesign: SystemDesignPrep;
  behavioralPrep: BehavioralPrep;
  technicalPrep: TechnicalPrep;
  mockInterviews: MockInterview[];
  resources: Resource[];
  schedule: StudySchedule;
}

interface SystemDesignPrep {
  completedCases: string[];
  inProgress: string[];
  notes: {
    topic: string;
    content: string;
    lastUpdated: string;
  }[];
  components: {
    name: string;
    understanding: number;
    practiceCount: number;
  }[];
}

interface BehavioralPrep {
  stories: {
    category: string;
    situation: string;
    task: string;
    action: string;
    result: string;
    lastPracticed: string;
  }[];
  companyValues: {
    company: string;
    values: string[];
    notes: string;
  }[];
  strengthsWeaknesses: {
    strengths: string[];
    weaknesses: string[];
    improvementPlans: string[];
  };
}

interface TechnicalPrep {
  conceptMastery: {
    topic: string;
    confidence: number;
    lastReviewed: string;
    resources: string[];
  }[];
  practiceProblems: {
    category: string;
    completed: number;
    total: number;
    recentErrors: string[];
  }[];
  codeSnippets: {
    title: string;
    language: string;
    code: string;
    notes: string;
  }[];
}

interface MockInterview {
  date: string;
  type: 'Technical' | 'System Design' | 'Behavioral';
  company: string;
  feedback: string;
  strengths: string[];
  improvements: string[];
  rating: number;
}

interface Resource {
  title: string;
  type: 'Video' | 'Article' | 'Book' | 'Course';
  link: string;
  completed: boolean;
  notes: string;
  rating: number;
}

interface StudySchedule {
  dailyGoals: {
    date: string;
    tasks: {
      type: string;
      description: string;
      completed: boolean;
    }[];
  }[];
  weeklyFocus: {
    week: string;
    topics: string[];
    goals: string[];
  }[];
  milestones: {
    date: string;
    description: string;
    achieved: boolean;
  }[];
}

interface PrepStats {
  topics: TopicProgress[];
  patterns: InterviewPattern[];
  companies: CompanyPreparation[];
  weakAreas: string[];
  strongAreas: string[];
  readinessScore: number;
  interviewPrep: InterviewPrep;
  customNotes: {
    id: string;
    title: string;
    content: string;
    tags: string[];
    lastUpdated: string;
  }[];
  flashcards: {
    id: string;
    question: string;
    answer: string;
    category: string;
    lastReviewed: string;
    confidence: number;
  }[];
}

interface StoredData {
  leetcodeUsername: string;
  githubUsername: string;
  githubToken: string;
  leetcodeStats: LeetCodeStats | null;
  githubStats: GitHubStats | null;
  lastUpdated: string;
  goals: CodingGoals;
  achievements: Achievement[];
  prepStats: PrepStats;
}

interface CodingGoals {
  dailyProblems: number;
  weeklyContributions: number;
  monthlyStars: number;
  yearlyRepositories: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
}

const STORAGE_KEY = 'coding_profiles_data';
const AUTO_REFRESH_INTERVAL = 300000; // 5 minutes in milliseconds

const DEFAULT_GOALS: CodingGoals = {
  dailyProblems: 2,
  weeklyContributions: 10,
  monthlyStars: 5,
  yearlyRepositories: 12
};

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'consistent_coder',
    title: 'Consistent Coder',
    description: 'Maintain a 7-day streak on LeetCode',
    icon: 'Calendar',
    earned: false
  },
  {
    id: 'problem_solver',
    title: 'Problem Solver',
    description: 'Solve 100 problems on LeetCode',
    icon: 'CheckCircle2',
    earned: false
  },
  {
    id: 'github_star',
    title: 'GitHub Star',
    description: 'Get 50 stars across your repositories',
    icon: 'Star',
    earned: false
  },
  {
    id: 'open_source_contributor',
    title: 'Open Source Contributor',
    description: 'Make 100 contributions on GitHub',
    icon: 'GitFork',
    earned: false
  }
];

const INITIAL_PREP_STATS: PrepStats = {
  topics: [
    {
      name: 'Arrays & Strings',
      solved: 0,
      total: 50,
      lastPracticed: '',
      confidence: 0,
      needsReview: true
    },
    {
      name: 'Trees & Graphs',
      solved: 0,
      total: 40,
      lastPracticed: '',
      confidence: 0,
      needsReview: true
    },
    {
      name: 'Dynamic Programming',
      solved: 0,
      total: 30,
      lastPracticed: '',
      confidence: 0,
      needsReview: true
    },
    {
      name: 'System Design',
      solved: 0,
      total: 20,
      lastPracticed: '',
      confidence: 0,
      needsReview: true
    }
  ],
  patterns: [
    {
      name: 'Two Pointers',
      description: 'Solve array problems using two pointers technique',
      problemsSolved: 0,
      totalProblems: 20,
      lastPracticed: '',
      confidence: 0
    },
    {
      name: 'Sliding Window',
      description: 'Solve substring/subarray problems efficiently',
      problemsSolved: 0,
      totalProblems: 15,
      lastPracticed: '',
      confidence: 0
    },
    {
      name: 'DFS/BFS',
      description: 'Graph traversal and tree problems',
      problemsSolved: 0,
      totalProblems: 25,
      lastPracticed: '',
      confidence: 0
    }
  ],
  companies: [
    {
      company: 'Meta',
      requiredTopics: ['Graphs', 'Arrays', 'Dynamic Programming'],
      commonPatterns: ['DFS/BFS', 'Two Pointers'],
      solvedProblems: 0,
      targetProblems: 150,
      readiness: 0
    },
    {
      company: 'Amazon',
      requiredTopics: ['System Design', 'Trees', 'Dynamic Programming'],
      commonPatterns: ['BFS', 'Sliding Window'],
      solvedProblems: 0,
      targetProblems: 150,
      readiness: 0
    },
    {
      company: 'Google',
      requiredTopics: ['Algorithms', 'System Design', 'Dynamic Programming'],
      commonPatterns: ['DFS', 'Two Pointers'],
      solvedProblems: 0,
      targetProblems: 200,
      readiness: 0
    }
  ],
  weakAreas: [],
  strongAreas: [],
  readinessScore: 0,
  interviewPrep: {
    systemDesign: {
      completedCases: [],
      inProgress: [],
      notes: [],
      components: []
    },
    behavioralPrep: {
      stories: [],
      companyValues: [],
      strengthsWeaknesses: {
        strengths: [],
        weaknesses: [],
        improvementPlans: []
      }
    },
    technicalPrep: {
      conceptMastery: [],
      practiceProblems: [],
      codeSnippets: []
    },
    mockInterviews: [],
    resources: [],
    schedule: {
      dailyGoals: [],
      weeklyFocus: [],
      milestones: []
    }
  },
  customNotes: [],
  flashcards: []
};

// Update type definitions for the distributions
type TopicName = 'Arrays & Strings' | 'Trees & Graphs' | 'Dynamic Programming' | 'System Design';
type PatternName = 'Two Pointers' | 'Sliding Window' | 'DFS/BFS';

type TopicDistribution = Record<TopicName, number>;
type PatternDistribution = Record<PatternName, number>;

const LANGUAGE_COLORS: { [key: string]: string } = {
  JavaScript: '#f1e05a',
  TypeScript: '#2b7489',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  Ruby: '#701516',
  Go: '#00ADD8',
  Rust: '#dea584',
  PHP: '#4F5D95',
  Swift: '#ffac45',
  Kotlin: '#F18E33',
  'C#': '#178600',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051'
};

const LanguageBar: React.FC<{ languages: LanguageData[] }> = ({ languages }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex"
    >
      {languages.map((lang, index) => (
        <motion.div
          key={lang.name}
          initial={{ width: 0 }}
          animate={{ width: `${lang.percentage}%` }}
          transition={{ duration: 0.8, delay: index * 0.1 }}
          className="h-full relative group"
          style={{
            backgroundColor: lang.color || LANGUAGE_COLORS[lang.name] || '#6e7681',
            marginLeft: index === 0 ? '0' : '-1px'
          }}
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-200" />
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2">
            <div className="bg-gray-900 text-white text-xs py-1 px-2 rounded shadow-lg whitespace-nowrap">
              {lang.name}: {lang.percentage.toFixed(1)}%
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

const LanguageStats: React.FC<{ languages: LanguageData[] }> = ({ languages }) => {
  return (
    <div className="space-y-3">
      {/* Compact Language Bar */}
      <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden flex">
        {languages.slice(0, 6).map((lang, index) => (
          <motion.div
            key={lang.name}
            initial={{ width: 0 }}
            animate={{ width: `${lang.percentage}%` }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="h-full relative group cursor-pointer"
            style={{ backgroundColor: lang.color || LANGUAGE_COLORS[lang.name] || '#6e7681' }}
          >
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-200" />
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute -bottom-8 left-1/2 transform -translate-x-1/2 z-10">
              <div className="bg-gray-900 text-white text-xs py-1 px-2 rounded shadow-lg whitespace-nowrap">
                {lang.name}: {lang.percentage.toFixed(1)}%
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Compact Legend */}
      <div className="flex flex-wrap gap-3 text-xs">
        {languages.slice(0, 6).map((lang) => (
          <div key={lang.name} className="flex items-center gap-1.5">
            <div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: lang.color || LANGUAGE_COLORS[lang.name] || '#6e7681' }}
            />
            <span className="text-gray-600 dark:text-gray-400">{lang.name}</span>
            <span className="text-gray-400 dark:text-gray-500">{lang.percentage.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const CodingProfiles: React.FC = () => {
  const { theme } = useTheme();
  const [leetcodeUsername, setLeetcodeUsername] = useState('');
  const [githubUsername, setGithubUsername] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const [leetcodeStats, setLeetcodeStats] = useState<LeetCodeStats | null>(null);
  const [githubStats, setGithubStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [showTokenInput, setShowTokenInput] = useState(false);

  const fetchLeetCodeStats = async (username: string): Promise<LeetCodeStats | null> => {
    try {
      console.log('Fetching LeetCode stats for username:', username);
      const response = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('LeetCode API response:', data);

      if (data.status === 'error' || !data.totalSolved) {
        throw new Error(data.message || 'Failed to fetch LeetCode stats');
      }

      return {
        totalSolved: data.totalSolved || 0,
        easySolved: data.easySolved || 0,
        mediumSolved: data.mediumSolved || 0,
        hardSolved: data.hardSolved || 0,
        acceptanceRate: data.acceptanceRate || 0,
        ranking: data.ranking || 0,
        contributionPoints: data.contributionPoints || 0,
        streak: data.streak || 0,
        contestRating: data.contestRating || 0,
        contestGlobalRanking: data.contestGlobalRanking || 0,
        badges: data.badges || [],
        submissions: {
          lastWeek: data.submissionCalendar?.lastWeek || 0,
          lastMonth: data.submissionCalendar?.lastMonth || 0,
          lastYear: data.submissionCalendar?.lastYear || 0
        },
        recentSubmissions: data.recentSubmissions || [],
        studyPlans: data.studyPlans || []
      };
    } catch (error) {
      console.error('Error fetching LeetCode stats:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let updatedGithubStats = null;
      let updatedLeetcodeStats = null;
      const currentTime = new Date().toISOString();

      if (githubUsername) {
        console.log('Fetching GitHub stats...');
        updatedGithubStats = await fetchGitHubStats(githubUsername, githubToken);
        setGithubStats(updatedGithubStats);
      }

      if (leetcodeUsername) {
        console.log('Fetching LeetCode stats...');
        try {
          updatedLeetcodeStats = await fetchLeetCodeStats(leetcodeUsername);
          if (updatedLeetcodeStats) {
            console.log('LeetCode stats fetched successfully:', updatedLeetcodeStats);
            setLeetcodeStats(updatedLeetcodeStats);
          }
        } catch (error) {
          console.error('LeetCode fetch error:', error);
          setError(error instanceof Error ? error.message : 'Failed to fetch LeetCode stats');
        }
      }

      setLastUpdated(currentTime);
      
      // Only save to localStorage if we have data to save
      if (updatedGithubStats || updatedLeetcodeStats) {
        const dataToSave = {
          githubUsername,
          githubToken,
          leetcodeUsername,
          githubStats: updatedGithubStats,
          leetcodeStats: updatedLeetcodeStats,
          lastUpdated: currentTime
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error fetching stats';
      setError(errorMessage);
      console.error('Stats Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create a synthetic form event
  const createFormEvent = () => {
    const form = document.createElement('form');
    const event = new Event('submit', { bubbles: true, cancelable: true }) as unknown as React.FormEvent<HTMLFormElement>;
    Object.defineProperty(event, 'target', { value: form });
    return event;
  };

  // Load saved data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        setGithubUsername(data.githubUsername || '');
        setGithubToken(data.githubToken || '');
        setLeetcodeUsername(data.leetcodeUsername || '');
        setGithubStats(data.githubStats);
        setLeetcodeStats(data.leetcodeStats);
        setLastUpdated(data.lastUpdated);

        // Auto-refresh data if it's older than 1 hour
        const lastUpdate = new Date(data.lastUpdated);
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        if (lastUpdate < oneHourAgo && (data.githubUsername || data.leetcodeUsername)) {
          handleSubmit(createFormEvent());
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Auto-refresh data
  useEffect(() => {
    let intervalId: number;

    const refreshData = async () => {
      if (githubUsername || leetcodeUsername) {
        await handleSubmit(createFormEvent());
      }
    };

    if (autoRefresh && (githubUsername || leetcodeUsername)) {
      intervalId = window.setInterval(refreshData, AUTO_REFRESH_INTERVAL);
    }

    return () => {
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [autoRefresh, githubUsername, leetcodeUsername]);

  const fetchGitHubStats = async (username: string, token?: string) => {
    try {
      const headers: HeadersInit = {
        'Accept': 'application/vnd.github.v3+json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // GraphQL query for detailed contribution data
      const graphqlQuery = {
        query: `
          query ($username: String!) {
            user(login: $username) {
              repositories(first: 100, orderBy: {field: STARGAZERS, direction: DESC}, ownerAffiliations: [OWNER]) {
                totalCount
                nodes {
                  name
                  description
                  stargazerCount
                  forkCount
                  primaryLanguage {
                    name
                    color
                  }
                  languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
                    edges {
                      size
                      node {
                        name
                        color
                      }
                    }
                  }
                }
              }
              contributionsCollection {
                totalCommitContributions
                totalIssueContributions
                totalPullRequestContributions
                totalPullRequestReviewContributions
                totalRepositoryContributions
                contributionCalendar {
                  totalContributions
                  weeks {
                    contributionDays {
                      contributionCount
                      date
                    }
                  }
                }
                commitContributionsByRepository {
                  repository {
                    name
                  }
                  contributions {
                    totalCount
                  }
                }
              }
              followers {
                totalCount
              }
              pullRequests(first: 1) {
                totalCount
              }
              issues(first: 1) {
                totalCount
              }
            }
          }
        `,
        variables: { username }
      };

      // Make the GraphQL request
      const graphqlResponse = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(graphqlQuery)
      });

      if (!graphqlResponse.ok) {
        throw new Error('Failed to fetch GitHub data');
      }

      const data = await graphqlResponse.json();
      const userData = data.data.user;
      const contributionsCollection = userData.contributionsCollection;

      // Calculate contribution streak
      const weeks = contributionsCollection.contributionCalendar.weeks;
      const allDays = weeks.flatMap((week: any) => week.contributionDays);
      const sortedDays = allDays.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;

      for (const day of sortedDays) {
        if (day.contributionCount > 0) {
          tempStreak++;
          if (tempStreak > longestStreak) {
            longestStreak = tempStreak;
          }
          if (currentStreak === 0) {
            currentStreak = tempStreak;
          }
        } else {
          tempStreak = 0;
        }
      }

      // Process languages data
      const languageMap = new Map();
      userData.repositories.nodes.forEach((repo: any) => {
        if (repo.languages?.edges) {
          repo.languages.edges.forEach((edge: any) => {
            const langName = edge.node.name;
            const size = edge.size;
            languageMap.set(langName, (languageMap.get(langName) || 0) + size);
          });
        }
      });

      const totalBytes = Array.from(languageMap.values()).reduce((a: number, b: number) => a + b, 0);
      const languageData = Array.from(languageMap.entries())
        .map(([name, bytes]) => ({
          name,
          bytes: bytes as number,
          percentage: (bytes as number / totalBytes) * 100,
          color: LANGUAGE_COLORS[name] || '#6e7681'
        }))
        .sort((a, b) => b.bytes - a.bytes);

      // Compile all stats
      return {
        languages: Object.fromEntries(languageMap),
        topLanguages: languageData,
        totalContributions: contributionsCollection.contributionCalendar.totalContributions,
        currentStreak,
        longestStreak,
        contributionsLastYear: sortedDays.map((day: any) => ({
          date: day.date,
          count: day.contributionCount
        })),
        repositories: userData.repositories.totalCount,
        stars: userData.repositories.nodes.reduce((sum: number, repo: any) => sum + repo.stargazerCount, 0),
        forks: userData.repositories.nodes.reduce((sum: number, repo: any) => sum + repo.forkCount, 0),
        followers: userData.followers.totalCount,
        pullRequests: {
          opened: userData.pullRequests.totalCount,
          merged: contributionsCollection.totalPullRequestContributions
        },
        issues: {
          opened: userData.issues.totalCount,
          closed: contributionsCollection.totalIssueContributions
        },
        commitHistory: sortedDays.map((day: any) => ({
          date: day.date,
          count: day.contributionCount
        })),
        commitContributions: contributionsCollection.totalCommitContributions,
        issueContributions: contributionsCollection.totalIssueContributions,
        pullRequestContributions: contributionsCollection.totalPullRequestContributions,
        pullRequestReviewContributions: contributionsCollection.totalPullRequestReviewContributions,
        repositoryContributions: contributionsCollection.totalRepositoryContributions,
        popularRepos: userData.repositories.nodes
          .slice(0, 5)
          .map((repo: any) => ({
            name: repo.name,
            stars: repo.stargazerCount,
            forks: repo.forkCount,
            description: repo.description,
            language: repo.primaryLanguage?.name
          }))
      };
    } catch (error) {
      console.error('Error fetching GitHub stats:', error);
      throw error;
    }
  };

  const clearData = () => {
    setLeetcodeUsername('');
    setGithubUsername('');
    setGithubToken('');
    setLeetcodeStats(null);
    setGithubStats(null);
    setLastUpdated('');
    localStorage.removeItem(STORAGE_KEY);
  };

  const formatLastUpdated = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const LeetCodeDetailedStats: React.FC<{ stats: LeetCodeStats }> = ({ stats }) => {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <div>
                <h3 className="text-xl font-semibold">LeetCode Profile</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Your coding journey statistics</p>
          </div>
          </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500">{stats.ranking}</div>
                <div className="text-sm text-gray-500">Global Rank</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500">{stats.acceptanceRate}%</div>
                <div className="text-sm text-gray-500">Acceptance Rate</div>
              </div>
          </div>
        </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Solved</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.totalSolved}</p>
              </div>
                <Hash className="w-8 h-8 text-blue-500 opacity-70" />
            </div>
              </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Easy</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.easySolved}</p>
            </div>
                <CheckCircle2 className="w-8 h-8 text-green-500 opacity-70" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Medium</p>
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.mediumSolved}</p>
                </div>
                <Star className="w-8 h-8 text-yellow-500 opacity-70" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Hard</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.hardSolved}</p>
                </div>
                <Flame className="w-8 h-8 text-red-500 opacity-70" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <h4 className="text-sm font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                <Medal className="w-4 h-4" />
                Contest Performance
              </h4>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                    {stats.contestRating || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-500">Contest Rating</p>
                </div>
                <div className="h-16 w-16">
                  <div className="w-full h-full rounded-full border-4 border-indigo-500 flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-indigo-500" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <h4 className="text-sm font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                <Timer className="w-4 h-4" />
                Consistency
              </h4>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                    {stats.streak} days
                  </p>
                  <p className="text-sm text-gray-500">Current Streak</p>
                </div>
                <div className="flex -space-x-1">
                  {stats.streak > 0 ? (
                    [...Array(Math.min(7, stats.streak))].map((_, i) => (
                      <div 
                        key={i}
                        className="w-3 h-8 bg-orange-500 rounded-sm first:rounded-l-md last:rounded-r-md"
                        style={{ opacity: 0.5 + (i * 0.07) }}
                      />
                    ))
                  ) : (
                    <div className="text-sm text-gray-500">No active streak</div>
                  )}
              </div>
            </div>
          </div>
        </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <h4 className="text-sm font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
              Problem Distribution
            </h4>
            {stats.totalSolved > 0 ? (
              <>
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden flex">
                  <div 
                    className="bg-green-500 h-full"
                    style={{ width: `${(stats.easySolved / stats.totalSolved) * 100}%` }}
                  />
                  <div 
                    className="bg-yellow-500 h-full"
                    style={{ width: `${(stats.mediumSolved / stats.totalSolved) * 100}%` }}
                  />
                  <div 
                    className="bg-red-500 h-full"
                    style={{ width: `${(stats.hardSolved / stats.totalSolved) * 100}%` }}
                    />
                  </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    Easy ({Math.round((stats.easySolved / stats.totalSolved) * 100)}%)
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                    Medium ({Math.round((stats.mediumSolved / stats.totalSolved) * 100)}%)
                </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    Hard ({Math.round((stats.hardSolved / stats.totalSolved) * 100)}%)
            </div>
                </div>
              </>
            ) : (
              <div className="text-sm text-gray-500 text-center py-4">
                No problems solved yet
          </div>
        )}
          </div>
        </div>
      </div>
    );
  };

  const GitHubDetailedStats: React.FC<{ stats: GitHubStats }> = ({ stats }) => {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <Github className="w-8 h-8 text-gray-700 dark:text-gray-300" />
            </div>
              <div>
                <h3 className="text-xl font-semibold">GitHub Profile</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Open Source Contributions & Activity</p>
            </div>
          </div>
            </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-600/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Repositories</p>
                  <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">{stats.repositories}</p>
            </div>
                <Box className="w-8 h-8 text-gray-500 opacity-70" />
          </div>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Stars</p>
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.stars}</p>
            </div>
                <Star className="w-8 h-8 text-yellow-500 opacity-70" />
          </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pull Requests</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.pullRequests.opened}</p>
                </div>
                <GitPullRequest className="w-8 h-8 text-blue-500 opacity-70" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Followers</p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.followers}</p>
                </div>
                <Users className="w-8 h-8 text-purple-500 opacity-70" />
            </div>
          </div>
        </div>

          {/* Language Statistics */}
          <div className="bg-white dark:bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-gray-500" />
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Most Used Languages</h4>
              </div>
              <span className="text-xs text-gray-400">Top 6</span>
              </div>
            <LanguageStats languages={stats.topLanguages} />
              </div>

          {/* Open Source Impact Section */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-6">
            <h4 className="text-sm font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-6 flex items-center gap-2">
              <GitFork className="w-4 h-4 text-green-600" />
              Open Source Impact
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-green-100 dark:border-green-800/30">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-md bg-green-100 dark:bg-green-900/30">
                    <GitPullRequest className="w-4 h-4 text-green-600" />
            </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total PRs</p>
                    <p className="text-xl font-bold text-green-600 dark:text-green-400">
                      {stats.pullRequests.opened}
                    </p>
          </div>
              </div>
                <div className="text-xs text-gray-500">
                  {stats.pullRequests.merged} merged
              </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-green-100 dark:border-green-800/30">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-md bg-green-100 dark:bg-green-900/30">
                    <GitFork className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Contributions</p>
                    <p className="text-xl font-bold text-green-600 dark:text-green-400">
                      {stats.totalContributions}
                    </p>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  Last year
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-green-100 dark:border-green-800/30">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-md bg-green-100 dark:bg-green-900/30">
                    <Star className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Stars Earned</p>
                    <p className="text-xl font-bold text-green-600 dark:text-green-400">
                      {stats.stars}
                    </p>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  Across all repos
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-green-100 dark:border-green-800/30">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-md bg-green-100 dark:bg-green-900/30">
                    <Clock className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Streak</p>
                    <p className="text-xl font-bold text-green-600 dark:text-green-400">
                      {stats.currentStreak} days
                    </p>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  Longest: {stats.longestStreak} days
                </div>
              </div>
            </div>

            {/* Popular Repositories */}
            {stats.popularRepos.length > 0 && (
              <div className="space-y-4">
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Popular Repositories
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {stats.popularRepos.map(repo => (
                    <div 
                      key={repo.name}
                      className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-green-100 dark:border-green-800/30"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h6 className="font-medium mb-1 flex items-center gap-2">
                            <Box className="w-4 h-4 text-green-600" />
                            {repo.name}
                          </h6>
                          <p className="text-sm text-gray-500 line-clamp-2">
                            {repo.description || 'No description available'}
                          </p>
              </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm">{repo.stars}</span>
            </div>
                          <div className="flex items-center gap-1">
                            <GitFork className="w-4 h-4 text-blue-500" />
                            <span className="text-sm">{repo.forks}</span>
                          </div>
                        </div>
                      </div>
                      {repo.language && (
                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-sm">{repo.language}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className={`rounded-xl ${
        theme.mode === 'dark' ? 'bg-gray-800' : 'bg-white'
      } shadow-md overflow-hidden p-6`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Coding Profiles</h2>
          <div className="flex items-center gap-4">
            {(leetcodeStats || githubStats) && (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Last updated: {formatLastUpdated(lastUpdated)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoRefresh}
                      onChange={(e) => setAutoRefresh(e.target.checked)}
                      className="form-checkbox h-4 w-4 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">Auto-refresh</span>
                  </label>
                </div>
                <button
                  onClick={() => handleSubmit(createFormEvent())}
                  disabled={loading}
                  className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50"
                >
                  {loading ? 'Refreshing...' : 'Refresh'}
                </button>
                <button
                  onClick={clearData}
                  className="text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                >
                  Clear Data
                </button>
              </>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-400">
                GitHub Username
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={githubUsername}
                  onChange={(e) => setGithubUsername(e.target.value.trim())}
                  className="flex-1 p-2 border rounded-l text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Enter GitHub username"
                />
                <div className="bg-gray-900 p-2 rounded-r">
                  <Github className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-400">
                LeetCode Username
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={leetcodeUsername}
                  onChange={(e) => setLeetcodeUsername(e.target.value.trim())}
                  className="flex-1 p-2 border rounded-l text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Enter LeetCode username"
                />
                <div className="bg-orange-500 p-2 rounded-r">
                  <Code2 className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowTokenInput(!showTokenInput)}
              className="text-sm text-blue-500 hover:text-blue-600"
            >
              {showTokenInput ? 'Hide Token Input' : 'Add GitHub Token'}
            </button>
            {error && error.includes('rate limit') && (
              <span className="text-xs text-red-500">
                Add a GitHub token to increase rate limit
              </span>
            )}
          </div>

          {showTokenInput && (
            <div>
              <label className="block text-sm font-medium mb-1">
                GitHub Personal Access Token
              </label>
              <input
                type="password"
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value.trim())}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                placeholder="Enter your GitHub token"
              />
              <p className="mt-1 text-xs text-gray-500">
                Token is stored locally and used only for API requests
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || (!githubUsername && !leetcodeUsername)}
            className={`w-full py-2 rounded text-white font-medium transition-colors ${
              loading || (!githubUsername && !leetcodeUsername)
                ? 'bg-gray-400'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {loading ? 'Fetching Stats...' : 'Track Profiles'}
          </button>
        </form>

        {error && (
          <div className="text-red-500 text-sm mb-4">
            {error}
          </div>
        )}

        {/* Display LeetCode Stats First */}
        {leetcodeStats && (
          <>
          <LeetCodeDetailedStats stats={leetcodeStats} />
            <FaangEligibility leetcodeStats={leetcodeStats} />
          </>
        )}

        {/* Display GitHub Stats */}
        {githubStats && (
          <>
            <div className="space-y-6 mt-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <Github className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">GitHub Profile</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Open Source Activity</p>
                    </div>
                  </div>
                </div>

                {/* GitHub Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Contributions</p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {githubStats.totalContributions}
                        </p>
                        <div className="text-xs text-gray-500 mt-1">
                          <span className="inline-flex items-center gap-1">
                            <GitPullRequest className="w-3 h-3" />
                            PRs: {githubStats.pullRequestContributions}
                          </span>
                          <span className="inline-flex items-center gap-1 ml-2">
                            <GitFork className="w-3 h-3" />
                            Issues: {githubStats.issueContributions}
                          </span>
                        </div>
                      </div>
                      <GitFork className="w-8 h-8 text-green-500 opacity-70" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Stars</p>
                        <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{githubStats.stars}</p>
                      </div>
                      <Star className="w-8 h-8 text-yellow-500 opacity-70" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Pull Requests</p>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{githubStats.pullRequests.opened}</p>
                      </div>
                      <GitPullRequest className="w-8 h-8 text-blue-500 opacity-70" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Followers</p>
                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{githubStats.followers}</p>
                      </div>
                      <Users className="w-8 h-8 text-purple-500 opacity-70" />
                    </div>
                  </div>
                </div>

                {/* Compact Language Section */}
                <div className="bg-white dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-gray-500" />
                      <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Most Used Languages</h4>
                    </div>
                    <span className="text-xs text-gray-400">Top 6</span>
                  </div>
                  <LanguageStats languages={githubStats.topLanguages} />
                </div>
              </div>
            </div>

            {/* Add RtCamp Eligibility */}
            <RtCampEligibility 
              githubUsername={githubUsername}
              githubStats={githubStats}
              githubToken={githubToken}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default CodingProfiles; 