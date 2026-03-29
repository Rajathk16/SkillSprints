

import { collection, query, orderBy, limit, getDocs, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 
 * @param {string} sortBy 
 * @param {number} limitCount 
 * @returns {Promise<Array>}
 */
export const fetchLeaderboardData = async (sortBy = "xp", limitCount = 100) => {
  try {
   
    let orderByField = "xp";
    if (sortBy === "level") orderByField = "level";
    if (sortBy === "quizzes") orderByField = "totalQuizzes";

    const q = query(
      collection(db, "users"),
      orderBy(orderByField, "desc"),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    const users = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      users.push({
        id: doc.id,
        email: data.email,
        level: data.level || 1,
        xp: data.xp || 0,
        title: data.title || "Novice",
        streak: data.streak || 0,
        totalQuizzes: data.totalQuizzes || 0,
        role: data.role || "student"
      });
    });

    
    const students = users.filter(u => u.role === "student");

    return students;
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    throw error;
  }
};

/**

 * @param {string} userId 
 * @returns {Promise<Object|null>} 
 */
export const fetchCurrentUserData = async (userId) => {
  try {
    const q = query(
      collection(db, "users"),
      where("__name__", "==", userId)
    );
    
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const userData = snapshot.docs[0].data();
      return {
        id: userId,
        email: userData.email,
        level: userData.level || 1,
        xp: userData.xp || 0,
        title: userData.title || "Novice",
        streak: userData.streak || 0,
        totalQuizzes: userData.totalQuizzes || 0,
        role: userData.role || "student"
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching current user data:", error);
    throw error;
  }
};

/**

 * @param {Array} leaderboardData 
 * @param {string} userId 
 * @returns {number|null} 
 */
export const findUserRank = (leaderboardData, userId) => {
  const userIndex = leaderboardData.findIndex(u => u.id === userId);
  return userIndex !== -1 ? userIndex + 1 : null;
};

/**

 * @param {number} rank 
 * @returns {string}
 */
export const getRankIcon = (rank) => {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `#${rank}`;
};

/**

 * @param {string} title 
 * @returns {string}
 */
export const getTitleColor = (title) => {
  const colors = {
    "Novice": "bg-gray-700 text-gray-100",
    "Apprentice": "bg-gray-700 text-gray-100",
    "Expert": "bg-purple-700 text-purple-100",
    "Master": "bg-yellow-700 text-yellow-50",
    "Legend": "bg-red-700 text-red-50"
  };
  return colors[title] || "bg-gray-700 text-gray-100";
};

/**

 * @param {string} title 
 * @returns {string} 
 */
export const getTitleBadgeColor = (title) => {
  const colors = {
    "Novice": "bg-gray-500",
    "Apprentice": "bg-green-500",
    "Expert": "bg-purple-500",
    "Master": "bg-yellow-500",
    "Legend": "bg-red-500"
  };
  return colors[title] || "bg-gray-500";
};

/**
 
 * @param {Array} leaderboardData 
 * @returns {Object} 
 */
export const calculateLeaderboardStats = (leaderboardData) => {
  if (leaderboardData.length === 0) {
    return {
      totalStudents: 0,
      highestLevel: 0,
      totalQuizzes: 0
    };
  }

  return {
    totalStudents: leaderboardData.length,
    highestLevel: Math.max(...leaderboardData.map(u => u.level)),
    totalQuizzes: leaderboardData.reduce((sum, u) => sum + u.totalQuizzes, 0)
  };
};

/**
 
 * @param {Array} leaderboardData 
 * @returns {Array} 
 */
export const getTop3Users = (leaderboardData) => {
  return leaderboardData.slice(0, 3);
};

/**

 * @param {Array} leaderboardData -
 * @returns {Array} 
 */
export const getRemainingUsers = (leaderboardData) => {
  return leaderboardData.slice(3);
};