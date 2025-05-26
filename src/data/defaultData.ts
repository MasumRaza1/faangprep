import { Subject, Topic, SubTopic } from '../types';
import { v4 as uuidv4 } from 'uuid';

const defaultStartDate = new Date();
defaultStartDate.setHours(0, 0, 0, 0);

const defaultSchedule = {
  startDate: defaultStartDate,
  totalDays: 30,
  endDate: new Date(defaultStartDate.getTime() + (30 * 24 * 60 * 60 * 1000)),
};

// Helper function to create a subtopic with required properties
const createSubtopic = (title: string, url?: string): SubTopic => ({
  id: uuidv4(),
  title,
  completed: false,
  scheduledDate: null,
  subtopics: [],
  url
});

// Helper function to create a topic with required properties
const createTopic = (title: string, subtopics: SubTopic[]): Topic => ({
  id: uuidv4(),
  title,
  completed: false,
  scheduledDate: null,
  subtopics
});

export const defaultSubjects: Subject[] = [
  {
    id: uuidv4(),
    title: 'Data Structures & Algorithms',
    icon: 'code',
    description: 'Master DSA concepts with practice questions from LeetCode and GeeksforGeeks',
    topics: [
      createTopic('Arrays & Basic Math', [
        createSubtopic('Easy - Largest Element in Array', 'https://practice.geeksforgeeks.org/problems/largest-element-in-array4009/0'),
        createSubtopic('Easy - Second Largest Element', 'https://practice.geeksforgeeks.org/problems/second-largest3735/1'),
        createSubtopic('Easy - Check if Array is Sorted', 'https://leetcode.com/problems/check-if-array-is-sorted-and-rotated/'),
        createSubtopic('Easy - Count Digits', 'https://practice.geeksforgeeks.org/problems/count-digits5716/1'),
        createSubtopic('Medium - Kadane\'s Algorithm', 'https://takeuforward.org/data-structure/kadanes-algorithm-maximum-subarray-sum-in-an-array/'),
        createSubtopic('Medium - Armstrong Number', 'https://practice.geeksforgeeks.org/problems/armstrong-numbers2727/1'),
        createSubtopic('Hard - Merge Overlapping Intervals', 'https://leetcode.com/problems/merge-intervals/')
      ]),
      createTopic('Sorting & Searching', [
        createSubtopic('Easy - Selection Sort', 'https://takeuforward.org/sorting/selection-sort-algorithm/'),
        createSubtopic('Easy - Bubble Sort', 'https://takeuforward.org/data-structure/bubble-sort-algorithm/'),
        createSubtopic('Easy - Binary Search', 'https://leetcode.com/problems/binary-search/'),
        createSubtopic('Medium - Merge Sort', 'https://takeuforward.org/data-structure/merge-sort-algorithm/'),
        createSubtopic('Medium - Quick Sort', 'https://takeuforward.org/data-structure/quick-sort-algorithm/'),
        createSubtopic('Hard - Search in Rotated Array', 'https://leetcode.com/problems/search-in-rotated-sorted-array/')
      ]),
      createTopic('Strings & Pattern Matching', [
        createSubtopic('Easy - Reverse String', 'https://leetcode.com/problems/reverse-string/'),
        createSubtopic('Easy - Palindrome Check', 'https://leetcode.com/problems/valid-palindrome/'),
        createSubtopic('Medium - Anagram Check', 'https://leetcode.com/problems/valid-anagram/'),
        createSubtopic('Medium - Pattern Matching', 'https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/'),
        createSubtopic('Hard - String Compression', 'https://leetcode.com/problems/string-compression/')
      ]),
      createTopic('Linked Lists', [
        createSubtopic('Easy - Singly Linked List Operations', 'https://leetcode.com/tag/linked-list/'),
        createSubtopic('Easy - Reverse Linked List', 'https://leetcode.com/problems/reverse-linked-list/'),
        createSubtopic('Medium - Detect Cycle', 'https://leetcode.com/problems/linked-list-cycle/'),
        createSubtopic('Medium - Find Middle Element', 'https://leetcode.com/problems/middle-of-the-linked-list/'),
        createSubtopic('Hard - LRU Cache Implementation', 'https://leetcode.com/problems/lru-cache/')
      ]),
      createTopic('Trees & Graphs', [
        createSubtopic('Easy - Binary Tree Traversals', 'https://leetcode.com/tag/tree/'),
        createSubtopic('Easy - Height of Binary Tree', 'https://leetcode.com/problems/maximum-depth-of-binary-tree/'),
        createSubtopic('Medium - Binary Search Tree', 'https://leetcode.com/tag/binary-search-tree/'),
        createSubtopic('Medium - Graph BFS/DFS', 'https://leetcode.com/tag/depth-first-search/'),
        createSubtopic('Hard - Shortest Path (Dijkstra)', 'https://practice.geeksforgeeks.org/problems/implementing-dijkstra-set-1-adjacency-matrix/1')
      ]),
      createTopic('Dynamic Programming', [
        createSubtopic('Easy - Fibonacci Number', 'https://leetcode.com/problems/fibonacci-number/'),
        createSubtopic('Easy - Climbing Stairs', 'https://leetcode.com/problems/climbing-stairs/'),
        createSubtopic('Medium - 0/1 Knapsack', 'https://practice.geeksforgeeks.org/problems/0-1-knapsack-problem0945/1'),
        createSubtopic('Medium - Longest Common Subsequence', 'https://leetcode.com/problems/longest-common-subsequence/'),
        createSubtopic('Hard - Edit Distance', 'https://leetcode.com/problems/edit-distance/')
      ]),
      createTopic('Advanced Algorithms', [
        createSubtopic('Medium - Greedy Algorithms', 'https://leetcode.com/tag/greedy/'),
        createSubtopic('Medium - Trie Implementation', 'https://leetcode.com/problems/implement-trie-prefix-tree/'),
        createSubtopic('Hard - N-Queens Problem', 'https://leetcode.com/problems/n-queens/'),
        createSubtopic('Hard - Segment Trees', 'https://practice.geeksforgeeks.org/problems/segment-tree-1587115621/1')
      ])
    ],
    schedule: {
      startDate: new Date(),
      totalDays: 90,
      endDate: new Date(new Date().setDate(new Date().getDate() + 90))
    }
  },

  {
    id: uuidv4(),
    title: 'Object-Oriented Programming',
    icon: 'boxes',
    description: 'Master OOP concepts and design patterns',
    topics: [
      createTopic('OOP Basics', [
        createSubtopic('Classes & Objects'),
        createSubtopic('Constructors & Destructors'),
        createSubtopic('Access Modifiers (Public, Private, Protected)'),
        createSubtopic('Inheritance (Single, Multiple, Multilevel, Hybrid)'),
        createSubtopic('Polymorphism (Compile-time & Run-time)'),
        createSubtopic('Method Overloading'),
        createSubtopic('Method Overriding'),
        createSubtopic('Encapsulation'),
        createSubtopic('Abstraction'),
        createSubtopic('Abstract Classes vs Interfaces'),
        createSubtopic('Composition vs Inheritance')
      ]),
      createTopic('SOLID Principles', [
        createSubtopic('Single Responsibility Principle'),
        createSubtopic('Open/Closed Principle'),
        createSubtopic('Liskov Substitution Principle'),
        createSubtopic('Interface Segregation Principle'),
        createSubtopic('Dependency Inversion Principle')
      ]),
      createTopic('Design Patterns - Creational', [
        createSubtopic('Singleton'),
        createSubtopic('Factory Method'),
        createSubtopic('Abstract Factory'),
        createSubtopic('Builder'),
        createSubtopic('Prototype')
      ]),
      createTopic('Design Patterns - Structural', [
        createSubtopic('Adapter'),
        createSubtopic('Bridge'),
        createSubtopic('Composite'),
        createSubtopic('Decorator'),
        createSubtopic('Facade'),
        createSubtopic('Flyweight'),
        createSubtopic('Proxy')
      ]),
      createTopic('Design Patterns - Behavioral', [
        createSubtopic('Chain of Responsibility'),
        createSubtopic('Command'),
        createSubtopic('Interpreter'),
        createSubtopic('Iterator'),
        createSubtopic('Mediator'),
        createSubtopic('Memento'),
        createSubtopic('Observer'),
        createSubtopic('State'),
        createSubtopic('Strategy'),
        createSubtopic('Template Method'),
        createSubtopic('Visitor')
      ])
    ],
    schedule: { ...defaultSchedule }
  },

  {
    id: uuidv4(),
    title: 'Operating Systems',
    icon: 'cpu',
    description: 'Learn key OS concepts for system design interviews',
    topics: [
      createTopic('Processes and Threads', [
        createSubtopic('Process Lifecycle (PCB, States)'),
        createSubtopic('Thread vs Process'),
        createSubtopic('Context Switching'),
        createSubtopic('Multithreading & Concurrency'),
        createSubtopic('Inter-Process Communication (IPC)'),
        createSubtopic('Race Conditions & Critical Sections')
      ]),
      createTopic('CPU Scheduling', [
        createSubtopic('Preemptive vs Non-preemptive Scheduling'),
        createSubtopic('FCFS, SJF, Round Robin'),
        createSubtopic('Priority Scheduling'),
        createSubtopic('Multilevel Queue Scheduling'),
        createSubtopic('Context Switch Overhead')
      ]),
      createTopic('Memory Management', [
        createSubtopic('Paging & Segmentation'),
        createSubtopic('Virtual Memory'),
        createSubtopic('Page Replacement Algorithms (LRU, FIFO)'),
        createSubtopic('TLB & Caching'),
        createSubtopic('Thrashing'),
        createSubtopic('Stack vs Heap')
      ]),
      createTopic('File Systems', [
        createSubtopic('File System Interface & Implementation'),
        createSubtopic('Inodes, File Descriptors'),
        createSubtopic('Directory Structures'),
        createSubtopic('Mounting & Partitioning'),
        createSubtopic('Journaling File Systems')
      ]),
      createTopic('Deadlocks', [
        createSubtopic('Necessary Conditions'),
        createSubtopic('Deadlock Prevention'),
        createSubtopic('Deadlock Avoidance (Bankers Algorithm)'),
        createSubtopic('Deadlock Detection & Recovery'),
        createSubtopic('Resource Allocation Graph')
      ]),
      createTopic('Synchronization', [
        createSubtopic('Mutex vs Semaphore'),
        createSubtopic('Monitors & Locks'),
        createSubtopic('Spinlocks & Busy Waiting'),
        createSubtopic('Dining Philosophers Problem'),
        createSubtopic('Readers-Writers Problem')
      ]),
      createTopic('I/O & Device Management', [
        createSubtopic('Device Drivers'),
        createSubtopic('Interrupts'),
        createSubtopic('DMA (Direct Memory Access)'),
        createSubtopic('Polling vs Interrupts'),
        createSubtopic('Disk Scheduling Algorithms (FCFS, SSTF, SCAN)')
      ]),
      createTopic('System Calls & OS Structure', [
        createSubtopic('System Call Interface'),
        createSubtopic('User Mode vs Kernel Mode'),
        createSubtopic('Microkernel vs Monolithic Kernel'),
        createSubtopic('Booting Process & Init Systems')
      ])
    ],
    schedule: { ...defaultSchedule }
  },

  {
    id: uuidv4(),
    title: 'DBMS & SQL',
    icon: 'database',
    description: 'Database concepts and SQL for technical interviews',
    topics: [
      createTopic('SQL Basics', [
        createSubtopic('Primary Key, Candidate Key, Super Key, Foreign Key, Alternate Key, Composite Key, Unique Key'),
        createSubtopic('DDL, DML, DCL, TCL Commands'),
        createSubtopic('SELECT, INSERT, UPDATE, DELETE'),
        createSubtopic('WHERE, ORDER BY, GROUP BY, HAVING'),
        createSubtopic('Joins (INNER, LEFT, RIGHT, FULL)'),
        createSubtopic('UNION vs UNION ALL'),
        createSubtopic('Subqueries & Nested Queries'),
        createSubtopic('Aliases, LIKE, IN, BETWEEN'),
        createSubtopic('Aggregate Functions (SUM, COUNT, AVG)'),
        createSubtopic('CASE Statements & Conditional Logic')
      ]),
      createTopic('Normalization', [
        createSubtopic('1NF, 2NF, 3NF'),
        createSubtopic('BCNF'),
        createSubtopic('4NF, 5NF'),
        createSubtopic('Anomalies (Insert, Update, Delete)'),
        createSubtopic('Functional Dependencies'),
        createSubtopic('Decomposition & Lossless Join'),
        createSubtopic('RAID 0 (Striping), RAID 1 (Mirroring), RAID 5 (Distributed Parity), RAID 10 (Striping + Mirroring), RAID Pros and Cons, RAID Use Cases')
      ]),
      createTopic('Indexing', [
        createSubtopic('What is Indexing?'),
        createSubtopic('Clustered vs Non-Clustered Index'),
        createSubtopic('B+ Trees and Hash Indexes'),
        createSubtopic('Covering Indexes'),
        createSubtopic('Indexing and Performance Trade-offs')
      ]),
      createTopic('Transactions', [
        createSubtopic('ACID Properties'),
        createSubtopic('Transaction States'),
        createSubtopic('Concurrency Control'),
        createSubtopic('Two-Phase Locking (2PL)'),
        createSubtopic('Isolation Levels (Read Uncommitted, etc.)'),
        createSubtopic('Phantom Reads, Dirty Reads, Lost Updates'),
        createSubtopic('Deadlocks in Transactions')
      ]),
      createTopic('Query Optimization', [
        createSubtopic('EXPLAIN / ANALYZE in SQL'),
        createSubtopic('Query Execution Plan'),
        createSubtopic('Cost-Based Optimization'),
        createSubtopic('Join Order Optimization'),
        createSubtopic('Use of Indexes in Optimization')
      ]),
      createTopic('ER Model & Relational Model', [
        createSubtopic('Entities and Attributes'),
        createSubtopic('Entity-Relationship Diagrams (ERDs)'),
        createSubtopic('Mapping ER Model to Relational Model'),
        createSubtopic('Keys (Primary, Candidate, Foreign)'),
        createSubtopic('Constraints (NOT NULL, UNIQUE, CHECK)')
      ]),
      createTopic('Storage & File Organization', [
        createSubtopic('Heap Files vs Sorted Files'),
        createSubtopic('Sequential & Hashed File Organization'),
        createSubtopic('Buffer Management'),
        createSubtopic('Page Replacement Strategies')
      ]),
      createTopic('NoSQL Basics (for Comparison)', [
        createSubtopic('RDBMS vs NoSQL'),
        createSubtopic('Document Stores (MongoDB)'),
        createSubtopic('Key-Value Stores (Redis)'),
        createSubtopic('CAP Theorem')
      ])
    ],
    schedule: { ...defaultSchedule }
  },

  {
    id: uuidv4(),
    title: 'Computer Networks',
    icon: 'network',
    description: 'Network concepts for distributed systems design',
    topics: [
      createTopic('OSI Model', [
        createSubtopic('7 Layers Overview'),
        createSubtopic('Physical Layer'),
        createSubtopic('Data Link Layer'),
        createSubtopic('Network Layer'),
        createSubtopic('Transport Layer'),
        createSubtopic('Session Layer'),
        createSubtopic('Presentation Layer'),
        createSubtopic('Application Layer')
      ]),
      createTopic('TCP/IP Protocol', [
        createSubtopic('IP Addressing & Subnetting'),
        createSubtopic('IPv4 vs IPv6'),
        createSubtopic('TCP vs UDP'),
        createSubtopic('3-Way Handshake'),
        createSubtopic('Flow Control and Congestion Control'),
        createSubtopic('Ports and Sockets')
      ]),
      createTopic('HTTP and HTTPS', [
        createSubtopic('HTTP Methods (GET, POST, PUT, DELETE)'),
        createSubtopic('Status Codes'),
        createSubtopic('Headers and Cookies'),
        createSubtopic('TLS/SSL Basics'),
        createSubtopic('HTTPS Handshake')
      ]),
      createTopic('DNS', [
        createSubtopic('DNS Lookup Process'),
        createSubtopic('Types of DNS Records'),
        createSubtopic('Caching and TTL'),
        createSubtopic('DNS Servers (Root, TLD, Authoritative)'),
        createSubtopic('DNS Security Issues')
      ]),
      createTopic('Load Balancing', [
        createSubtopic('What is Load Balancing?'),
        createSubtopic('Types of Load Balancers (Hardware, Software)'),
        createSubtopic('Load Balancing Algorithms (Round Robin, Least Connections, IP Hash)'),
        createSubtopic('Health Checks'),
        createSubtopic('Sticky Sessions')
      ])
    ],
    schedule: { ...defaultSchedule }
  },
  {
    id: uuidv4(),
    title: 'System Design',
    icon: 'boxes',
    description: 'System design concepts for senior roles',
    topics: [
      createTopic('Scalability', [
        createSubtopic('Vertical vs Horizontal Scaling'),
        createSubtopic('Load Balancers'),
        createSubtopic('Caching Strategies'),
        createSubtopic('CDNs'),
        createSubtopic('Asynchronous Processing and Message Queues')
      ]),
      createTopic('Reliability', [
        createSubtopic('Redundancy'),
        createSubtopic('Failover Mechanisms'),
        createSubtopic('Health Checks and Monitoring'),
        createSubtopic('Disaster Recovery')
      ]),
      createTopic('Availability', [
        createSubtopic('CAP Theorem'),
        createSubtopic('Replication Techniques'),
        createSubtopic('Data Consistency Models')
      ]),
      createTopic('Caching', [
        createSubtopic('Write-Through vs Write-Back Cache'),
        createSubtopic('Distributed Caching'),
        createSubtopic('Cache Eviction Policies (LRU, LFU)')
      ]),
      createTopic('Microservices', [
        createSubtopic('Service Discovery'),
        createSubtopic('Inter-service Communication (REST, gRPC, Messaging)'),
        createSubtopic('API Gateway'),
        createSubtopic('Circuit Breaker Pattern'),
        createSubtopic('Database per Service')
      ]),
      createTopic('Database Sharding', [
        createSubtopic('Horizontal vs Vertical Sharding'),
        createSubtopic('Shard Key Selection'),
        createSubtopic('Challenges in Sharding'),
        createSubtopic('Rebalancing and Resharding')
      ])
    ],
    schedule: { ...defaultSchedule }
  },

  {
    id: uuidv4(),
    title: 'Web Development (MERN)',
    icon: 'globe',
    description: 'MERN stack technologies for full-stack roles',
    topics: [
      createTopic('MongoDB', [
        createSubtopic('Basic CRUD Operations'),
        createSubtopic('Schema Design'),
        createSubtopic('Indexing'),
        createSubtopic('Aggregation Pipeline'),
        createSubtopic('Transactions'),
        createSubtopic('Replication & Sharding'),
        createSubtopic('Performance Optimization')
      ]),
      createTopic('Express.js', [
        createSubtopic('Routing'),
        createSubtopic('Middleware'),
        createSubtopic('Error Handling'),
        createSubtopic('Authentication & Authorization'),
        createSubtopic('RESTful API Design'),
        createSubtopic('File Upload'),
        createSubtopic('Database Integration')
      ]),
      createTopic('React.js', [
        createSubtopic('Components & Props'),
        createSubtopic('State & Lifecycle'),
        createSubtopic('Hooks'),
        createSubtopic('Context API'),
        createSubtopic('Redux'),
        createSubtopic('React Router'),
        createSubtopic('Performance Optimization'),
        createSubtopic('Testing (Jest & React Testing Library)')
      ]),
      createTopic('Node.js', [
        createSubtopic('Event Loop'),
        createSubtopic('Streams & Buffers'),
        createSubtopic('Async Programming'),
        createSubtopic('File System Operations'),
        createSubtopic('Child Processes'),
        createSubtopic('Clustering'),
        createSubtopic('Security Best Practices')
      ]),
      createTopic('Web Security', [
        createSubtopic('XSS Prevention'),
        createSubtopic('CSRF Protection'),
        createSubtopic('SQL Injection'),
        createSubtopic('Authentication Methods'),
        createSubtopic('JWT & Session Management'),
        createSubtopic('HTTPS & SSL/TLS'),
        createSubtopic('CORS')
      ]),
      createTopic('Performance', [
        createSubtopic('Code Splitting'),
        createSubtopic('Lazy Loading'),
        createSubtopic('Caching Strategies'),
        createSubtopic('Bundle Optimization'),
        createSubtopic('Image Optimization'),
        createSubtopic('Server-Side Rendering'),
        createSubtopic('Progressive Web Apps')
      ]),
      createTopic('Testing', [
        createSubtopic('Unit Testing'),
        createSubtopic('Integration Testing'),
        createSubtopic('End-to-End Testing'),
        createSubtopic('Test Coverage'),
        createSubtopic('Mocking & Stubbing'),
        createSubtopic('Performance Testing')
      ]),
      createTopic('Deployment', [
        createSubtopic('CI/CD Pipelines'),
        createSubtopic('Docker Containerization'),
        createSubtopic('Cloud Deployment (AWS/GCP/Azure)'),
        createSubtopic('Monitoring & Logging'),
        createSubtopic('Environment Configuration'),
        createSubtopic('Database Migration')
      ])
    ],
    schedule: { ...defaultSchedule }
  },

  {
    id: uuidv4(),
    title: 'Soft Skills',
    icon: 'users',
    description: 'Behavioral interview preparation and communication skills',
    topics: [
      createTopic('STAR Method', [
        createSubtopic('Situation - Setting the context'),
        createSubtopic('Task - What was the goal?'),
        createSubtopic('Action - What did you do?'),
        createSubtopic('Result - What was the outcome?')
      ]),
      createTopic('Leadership Examples', [
        createSubtopic('Leading a team/project'),
        createSubtopic('Mentoring and coaching others'),
        createSubtopic('Taking initiative and ownership')
      ]),
      createTopic('Conflict Resolution', [
        createSubtopic('Identifying conflicts early'),
        createSubtopic('Communication strategies'),
        createSubtopic('Negotiation and compromise'),
        createSubtopic('Maintaining professionalism')
      ]),
      createTopic('Teamwork Stories', [
        createSubtopic('Collaborating with diverse teams'),
        createSubtopic('Handling team challenges'),
        createSubtopic('Supporting teammates')
      ]),
      createTopic('Failure Examples', [
        createSubtopic('Taking responsibility'),
        createSubtopic('Lessons learned'),
        createSubtopic('How you improved afterward')
      ]),
      createTopic('Effective Communication', [
        createSubtopic('Active listening'),
        createSubtopic('Clear and concise messaging'),
        createSubtopic('Non-verbal communication'),
        createSubtopic('Feedback delivery and reception')
      ]),
      createTopic('Time Management', [
        createSubtopic('Prioritization techniques'),
        createSubtopic('Dealing with deadlines'),
        createSubtopic('Avoiding procrastination')
      ])
    ],
    schedule: { ...defaultSchedule }
  },

  {
    id: uuidv4(),
    title: 'Machine Coding',
    icon: 'code-2',
    description: 'Practical coding for machine coding rounds',
    topics: [
      createTopic('Design Patterns Implementation', [
        createSubtopic('Singleton Pattern'),
        createSubtopic('Factory Pattern'),
        createSubtopic('Observer Pattern'),
        createSubtopic('Decorator Pattern'),
        createSubtopic('Strategy Pattern')
      ]),
      createTopic('Error Handling', [
        createSubtopic('Try-Catch Blocks'),
        createSubtopic('Custom Exceptions'),
        createSubtopic('Logging and Debugging'),
        createSubtopic('Graceful Degradation')
      ]),
      createTopic('UI Components', [
        createSubtopic('Reusable Components'),
        createSubtopic('Component Communication'),
        createSubtopic('State Management'),
        createSubtopic('Event Handling'),
        createSubtopic('Form Validation')
      ]),
      createTopic('API Integration', [
        createSubtopic('RESTful APIs'),
        createSubtopic('GraphQL'),
        createSubtopic('WebSocket'),
        createSubtopic('Error Handling'),
        createSubtopic('Data Caching')
      ]),
      createTopic('Performance Optimization', [
        createSubtopic('Code Splitting'),
        createSubtopic('Lazy Loading'),
        createSubtopic('Memoization'),
        createSubtopic('Virtual Lists'),
        createSubtopic('Bundle Size Optimization')
      ])
    ],
    schedule: { ...defaultSchedule }
  },

  {
    id: uuidv4(),
    title: 'DSA Questions',
    icon: 'code-2',
    description: 'Curated DSA questions from LeetCode and GeeksforGeeks with difficulty levels',
    topics: [
      createTopic('Arrays', [
        createSubtopic('Easy - Largest Element in Array', 'https://practice.geeksforgeeks.org/problems/largest-element-in-array4009/0'),
        createSubtopic('Easy - Second Largest Element', 'https://practice.geeksforgeeks.org/problems/second-largest3735/1'),
        createSubtopic('Easy - Check if Array is Sorted', 'https://leetcode.com/problems/check-if-array-is-sorted-and-rotated/'),
        createSubtopic('Easy - Remove Duplicates from Sorted Array', 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/'),
        createSubtopic('Medium - Kadane\'s Algorithm', 'https://takeuforward.org/data-structure/kadanes-algorithm-maximum-subarray-sum-in-an-array/'),
        createSubtopic('Hard - Merge Overlapping Intervals', 'https://leetcode.com/problems/merge-intervals/')
      ]),
      createTopic('Sorting Techniques', [
        createSubtopic('Easy - Selection Sort', 'https://takeuforward.org/sorting/selection-sort-algorithm/'),
        createSubtopic('Easy - Bubble Sort', 'https://takeuforward.org/data-structure/bubble-sort-algorithm/'),
        createSubtopic('Easy - Insertion Sort', 'https://takeuforward.org/data-structure/insertion-sort-algorithm/'),
        createSubtopic('Medium - Merge Sort', 'https://takeuforward.org/data-structure/merge-sort-algorithm/'),
        createSubtopic('Medium - Quick Sort', 'https://takeuforward.org/data-structure/quick-sort-algorithm/'),
        createSubtopic('Hard - Count Inversions', 'https://practice.geeksforgeeks.org/problems/inversion-of-array-1587115620/1')
      ]),
      createTopic('Basic Math', [
        createSubtopic('Easy - Count Digits', 'https://practice.geeksforgeeks.org/problems/count-digits5716/1'),
        createSubtopic('Easy - Reverse Number', 'https://leetcode.com/problems/reverse-integer/'),
        createSubtopic('Easy - Check Palindrome', 'https://leetcode.com/problems/palindrome-number/'),
        createSubtopic('Easy - GCD/HCF', 'https://practice.geeksforgeeks.org/problems/lcm-and-gcd4516/1'),
        createSubtopic('Medium - Armstrong Number', 'https://practice.geeksforgeeks.org/problems/armstrong-numbers2727/1'),
        createSubtopic('Medium - Print all Divisors', 'https://practice.geeksforgeeks.org/problems/sum-of-all-divisors-from-1-to-n4738/1')
      ]),
      createTopic('Patterns & Logic Building', [
        createSubtopic('Easy - Basic Patterns', 'https://takeuforward.org/strivers-a2z-dsa-course/must-do-pattern-problems-before-starting-dsa/'),
        createSubtopic('Medium - Number Patterns', 'https://practice.geeksforgeeks.org/problems/pattern/1'),
        createSubtopic('Medium - Star Patterns', 'https://practice.geeksforgeeks.org/problems/triangle-pattern-1661493231/1'),
        createSubtopic('Hard - Complex Patterns', 'https://practice.geeksforgeeks.org/problems/square-pattern/1')
      ]),
      createTopic('Recursion', [
        createSubtopic('Easy - Print 1 to N', 'https://practice.geeksforgeeks.org/problems/print-1-to-n-without-using-loops-1587115620/1'),
        createSubtopic('Easy - Sum of First N Numbers', 'https://practice.geeksforgeeks.org/problems/sum-of-first-n-terms5843/1'),
        createSubtopic('Medium - Factorial', 'https://practice.geeksforgeeks.org/problems/factorial5739/1'),
        createSubtopic('Medium - Fibonacci', 'https://leetcode.com/problems/fibonacci-number/'),
        createSubtopic('Hard - Tower of Hanoi', 'https://practice.geeksforgeeks.org/problems/tower-of-hanoi-1587115621/1')
      ]),
      createTopic('Strings', [
        createSubtopic('Easy - Reverse String', 'https://leetcode.com/problems/reverse-string/'),
        createSubtopic('Easy - Palindrome Check', 'https://leetcode.com/problems/valid-palindrome/'),
        createSubtopic('Medium - Anagram Check', 'https://leetcode.com/problems/valid-anagram/'),
        createSubtopic('Medium - Longest Common Prefix', 'https://leetcode.com/problems/longest-common-prefix/'),
        createSubtopic('Hard - String Compression', 'https://leetcode.com/problems/string-compression/')
      ]),
      createTopic('Binary Search', [
        createSubtopic('Easy - Binary Search Implementation', 'https://leetcode.com/problems/binary-search/'),
        createSubtopic('Easy - First and Last Position', 'https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/'),
        createSubtopic('Medium - Search in Rotated Array', 'https://leetcode.com/problems/search-in-rotated-sorted-array/'),
        createSubtopic('Medium - Find Peak Element', 'https://leetcode.com/problems/find-peak-element/'),
        createSubtopic('Hard - Median of Two Sorted Arrays', 'https://leetcode.com/problems/median-of-two-sorted-arrays/')
      ])
    ],
    schedule: {
      startDate: new Date(),
      totalDays: 60,
      endDate: new Date(new Date().setDate(new Date().getDate() + 60))
    }
  },

];