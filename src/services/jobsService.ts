import axios from 'axios';

interface GovtJob {
  id: string;
  title: string;
  department: string;
  location: string;
  salary: string;
  lastDate: string;
  qualification: string;
  experience: string;
  vacancies: number;
  applicationUrl: string;
  notificationUrl: string;
  category: 'CS' | 'IT' | 'Hardware' | 'Software' | 'General';
  tags: string[];
  postedDate: string;
}

class JobsService {
  private static instance: JobsService;
  private jobsCache: GovtJob[] = [];
  private lastFetchTime: number = 0;
  private readonly CACHE_DURATION = 3600000; // 1 hour in milliseconds
  private readonly API_BASE_URL = 'https://raw.githubusercontent.com/deep5050/jobful-api/master/data';

  private constructor() {}

  public static getInstance(): JobsService {
    if (!JobsService.instance) {
      JobsService.instance = new JobsService();
    }
    return JobsService.instance;
  }

  private transformJobData(apiJob: any): GovtJob {
    return {
      id: apiJob.advtNo || String(Math.random()),
      title: apiJob.postName,
      department: apiJob.postBoard,
      location: this.extractLocation(apiJob.postBoard),
      salary: apiJob.salary || 'As per norms',
      lastDate: this.parseLastDate(apiJob.lastDate),
      qualification: apiJob.qualification,
      experience: this.extractExperience(apiJob.qualification),
      vacancies: this.extractVacancies(apiJob.postName),
      applicationUrl: apiJob.link,
      notificationUrl: apiJob.link,
      category: this.determineCategory(apiJob.postName, apiJob.qualification),
      tags: this.extractTags(apiJob.postName, apiJob.qualification),
      postedDate: apiJob.postDate
    };
  }

  private parseLastDate(lastDate: string): string {
    try {
      // Remove any text like "Extended to" or "Walk in"
      lastDate = lastDate.replace(/extended to|walk in/i, '').trim();
      
      // Handle date formats: DD-MM-YYYY, DD/MM/YYYY, DD.MM.YYYY
      const dateMatch = lastDate.match(/(\d{2})[-./](\d{2})[-./](\d{4})/);
      if (dateMatch) {
        const [_, day, month, year] = dateMatch;
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).toISOString();
      }

      // Handle format: DD-MM-YY
      const shortYearMatch = lastDate.match(/(\d{2})[-./](\d{2})[-./](\d{2})/);
      if (shortYearMatch) {
        const [_, day, month, shortYear] = shortYearMatch;
        const year = parseInt(shortYear) < 50 ? 2000 + parseInt(shortYear) : 1900 + parseInt(shortYear);
        return new Date(year, parseInt(month) - 1, parseInt(day)).toISOString();
      }

      // If no valid date found, set to 30 days from now
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    } catch {
      // If date parsing fails, set to 30 days from now
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    }
  }

  private extractLocation(postBoard: string): string {
    const commonLocations = ['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune'];
    for (const location of commonLocations) {
      if (postBoard.includes(location)) return location;
    }
    return 'Pan India';
  }

  private extractExperience(qualification: string): string {
    if (qualification.toLowerCase().includes('experience')) {
      return qualification.match(/\d+(-\d+)?\s*years?/i)?.[0] || '0-3 years';
    }
    return '0-3 years';
  }

  private extractVacancies(postName: string): number {
    const match = postName.match(/(\d+)\s*Posts?/i);
    return match ? parseInt(match[1]) : 1;
  }

  private determineCategory(postName: string, qualification: string): GovtJob['category'] {
    const text = `${postName} ${qualification}`.toLowerCase();
    if (text.includes('computer science')) return 'CS';
    if (text.includes('software')) return 'Software';
    if (text.includes('hardware') || text.includes('electronics')) return 'Hardware';
    if (text.includes('it') || text.includes('information technology')) return 'IT';
    return 'General';
  }

  private extractTags(postName: string, qualification: string): string[] {
    const tags = new Set<string>();
    const text = `${postName} ${qualification}`.toLowerCase();
    
    const techKeywords = [
      // Programming Languages
      'java', 'python', 'javascript', 'typescript', 'c++', 'c#', 'php',
      'ruby', 'scala', 'kotlin', 'swift', 'go', 'rust',
      
      // Web Technologies
      'react', 'angular', 'vue', 'node.js', 'express', 'django', 'spring',
      'asp.net', 'html', 'css', 'jquery', 'bootstrap',
      
      // Cloud & DevOps
      'aws', 'azure', 'gcp', 'cloud', 'docker', 'kubernetes', 'jenkins',
      'ci/cd', 'devops', 'microservices',
      
      // Data & AI
      'sql', 'mysql', 'postgresql', 'mongodb', 'oracle', 'data science',
      'machine learning', 'ai', 'deep learning', 'big data', 'hadoop',
      'spark', 'tensorflow',
      
      // Security
      'cybersecurity', 'network security', 'encryption', 'firewall',
      'penetration testing', 'ethical hacking', 'security',
      
      // Other Skills
      'agile', 'scrum', 'project management', 'testing', 'qa',
      'full stack', 'frontend', 'backend', 'mobile', 'android', 'ios'
    ];

    techKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        // Capitalize each word in the tag
        tags.add(
          keyword.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
        );
      }
    });

    // Add general category tags
    if (text.includes('computer science')) tags.add('Computer Science');
    if (text.includes('information technology')) tags.add('Information Technology');
    if (text.includes('software')) tags.add('Software Development');
    if (text.includes('hardware') || text.includes('electronics')) tags.add('Hardware');
    if (text.includes('network')) tags.add('Networking');
    if (text.includes('security')) tags.add('Security');
    if (text.includes('data')) tags.add('Data');
    if (text.includes('web')) tags.add('Web Development');
    if (text.includes('mobile')) tags.add('Mobile Development');
    if (text.includes('cloud')) tags.add('Cloud Computing');

    return Array.from(tags);
  }

  public async getJobs(): Promise<GovtJob[]> {
    const currentTime = Date.now();
    
    // Return cached data if it's still fresh
    if (
      this.jobsCache.length > 0 && 
      currentTime - this.lastFetchTime < this.CACHE_DURATION
    ) {
      console.log('Returning cached jobs:', this.jobsCache.length);
      return this.jobsCache;
    }

    try {
      // Fetch jobs from the static JSON data
      console.log('Fetching jobs from API');
      const response = await axios.get(`${this.API_BASE_URL}/jobs.json`);
      const allJobs = response.data || [];
      console.log('Total jobs fetched:', allJobs.length);

      // Transform and filter IT/CS related jobs
      const itJobs = allJobs.filter(job => this.isITRelatedJob(job));
      console.log('IT/CS related jobs:', itJobs.length);

      const transformedJobs = itJobs.map(job => {
        try {
          return this.transformJobData(job);
        } catch (error) {
          console.error('Error transforming job:', error, job);
          return null;
        }
      }).filter(Boolean);
      console.log('Successfully transformed jobs:', transformedJobs.length);

      // Sort by posted date (most recent first)
      transformedJobs.sort((a, b) => 
        new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
      );

      // Update cache
      this.jobsCache = transformedJobs;
      this.lastFetchTime = currentTime;

      return transformedJobs;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      return this.jobsCache; // Return cached data in case of error
    }
  }

  private isITRelatedJob(job: any): boolean {
    if (!job || !job.postName || !job.qualification) {
      return false;
    }
    
    const text = `${job.postName} ${job.qualification}`.toLowerCase();
    const itKeywords = [
      // Core IT/CS terms
      'computer', 'software', 'it', 'information technology', 'developer',
      'programmer', 'engineer', 'analyst', 'data', 'system', 'network',
      'database', 'web', 'application', 'cyber', 'security', 'digital',
      'technical', 'technology', 'computing', 'electronics',
      
      // Job titles
      'scientist', 'architect', 'administrator', 'devops', 'full stack',
      'frontend', 'backend', 'qa', 'testing', 'support', 'maintenance',
      
      // Technologies
      'java', 'python', 'javascript', 'c++', 'php', 'ruby', 'scala',
      'cloud', 'aws', 'azure', 'google cloud', 'machine learning', 'ai',
      'artificial intelligence', 'blockchain', 'mobile', 'android', 'ios',
      
      // Organizations
      'isro', 'drdo', 'cdac', 'nic', 'stpi', 'nielit', 'cert-in',
      'deity', 'meity', 'uidai', 'negd', 'nicsi'
    ];
    
    const matches = itKeywords.some(keyword => text.includes(keyword));
    if (matches) {
      console.log('Found IT job:', job.postName);
    }
    return matches;
  }
}

export const jobsService = JobsService.getInstance();
export type { GovtJob }; 