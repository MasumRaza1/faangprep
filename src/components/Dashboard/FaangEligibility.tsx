import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  AlertCircle, 
  TrendingUp, 
  Building2, 
  Target, 
  Award, 
  Brain, 
  Clock, 
  Zap, 
  BarChart2, 
  BookOpen,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  Rocket,
  Code2,
  Briefcase,
  GraduationCap,
  LineChart,
  Shield,
  Users2
} from 'lucide-react';

interface LeetCodeStats {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  acceptanceRate: number;
  ranking: number;
  contestRating: number;
  streak: number;
}

interface CompanyRequirements {
  category: string;
  minProblems: number;
  minMedium: number;
  minHard: number;
  minContestRating: number;
  companies: Array<{
    name: string;
    logo: string;
    requiredSkills: string[];
    preferredExperience: string[];
    interviewFocus: string[];
    salaryRange: string;
    acceptance: number;
  }>;
}

const REQUIREMENTS: CompanyRequirements = {
  category: 'Top Tech Companies',
  minProblems: 500,
  minMedium: 150,
  minHard: 50,
  minContestRating: 1800,
  companies: [
    {
      name: 'Google',
      logo: '🎯',
      requiredSkills: ['Algorithms', 'System Design', 'Problem Solving'],
      preferredExperience: ['ML/AI', 'Distributed Systems', 'Cloud Computing'],
      interviewFocus: ['Code Quality', 'Technical Depth', 'Innovation'],
      salaryRange: '₹18L - ₹47.3L',
      acceptance: 0.7
    },
    {
      name: 'Meta',
      logo: '📱',
      requiredSkills: ['Data Structures', 'Scalability', 'Frontend/Backend'],
      preferredExperience: ['Social Networks', 'Real-time Systems', 'Mobile'],
      interviewFocus: ['Scale', 'User Impact', 'Performance'],
      salaryRange: '₹48.9L - ₹84.7L',
      acceptance: 1.2
    },
    {
      name: 'Amazon',
      logo: '📦',
      requiredSkills: ['System Design', 'Leadership', 'Scalability'],
      preferredExperience: ['Cloud', 'E-commerce', 'Microservices'],
      interviewFocus: ['Leadership Principles', 'Scale', 'Customer Focus'],
      salaryRange: '₹26.7L - ₹55.7L',
      acceptance: 1.5
    },
    {
      name: 'Apple',
      logo: '🍎',
      requiredSkills: ['System Programming', 'UI/UX', 'Performance'],
      preferredExperience: ['Mobile', 'Hardware Integration', 'Security'],
      interviewFocus: ['Quality', 'Innovation', 'User Experience'],
      salaryRange: '₹17L - ₹62.6L',
      acceptance: 0.8
    },
    {
      name: 'Microsoft',
      logo: '🪟',
      requiredSkills: ['Cloud', 'Enterprise', 'System Design'],
      preferredExperience: ['Azure', '.NET', 'Enterprise Software'],
      interviewFocus: ['Problem Solving', 'Architecture', 'Collaboration'],
      salaryRange: '₹18L - ₹33L',
      acceptance: 1.3
    },
    {
      name: 'Zerodha',
      logo: '📈',
      requiredSkills: ['Backend Development', 'Financial Systems', 'Security'],
      preferredExperience: ['Trading Systems', 'APIs', 'Startup Culture'],
      interviewFocus: ['Practical Problem Solving', 'Ownership', 'Performance'],
      salaryRange: '₹6.5L - ₹26.8L',
      acceptance: 2.0
    },
    {
      name: 'Infosys',
      logo: '💼',
      requiredSkills: ['Java', 'SQL', 'Enterprise Tools'],
      preferredExperience: ['Client Communication', 'Software Services'],
      interviewFocus: ['Service Delivery', 'Process Knowledge', 'Code Maintenance'],
      salaryRange: '₹3.2L - ₹14L',
      acceptance: 5.0
    }
  ]
};

const CORE_SKILLS = [
  { name: 'Data Structures', icon: <Code2 className="w-4 h-4" />, importance: 'Critical' },
  { name: 'Algorithms', icon: <Brain className="w-4 h-4" />, importance: 'Critical' },
  { name: 'System Design', icon: <Shield className="w-4 h-4" />, importance: 'High' },
  { name: 'Problem Solving', icon: <Target className="w-4 h-4" />, importance: 'Critical' },
  { name: 'Leadership', icon: <Users2 className="w-4 h-4" />, importance: 'High' },
  { name: 'Dynamic Programming', icon: <LineChart className="w-4 h-4" />, importance: 'Medium' }
];

interface FaangEligibilityProps {
  leetcodeStats: LeetCodeStats;
}

const FaangEligibility: React.FC<FaangEligibilityProps> = ({ leetcodeStats }) => {
  const { theme } = useTheme();
  const [selectedCompany, setSelectedCompany] = useState(REQUIREMENTS.companies[0]);

  const calculateReadiness = () => {
    const totalScore = Math.min(100, (leetcodeStats.totalSolved / REQUIREMENTS.minProblems) * 100);
    const mediumScore = Math.min(100, (leetcodeStats.mediumSolved / REQUIREMENTS.minMedium) * 100);
    const hardScore = Math.min(100, (leetcodeStats.hardSolved / REQUIREMENTS.minHard) * 100);
    const contestScore = leetcodeStats.contestRating 
      ? Math.min(100, (leetcodeStats.contestRating / REQUIREMENTS.minContestRating) * 100)
      : 0;

    const hasContestRating = leetcodeStats.contestRating !== undefined;
    const weights = hasContestRating 
      ? { total: 0.3, medium: 0.35, hard: 0.25, contest: 0.1 }
      : { total: 0.35, medium: 0.4, hard: 0.25, contest: 0 };

    const overallScore = (totalScore * weights.total) + 
                        (mediumScore * weights.medium) + 
                        (hardScore * weights.hard) + 
                        (contestScore * weights.contest);
    
    return {
      score: Math.round(overallScore),
      status: overallScore >= 80 ? 'high' : overallScore >= 60 ? 'medium' : 'low',
      gaps: {
        total: Math.max(0, REQUIREMENTS.minProblems - leetcodeStats.totalSolved),
        medium: Math.max(0, REQUIREMENTS.minMedium - leetcodeStats.mediumSolved),
        hard: Math.max(0, REQUIREMENTS.minHard - leetcodeStats.hardSolved),
        contest: leetcodeStats.contestRating && leetcodeStats.contestRating < REQUIREMENTS.minContestRating
          ? REQUIREMENTS.minContestRating - leetcodeStats.contestRating
          : 0
      }
    };
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const readiness = calculateReadiness();

  const getReadinessLevel = (score: number) => {
    if (score >= 80) return { text: 'Highly Ready', color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/20' };
    if (score >= 60) return { text: 'Moderately Ready', color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/20' };
    return { text: 'Need More Practice', color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/20' };
  };

  const readinessLevel = getReadinessLevel(readiness.score);

  return (
    <div className="mt-6 space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Rocket className="w-8 h-8 text-blue-500" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Tech Company Readiness</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Your preparation analysis for top tech companies</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className={`px-4 py-2 rounded-full ${readinessLevel.bg}`}>
              <span className={`text-sm font-medium ${readinessLevel.color}`}>
                {readinessLevel.text}
              </span>
            </div>
            <div className="text-center">
              <div className={`text-4xl font-bold ${readinessLevel.color}`}>
                {readiness.score}%
              </div>
              <div className="text-sm text-gray-500">Overall Score</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Progress Overview */}
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <h4 className="text-sm font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
                <BarChart2 className="w-4 h-4" />
                Progress Overview
              </h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-blue-500" />
                      Total Problems
                    </span>
                    <span className="font-medium">{leetcodeStats.totalSolved}/{REQUIREMENTS.minProblems}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div 
                      className={`h-full ${getProgressColor(Math.min(100, (leetcodeStats.totalSolved / REQUIREMENTS.minProblems) * 100))} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.min(100, (leetcodeStats.totalSolved / REQUIREMENTS.minProblems) * 100)}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-yellow-500" />
                      Medium Problems
                    </span>
                    <span className="font-medium">{leetcodeStats.mediumSolved}/{REQUIREMENTS.minMedium}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div 
                      className={`h-full ${getProgressColor(Math.min(100, (leetcodeStats.mediumSolved / REQUIREMENTS.minMedium) * 100))} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.min(100, (leetcodeStats.mediumSolved / REQUIREMENTS.minMedium) * 100)}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-red-500" />
                      Hard Problems
                    </span>
                    <span className="font-medium">{leetcodeStats.hardSolved}/{REQUIREMENTS.minHard}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div 
                      className={`h-full ${getProgressColor(Math.min(100, (leetcodeStats.hardSolved / REQUIREMENTS.minHard) * 100))} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.min(100, (leetcodeStats.hardSolved / REQUIREMENTS.minHard) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <h4 className="text-sm font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Core Skills Required
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {CORE_SKILLS.map(skill => (
                  <div 
                    key={skill.name}
                    className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
                  >
                    <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-900/30">
                      {skill.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{skill.name}</p>
                      <p className={`text-xs ${
                        skill.importance === 'Critical' ? 'text-red-500' :
                        skill.importance === 'High' ? 'text-yellow-500' :
                        'text-blue-500'
                      }`}>
                        {skill.importance}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Middle Column: Company Focus */}
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <h4 className="text-sm font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Company Focus
              </h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {REQUIREMENTS.companies.map(company => (
                  <button
                    key={company.name}
                    onClick={() => setSelectedCompany(company)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedCompany.name === company.name
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {company.logo} {company.name}
                    </span>
                  </button>
                ))}
              </div>
              <div className="space-y-4">
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="font-medium">Required Skills</h5>
                    <span className="text-xs text-gray-500">Priority Order</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedCompany.requiredSkills.map((skill, index) => (
                      <span 
                        key={skill}
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          index === 0 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                          index === 1 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                          'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="font-medium">Interview Focus</h5>
                    <span className="text-xs text-gray-500">Key Areas</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedCompany.interviewFocus.map(focus => (
                      <span 
                        key={focus}
                        className="px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 text-xs font-medium"
                      >
                        {focus}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Recommendations */}
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <h4 className="text-sm font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Next Steps
              </h4>
              <div className="space-y-3">
                {readiness.gaps.total > 0 && (
                  <div className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                    <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-900/30">
                      <Target className="w-4 h-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Increase Problem Count</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Solve {readiness.gaps.total} more problems to reach the target
                      </p>
                    </div>
                  </div>
                )}
                {readiness.gaps.medium > 0 && (
                  <div className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                    <div className="p-1.5 rounded-md bg-yellow-100 dark:bg-yellow-900/30">
                      <Award className="w-4 h-4 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Focus on Medium Problems</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Complete {readiness.gaps.medium} more medium difficulty problems
                      </p>
                    </div>
                  </div>
                )}
                {readiness.gaps.hard > 0 && (
                  <div className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                    <div className="p-1.5 rounded-md bg-red-100 dark:bg-red-900/30">
                      <Zap className="w-4 h-4 text-red-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Tackle Hard Problems</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Solve {readiness.gaps.hard} more hard problems to improve readiness
                      </p>
                    </div>
                  </div>
                )}
                {readiness.gaps.contest > 0 && (
                  <div className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                    <div className="p-1.5 rounded-md bg-purple-100 dark:bg-purple-900/30">
                      <Clock className="w-4 h-4 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Improve Contest Rating</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Increase rating by {readiness.gaps.contest} points through contests
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <h4 className="text-sm font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Career Impact
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <GraduationCap className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium">Expected Compensation</span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedCompany.salaryRange}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <Users2 className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium">Acceptance Rate</span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedCompany.acceptance}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaangEligibility; 