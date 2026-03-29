"use client";

import { useEffect, useState } from "react";
import { authFeature, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from"next/navigation";

export default function MediumPracticeHome() {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProgress = async () => {
      const user = authFeature.currentUser;
      if (!user) {
        router.push("/login");
        return;
      }

      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        setProgress(snap.data()?.practiceProgress || {});
      } catch (err) {
        console.error("Error fetching progress:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [router]);

      const isEasyUnlocked = true;
      const isMediumUnlocked = progress?.easySolvedIndexes?.length > 0;
      const isHardUnlocked = progress?.mediumSolvedIndexes?.length > 0;

      const getProgressPercentage = (difficulty) => {
        const total = 100;
        if (difficulty === "easy") {
          return ((progress?.easySolvedIndexes?.length || 0) / total) * 100;
        }
        if (difficulty === "medium") {
          return ((progress?.mediumSolvedIndexes?.length || 0) / total) * 100;
        }
        if (difficulty === "hard") {
          return ((progress?.hardSolvedIndexes?.length || 0) / total) * 100;
        }
        return 0;
      };

      if (loading) {
        return (
          <div className="min-h-screen bg-linear-to-br from-slate-100 via-gray-50 to-white flex items-center justify-center">
            <div className="text-center">
              <div className="relative">
                <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-emerald-400 mx-auto"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl text-emerald-600">🎯</span>
                </div>
              </div>
              <p className="text-slate-900 font-bold text-xl mt-6">Loading Practice Mode...</p>
            </div>
          </div>
        );
      }

      return (
        <div className="min-h-screen bg-linear-to-br from-slate-100 via-gray-50 to-white relative overflow-hidden">

          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
          </div>

          <div className="relative z-10 bg-slate-800/20 backdrop-blur-md border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <button
                onClick={() => router.push("/dashboard")}
                className="flex items-center text-slate-900 hover:text-emerald-600 transition-colors group"
              >
                <svg className="w-6 h-6 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="font-bold">Back to Dashboard</span>
              </button>
            </div>
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-1">

            <div className="text-center mb-16">
              <div className="inline-block">
                <div className="relative">
                  <h1 className="text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-emerald-500 via-emerald-400 to-emerald-600 mb-4">
                     PRACTICE MODE
                  </h1>
                </div>
              </div>
              <p className="text-2xl text-slate-700 font-bold mt-6">Master your skills, level by level!</p>
              <p className="text-lg text-slate-500 mt-3">Complete each difficulty to unlock the next challenge</p>
            </div>

            <div className="space-y-8">
              {/* Easy Card */}
              <div className="relative group">
                <div className={`absolute -inset-2 bg-linear-to-r from-emerald-400 to-emerald-600 rounded-2xl blur ${isEasyUnlocked ? "opacity-50 group-hover:opacity-75" : "opacity-20"} transition-opacity`}></div>
                <div className="relative">
                  <button
                    onClick={() => isEasyUnlocked && router.push("/practise/easy")}
                    disabled={!isEasyUnlocked}
                    className={`w-full p-8 rounded-2xl transition-all transform ${isEasyUnlocked ? "bg-linear-to-br from-emerald-500/80 to-emerald-600/80 hover:scale-[1.02] cursor-pointer" : "bg-slate-200/50 cursor-not-allowed"} backdrop-blur-xl border-2 ${isEasyUnlocked ? "border-emerald-400/50" : "border-slate-300/30"} shadow-2xl`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <div className={`w-24 h-24 rounded-2xl flex items-center justify-center text-5xl ${isEasyUnlocked ? "bg-linear-to-br from-emerald-400 to-emerald-500 shadow-lg shadow-emerald-500/50" : "bg-slate-300"} border-4 border-slate-200`}>
                          {isEasyUnlocked ? "🟢" : "🔒"}
                        </div>
                        <div className="text-left">
                          <h2 className={`text-4xl font-black mb-2 ${isEasyUnlocked ? "text-emerald-600" : "text-slate-500"}`}>
                            EASY LEVEL
                          </h2>
                          <p className={`text-lg font-semibold mb-3 ${isEasyUnlocked ? "text-slate-800" : "text-slate-500"}`}>
                            💎 +10 XP per question
                          </p>
                          {isEasyUnlocked && (
                            <>
                              <div className="flex items-center space-x-2 mb-2">
                                <div className="w-64 h-3 bg-slate-300 rounded-full overflow-hidden border border-emerald-400/30">
                                  <div className="h-full bg-linear-to-r from-emerald-400 to-emerald-500 transition-all duration-500" style={{ width: `${getProgressPercentage("easy")}%` }}></div>
                                </div>
                                <span className="text-emerald-600 font-bold text-sm">{Math.round(getProgressPercentage("easy"))}%</span>
                              </div>
                              <p className="text-emerald-700 text-sm font-semibold">✅ {progress?.easySolvedIndexes?.length || 0} / 100 completed</p>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-center">
                        {isEasyUnlocked ? (
                          <div className="bg-emerald-500 text-slate-50 px-6 py-3 rounded-xl font-black text-lg shadow-lg">▶ START</div>
                        ) : (
                          <div className="bg-slate-400 text-slate-600 px-6 py-3 rounded-xl font-black text-lg">🔒 LOCKED</div>
                        )}
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Medium Card */}
              <div className="relative group">
                <div className={`absolute -inset-2 bg-linear-to-r from-gray-400 to-slate-500 rounded-2xl blur ${isMediumUnlocked ? "opacity-50 group-hover:opacity-75" : "opacity-20"} transition-opacity`}></div>
                <div className="relative">
                  <button
                    onClick={() => isMediumUnlocked && router.push("/practise/medium")}
                    disabled={!isMediumUnlocked}
                    className={`w-full p-8 rounded-2xl transition-all transform ${isMediumUnlocked ? "bg-linear-to-br from-slate-400/80 to-slate-500/80 hover:scale-[1.02] cursor-pointer" : "bg-slate-200/50 cursor-not-allowed"} backdrop-blur-xl border-2 ${isMediumUnlocked ? "border-gray-400/50" : "border-slate-300/30"} shadow-2xl`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <div className={`w-24 h-24 rounded-2xl flex items-center justify-center text-5xl ${isMediumUnlocked ? "bg-linear-to-br from-gray-400 to-slate-500 shadow-lg shadow-gray-500/50" : "bg-slate-300"} border-4 border-slate-200`}>
                          {isMediumUnlocked ? "🟡" : "🔒"}
                        </div>
                        <div className="text-left">
                          <h2 className={`text-4xl font-black mb-2 ${isMediumUnlocked ? "text-slate-600" : "text-slate-500"}`}>MEDIUM LEVEL</h2>
                          <p className={`text-lg font-semibold mb-3 ${isMediumUnlocked ? "text-slate-800" : "text-slate-500"}`}>💎 +20 XP per question</p>
                          {isMediumUnlocked ? (
                            <>
                              <div className="flex items-center space-x-2 mb-2">
                                <div className="w-64 h-3 bg-slate-300 rounded-full overflow-hidden border border-gray-400/30">
                                  <div className="h-full bg-linear-to-r from-gray-400 to-slate-500 transition-all duration-500" style={{ width: `${getProgressPercentage("medium")}%` }}></div>
                                </div>
                                <span className="text-slate-600 font-bold text-sm">{Math.round(getProgressPercentage("medium"))}%</span>
                              </div>
                              <p className="text-slate-700 text-sm font-semibold">✅ {progress?.mediumSolvedIndexes?.length || 0} / 100 completed</p>
                            </>
                          ) : (
                            <p className="text-slate-500 text-sm font-semibold">🔒 Complete all Easy questions to unlock</p>
                          )}
                        </div>
                      </div>
                      <div className="text-center">
                        {isMediumUnlocked ? (
                          <div className="bg-gray-500 text-slate-50 px-6 py-3 rounded-xl font-black text-lg shadow-lg">▶ START</div>
                        ) : (
                          <div className="bg-slate-400 text-slate-600 px-6 py-3 rounded-xl font-black text-lg">🔒 LOCKED</div>
                        )}
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Hard Card */}
              <div className="relative group">
                <div className={`absolute -inset-2 bg-linear-to-r from-slate-600 to-gray-700 rounded-2xl blur ${isHardUnlocked ? "opacity-50 group-hover:opacity-75" : "opacity-20"} transition-opacity`}></div>
                <div className="relative">
                  <button
                    onClick={() => isHardUnlocked && router.push("/practise/hard")}
                    disabled={!isHardUnlocked}
                    className={`w-full p-8 rounded-2xl transition-all transform ${isHardUnlocked ? "bg-linear-to-br from-slate-600/80 to-gray-700/80 hover:scale-[1.02] cursor-pointer" : "bg-slate-200/50 cursor-not-allowed"} backdrop-blur-xl border-2 ${isHardUnlocked ? "border-slate-400/50" : "border-slate-300/30"} shadow-2xl`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <div className={`w-24 h-24 rounded-2xl flex items-center justify-center text-5xl ${isHardUnlocked ? "bg-linear-to-br from-slate-500 to-gray-600 shadow-lg shadow-slate-500/50" : "bg-slate-300"} border-4 border-slate-200`}>
                          {isHardUnlocked ? "🔴" : "🔒"}
                        </div>
                        <div className="text-left">
                          <h2 className={`text-4xl font-black mb-2 ${isHardUnlocked ? "text-slate-700" : "text-slate-500"}`}>HARD LEVEL</h2>
                          <p className={`text-lg font-semibold mb-3 ${isHardUnlocked ? "text-slate-800" : "text-slate-500"}`}>💎 +30 XP per question</p>
                          {isHardUnlocked ? (
                            <>
                              <div className="flex items-center space-x-2 mb-2">
                                <div className="w-64 h-3 bg-slate-300 rounded-full overflow-hidden border border-slate-400/30">
                                  <div className="h-full bg-linear-to-r from-slate-500 to-gray-600 transition-all duration-500" style={{ width: `${getProgressPercentage("hard")}%` }}></div>
                                </div>
                                <span className="text-slate-700 font-bold text-sm">{Math.round(getProgressPercentage("hard"))}%</span>
                              </div>
                              <p className="text-slate-800 text-sm font-semibold">✅ {progress?.hardSolvedIndexes?.length || 0} / 100 completed</p>
                            </>
                          ) : (
                            <p className="text-slate-500 text-sm font-semibold">🔒 Complete all Medium questions to unlock</p>
                          )}
                        </div>
                      </div>
                      <div className="text-center">
                        {isHardUnlocked ? (
                          <div className="bg-slate-600 text-slate-50 px-6 py-3 rounded-xl font-black text-lg shadow-lg">▶ START</div>
                        ) : (
                          <div className="bg-slate-400 text-slate-600 px-6 py-3 rounded-xl font-black text-lg">🔒 LOCKED</div>
                        )}
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <div className="relative mt-12">
              <div className="absolute -inset-1 bg-linear-to-r from-slate-400 to-gray-400 rounded-xl blur opacity-30"></div>
              <div className="relative bg-slate-800/40 backdrop-blur-xl rounded-xl shadow-2xl p-8 border border-slate-200">
                <h3 className="text-2xl font-black text-emerald-600 mb-4 flex items-center">
                  <span className="text-3xl mr-3">💡</span>
                  HOW IT WORKS
                </h3>
                <div className="space-y-3 text-slate-900">
                  <div className="flex items-start space-x-3">
                    <span className="text-emerald-500 text-xl">🟢</span>
                    <p className="text-lg"><strong className="text-emerald-600">Easy:</strong> Start here! Perfect for beginners. Unlocked by default.</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-gray-500 text-xl">🟡</span>
                    <p className="text-lg"><strong className="text-slate-600">Medium:</strong> Unlocks after completing all Easy questions.</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-slate-500 text-xl">🔴</span>
                    <p className="text-lg"><strong className="text-slate-700">Hard:</strong> Unlocks after completing all Medium questions.</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-emerald-500 text-xl">⚡</span>
                    <p className="text-lg"><strong className="text-emerald-600">Tip:</strong> Each question gives you XP based on difficulty!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
