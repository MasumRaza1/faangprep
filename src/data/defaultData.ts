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
    title: 'Object-Oriented Programming',
    icon: 'boxes',
    description: 'Master OOP concepts and design patterns',
    topics: [
      createTopic('OOP Basics', [
        createSubtopic('Classes & Objects'),
        createSubtopic('Constructors & Destructors'),
        createSubtopic('Access Modifiers (Public, Private, Protected)'),
        createSubtopic('Inheritance (Single, Multilevel)'),
        createSubtopic('Polymorphism (Compile-time & Run-time)'),
        createSubtopic('Method Overloading & Overriding'),
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
        createSubtopic('Builder')
      ]),
      
      createTopic('Design Patterns - Structural', [
        createSubtopic('Adapter'),
        createSubtopic('Facade'),
        createSubtopic('Decorator'),
        createSubtopic('Proxy')
      ]),
      
      createTopic('Design Patterns - Behavioral', [
        createSubtopic('Observer'),
        createSubtopic('Strategy'),
        createSubtopic('Command'),
        createSubtopic('Template Method'),
        createSubtopic('Chain of Responsibility')
      ]),
      
      createTopic('Low-Level Design Concepts', [
        createSubtopic('Class Diagrams & UML Basics'),
        createSubtopic('Designing Object Models'),
        createSubtopic('Associations, Aggregation, Composition'),
        createSubtopic('Managing State & Behavior'),
        createSubtopic('Handling Exceptions in Design'),
        createSubtopic('Principles of Reusability & Extensibility'),
        createSubtopic('Real-world Example Designs (e.g., Parking Lot, Library Management)'),
        createSubtopic('Scalability & Maintainability Considerations')
      ]),
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
          createSubtopic('Virtual Memory Basics'),
          createSubtopic('Page Replacement Algorithms (LRU, FIFO)'),
          createSubtopic('TLB & Caching'),
          createSubtopic('Thrashing'),
          createSubtopic('Stack vs Heap')
        ]),
        createTopic('File Systems', [
          createSubtopic('File System Interface & Implementation'),
          createSubtopic('Inodes, File Descriptors'),
          createSubtopic('Directory Structures'),
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
        ]),
        createTopic('Virtualization', [
          createSubtopic('What is Virtualization?'),
          createSubtopic('Types of Virtualization (OS-Level, Container, Hypervisor)'),
          createSubtopic('Virtualization Technologies (VMware, VirtualBox, Docker)'),
          createSubtopic('Virtualization Trade-offs')
        ]),
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
          createSubtopic('Keys: Primary, Foreign, Candidate, Composite, Unique'),
          createSubtopic('SQL Commands: DDL, DML, DCL, TCL'),
          createSubtopic('Basic Queries: SELECT, INSERT, UPDATE, DELETE'),
          createSubtopic('Filtering & Sorting: WHERE, ORDER BY, GROUP BY, HAVING'),
          createSubtopic('Joins: INNER, LEFT, RIGHT, FULL'),
          createSubtopic('UNION vs UNION ALL'),
          createSubtopic('Subqueries & Nested Queries'),
          createSubtopic('Aliases, LIKE, IN, BETWEEN'),
          createSubtopic('Aggregate Functions: SUM, COUNT, AVG'),
          createSubtopic('CASE Statements & Conditional Logic')
        ]),
        createTopic('Normalization', [
          createSubtopic('1NF, 2NF, 3NF Basics'),
          createSubtopic('BCNF Overview'),
          createSubtopic('4NF & 5NF Overview'),
          createSubtopic('Data Anomalies: Insert, Update, Delete'),
          createSubtopic('Functional Dependencies'),
          createSubtopic('Decomposition & Lossless Join')
        ]),
        createTopic('Indexing', [
          createSubtopic('Purpose of Indexing'),
          createSubtopic('Clustered vs Non-Clustered Index'),
          createSubtopic('B+ Trees and Hash Index Basics'),
          createSubtopic('Indexing Trade-offs')
        ]),
        createTopic('Transactions', [
          createSubtopic('ACID Properties'),
          createSubtopic('Transaction Lifecycle'),
          createSubtopic('Concurrency Control Basics'),
          createSubtopic('Isolation Levels & Phenomena (Dirty Reads, Phantom Reads)'),
          createSubtopic('Deadlocks & Basic Resolution Strategies')
        ]),
        createTopic('Query Optimization', [
          createSubtopic('Reading Execution Plans (EXPLAIN)'),
          createSubtopic('Basics of Query Optimization'),
          createSubtopic('Join Order & Use of Indexes')
        ]),
        createTopic('ER Model & Relational Model', [
          createSubtopic('Entities, Attributes, and Relationships'),
          createSubtopic('ER Diagrams'),
          createSubtopic('Mapping ER to Relational Schema'),
          createSubtopic('Constraints: NOT NULL, UNIQUE, CHECK')
        ]),
        createTopic('Storage & File Organization', [
          createSubtopic('Heap vs Sorted Files'),
          createSubtopic('Sequential & Hashed File Organization'),
          createSubtopic('Buffer Management Overview')
        ]),
        createTopic('NoSQL Basics', [
          createSubtopic('Differences: RDBMS vs NoSQL'),
          createSubtopic('Common NoSQL Types: Document (MongoDB), Key-Value (Redis)'),
          createSubtopic('CAP Theorem Basics')
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
          createSubtopic('Transport Layer'),
          createSubtopic('Application Layer')
        ]),
        createTopic('TCP/IP Protocol', [
          createSubtopic('IP Addressing & Subnetting'),
          createSubtopic('IPv4 vs IPv6'),
          createSubtopic('NAT & CIDR Basics'),
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
          createSubtopic('Sticky Sessions'),
          createSubtopic('Global vs Local Load Balancing')
        ]),
        createTopic('Network Security', [
          createSubtopic('Firewall Rules'),
          createSubtopic('VPNs'),
          createSubtopic('Intrusion Detection Systems (IDS)'),
          createSubtopic('Intrusion Prevention Systems (IPS)'),
          createSubtopic('SSL/TLS'),
          createSubtopic('Firewall Rules'),
          createSubtopic('VPNs'),
          createSubtopic('Intrusion Detection Systems (IDS)'),
          createSubtopic('Intrusion Prevention Systems (IPS)'),
          createSubtopic('SSL/TLS'),
        ]),
      
      
    ],
    schedule: { ...defaultSchedule }
  },
  {
    id: uuidv4(),
    title: 'System Design',
    icon: 'boxes',
    description: 'System design concepts for senior roles',
    topics: [
      createTopic('System Design Basics', [
        createSubtopic('Design Goals & Tradeoffs'),
        createSubtopic('Interview Approach & Clarifying Requirements'),
        createSubtopic('High-Level Architecture & API Design')
      ]),
      
      createTopic('Scalability', [
        createSubtopic('Vertical vs Horizontal Scaling'),
        createSubtopic('Load Balancers'),
        createSubtopic('Caching Strategies'),
        createSubtopic('CDNs'),
        createSubtopic('Asynchronous Processing & Message Queues')
      ]),
      
      createTopic('Reliability & Availability', [
        createSubtopic('Redundancy'),
        createSubtopic('Failover Mechanisms'),
        createSubtopic('Health Checks & Monitoring'),
        createSubtopic('Disaster Recovery'),
        createSubtopic('CAP Theorem'),
        createSubtopic('Data Consistency Models (ACID vs BASE)')
      ]),
      
      createTopic('Data Storage & Partitioning', [
        createSubtopic('SQL vs NoSQL Databases'),
        createSubtopic('Indexing & Query Optimization'),
        createSubtopic('Data Partitioning & Sharding'),
        createSubtopic('Shard Key Selection & Challenges'),
        createSubtopic('Rebalancing & Resharding')
      ]),
      
      createTopic('Caching', [
        createSubtopic('Write-Through vs Write-Back Cache'),
        createSubtopic('Distributed Caching'),
        createSubtopic('Cache Eviction Policies (LRU, LFU)')
      ]),
      
      createTopic('Microservices & Distributed Systems', [
        createSubtopic('Service Discovery'),
        createSubtopic('Inter-service Communication (REST, gRPC, Messaging)'),
        createSubtopic('API Gateway'),
        createSubtopic('Circuit Breaker Pattern'),
        createSubtopic('Database per Service'),
        createSubtopic('Event-Driven Architecture & Saga Pattern')
      ]),
      
      createTopic('APIs & Protocols', [
        createSubtopic('REST vs GraphQL vs gRPC'),
        createSubtopic('Rate Limiting & Throttling')
      ]),
      
      createTopic('Monitoring & Observability', [
        createSubtopic('Metrics & Logging'),
        createSubtopic('Distributed Tracing')
      ]),
      
      createTopic('Security in System Design', [
        createSubtopic('Authentication & Authorization (OAuth, JWT)'),
        createSubtopic('Data Encryption (In Transit & At Rest)')
      ]),
      createTopic('System Design Projects', [
        createSubtopic('Design a URL Shortener Service (like bit.ly)'),
        createSubtopic('Design a Scalable Chat Application'),
        createSubtopic('Design an Online Bookstore with Inventory Management'),
        createSubtopic('Design a Social Media Feed (like Twitter or Instagram)'),
        createSubtopic('Design a Video Streaming Service (like YouTube)'),
        createSubtopic('Design a Ride-Sharing Service (like Uber)'),
        createSubtopic('Design a Notification System with Push & Email'),
        createSubtopic('Design a Real-time Collaborative Document Editor'),
        createSubtopic('Design a Distributed Cache System (like Redis)'),
        createSubtopic('Design an E-commerce Checkout & Payment System')
      ]),

      
    ],
    schedule: { ...defaultSchedule }
  },

  {
    id: uuidv4(),
    title: 'Web Development (MERN)',
    icon: 'globe',
    description: 'MERN stack technologies for full-stack roles',
    topics: [
      createTopic('JavaScript', [
        createSubtopic('Execution Context & Call Stack'),
        createSubtopic('Hoisting'),
        createSubtopic('Closures'),
        createSubtopic('Promises & Async/Await'),
        createSubtopic('Event Loop & Callback Queue'),
        createSubtopic('this Keyword'),
        createSubtopic('Prototypes & Inheritance'),
        createSubtopic('ES6+ Features (let/const, arrow functions, spread/rest)'),
        createSubtopic('Modules (import/export)'),
        createSubtopic('Array Methods (map, filter, reduce)'),
        createSubtopic('Debouncing & Throttling'),
        createSubtopic('Error Handling (try/catch, throw)'),
        createSubtopic('Basics of DOM Manipulation')
      ]),
      
      createTopic('React.js ', [
        createSubtopic('JSX & Rendering Elements'),
        createSubtopic('Components (Functional & Class-based)'),
        createSubtopic('Props & State'),
        createSubtopic('Handling Events'),
        createSubtopic('Conditional Rendering'),
        createSubtopic('Lists & Keys'),
        createSubtopic('useState & useEffect'),
        createSubtopic('Custom Hooks'),
        createSubtopic('useRef & useMemo (Performance Tips)'),
        createSubtopic('Context API (State Sharing)'),
        createSubtopic('React Router (v6 Basics)'),
        createSubtopic('Form Handling & Validation'),
        createSubtopic('Redux (Intro & Toolkit Basics)'),
        createSubtopic('Component Reusability & Composition'),
        createSubtopic('Code Splitting & Lazy Loading'),
        createSubtopic('Error Boundaries'),
        createSubtopic('Unit Testing with Jest'),
        createSubtopic('Testing Components with React Testing Library'),
        createSubtopic('Project: Todo App (basic)'),
        createSubtopic('Project: Blog SPA with Routing (intermediate)')
      ]),
      
      createTopic('Node.js', [
        createSubtopic('What is Node.js & Use Cases'),
        createSubtopic('Node.js Architecture (V8, Libuv, Event Loop)'),
        createSubtopic('Modules (CommonJS & ES6 Import/Export)'),
        createSubtopic('npm & package.json'),
        createSubtopic('Creating a Simple Server (http module)'),
        createSubtopic('Event Loop & Async Programming (Callbacks, Promises, Async/Await)'),
        createSubtopic('File System Module (fs)'),
        createSubtopic('Path & OS Modules'),
        createSubtopic('Streams & Buffers (Basics Only)'),
        createSubtopic('Environment Variables & dotenv'),
        createSubtopic('Error Handling & Debugging'),
        createSubtopic('Basic REST API with Express (Optional Intro)'),
        createSubtopic('Project: Command-line Note Taker (basic)'),
        createSubtopic('Project: File Upload API (intermediate)')
      ]),
      
      createTopic('Express.js', [
        createSubtopic('What is Express.js & Why Use It'),
        createSubtopic('Setting Up a Basic Server'),
        createSubtopic('Routing (GET, POST, PUT, DELETE)'),
        createSubtopic('Route Parameters & Query Strings'),
        createSubtopic('Middleware (Built-in, Custom, Third-Party)'),
        createSubtopic('Serving Static Files'),
        createSubtopic('Request & Response Objects'),
        createSubtopic('Error Handling Middleware'),
        createSubtopic('RESTful API Design Best Practices'),
        createSubtopic('Authentication with JWT & Bcrypt'),
        createSubtopic('Protecting Routes (Auth Middleware)'),
        createSubtopic('File Upload with Multer'),
        createSubtopic('Environment Variables with dotenv'),
        createSubtopic('Connecting to MongoDB with Mongoose'),
        createSubtopic('Project: User Registration API (basic)'),
        createSubtopic('Project: Blog REST API with Auth (intermediate)'),
      ]),
      
      createTopic('MongoDB', [
        createSubtopic('What is MongoDB & When to Use It'),
        createSubtopic('Documents, Collections & BSON'),
        createSubtopic('Basic CRUD Operations (insert, find, update, delete)'),
        createSubtopic('Data Types & Schema Design with Mongoose'),
        createSubtopic('Relationships: Embedding vs Referencing'),
        createSubtopic('Query Operators & Filtering'),
        createSubtopic('Indexes (Single Field, Compound)'),
        createSubtopic('Aggregation Pipeline (Match, Group, Project)'),
        createSubtopic('Validation & Middleware (Mongoose)'),
        createSubtopic('Transactions (Basics with MongoDB Atlas)'),
        createSubtopic('Performance Tips (Indexes, Projections, Limitations)'),
        createSubtopic('Connecting MongoDB to Express Apps'),
        createSubtopic('Project: User Database (basic)'),
        createSubtopic('Project: Blog with Comments (intermediate)')
      ]),
      createTopic('MERN Projects', [
        createSubtopic('Todo List App (React + Node + Express + MongoDB)'),
        createSubtopic('Blog Platform with Authentication & CRUD'),
        createSubtopic('E-commerce Storefront (Product Catalog, Cart, Checkout)'),
        createSubtopic('Social Media Feed with Likes & Comments'),
        createSubtopic('Real-time Chat Application (using WebSockets)'),
        createSubtopic('File Upload & Management System'),
        createSubtopic('User Authentication System (JWT & Role-Based Access)'),
        createSubtopic('Task Management App with Drag & Drop'),
        createSubtopic('Booking System with Calendar Integration'),
        createSubtopic('Personal Portfolio with Admin Panel to Update Content')
      ]),
      createTopic('TypeScript', [
        createSubtopic('TypeScript Setup & Configuration'),
        createSubtopic('Basic Types (string, number, boolean, any)'),
        createSubtopic('Interfaces & Type Aliases'),
        createSubtopic('Functions & Optional Parameters'),
        createSubtopic('Union & Intersection Types'),
        createSubtopic('Generics'),
        createSubtopic('Enums & Tuples'),
        createSubtopic('Type Inference & Type Assertions'),
        createSubtopic('Classes & Inheritance'),
        createSubtopic('Modules & Namespaces'),
        createSubtopic('Advanced Types (Mapped Types, Conditional Types)'),
        createSubtopic('Decorators (Basics)'),
        createSubtopic('TypeScript with React (Typing Props & State)'),
        createSubtopic('TypeScript with Node.js (Express Types)'),
        createSubtopic('Error Handling & Strict Type-Checking')
      ]),
      
      createTopic('Next.js', [
        createSubtopic('What is Next.js & Features Overview'),
        createSubtopic('Pages & File-based Routing'),
        createSubtopic('Static Generation (SSG)'),
        createSubtopic('Server-Side Rendering (SSR)'),
        createSubtopic('Client-Side Rendering & Hydration'),
        createSubtopic('API Routes'),
        createSubtopic('Data Fetching Methods (getStaticProps, getServerSideProps)'),
        createSubtopic('Dynamic Routes & Catch-All Routes'),
        createSubtopic('Middleware & Custom Server'),
        createSubtopic('Authentication Strategies with Next.js'),
        createSubtopic('Image Optimization & Next/Image Component'),
        createSubtopic('Incremental Static Regeneration (ISR)'),
        createSubtopic('Deployment (Vercel & Custom Server Setup)'),
        createSubtopic('Performance Optimization & Caching'),
        createSubtopic('Internationalization (i18n)')
      ]),
      createTopic('GraphQL', [
        createSubtopic('What is GraphQL & Why Use It'),
        createSubtopic('GraphQL Schema & Types'),
        createSubtopic('Query & Mutation Operations'),
        createSubtopic('Resolvers & Data Fetching'),
        createSubtopic('Subscriptions & Real-time Updates'),
        createSubtopic('GraphQL Clients (Apollo Client, Relay)'),
        createSubtopic('GraphQL with React (Apollo Client)'),
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
      ]),
      createTopic('Interview Preparation', [
        createSubtopic('Research the company'),
        createSubtopic('Practice common interview questions'),
        createSubtopic('Prepare for behavioral questions'),
        createSubtopic('Review technical concepts')
      ]),
      
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
          createSubtopic('Logging and Debugging')
        ]),
        createTopic('UI Components', [
          createSubtopic('Reusable Components'),
          createSubtopic('Component Communication'),
          createSubtopic('State Management'),
          createSubtopic('Event Handling')
        ]),
        createTopic('API Integration', [
          createSubtopic('RESTful APIs'),
          createSubtopic('GraphQL'),
          createSubtopic('Error Handling'),
          createSubtopic('Data Caching')
        ]),
        createTopic('Performance Optimization', [
          createSubtopic('Memoization'),
          createSubtopic('Code Splitting'),
          createSubtopic('Lazy Loading'),
          createSubtopic('Bundle Size Optimization')
        ])
       
    ],
    schedule: { ...defaultSchedule }
  },



];