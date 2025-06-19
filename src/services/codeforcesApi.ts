
import CryptoJS from 'crypto-js';

const API_KEY = 'd3063129ed3d9d5a7a16e984d374f8ada1ab4ae8';
const API_SECRET = '022a5079480bb81ca422022c5045252b6e30e485';
const BASE_URL = 'https://codeforces.com/api';

class CodeforcesAPI {
  private generateApiSig(methodName: string, params: Record<string, any> = {}): string {
    const rand = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    const currentTime = Math.floor(Date.now() / 1000);
    
    const paramString = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');
    
    const stringToHash = `${rand}/${methodName}?${paramString}#${API_SECRET}`;
    const hash = CryptoJS.SHA512(stringToHash).toString();
    
    return `${rand}${hash}`;
  }

  private async makeRequest(methodName: string, params: Record<string, any> = {}) {
    try {
      const apiSig = this.generateApiSig(methodName, params);
      const queryParams = new URLSearchParams({
        ...params,
        apiKey: API_KEY,
        apiSig: apiSig
      });

      console.log(`Making request to: ${BASE_URL}/${methodName}?${queryParams}`);
      
      const response = await fetch(`${BASE_URL}/${methodName}?${queryParams}`);
      const data = await response.json();
      
      if (data.status !== 'OK') {
        throw new Error(data.comment || 'API request failed');
      }
      
      return data.result;
    } catch (error) {
      console.error(`Error in ${methodName}:`, error);
      throw error;
    }
  }

  async getProblems() {
    return this.makeRequest('problemset.problems');
  }

  async getContests() {
    return this.makeRequest('contest.list');
  }

  async getUserInfo(handle: string) {
    return this.makeRequest('user.info', { handles: handle });
  }

  async getUserStatus(handle: string, from: number = 1, count: number = 10000) {
    return this.makeRequest('user.status', { handle, from, count });
  }

  async getUserRating(handle: string) {
    return this.makeRequest('user.rating', { handle });
  }
}

export const codeforcesApi = new CodeforcesAPI();

// Utility functions
export const getRatingClass = (rating: number): string => {
  if (rating < 1200) return 'rating-newbie';
  if (rating < 1400) return 'rating-pupil';
  if (rating < 1600) return 'rating-specialist';
  if (rating < 1900) return 'rating-expert';
  if (rating < 2100) return 'rating-candidate-master';
  if (rating < 2300) return 'rating-master';
  if (rating < 2400) return 'rating-international-master';
  if (rating < 2600) return 'rating-grandmaster';
  if (rating < 3000) return 'rating-international-grandmaster';
  return 'rating-legendary-grandmaster';
};

export const getRatingTitle = (rating: number): string => {
  if (rating < 1200) return 'Newbie';
  if (rating < 1400) return 'Pupil';
  if (rating < 1600) return 'Specialist';
  if (rating < 1900) return 'Expert';
  if (rating < 2100) return 'Candidate Master';
  if (rating < 2300) return 'Master';
  if (rating < 2400) return 'International Master';
  if (rating < 2600) return 'Grandmaster';
  if (rating < 3000) return 'International Grandmaster';
  return 'Legendary Grandmaster';
};

export const getProblemUrl = (contestId: number, index: string, isContest: boolean = false): string => {
  if (isContest) {
    return `https://codeforces.com/contest/${contestId}/problem/${index}`;
  }
  return `https://codeforces.com/problemset/problem/${contestId}/${index}`;
};
