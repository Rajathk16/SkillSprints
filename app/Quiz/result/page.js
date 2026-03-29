"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authFeature, db } from "@/lib/firebase";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";

export default function QuizResult() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [detailedResults, setDetailedResults] = useState(null);
  const [loading, setLoading] = useState(true);

  const score = parseInt(searchParams.get("score")) || 0;
  const correct = parseInt(searchParams.get("correct")) || 0;
  const total = parseInt(searchParams.get("total")) || 0;

  useEffect(() => {
    const fetchDetailedResults = async () => {
      const user = authFeature.currentUser;
      if (!user) return;

      try {
        const q = query(
          collection(db, "quizAnswers"),
          where("userId", "==", user.uid),
          orderBy("timestamp", "desc"),
          limit(1)
        );
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          setDetailedResults(snapshot.docs[0].data());
        }
      } catch (error) {
        console.error("Error fetching results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetailedResults();
  }, []);

  const getPerformanceMessage = () => {
    if (score >= 90) return { text: "Outstanding! 🎉", color: "text-green-600", bg: "bg-green-50" };
    if (score >= 75) return { text: "Great Job! 🌟", color: "text-accent", bg: "bg-gray-50" };
    if (score >= 60) return { text: "Good Effort! 👍", color: "text-yellow-600", bg: "bg-yellow-50" };
    return { text: "Keep Practicing! 💪", color: "text-red-600", bg: "bg-red-50" };
  };

  const performance = getPerformanceMessage();

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className={`${performance.bg} p-8 text-center border-b`}>
            <div className="text-6xl mb-4">
              {score >= 90 ? "🏆" : score >= 75 ? "🌟" : score >= 60 ? "👍" : "💪"}
            </div>
            <h1 className={`text-4xl font-bold ${performance.color} mb-2`}>
              {performance.text}
            </h1>
            <p className="text-gray-600 text-lg">Quiz Completed Successfully</p>
          </div>

          <div className="p-8">
          
            <div className="text-center mb-8">
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-48 h-48" viewBox="0 0 200 200">
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="12"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke="#2e8b57"
                    strokeWidth="12"
                    strokeDasharray={`${(score / 100) * 565} 565`}
                    strokeLinecap="round"
                    transform="rotate(-90 100 100)"
                  />
                </svg>
                <div className="absolute text-center">
                  <div className="text-5xl font-bold text-gray-900">{score}%</div>
                  <div className="text-sm text-gray-500 mt-1">Your Score</div>
                </div>
              </div>
            </div>

            
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-green-600">{correct}</div>
                <div className="text-sm text-gray-600 mt-1">Correct</div>
              </div>
              <div className="bg-red-50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-red-600">{total - correct}</div>
                <div className="text-sm text-gray-600 mt-1">Incorrect</div>
              </div>
              <div className="bg-indigo-50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-indigo-600">{total}</div>
                <div className="text-sm text-gray-600 mt-1">Total</div>
              </div>
            </div>

            
            <div className="bg-linear-to-r from-yellow-50 to-orange-50 rounded-xl p-6 mb-6 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-yellow-400 rounded-full p-3 mr-4">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-lg text-gray-900">XP Earned</div>
                    <div className="text-sm text-gray-600">Keep going to level up!</div>
                  </div>
                </div>
                <div className="text-3xl font-bold text-yellow-900">+{score}</div>
              </div>
            </div>

            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => router.push("/quiz")}
                className="bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
              >
                Retake Quiz
              </button>
              <button
                onClick={() => router.push("/quiz/review")}
                className="bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors"
              >
                Review Answers
              </button>
              <button
                onClick={() => router.push("/dashboard")}
                className="bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>

        
        {detailedResults && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Question Review</h2>
            <div className="space-y-6">
              {detailedResults.questions?.map((question, index) => {
                const userAnswer = detailedResults.selectedAnswers[index];
                const correctAnswer = detailedResults.correctAnswers[index];
                const isCorrect = userAnswer === correctAnswer;

                return (
                  <div
                    key={index}
                    className={`border-2 rounded-xl p-6 ${
                      isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-semibold text-lg flex-1">
                        Q{index + 1}. {question.question}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          isCorrect
                            ? "bg-green-200 text-green-800"
                            : "bg-red-200 text-red-800"
                        }`}
                      >
                        {isCorrect ? "✓ Correct" : "✗ Incorrect"}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      {question.options?.map((option, optIndex) => {
                        const isUserAnswer = option === userAnswer;
                        const isCorrectAnswer = option === correctAnswer;

                        return (
                          <div
                            key={optIndex}
                            className={`p-3 rounded-lg ${
                              isCorrectAnswer
                                ? "bg-green-100 border-2 border-green-500"
                                : isUserAnswer
                                ? "bg-red-100 border-2 border-red-500"
                                : "bg-white border border-gray-200"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{option}</span>
                              {isCorrectAnswer && (
                                <span className="text-green-600 font-semibold">✓ Correct Answer</span>
                              )}
                              {isUserAnswer && !isCorrect && (
                                <span className="text-red-600 font-semibold">Your Answer</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {detailedResults.explanations[index] && (
                      <div className="bg-gray-50 border-l-4 border-gray-400 p-4 rounded">
                        <div className="font-semibold text-strong mb-1">Explanation:</div>
                        <div className="text-muted text-sm">
                          {detailedResults.explanations[index]}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}