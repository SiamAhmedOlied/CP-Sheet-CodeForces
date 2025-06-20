
export interface VerificationBadge {
  type: 'none' | 'blue' | 'golden';
  title: string;
  description: string;
}

// Top 100 Codeforces users (this would typically come from an API or database)
// For now, I'll include a sample of known top users
const TOP_100_USERS = [
  'tourist', 'Benq', 'Um_nik', 'jiangly', 'Radewoosh', 'mnbvmar', 'scott_wu',
  'Petr', 'apiad', 'ecnerwala', 'ksun48', 'tmwilliamlin168', 'Errichto',
  'aid', 'maroonrk', 'TLE', 'ko_osaga', 'antontrygubO_o', 'vintage_Vlad_Makeev',
  'sunset', 'SecondThread', 'rainboy', 'nuip', 'yosupo', 'djq_cpp',
  // Add more known top users here
];

const SPECIAL_DEVELOPER = 'SiamAhmedOlied';

export const getVerificationBadge = (handle: string, rating?: number): VerificationBadge => {
  // Golden tick for the app developer
  if (handle === SPECIAL_DEVELOPER) {
    return {
      type: 'golden',
      title: 'App Developer',
      description: 'Creator of this application'
    };
  }

  // Blue tick for top 100 users
  if (TOP_100_USERS.includes(handle)) {
    return {
      type: 'blue',
      title: 'Top 100 Codeforces User',
      description: 'Ranked among the top 100 competitive programmers worldwide'
    };
  }

  // No verification badge
  return {
    type: 'none',
    title: '',
    description: ''
  };
};
