
import Navigation from '@/components/Navigation';
import Leaderboard from '@/components/Leaderboard';

const LeaderboardPage = () => {
  return (
    <div className="min-h-screen matrix-bg">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-orbitron font-bold neon-text glitch-effect mb-4" data-text="GLOBAL LEADERBOARD">
            GLOBAL LEADERBOARD
          </h1>
          <p className="text-gray-400 font-mono">Compete with the world's best competitive programmers</p>
        </div>

        <Leaderboard />
      </div>
    </div>
  );
};

export default LeaderboardPage;
