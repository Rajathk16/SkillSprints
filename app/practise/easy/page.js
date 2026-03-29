"use client";

import { useState, useEffect } from "react";
import { authFeature, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { calculateLevel } from "@/lib/levelSystem";
import { useRouter } from "next/navigation";

export default function EasyPractice() {
  const router = useRouter();

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [completedQuestions, setCompletedQuestions] = useState([]);


   const fetchQuestions = async () => {
    const snap = await getDoc(doc(db, "practiceQuestions", "easy"));
    if (snap.exists()) {
      setQuestions(snap.data().questions);
    }
  };


   const fetchUserProgress = async () => {
    const user = authFeature.currentUser;
    if (!user) return;

    const snap = await getDoc(doc(db, "users", user.uid));
    const solved =
      snap.data()?.practiceProgress?.easySolvedIndexes || [];

    setCompletedQuestions(solved);
  };
  
  useEffect(() => {
    fetchQuestions();
    fetchUserProgress();
  }, []);

 

 

  const handleAnswer = async (selected) => {
    try {
      const user = authFeature.currentUser;
      if (!user) {
        alert("Please login to answer questions");
        return;
      }

      const correct = questions[current].correctAnswer;

      if (selected === correct) {
        setIsCorrect(true);

        if (!completedQuestions.includes(current)) {
          const updatedSolved = [...completedQuestions, current];
          setCompletedQuestions(updatedSolved);

          const userRef = doc(db, "users", user.uid);

          await updateDoc(userRef, {
            xp: increment(10),
            "practiceProgress.easyCompleted": increment(1),
            "practiceProgress.easySolvedIndexes": updatedSolved,
          });

          const snap = await getDoc(userRef);
          const newXP = snap.data().xp;

          const { level, title } = calculateLevel(newXP);

          await updateDoc(userRef, { level, title });
        }
      } else {
        setIsCorrect(false);
      }

      setShowSolution(true);
    } catch (error) {
      console.error("Error in handleAnswer:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const nextQuestion = async () => {
    setShowSolution(false);

    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      
      const user = authFeature.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          "practiceProgress.easyLevelCompleted": true,
        });
      }
      
      alert("🎉 Easy Level Completed!");
      router.push("/practise");
    }
  };

  if (!questions.length)
    return <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-indigo-50 via-white to-gray-100">
    
    <div className="bg-white shadow-xl rounded-2xl p-10 flex flex-col items-center gap-6 w-[320px]">
      
  
      <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>


      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-800">
          Loading Questions...
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Preparing your practice session 🚀
        </p>
      </div>

    </div>
    
  </div>;

  const q = questions[current];

  const isAllCompleted =
    completedQuestions.length === questions.length;

   return (
  <div className="min-h-screen bg-linear-to-br from-slate-900 via-gray-900 to-slate-900 text-white p-8">

    <button
      onClick={() => router.back()}
      className="mb-6 bg-white/10 hover:bg-white/20 px-5 py-2 rounded-lg border border-white/20 transition"
    >
      ← Back
    </button>

    <h2 className="text-3xl font-bold mb-2">Easy Practice</h2>
    <p className="mb-6 text-muted">
      Question {current + 1} / {questions.length}
    </p>

    
    <div className="bg-white text-black p-8 rounded-2xl shadow-2xl max-w-2xl">

      <h3 className="mb-6 font-semibold text-lg">
        {q.question}
      </h3>

     
      {!showSolution &&
        q.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(opt)}
            className="block w-full text-left bg-gray-100 hover:bg-gray-200 text-black mt-3 px-5 py-3 rounded-lg font-medium transition"
          >
            {opt}
          </button>
        ))}

 
      {showSolution && (
        <div className="mt-6">

          <p
            className={`text-lg font-bold ${
              isCorrect ? "text-green-600" : "text-red-600"
            }`}
          >
            {isCorrect ? "✅ Correct Answer!" : "❌ Wrong Answer"}
          </p>

          <p className="mt-3">
            <strong>Correct Answer:</strong> {q.correctAnswer}
          </p>

          <p className="mt-3 text-gray-700">
            <strong>Explanation:</strong> {q.solution}
          </p>

          <button
            onClick={nextQuestion}
            className="mt-6 bg-accent hover:opacity-90 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Next Question →
          </button>
        </div>
      )}
    </div>

    <div className="mt-10 grid grid-cols-8 gap-3 max-w-2xl">
      {questions.map((_, index) => (
        <button
          key={index}
          onClick={() => {
            setCurrent(index);
            setShowSolution(false);
          }}
          className={`py-2 rounded-lg font-semibold transition ${
            completedQuestions.includes(index)
              ? "bg-green-500 text-white"
              : "bg-white/20 hover:bg-white/30"
          }`}
        >
          {index + 1}
        </button>
      ))}
    </div>

   
    {isAllCompleted && (
      <div className="mt-8 text-center">
        <p className="text-green-400 font-bold text-xl">
          🎉 Easy Level Completed! Medium Unlocked!
        </p>
      </div>
    )}
  </div>
);

}
