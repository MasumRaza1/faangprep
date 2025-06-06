import React, { useState, useMemo, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { ChevronDown, ChevronRight, ExternalLink, Search, Shuffle, Check, BookmarkPlus, BookmarkCheck, Calendar, ChevronLeft, RefreshCw } from 'lucide-react';
import ultimateData from '../../data/ultimateData';
import Footer from '../Footer';
import Fuse from 'fuse.js';

interface Question {
  questionHeading: string;
  questionLink: string;
  gfgLink: string;
  leetCodeLink: string;
  youTubeLink: string;
  isDone: boolean;
  isBookmarked: boolean;
  userNotes: string;
  questionIndex: number;
  questionId: string;
  difficulty?: string;
}

interface Category {
  categoryId: number;
  categoryName: string;
  categoryTotalQuestions: number;
  categoryCompletedQuestions: number;
  questionList: Question[];
}

interface Content {
  contentPath: string;
  contentHeading: string;
  contentSubHeading: string;
  contentUserNotes: string;
  contentTotalQuestions: number;
  contentCompletedQuestions: number;
  categoryList: Category[];
}

interface StudyPlan {
  startDate: string;
  numberOfDays: number;
  questionsPerDay: number;
  questionAssignments: { [date: string]: string[] };
  completedQuestionsByDate: { [date: string]: string[] };
}

const styles = `
  *, *::before, *::after {
    box-sizing: border-box;
  }

  .highlight-animation {
    animation: highlight 2s ease-in-out;
  }

  @keyframes highlight {
    0% { background-color: rgba(59, 130, 246, 0.5); }
    100% { background-color: transparent; }
  }

  /* Mobile-friendly scrolling */
  @media (max-width: 640px) {
    .overflow-auto {
      -webkit-overflow-scrolling: touch;
    }
  }

  @keyframes spin-once {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  
  .animate-spin-once:hover {
    animation: spin-once 0.5s ease-in-out;
  }
`;

const DSAQuestions: React.FC = () => {
  const { theme } = useTheme();

  // Get today's date in IST
  const getTodayIST = () => {
    const now = new Date();
    // Convert to IST
    const istDate = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
    return istDate.toISOString().split('T')[0];
  };

  // Enhanced date formatting with Indian time zone
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    // Convert to IST by adding 5 hours and 30 minutes
    const istDate = new Date(date.getTime() + (5.5 * 60 * 60 * 1000));
    return istDate.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'Asia/Kolkata'
    });
  };

  const [expandedTopics, setExpandedTopics] = useState<{ [key: string]: boolean }>({});
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [completedQuestions, setCompletedQuestions] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('completedQuestions');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch (error) {
      console.error('Error loading completed questions:', error);
      return new Set();
    }
  });
  const [revisionQuestions, setRevisionQuestions] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('revisionQuestions');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch (error) {
      console.error('Error loading revision questions:', error);
      return new Set();
    }
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showDifficultyDropdown, setShowDifficultyDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'revision'>('all');
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [showStudyPlanModal, setShowStudyPlanModal] = useState(false);
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const [startDate, setStartDate] = useState('');
  const [numberOfDays, setNumberOfDays] = useState('');
  const [selectedDate, setSelectedDate] = useState(getTodayIST());
  const [showCalendar, setShowCalendar] = useState(false);
  const content = (ultimateData?.data?.content || []) as Content[];
  const [showBookmarked, setShowBookmarked] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [showIncomplete, setShowIncomplete] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Add debounce function after the state declarations
  const debounce = <F extends (...args: any[]) => any>(func: F, waitFor: number) => {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: Parameters<F>): Promise<ReturnType<F>> =>
      new Promise(resolve => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => resolve(func(...args)), waitFor);
      });
  };

  // Add highlight function
  const highlightText = (text: string, query: string): JSX.Element => {
    if (!query.trim()) return <>{text}</>;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <>
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() ? (
            <span key={i} className="bg-yellow-200 dark:bg-yellow-900 rounded px-0.5">{part}</span>
          ) : part
        )}
      </>
    );
  };

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const loadSavedData = () => {
      try {
        const savedStudyPlan = localStorage.getItem('studyPlan');

        if (savedStudyPlan) {
          const plan = JSON.parse(savedStudyPlan);
          setStudyPlan(plan);
          setSelectedDate(getTodayIST());
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    };

    loadSavedData();
  }, []);

  // Persist completed questions whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('completedQuestions', JSON.stringify(Array.from(completedQuestions)));
    } catch (error) {
      console.error('Error saving completed questions:', error);
    }
  }, [completedQuestions]);

  // Persist revision questions whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('revisionQuestions', JSON.stringify(Array.from(revisionQuestions)));
    } catch (error) {
      console.error('Error saving revision questions:', error);
    }
  }, [revisionQuestions]);

  // Persist study plan whenever it changes
  useEffect(() => {
    if (studyPlan) {
      try {
        localStorage.setItem('studyPlan', JSON.stringify(studyPlan));
      } catch (error) {
        console.error('Error saving study plan:', error);
      }
    }
  }, [studyPlan]);

  const toggleTopic = (topicName: string) => {
    setExpandedTopics(prev => ({
      ...prev,
      [topicName]: !prev[topicName]
    }));
  };

  const toggleQuestionCompletion = (questionId: string) => {
    const today = getTodayIST();
    
    setCompletedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
        if (studyPlan) {
          const updatedPlan = { ...studyPlan };
          if (!updatedPlan.completedQuestionsByDate) {
            updatedPlan.completedQuestionsByDate = {};
          }
          if (updatedPlan.completedQuestionsByDate[today]) {
            updatedPlan.completedQuestionsByDate[today] = updatedPlan.completedQuestionsByDate[today].filter(
              id => id !== questionId
            );
          }
          setStudyPlan(updatedPlan);
        }
      } else {
        newSet.add(questionId);
        if (studyPlan) {
          const updatedPlan = { ...studyPlan };
          if (!updatedPlan.completedQuestionsByDate) {
            updatedPlan.completedQuestionsByDate = {};
          }
          if (!updatedPlan.completedQuestionsByDate[today]) {
            updatedPlan.completedQuestionsByDate[today] = [];
          }
          updatedPlan.completedQuestionsByDate[today].push(questionId);
          setStudyPlan(updatedPlan);
        }
      }

      // Immediately persist to localStorage
      try {
        localStorage.setItem('completedQuestions', JSON.stringify(Array.from(newSet)));
      } catch (error) {
        console.error('Error saving completed questions:', error);
      }

      return newSet;
    });
  };

  const toggleRevision = (questionId: string) => {
    setRevisionQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }

      // Immediately persist to localStorage
      try {
        localStorage.setItem('revisionQuestions', JSON.stringify(Array.from(newSet)));
      } catch (error) {
        console.error('Error saving revision questions:', error);
      }

      return newSet;
    });
  };

  // Improved difficulty detection
  const getDifficulty = (question: Question): 'Easy' | 'Medium' | 'Hard' => {
    // First check if difficulty is explicitly set
    if (question.difficulty) {
      const diff = question.difficulty.toLowerCase();
      if (diff.includes('easy')) return 'Easy';
      if (diff.includes('medium')) return 'Medium';
      if (diff.includes('hard')) return 'Hard';
    }

    // Check in question heading
    const title = question.questionHeading.toLowerCase();
    
    // Check for explicit difficulty mentions
    if (title.includes('[easy]') || title.includes('(easy)') || title.includes('easy -')) return 'Easy';
    if (title.includes('[medium]') || title.includes('(medium)') || title.includes('medium -')) return 'Medium';
    if (title.includes('[hard]') || title.includes('(hard)') || title.includes('hard -')) return 'Hard';

    // Check LeetCode URL if available
    if (question.leetCodeLink) {
      const leetCodeUrl = question.leetCodeLink.toLowerCase();
      if (leetCodeUrl.includes('/easy/')) return 'Easy';
      if (leetCodeUrl.includes('/medium/')) return 'Medium';
      if (leetCodeUrl.includes('/hard/')) return 'Hard';
    }

    // Check for common patterns in question heading
    const easyPatterns = [
      'basic',
      'simple',
      'elementary',
      'beginner',
      'straightforward',
      'implementation',
      'introduction'
    ];

    const hardPatterns = [
      'advanced',
      'complex',
      'difficult',
      'challenging',
      'hard',
      'expert',
      'optimization'
    ];

    // Check for easy patterns
    if (easyPatterns.some(pattern => title.includes(pattern))) {
      return 'Easy';
    }

    // Check for hard patterns
    if (hardPatterns.some(pattern => title.includes(pattern))) {
      return 'Hard';
    }

    // Default to Medium if no clear indicators
    return 'Medium';
  };

  // Calculate statistics
  const calculateStats = () => {
    let totalQuestions = 0;
    let completedCount = 0;
    const difficultyStats = {
      Easy: { total: 0, completed: 0 },
      Medium: { total: 0, completed: 0 },
      Hard: { total: 0, completed: 0 }
    };

    content.forEach(section => {
      section.categoryList.forEach(category => {
        category.questionList.forEach(question => {
          const difficulty = getDifficulty(question);
          totalQuestions++;
          difficultyStats[difficulty].total++;
          
          if (completedQuestions.has(question.questionId)) {
            completedCount++;
            difficultyStats[difficulty].completed++;
          }
        });
      });
    });

    return {
      total: totalQuestions,
      completed: completedCount,
      difficultyStats
    };
  };

  // Update the getFilteredQuestions function
  const getFilteredQuestions = (questions: Question[]) => {
    // First filter by difficulty and tab
    const baseFiltered = questions.filter((question: Question) => {
      const matchesDifficulty = selectedDifficulty === 'all' || getDifficulty(question) === selectedDifficulty;
      const matchesTab = activeTab === 'all' || (activeTab === 'revision' && revisionQuestions.has(question.questionId));
      return matchesDifficulty && matchesTab;
    });

    // If no search query, return base filtered results
    if (!searchQuery.trim()) return baseFiltered;

    // Configure Fuse.js for fuzzy search
    const fuseOptions = {
      includeScore: true,
      threshold: 0.4,
      keys: [
        { name: 'questionHeading', weight: 0.7 },
        { name: 'questionLink', weight: 0.3 },
        { name: 'gfgLink', weight: 0.3 },
        { name: 'leetCodeLink', weight: 0.3 }
      ]
    };

    const fuse = new Fuse(baseFiltered, fuseOptions);
    return fuse.search(searchQuery).map(result => result.item);
  };

  // Add debounced search handler
  const debouncedSearch = debounce(async (query: string) => {
    if (!query.trim()) {
      setSearchSuggestions([]);
      return;
    }

    // Get all unique question headings and topics
    const suggestions = new Set<string>();
    content.forEach(section => {
      section.categoryList.forEach(category => {
        suggestions.add(category.categoryName);
        category.questionList.forEach(question => {
          suggestions.add(question.questionHeading);
        });
      });
    });

    // Filter suggestions based on query
    const fuse = new Fuse(Array.from(suggestions), {
      threshold: 0.4,
      includeScore: true
    });

    const results = fuse.search(query)
      .slice(0, 5)
      .map(result => result.item);

    setSearchSuggestions(results);
  }, 300);

  // Enhanced random question picker
  const pickRandomQuestion = () => {
    const allQuestions: Question[] = [];
    content.forEach((section: Content) => {
      section.categoryList.forEach((category: Category) => {
        category.questionList.forEach((question: Question) => {
          if (
            (selectedDifficulty === 'all' || getDifficulty(question) === selectedDifficulty) &&
            (activeTab === 'all' || (activeTab === 'revision' && revisionQuestions.has(question.questionId)))
          ) {
            allQuestions.push(question);
          }
        });
      });
    });

    if (allQuestions.length > 0) {
      // Filter out completed questions unless all questions are completed
      const incompleteQuestions = allQuestions.filter((q: Question) => !completedQuestions.has(q.questionId));
      const questionsToPickFrom = incompleteQuestions.length > 0 ? incompleteQuestions : allQuestions;
      
      const randomQuestion = questionsToPickFrom[Math.floor(Math.random() * questionsToPickFrom.length)];
      
      // Find and expand the topic containing this question
      content.forEach((section: Content) => {
        section.categoryList.forEach((category: Category) => {
          if (category.questionList.some((q: Question) => q.questionId === randomQuestion.questionId)) {
            setExpandedTopics(prev => ({ ...prev, [category.categoryName]: true }));
          }
        });
      });

      // If we have a study plan, select the date this question is assigned to
      if (studyPlan) {
        for (const [date, questions] of Object.entries(studyPlan.questionAssignments)) {
          if (questions.includes(randomQuestion.questionId)) {
            setSelectedDate(date);
            break;
          }
        }
      }

      // Scroll to the question
      setTimeout(() => {
        const element = document.getElementById(randomQuestion.questionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('highlight-animation');
          setTimeout(() => element.classList.remove('highlight-animation'), 2000);
        }
      }, 100);
    }
  };

  // Helper function to render question links
  const renderQuestionLinks = (question: Question) => {
    const links = [];
    
    if (question.questionLink) {
      links.push(
        <a
          key="question"
          href={question.questionLink}
          target="_blank"
          rel="noopener noreferrer"
          className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 hover:bg-purple-200 
            dark:bg-purple-900/30 dark:text-purple-400 dark:hover:bg-purple-900/50 
            flex items-center gap-1.5 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" 
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          Question
        </a>
      );
    }
    
    if (question.leetCodeLink) {
      links.push(
        <a
          key="leetcode"
          href={question.leetCodeLink}
          target="_blank"
          rel="noopener noreferrer"
          className="px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 hover:bg-yellow-200 
            dark:bg-yellow-900/30 dark:text-yellow-400 dark:hover:bg-yellow-900/50 
            flex items-center gap-1.5 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.823.662s-1.357-.195-1.824-.662l-4.332-4.363c-.467-.467-.702-1.15-.702-1.863s.235-1.357.702-1.824l4.319-4.38c.467-.467 1.125-.645 1.837-.645s1.357.195 1.823.662l2.697 2.606c.514.515 1.365.497 1.9-.038.535-.536.553-1.387.039-1.901l-2.609-2.636a5.055 5.055 0 0 0-2.445-1.337l2.467-2.503c.516-.514.498-1.366-.037-1.901-.535-.535-1.387-.552-1.901-.038l-10.1 10.101c-.981.982-1.494 2.337-1.494 3.835 0 1.498.513 2.895 1.494 3.875l4.347 4.361c.981.979 2.337 1.452 3.834 1.452s2.853-.512 3.835-1.494l2.609-2.637c.514-.514.496-1.365-.039-1.9s-1.386-.553-1.899-.039zM20.811 13.01H10.666c-.702 0-1.27.604-1.27 1.346s.568 1.346 1.27 1.346h10.145c.701 0 1.27-.604 1.27-1.346s-.569-1.346-1.27-1.346z"/>
          </svg>
          LeetCode
        </a>
      );
    }
    
    if (question.gfgLink) {
      links.push(
        <a
          key="gfg"
          href={question.gfgLink}
          target="_blank"
          rel="noopener noreferrer"
          className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200 
            dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50 
            flex items-center gap-1.5 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zm-2.5 11.5h-7a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1zm0-3h-7a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1zm0-3h-7a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1z"/>
          </svg>
          GfG
        </a>
      );
    }

    if (question.youTubeLink) {
      links.push(
        <a
          key="youtube"
          href={question.youTubeLink}
          target="_blank"
          rel="noopener noreferrer"
          className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 
            dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 
            flex items-center gap-1.5 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
          </svg>
          Solution
        </a>
      );
    }

    return links.length > 0 ? (
      <div className="flex flex-wrap gap-2 items-center mt-2">
        {links}
      </div>
    ) : null;
  };

  // Get all questions in order
  const getAllQuestions = (): Question[] => {
    const allQuestions: Question[] = [];
    content.forEach((section: Content) => {
      section.categoryList.forEach((category: Category) => {
        category.questionList.forEach((question: Question) => {
          allQuestions.push(question);
        });
      });
    });
    return allQuestions;
  };

  // Get section date range
  const getSectionDateRange = (section: Content) => {
    if (!studyPlan) return null;

    let firstDate: Date | undefined;
    let lastDate: Date | undefined;

    // Find all questions in this section
    const sectionQuestionIds = new Set<string>();
    section.categoryList.forEach((category: Category) => {
      category.questionList.forEach((question: Question) => {
        sectionQuestionIds.add(question.questionId);
      });
    });

    // Find the earliest and latest dates for these questions
    Object.entries(studyPlan.questionAssignments).forEach(([dateStr, questionIds]) => {
      const hasQuestionFromSection = questionIds.some(id => sectionQuestionIds.has(id));
      if (hasQuestionFromSection) {
        const date = new Date(dateStr);
        if (!firstDate || date < firstDate) firstDate = date;
        if (!lastDate || date > lastDate) lastDate = date;
      }
    });

    if (!firstDate || !lastDate) return null;

    return {
      start: formatDate(firstDate.toISOString()),
      end: formatDate(lastDate.toISOString())
    };
  };

  // Get section progress
  const getSectionProgress = (section: Content) => {
    let total = 0;
    let completed = 0;

    section.categoryList.forEach((category: Category) => {
      category.questionList.forEach((question: Question) => {
        total++;
        if (completedQuestions.has(question.questionId)) {
          completed++;
        }
      });
    });

    return { completed, total };
  };

  // Create study plan with section-wise distribution
  const createStudyPlan = () => {
    const numDays = parseInt(numberOfDays);
    if (!startDate || !numDays || numDays <= 0) return;

    const allQuestions = getAllQuestions();
    // Filter out completed questions
    const remainingQuestions = allQuestions.filter(q => !completedQuestions.has(q.questionId));
    const totalQuestions = remainingQuestions.length;
    const questionsPerDay = Math.ceil(totalQuestions / numDays);
    
    const assignments: { [date: string]: string[] } = {};
    
    // Group questions by section, excluding completed ones
    const sectionQuestions: { [sectionPath: string]: Question[] } = {};
    content.forEach(section => {
      sectionQuestions[section.contentPath] = [];
      section.categoryList.forEach(category => {
        category.questionList.forEach(question => {
          if (!completedQuestions.has(question.questionId)) {
          sectionQuestions[section.contentPath].push(question);
          }
        });
      });
    });

    // Calculate days per section based on remaining question count
    const totalDaysPerSection: { [sectionPath: string]: number } = {};
    Object.entries(sectionQuestions).forEach(([sectionPath, questions]) => {
      const sectionDays = Math.ceil((questions.length / totalQuestions) * numDays);
      totalDaysPerSection[sectionPath] = sectionDays;
    });

    // Assign questions section by section
    let currentDate = new Date(startDate);
    Object.entries(sectionQuestions).forEach(([sectionPath, questions]) => {
      const sectionDays = totalDaysPerSection[sectionPath];
      const questionsPerDayInSection = Math.ceil(questions.length / sectionDays);

      let sectionQuestionIndex = 0;
      for (let day = 0; day < sectionDays && sectionQuestionIndex < questions.length; day++) {
        const dateString = currentDate.toISOString().split('T')[0];
        assignments[dateString] = [];

        for (let q = 0; q < questionsPerDayInSection && sectionQuestionIndex < questions.length; q++) {
          assignments[dateString].push(questions[sectionQuestionIndex].questionId);
          sectionQuestionIndex++;
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }
    });

    const newStudyPlan: StudyPlan = {
      startDate,
      numberOfDays: numDays,
      questionsPerDay,
      questionAssignments: assignments,
      completedQuestionsByDate: {}
    };

    setStudyPlan(newStudyPlan);
    setSelectedDate(startDate);
    setShowStudyPlanModal(false);
  };

  const getEndDate = () => {
    if (!studyPlan?.startDate) return null;
    const endDate = new Date(studyPlan.startDate);
    endDate.setDate(endDate.getDate() + studyPlan.numberOfDays - 1);
    return endDate.toLocaleDateString();
  };

  const getRemainingDays = () => {
    if (!studyPlan?.startDate) return 0;
    const today = new Date(getTodayIST());
    const endDate = new Date(studyPlan.startDate);
    endDate.setDate(endDate.getDate() + studyPlan.numberOfDays - 1);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const getQuestionsForDate = (date: string) => {
    if (!studyPlan) return [];
    return studyPlan.questionAssignments[date] || [];
  };

  const getCompletedQuestionsForDate = (date: string) => {
    if (!studyPlan?.completedQuestionsByDate) return [];
    return studyPlan.completedQuestionsByDate[date] || [];
  };

  // Get the content array from ultimateData
  const stats = calculateStats();
  const progressPercentage = Math.round((stats.completed / stats.total) * 100);
  const selectedDateQuestions = getQuestionsForDate(selectedDate);

  // Add difficulty filter options
  const difficultyOptions = ['all', 'Easy', 'Medium', 'Hard'] as const;

  // Update the difficulty dropdown
  const renderDifficultyDropdown = () => (
    <div className="relative">
      <button
        onClick={() => setShowDifficultyDropdown(!showDifficultyDropdown)}
        className={`px-4 py-2 rounded-lg ${
          theme.mode === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
        } flex items-center gap-2`}
      >
        <span className={
          selectedDifficulty === 'all' 
            ? '' 
            : selectedDifficulty === 'Easy'
            ? 'text-green-500'
            : selectedDifficulty === 'Medium'
            ? 'text-yellow-500'
            : 'text-red-500'
        }>
          {selectedDifficulty === 'all' ? 'Difficulty' : selectedDifficulty}
        </span>
        <ChevronDown size={16} />
      </button>
      {showDifficultyDropdown && (
        <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg ${
          theme.mode === 'dark' ? 'bg-gray-800' : 'bg-white'
        } ring-1 ring-black ring-opacity-5 z-10`}>
          <div className="py-1">
            {difficultyOptions.map((difficulty) => {
              const difficultyColor = 
                difficulty === 'all'
                  ? ''
                  : difficulty === 'Easy'
                  ? 'text-green-500'
                  : difficulty === 'Medium'
                  ? 'text-yellow-500'
                  : 'text-red-500';

              return (
                <button
                  key={difficulty}
                  onClick={() => {
                    setSelectedDifficulty(difficulty);
                    setShowDifficultyDropdown(false);
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    theme.mode === 'dark'
                      ? 'hover:bg-gray-700'
                      : 'hover:bg-gray-100'
                  } ${difficultyColor} ${selectedDifficulty === difficulty ? 'bg-blue-500 text-white' : ''}`}
                >
                  {difficulty === 'all' ? 'All Difficulties' : difficulty}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  // Get scheduled date for a question
  const getQuestionScheduledDate = (questionId: string): string | null => {
    if (!studyPlan) return null;
    
    for (const [date, questions] of Object.entries(studyPlan.questionAssignments)) {
      if (questions.includes(questionId)) {
        return formatDate(date);
      }
    }
    return null;
  };

  // Update the handleReset function to be more comprehensive
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all progress? This action cannot be undone.')) {
      // Reset study plan
      setStudyPlan(null);

      // Reset completed questions
      setCompletedQuestions(new Set());

      // Reset revision questions
      setRevisionQuestions(new Set());
      
      // Reset search and filters
      setSearchQuery('');
      setSelectedDifficulty('all');
      
      // Reset expanded topics
      setExpandedTopics({});

      // Reset selected date to today
      setSelectedDate(getTodayIST());
      
      // Clear local storage
      localStorage.removeItem('studyPlan');
      localStorage.removeItem('completedQuestions');
      localStorage.removeItem('revisionQuestions');
      
      // Update stats
      calculateStats();
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Progress Tracker */}
        <div className={`mb-4 sm:mb-8 p-4 sm:p-6 rounded-lg ${theme.mode === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Total Progress */}
            <div className="flex items-center space-x-4">
              <div className="relative w-16 sm:w-20 h-16 sm:h-20">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke={theme.mode === 'dark' ? '#374151' : '#E5E7EB'}
                    strokeWidth="3"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="#F97316"
                    strokeWidth="3"
                    strokeDasharray={`${progressPercentage}, 100`}
                    strokeDashoffset="0"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-base sm:text-lg font-semibold">{progressPercentage}%</span>
                </div>
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold">Total Progress</h2>
                <p className="text-xl sm:text-2xl font-bold">{stats.completed} / {stats.total}</p>
              </div>
            </div>

            {/* Difficulty Stats */}
            {['Easy', 'Medium', 'Hard'].map(difficulty => (
              <div key={difficulty} className="flex items-center space-x-4">
                <div className={`text-${difficulty === 'Easy' ? 'green' : difficulty === 'Medium' ? 'yellow' : 'red'}-500`}>
                  <h3 className="text-lg sm:text-xl font-bold">{difficulty}</h3>
                  <p className="text-xl sm:text-2xl font-bold">
                    {stats.difficultyStats[difficulty].completed} / {stats.difficultyStats[difficulty].total}
                    <span className="text-gray-500 text-base sm:text-lg ml-2">completed</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Controls Section - Improved Layout */}
        <div className="flex flex-col gap-4 mb-4 sm:mb-8">
          {/* Top Row - Main Filters */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <div className="flex flex-col sm:flex-row w-full sm:w-auto items-start sm:items-center gap-2 sm:gap-4">
          <button 
            onClick={() => setActiveTab('all')}
                className={`w-full sm:w-auto px-4 py-2 rounded-lg ${
              activeTab === 'all'
                ? theme.mode === 'dark'
                  ? 'bg-gray-800 text-white'
                  : 'bg-white text-gray-900'
                : theme.mode === 'dark'
                  ? 'bg-gray-700 text-gray-300'
                  : 'bg-gray-100 text-gray-600'
                } font-medium text-sm sm:text-base min-w-[120px] text-center`}
          >
            All Problems
          </button>
          <button 
            onClick={() => setActiveTab('revision')}
                className={`w-full sm:w-auto px-4 py-2 rounded-lg ${
              activeTab === 'revision'
                ? theme.mode === 'dark'
                  ? 'bg-gray-800 text-white'
                  : 'bg-white text-gray-900'
                : theme.mode === 'dark'
                  ? 'bg-gray-700 text-gray-300'
                  : 'bg-gray-100 text-gray-600'
                } text-sm sm:text-base min-w-[120px] text-center`}
          >
            Revision ({revisionQuestions.size})
          </button>
            </div>

            {/* Search Bar - Full width on mobile */}
            <div className="w-full sm:w-auto sm:flex-grow">
              <div className="relative w-full sm:max-w-md">
                  <input
                    type="text"
                    value={searchQuery}
                  onChange={(e) => {
                    const query = e.target.value;
                    setSearchQuery(query);
                    debouncedSearch(query);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    placeholder="Search questions or topics..."
                  className={`w-full px-4 py-2 rounded-lg text-sm sm:text-base ${
                      theme.mode === 'dark'
                        ? 'bg-gray-800 text-white placeholder-gray-400'
                        : 'bg-white text-gray-900 placeholder-gray-500'
                    } border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                <Search size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                
                {/* Search Suggestions */}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className={`absolute z-50 w-full mt-1 py-2 rounded-lg shadow-lg ${
                    theme.mode === 'dark' ? 'bg-gray-800' : 'bg-white'
                  } border border-gray-200 dark:border-gray-700`}>
                    {searchSuggestions.map((suggestion, index) => (
                  <button
                        key={index}
                    onClick={() => {
                          setSearchQuery(suggestion);
                          setShowSuggestions(false);
                        }}
                        className={`w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${
                          theme.mode === 'dark' ? 'text-gray-200' : 'text-gray-800'
                        }`}
                      >
                        {highlightText(suggestion, searchQuery)}
                </button>
                    ))}
                  </div>
              )}
            </div>
            </div>
          </div>

          {/* Action Buttons - Stack on mobile */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <div className="w-full sm:w-auto flex flex-wrap items-center gap-2 sm:gap-4">
            <button
              onClick={pickRandomQuestion}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg ${
                theme.mode === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                } flex items-center justify-center gap-2 text-sm sm:text-base hover:bg-opacity-90 transition-colors`}
            >
                <Shuffle size={16} /> Random
            </button>
            <button
              onClick={() => setShowStudyPlanModal(true)}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg ${
                theme.mode === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                } flex items-center justify-center gap-2 text-sm sm:text-base hover:bg-opacity-90 transition-colors`}
            >
              <Calendar size={16} /> Study Plan
            </button>
            <button
              onClick={() => setShowCalendar(!showCalendar)}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg ${
                theme.mode === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                } flex items-center justify-center gap-2 text-sm sm:text-base hover:bg-opacity-90 transition-colors`}
            >
              <Calendar size={16} /> Calendar
            </button>
            <button
              onClick={handleReset}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg bg-red-500 text-white flex items-center justify-center gap-2 text-sm sm:text-base hover:bg-red-600 transition-colors`}
              title="Reset all progress"
            >
              <RefreshCw size={16} className="animate-spin-once" /> Reset All
            </button>
            </div>
          </div>
        </div>

        {/* Study Plan Summary */}
        {studyPlan && (
          <div className={`mb-4 sm:mb-8 rounded-xl overflow-hidden ${
            theme.mode === 'dark' ? 'bg-gray-800' : 'bg-white'
          } shadow-lg border ${theme.mode === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}>
            <div className={`p-4 sm:p-6 border-b ${theme.mode === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                    Study Plan Overview
                  </h3>
                  <p className={`mt-1 text-sm ${
                    theme.mode === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Track your progress and stay on schedule
                  </p>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`px-3 sm:px-4 py-1 sm:py-2 rounded-full text-sm font-medium ${
                    getRemainingDays() > 5
                      ? theme.mode === 'dark' ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'
                      : getRemainingDays() > 0
                      ? theme.mode === 'dark' ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-50 text-yellow-600'
                      : theme.mode === 'dark' ? 'bg-red-900/30 text-red-400' : 'bg-red-50 text-red-600'
                  }`}>
                    {getRemainingDays() > 0 
                      ? `${getRemainingDays()} days remaining`
                      : 'Plan completed'}
                  </span>
                  <button
                    onClick={() => setShowStudyPlanModal(true)}
                    className={`p-2 rounded-lg transition-colors ${
                      theme.mode === 'dark' 
                        ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200' 
                        : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                    }`}
                    title="Edit study plan"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 20h9"/>
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Start Date Card */}
                <div className={`p-4 rounded-lg ${
                  theme.mode === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
                } relative overflow-hidden group hover:shadow-md transition-shadow`}>
                  <div className="relative z-10">
                    <p className="text-sm text-gray-500 mb-1">Start Date</p>
                      <p className="text-base sm:text-lg font-medium">
                      {formatDate(studyPlan.startDate)}
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"/>
                </div>

                {/* End Date Card */}
                <div className={`p-4 rounded-lg ${
                  theme.mode === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
                } relative overflow-hidden group hover:shadow-md transition-shadow`}>
                  <div className="relative z-10">
                    <p className="text-sm text-gray-500 mb-1">End Date</p>
                      <p className="text-base sm:text-lg font-medium">
                      {getEndDate() ? formatDate(getEndDate()!) : '-'}
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"/>
                </div>

                {/* Streak Card */}
                <div className={`p-4 rounded-lg ${
                  theme.mode === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
                } relative overflow-hidden group hover:shadow-md transition-shadow`}>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-500">Streak</p>
                      <div className="flex items-center gap-1 bg-orange-100 dark:bg-orange-900/30 px-2 py-0.5 rounded-full">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="12" 
                          height="12" 
                          viewBox="0 0 24 24" 
                          fill="currentColor" 
                          className="text-orange-500"
                        >
                          <path d="M12 1l3 7h7l-6 4 3 7-7-4-7 4 3-7-6-4h7z" />
                        </svg>
                        <span className="text-xs font-medium text-orange-600 dark:text-orange-400">{
                          Object.keys(studyPlan.completedQuestionsByDate)
                            .sort()
                            .reduce((streak, date) => {
                              const completed = studyPlan.completedQuestionsByDate[date]?.length || 0;
                              const target = studyPlan.questionsPerDay;
                              return completed >= target ? streak + 1 : 0;
                            }, 0)
                        } days</span>
                      </div>
                    </div>
                    
                    {/* Days Progress */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500">Study Plan Progress</span>
                        <span className="text-xs font-medium">
                          {studyPlan.numberOfDays - getRemainingDays()}/{studyPlan.numberOfDays} days
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full transition-all duration-300" 
                          style={{ 
                            width: `${((studyPlan.numberOfDays - getRemainingDays()) / studyPlan.numberOfDays) * 100}%` 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"/>
                </div>

                {/* Today's Progress Card */}
                <div className={`p-4 rounded-lg ${
                  theme.mode === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
                } relative overflow-hidden group hover:shadow-md transition-shadow`}>
                  <div className="relative z-10">
                    <p className="text-sm text-gray-500 mb-1">Today's Progress</p>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-baseline gap-2">
                          <p className="text-xl sm:text-2xl font-bold text-green-500">
                          {getQuestionsForDate(getTodayIST()).filter(id => completedQuestions.has(id)).length}
                        </p>
                        <p className="text-sm text-gray-500">completed</p>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <p className="text-lg font-medium text-orange-500">
                          {revisionQuestions.size}
                        </p>
                        <p className="text-sm text-gray-500">in revision</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="text-yellow-500"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      <p className="text-sm">
                        <span className="font-medium">{
                          Object.keys(studyPlan.completedQuestionsByDate).filter(date => 
                            studyPlan.completedQuestionsByDate[date]?.length >= studyPlan.questionsPerDay
                          ).length
                        }</span>
                        <span className="text-gray-500 ml-1">days completed target</span>
                      </p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"/>
                  </div>
                </div>
                </div>
              </div>

            {/* Scheduled Questions Section */}
            <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  Scheduled Questions for {formatDate(selectedDate)}
                </h3>
                  <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const date = new Date(selectedDate);
                      date.setDate(date.getDate() - 1);
                      setSelectedDate(date.toISOString().split('T')[0]);
                    }}
                    className={`p-2 rounded-lg ${
                      theme.mode === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => {
                      const date = new Date(selectedDate);
                      date.setDate(date.getDate() + 1);
                      setSelectedDate(date.toISOString().split('T')[0]);
                    }}
                    className={`p-2 rounded-lg ${
                      theme.mode === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <ChevronRight size={20} />
                  </button>
                  </div>
                </div>

              <div className="space-y-3">
                {selectedDateQuestions.length > 0 ? (
                  selectedDateQuestions.map(questionId => {
                      const question = getAllQuestions().find(q => q.questionId === questionId);
                      if (!question) return null;

                      const isCompleted = completedQuestions.has(questionId);
                      const difficulty = getDifficulty(question);

                      return (
                        <div
                          key={questionId}
                          className={`p-4 rounded-lg transition-all duration-200 ${
                            theme.mode === 'dark' 
                              ? isCompleted ? 'bg-gray-700/50' : 'bg-gray-700/30' 
                              : isCompleted ? 'bg-gray-50' : 'bg-white'
                          } border ${
                          theme.mode === 'dark' 
                            ? isCompleted ? 'border-green-500/30' : 'border-gray-700' 
                            : isCompleted ? 'border-green-100' : 'border-gray-200'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <button
                              onClick={() => toggleQuestionCompletion(questionId)}
                              className={`flex-shrink-0 w-6 h-6 rounded-md border-2 transition-colors ${
                                isCompleted
                                  ? 'bg-green-500 border-green-500'
                                  : theme.mode === 'dark'
                                  ? 'border-gray-600'
                                  : 'border-gray-300'
                              } flex items-center justify-center hover:border-green-500`}
                            >
                              {isCompleted && <Check size={16} className="text-white" />}
                            </button>
                            <div className="flex-grow">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className={`font-medium ${isCompleted ? 'line-through text-gray-500' : ''}`}>
                                    {highlightText(question.questionHeading, searchQuery)}
                                  </span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                      difficulty === 'Easy' 
                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                        : difficulty === 'Medium'
                                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                    }`}>
                                      {difficulty}
                                    </span>
                                </div>
                                    {renderQuestionLinks(question)}
                                </div>
                                <button
                                  onClick={() => toggleRevision(questionId)}
                                  className={`p-2 rounded-lg transition-colors ${
                                  revisionQuestions.has(questionId)
                                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                      : theme.mode === 'dark'
                                      ? 'hover:bg-gray-600'
                                      : 'hover:bg-gray-100'
                                  }`}
                                title={revisionQuestions.has(questionId) ? "Remove from revision" : "Add to revision"}
                                >
                                {revisionQuestions.has(questionId) ? (
                                    <BookmarkCheck size={20} />
                                  ) : (
                                    <BookmarkPlus size={20} className="text-gray-400" />
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                  <div className={`p-6 text-center rounded-lg ${
                      theme.mode === 'dark' ? 'bg-gray-700/30' : 'bg-gray-50'
                    }`}>
                    <p className="text-gray-500">No questions scheduled for this date</p>
                    </div>
                  )}
              </div>
            </div>
          </div>
        )}

        {/* Questions List - Improve mobile layout */}
        <div className="space-y-4 sm:space-y-8">
          {content.map((section) => {
            const filteredCategories = section.categoryList.map(topic => ({
              ...topic,
              questionList: getFilteredQuestions(topic.questionList)
            })).filter(topic => topic.questionList.length > 0);

            if (filteredCategories.length === 0) return null;

            const dateRange = getSectionDateRange(section);
            const progress = getSectionProgress(section);
            const progressPercentage = Math.round((progress.completed / progress.total) * 100);

            return (
              <div key={section.contentPath} className={`rounded-xl overflow-hidden border ${
                theme.mode === 'dark' ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-white'
              } shadow-lg`}>
                <div className={`p-4 sm:p-6 border-b ${
                  theme.mode === 'dark' ? 'border-gray-700' : 'border-gray-100'
                }`}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold mb-1">{section.contentHeading}</h2>
                      {section.contentSubHeading && (
                        <p className={`text-base ${
                          theme.mode === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {section.contentSubHeading}
                        </p>
                      )}
                      {dateRange && (
                        <p className="text-sm text-blue-500 mt-2 flex items-center gap-2">
                          <Calendar size={14} />
                          {dateRange.start} - {dateRange.end}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`px-4 py-2 rounded-lg ${
                        theme.mode === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                      }`}>
                        <span className="text-sm text-gray-500">Progress</span>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-grow w-32 h-2 rounded-full bg-gray-200 dark:bg-gray-600">
                            <div 
                              className="h-2 rounded-full bg-green-500" 
                              style={{ width: `${progressPercentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">
                            {progress.completed}/{progress.total}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  <div className="grid gap-4 sm:gap-6">
                    {filteredCategories.map((topic) => (
                      <div
                        key={topic.categoryId}
                        className={`rounded-lg border ${
                          theme.mode === 'dark' ? 'border-gray-700' : 'border-gray-200'
                        }`}
                      >
                        <button
                          onClick={() => toggleTopic(topic.categoryName)}
                          className={`w-full px-6 py-4 flex items-center justify-between transition-colors ${
                            theme.mode === 'dark' ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {expandedTopics[topic.categoryName] ? (
                              <ChevronDown className="flex-shrink-0 text-gray-400" size={20} />
                            ) : (
                              <ChevronRight className="flex-shrink-0 text-gray-400" size={20} />
                            )}
                            <div className="text-left">
                              <h3 className="text-lg font-semibold">{topic.categoryName}</h3>
                              <p className="text-sm text-gray-500 mt-1">
                                {topic.questionList.filter(q => completedQuestions.has(q.questionId)).length} of {topic.questionList.length} completed
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className={`px-3 py-1 rounded-full text-sm ${
                              theme.mode === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                            }`}>
                              {topic.questionList.length} questions
                            </div>
                          </div>
                        </button>

                        {expandedTopics[topic.categoryName] && (
                          <div className="px-4 sm:px-6 pb-6">
                            <div className="grid gap-4">
                              {topic.questionList.map((question) => {
                                const isCompleted = completedQuestions.has(question.questionId);
                                const isInRevision = revisionQuestions.has(question.questionId);
                                const difficulty = getDifficulty(question);
                                const scheduledDate = getQuestionScheduledDate(question.questionId);

                                return (
                                  <div
                                    key={question.questionId}
                                    id={question.questionId}
                                    className={`p-4 rounded-lg transition-all duration-200 ${
                                      theme.mode === 'dark' 
                                        ? isCompleted ? 'bg-gray-700/50' : 'bg-gray-700/30' 
                                        : isCompleted ? 'bg-gray-50' : 'bg-white'
                                    } border ${
                                      theme.mode === 'dark' 
                                        ? isCompleted ? 'border-green-500/30' : 'border-gray-700' 
                                        : isCompleted ? 'border-green-100' : 'border-gray-200'
                                    } hover:shadow-md`}
                                  >
                                    <div className="space-y-3">
                                      <div className="flex items-start gap-3">
                                        <button
                                          onClick={() => toggleQuestionCompletion(question.questionId)}
                                          className={`flex-shrink-0 w-6 h-6 rounded-md border-2 transition-colors ${
                                            isCompleted
                                              ? 'bg-green-500 border-green-500'
                                              : theme.mode === 'dark'
                                              ? 'border-gray-600'
                                              : 'border-gray-300'
                                          } flex items-center justify-center hover:border-green-500`}
                                        >
                                          {isCompleted && (
                                            <Check size={16} className="text-white" />
                                          )}
                                        </button>
                                        <div className="flex-grow">
                                          <div className="flex items-start justify-between gap-4">
                                            <div>
                                              <div className="flex items-center gap-2 flex-wrap mb-2">
                                                <span className={`font-medium text-lg ${
                                                  isCompleted ? 'line-through text-gray-500' : ''
                                                }`}>
                                                  {highlightText(question.questionHeading, searchQuery)}
                                                </span>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                                  difficulty === 'Easy' 
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                    : difficulty === 'Medium'
                                                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                }`}>
                                                  {difficulty}
                                                </span>
                                                {scheduledDate && (
                                                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                                                    theme.mode === 'dark'
                                                      ? 'bg-blue-900/30 text-blue-400'
                                                      : 'bg-blue-50 text-blue-600'
                                                  }`}>
                                                    {scheduledDate}
                                                  </span>
                                                )}
                                              </div>
                                              <div className="flex items-center gap-4 flex-wrap">
                                                {renderQuestionLinks(question)}
                                              </div>
                                            </div>
                                            <button
                                              onClick={() => toggleRevision(question.questionId)}
                                              className={`p-2 rounded-lg transition-colors ${
                                                isInRevision 
                                                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                                  : theme.mode === 'dark'
                                                  ? 'hover:bg-gray-600'
                                                  : 'hover:bg-gray-100'
                                              }`}
                                              title={isInRevision ? "Remove from revision" : "Add to revision"}
                                            >
                                              {isInRevision ? (
                                                <BookmarkCheck size={20} />
                                              ) : (
                                                <BookmarkPlus size={20} className="text-gray-400" />
                                              )}
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Study Plan Modal - Make it mobile friendly */}
        {showStudyPlanModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 transition-opacity"
              onClick={() => setShowStudyPlanModal(false)}
            />
            
            {/* Modal Panel */}
            <div className="relative min-h-screen sm:min-h-0 flex items-center justify-center p-4">
              <div className={`relative w-full max-w-lg rounded-lg shadow-xl ${
                theme.mode === 'dark' ? 'bg-gray-800' : 'bg-white'
              } p-4 sm:p-6`}>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Create Study Plan</h2>
                    <button
                      onClick={() => setShowStudyPlanModal(false)}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Start Date</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className={`w-full px-4 py-2 rounded-lg text-sm ${
                          theme.mode === 'dark'
                            ? 'bg-gray-700 border-gray-600'
                            : 'bg-white border-gray-300'
                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      />
                      <p className="mt-1 text-xs text-gray-500">You can choose any date, including past dates</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Number of Days</label>
                      <input
                        type="number"
                        value={numberOfDays}
                        onChange={(e) => setNumberOfDays(e.target.value)}
                        min="1"
                        className={`w-full px-4 py-2 rounded-lg text-sm ${
                          theme.mode === 'dark'
                            ? 'bg-gray-700 border-gray-600'
                            : 'bg-white border-gray-300'
                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      />
                      {numberOfDays && parseInt(numberOfDays) > 0 && (
                        <p className="mt-1 text-sm text-gray-500">
                          {Math.ceil(getAllQuestions().length / parseInt(numberOfDays))} questions per day
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                    <button
                      onClick={() => setShowStudyPlanModal(false)}
                      className={`w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-medium ${
                        theme.mode === 'dark'
                          ? 'bg-gray-700 hover:bg-gray-600'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={createStudyPlan}
                      disabled={!startDate || !numberOfDays || parseInt(numberOfDays) <= 0}
                      className={`w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-medium ${
                        !startDate || !numberOfDays || parseInt(numberOfDays) <= 0
                          ? 'bg-blue-400 cursor-not-allowed'
                          : 'bg-blue-500 hover:bg-blue-600'
                      } text-white`}
                    >
                      Create Plan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Calendar Sidebar - Make it mobile friendly */}
        {showCalendar && studyPlan && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/50 transition-opacity"
              onClick={() => setShowCalendar(false)}
            />
            
            {/* Calendar Panel */}
            <div className={`absolute inset-y-0 right-0 w-full sm:w-96 transform transition-transform duration-300 ease-in-out
              ${theme.mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold">Study Calendar</h3>
                  <button 
                    onClick={() => setShowCalendar(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>

                {/* Calendar Content */}
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-2">
                    {(() => {
                      const dates: string[] = [];
                      const startDate = new Date(studyPlan.startDate);
                      
                      for (let i = 0; i < studyPlan.numberOfDays; i++) {
                        const currentDate = new Date(startDate);
                        currentDate.setDate(startDate.getDate() + i);
                        dates.push(currentDate.toISOString().split('T')[0]);
                      }

                      return dates.map(date => {
                        const questions = getQuestionsForDate(date);
                        const completedQuestions = getCompletedQuestionsForDate(date);
                        const isToday = date === getTodayIST();
                        const isSelected = date === selectedDate;

                        return (
                          <button
                            key={date}
                            onClick={() => setSelectedDate(date)}
                            className={`w-full text-left p-4 rounded-lg transition-colors ${
                              isSelected
                                ? 'bg-blue-500 text-white'
                                : isToday
                                ? theme.mode === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50'
                                : theme.mode === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div>
                                <p className="font-medium">{new Date(date).toLocaleDateString(undefined, { 
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric'
                                })}</p>
                                <p className={`text-sm ${
                                  isSelected ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'
                                }`}>
                                  {completedQuestions.length}/{questions.length} completed
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                {questions.map((questionId, index) => (
                                  <div
                                    key={questionId}
                                    className={`w-2 h-2 rounded-full ${
                                      completedQuestions.includes(questionId)
                                        ? 'bg-green-500'
                                        : isSelected
                                        ? 'bg-white/30'
                                        : theme.mode === 'dark'
                                        ? 'bg-gray-600'
                                        : 'bg-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </button>
                        );
                      });
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default DSAQuestions; 