"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { db, authFeature } from "@/lib/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs
} from "firebase/firestore";

export default function TakeQuiz() {
  const router = useRouter();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [current, setCurrent] = useState(0);
  const [time, setTime] = useState(60);
  const [score, setScore] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    loadQuiz();
  }, []);

  useEffect(() => {
    if (time > 0 && !submitted) {
      const timer = setTimeout(() => setTime(time - 1), 1000);
      return () => clearTimeout(timer);
    }

    if (time === 0 && !submitted) {
      submitQuiz();
    }
  }, [time, submitted, submitQuiz]);

  
  const loadQuiz = async () => {
    const user = authFeature.currentUser;
    if (!user) return;

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
        setQuestions(lastQuiz.questions);
        return;
      }
    }

    
    const res = await fetch("/api/question", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "generate" })
    });

    const data = await res.json();
    setQuestions(data.questions);
  };

  const selectAnswer = (option) => {
    if (submitted) return;

    const updated = [...answers];
    updated[current] = option;
    setAnswers(updated);

    if (current < questions.length - 1) {
      setCurrent(current + 1);
    }
  };

  const submitQuiz = useCallback(async () => {
    if (submitted) return;

    const user = authFeature.currentUser;
    if (!user) return;

    setSubmitted(true);

    let correct = 0;

    questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) correct++;
    });

    const today = new Date().toISOString().split("T")[0];

    await addDoc(collection(db, "quizResults"), {
      userId: user.uid,
      score: correct,
      total: questions.length,
      timeTaken: 60 - time,
      questions,
      userAnswers: answers,
      explanations: questions.map(q => q.explanation || ""),
      dateKey: today,
      rewardGiven: false,
      createdAt: new Date()
    });

    setScore(correct);
  }, [submitted, questions, answers, time]);

  if (!questions.length) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-8">
        Loading quiz...
      </div>
    );
  }

  if (score !== null) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-8 text-center">

        <h1 className="text-3xl mb-6">
          🎯 Your Score: {score} / {questions.length}
        </h1>

        <button
          onClick={() => router.push("/Quiz")}
          className="bg-green-600 px-6 py-3 rounded"
        >
          Back to Quiz Page
        </button>

      </div>
    );
  }

  const q = questions[current];

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">

      <h2 className="mb-4 text-xl">
        ⏳ Time Left: {time}s
      </h2>

      <h3 className="mb-6 text-lg">
        Question {current + 1} / {questions.length}
      </h3>

      <div className="bg-slate-800 p-6 rounded mb-6">
        <p className="mb-4">{q.question}</p>

        {q.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => selectAnswer(opt)}
            className={`block w-full mb-2 p-3 rounded ${
              answers[current] === opt
                ? "bg-accent"
                : "bg-slate-700"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {current === questions.length - 1 && (
        <button
          onClick={submitQuiz}
          className="bg-green-600 px-6 py-2 rounded"
        >
          Submit Quiz
        </button>
      )}

    </div>
  );
}
