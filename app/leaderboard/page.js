"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { authFeature } from "@/lib/firebase";
import {
  fetchLeaderboardData,
  fetchCurrentUserData,
  findUserRank,
  getRankIcon,
  getTitleColor,
  getTitleBadgeColor,
  calculateLeaderboardStats,
  getTop3Users,
  getRemainingUsers
} from "@/lib/leaderboardsystem";

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [userRank, setUserRank] = useState(null);
  const [sortBy, setSortBy] = useState("xp");
  const [stats, setStats] = useState({
    totalStudents: 0,
    highestLevel: 0,
    totalQuizzes: 0
  });
  const router = useRouter();

  const loadLeaderboard = useCallback(async () => {
    setLoading(true);
    try {
      const user = authFeature.currentUser;
      const data = await fetchLeaderboardData(sortBy, 100);
      setLeaderboardData(data);

      const leaderboardStats = calculateLeaderboardStats(data);
      setStats(leaderboardStats);

      if (user) {
        const rank = findUserRank(data, user.uid);
        setUserRank(rank);

        if (rank) {
          setCurrentUser(data[rank - 1]);
        } else {
          const userData = await fetchCurrentUserData(user.uid);
          setCurrentUser(userData);
        }
      }
    } catch (error) {
      console.error("Error loading leaderboard:", error);
      alert("Failed to load leaderboard. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [sortBy]);

  useEffect(() => {
    loadLeaderboard();
  }, [sortBy, loadLeaderboard]);

  const handleRefresh = () => {
    loadLeaderboard();
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-100 via-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-emerald-400 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl">🏆</span>
            </div>
          </div>
          <p className="text-slate-900 font-bold text-xl mt-6">Loading Leaderboard...</p>
          <div className="flex items-center justify-center space-x-1 mt-4">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          </div>
        </div>
      </div>
    );
  }

  const top3Users = getTop3Users(leaderboardData);
  const remainingUsers = getRemainingUsers(leaderboardData);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 via-gray-50 to-white relative overflow-hidden">
      <div className="relative z-10 bg-slate-800/20 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center text-slate-900 hover:text-emerald-600 transition-colors group"
          >
            <svg className="w-6 h-6 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-bold">Back to Dashboard</span>
          </button>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <div className="inline-block">
            <div className="relative">
              <h1 className="text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-emerald-500 via-emerald-600 to-emerald-700 mb-4">🏆 LEADERBOARD 🏆</h1>
            </div>
          </div>
          <p className="text-xl text-slate-700 font-semibold mt-4">Rise to the top and claim your glory!</p>
        </div>

        {currentUser && (
          <div className="relative mb-10">
            <div className="absolute -inset-1 bg-linear-to-r from-emerald-400 via-emerald-500 to-emerald-600 rounded-2xl blur opacity-50 animate-pulse"></div>
            <div className="relative bg-linear-to-br from-slate-800/90 to-gray-800/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border-2 border-emerald-400/30">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="absolute -inset-2 bg-linear-to-r from-emerald-400 to-emerald-500 rounded-full blur opacity-50 animate-pulse"></div>
                    <div className="relative w-24 h-24 rounded-full bg-linear-to-br from-emerald-400 to-emerald-500 flex items-center justify-center text-4xl font-black border-4 border-slate-50 shadow-2xl transform hover:scale-110 transition-transform">
                      {currentUser.email?.charAt(0).toUpperCase()}
                    </div>
                    <div className={`absolute -bottom-2 -right-2 ${getTitleBadgeColor(currentUser.title)} text-slate-50 px-3 py-1 rounded-full text-xs font-bold shadow-lg border-2 border-slate-50`}>
                      {currentUser.title}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-50 mb-2">YOUR RANK :</h3>
                    <p className="text-emerald-400 text-xl font-semibold">{currentUser.email?.split('@')[0]}</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-7xl font-black mb-2 transform hover:scale-110 transition-transform text-emerald-500">{userRank ? getRankIcon(userRank) : '🎯'}</div>
                  <p className="text-emerald-400 text-lg font-bold">{userRank ? `${userRank} GLOBALLY` : 'UNRANKED'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                <div className="bg-linear-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-lg rounded-xl p-4 text-center border border-slate-400/30 transform hover:scale-105 transition-transform">
                  <div className="text-4xl font-black text-slate-50">{currentUser.level}</div>
                  <div className="text-slate-300 text-sm font-semibold mt-1">LEVEL</div>
                </div>
                <div className="bg-linear-to-br from-emerald-600/50 to-emerald-700/50 backdrop-blur-lg rounded-xl p-4 text-center border border-emerald-400/30 transform hover:scale-105 transition-transform">
                  <div className="text-4xl font-black text-slate-50">{currentUser.xp}</div>
                  <div className="text-emerald-300 text-sm font-semibold mt-1">XP</div>
                </div>
                <div className="bg-linear-to-br from-slate-600/50 to-slate-700/50 backdrop-blur-lg rounded-xl p-4 text-center border border-slate-400/30 transform hover:scale-105 transition-transform">
                  <div className="text-4xl font-black text-slate-50 flex items-center justify-center">{currentUser.streak} 🔥</div>
                  <div className="text-slate-300 text-sm font-semibold mt-1">STREAK</div>
                </div>
                <div className="bg-linear-to-br from-emerald-500/50 to-emerald-600/50 backdrop-blur-lg rounded-xl p-4 text-center border border-emerald-400/30 transform hover:scale-105 transition-transform">
                  <div className="text-4xl font-black text-slate-50">{currentUser.totalQuizzes}</div>
                  <div className="text-emerald-300 text-sm font-semibold mt-1">QUIZZES</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="relative mb-8">
          <div className="absolute -inset-1 bg-linear-to-r from-emerald-400 to-slate-400 rounded-xl blur opacity-30"></div>
          <div className="relative bg-slate-800/40 backdrop-blur-xl rounded-xl shadow-2xl p-6 border border-slate-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <span className="text-slate-900 font-bold text-lg">⚡ SORT BY:</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleSortChange("xp")}
                    className={`px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 ${sortBy === "xp" ? "bg-linear-to-r from-emerald-500 to-emerald-600 text-slate-50 shadow-lg shadow-emerald-500/50" : "bg-slate-200 text-slate-900 hover:bg-slate-300"}`}
                  >
                    💎 XP
                  </button>
                  <button
                    onClick={() => handleSortChange("level")}
                    className={`px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 ${sortBy === "level" ? "bg-linear-to-r from-emerald-500 to-emerald-600 text-slate-50 shadow-lg shadow-emerald-500/50" : "bg-slate-200 text-slate-900 hover:bg-slate-300"}`}
                  >
                    🎯 LEVEL
                  </button>
                  <button
                    onClick={() => handleSortChange("quizzes")}
                    className={`px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 ${sortBy === "quizzes" ? "bg-linear-to-r from-emerald-500 to-emerald-600 text-slate-50 shadow-lg shadow-emerald-500/50" : "bg-slate-200 text-slate-900 hover:bg-slate-300"}`}
                  >
                    📝 QUIZZES
                  </button>
                </div>
              </div>
              <button
                onClick={handleRefresh}
                className="flex items-center space-x-2 px-6 py-3 bg-linear-to-r from-emerald-500 to-emerald-600 text-slate-50 rounded-xl font-bold hover:from-emerald-600 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg"
              >
                <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>REFRESH</span>
              </button>
            </div>
          </div>
        </div>

        {top3Users.length >= 3 && (
          <div className="relative mb-12">
            <div className="absolute -inset-4 bg-linear-to-r from-emerald-400 via-emerald-500 to-slate-400 rounded-3xl blur opacity-20"></div>
            <div className="relative bg-linear-to-br from-slate-200/40 to-gray-200/40 backdrop-blur-xl rounded-3xl shadow-2xl p-12 border-2 border-emerald-400/30">
              <h2 className="text-4xl font-black text-center text-transparent bg-clip-text bg-linear-to-r from-emerald-600 to-emerald-700 mb-8">⭐ TOP CHAMPIONS ⭐</h2>
              <div className="flex items-end justify-center space-x-8">{/* podium */}</div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {remainingUsers.map((user, index) => {
            const rank = index + 4;
            const isCurrentUser = currentUser && user.id === currentUser.id;

            return (
              <div key={user.id} className="relative group">
                <div className={`absolute -inset-1 bg-linear-to-r ${isCurrentUser ? "from-emerald-400 to-emerald-500 opacity-50" : "from-slate-400 to-gray-400 opacity-0 group-hover:opacity-30"} rounded-xl blur transition-opacity`} />
                <div className={`relative ${isCurrentUser ? "bg-linear-to-r from-slate-800/60 to-gray-800/60 border-2 border-emerald-400" : "bg-slate-100/50 border border-slate-200 hover:bg-slate-200/50"} backdrop-blur-xl rounded-xl shadow-lg p-5 transition-all transform hover:scale-[1.02]`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-5 flex-1">
                      <div className="text-3xl font-black text-emerald-600 w-12 text-center">{rank}</div>
                      <div className="relative">
                        <div className="w-14 h-14 rounded-full bg-linear-to-br from-emerald-400 to-slate-500 flex items-center justify-center text-slate-50 text-xl font-bold border-2 border-slate-50 shadow-lg">{user.email?.charAt(0).toUpperCase()}</div>
                        {isCurrentUser && (
                          <div className="absolute -top-2 -right-2 bg-emerald-400 text-slate-900 text-xs font-black px-2 py-1 rounded-full border-2 border-slate-50">YOU</div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-black text-slate-900 text-lg">{user.email?.split('@')[0]}</p>
                        <p className={`text-xs px-3 py-1 rounded-full inline-block ${getTitleColor(user.title)} font-bold mt-1`}>{user.title}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center"><div className="text-2xl font-black text-emerald-600">{user.level}</div><div className="text-xs text-slate-600 font-semibold">LEVEL</div></div>
                      <div className="text-center"><div className="text-2xl font-black text-emerald-500">{user.xp}</div><div className="text-xs text-emerald-400 font-semibold">XP</div></div>
                      <div className="text-center"><div className="text-2xl font-black text-slate-600">{user.totalQuizzes}</div><div className="text-xs text-slate-500 font-semibold">QUIZZES</div></div>
                      <div className="text-center"><div className="text-2xl font-black">{user.streak > 0 ? `${user.streak}🔥` : '—'}</div><div className="text-xs text-slate-500 font-semibold">STREAK</div></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative group">
            <div className="absolute -inset-1 bg-linear-to-r from-emerald-400 to-slate-400 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <div className="relative bg-linear-to-br from-slate-200/60 to-gray-200/60 backdrop-blur-xl rounded-xl shadow-xl p-8 text-center border border-emerald-400/30 transform hover:scale-105 transition-transform">
              <div className="text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-emerald-600 to-slate-600">{stats.totalStudents}</div>
              <div className="text-slate-700 text-lg font-bold mt-2">TOTAL WARRIORS</div>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-1 bg-linear-to-r from-slate-400 to-gray-400 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <div className="relative bg-linear-to-br from-slate-200/60 to-gray-200/60 backdrop-blur-xl rounded-xl shadow-xl p-8 text-center border border-slate-400/30 transform hover:scale-105 transition-transform">
              <div className="text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-slate-600 to-gray-600">{stats.highestLevel}</div>
              <div className="text-slate-700 text-lg font-bold mt-2">HIGHEST LEVEL</div>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-1 bg-linear-to-r from-emerald-400 to-emerald-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <div className="relative bg-linear-to-br from-slate-200/60 to-gray-200/60 backdrop-blur-xl rounded-xl shadow-xl p-8 text-center border border-emerald-400/30 transform hover:scale-105 transition-transform">
              <div className="text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-emerald-600 to-slate-600">{stats.totalQuizzes}</div>
              <div className="text-slate-700 text-lg font-bold mt-2">QUIZZES CONQUERED</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
