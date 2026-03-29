"use client";
import { useEffect, useState } from "react";
import { authFeature, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const user = authFeature.currentUser;
      if (!user) return;

      try {
        const docSnap = await getDoc(doc(db, "users", user.uid));
        setUserData(docSnap.data());
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 via-gray-50 to-white text-slate-900">
      <nav className="flex justify-between items-center px-8 py-4 bg-slate-800/30 backdrop-blur-lg border-b border-slate-200">
        <h2 className="text-2xl font-bold text-emerald-600">🚀 SkillSprint</h2>
        <button
          onClick={() => router.push("/profile")}
          className="bg-slate-200/50 hover:bg-slate-300/50 px-4 py-2 rounded-xl transition duration-300 text-slate-900"
        >
          👤 Profile
        </button>
      </nav>

      <div className="flex flex-col items-center justify-center mt-16 px-6">
        <div className="bg-slate-200/50 backdrop-blur-xl border border-slate-300 rounded-3xl shadow-2xl p-8 w-full max-w-xl text-center animate-fade-in">
          <h3 className="text-2xl font-semibold mb-2 text-slate-900">Welcome back 👋</h3>
          <p className="text-slate-600 mb-4">{userData?.email || "Loading..."}</p>

          <div className="flex justify-center gap-6 mb-6 flex-wrap">
            <div className="bg-slate-200/50 px-6 py-4 rounded-xl hover:scale-105 transition">
              <p className="text-sm text-slate-600">Level</p>
              <p className="text-xl font-bold text-emerald-600">{userData?.level || 0}</p>
            </div>

            <div className="bg-slate-200/50 px-6 py-4 rounded-xl hover:scale-105 transition">
              <p className="text-sm text-slate-600">Title</p>
              <p className="text-xl font-bold text-emerald-500">{userData?.title || "Beginner"}</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-6">
            <button
              onClick={() => router.push("/practise")}
              className="bg-emerald-600 hover:bg-emerald-700 py-3 rounded-xl font-semibold shadow-lg transition transform hover:scale-105 text-slate-50"
            >
              🎯 Practice Mode
            </button>

            <button
              onClick={() => router.push("/Quiz")}
              className="bg-emerald-500 hover:bg-emerald-600 py-3 rounded-xl font-semibold shadow-lg transition transform hover:scale-105 text-slate-50"
            >
              🧠 Quiz Mode
            </button>

            <button
              onClick={() => router.push("/leaderboard")}
              className="bg-emerald-700 hover:bg-emerald-800 py-3 rounded-xl font-semibold shadow-lg transition transform hover:scale-105 text-slate-50"
            >
              🏆 Leaderboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
