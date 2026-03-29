"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db, authFeature } from "@/lib/firebase";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";

export default function QuizHome() {
  const router = useRouter();
  const [canTake, setCanTake] = useState(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      const user = authFeature.currentUser;
      if (!user) {
        setCanTake(true);
        return;
      }

      const q = query(
        collection(db, "quizResults"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc"),
        limit(1)
      );

      const snap = await getDocs(q);

      if (!snap.empty) {
        const lastQuiz = snap.docs[0].data();
        const lastTime = lastQuiz.createdAt.toDate();
        const now = new Date();

        const diffHours = (now - lastTime) / (1000 * 60 * 60);

        if (diffHours < 24) {
          setCanTake(false);
          setCompleted(true);
        } else {
          setCanTake(true);
        }
      } else {
        setCanTake(true);
      }
    };

    checkStatus();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 p-8">

      <h1 className="text-3xl font-bold mb-10 text-center text-slate-900">
        Quiz Section
      </h1>

      <div className="space-y-6 max-w-md mx-auto">

        <button
          disabled={!canTake}
          onClick={() => router.push("/Quiz/take")}
          className={`w-full py-4 rounded-lg text-slate-50 font-semibold ${canTake ? "bg-emerald-600 hover:bg-emerald-700" : "bg-slate-400"}`}
        >
          Take Quiz
        </button>

        <button
          disabled={!completed}
          onClick={() => router.push("/Quiz/answers")}
          className={`w-full py-4 rounded-lg text-slate-50 font-semibold ${completed ? "bg-emerald-500 hover:bg-emerald-600" : "bg-slate-400"}`}
        >
          Answers
        </button>

        <button
          disabled={!completed}
          onClick={() => router.push("/Quiz/leader")}
          className={`w-full py-4 rounded-lg text-slate-50 font-semibold ${completed ? "bg-emerald-700 hover:bg-emerald-800" : "bg-slate-400"}`}
        >
          Leaderboard
        </button>
        <button
          onClick={() => router.push("/dashboard")}
          className="w-full py-4 rounded-lg bg-slate-800 hover:bg-slate-900 text-slate-50 font-semibold"
        >
          Back to Dashboard
        </button>

      </div>
    </div>
  );
}
