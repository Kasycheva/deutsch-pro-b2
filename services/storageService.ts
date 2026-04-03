import { UserProgress, UserProfile, VocabWord, VocabFolder } from '../types';
import { ACHIEVEMENTS, TOPICS } from '../constants';

const USERS_KEY = 'deutsch_pro_users';
const ACTIVE_USER_KEY = 'deutsch_pro_active_user';
const PROGRESS_PREFIX = 'deutsch_pro_progress_';

// --- Helper Methods ---

const getUsers = (): any[] => {
  try {
    const data = localStorage.getItem(USERS_KEY);
    const parsed = data ? JSON.parse(data) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Error parsing users from storage", e);
    return [];
  }
};

// --- Auth Methods ---

export const registerUser = (name: string, email: string, password: string): UserProfile | null => {
  const users = getUsers();
  const normalizedEmail = email.trim().toLowerCase();
  const cleanPassword = password.trim();
  
  const userExists = users.some((u: any) => 
    u && u.email && u.email.toLowerCase() === normalizedEmail
  );

  if (userExists) return null; 

  const newUser = {
    id: Date.now().toString(),
    name: name.trim(),
    email: normalizedEmail,
    password: cleanPassword,
    joinedDate: new Date().toISOString()
  };
  
  const updatedUsers = [...users, newUser];
  localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
  
  const profile: UserProfile = { 
    id: newUser.id, 
    name: newUser.name, 
    email: newUser.email, 
    joinedDate: newUser.joinedDate 
  };
  
  localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(profile));
  return profile;
};

export const loginUser = (email: string, password: string): UserProfile | null => {
  const users = getUsers();
  const normalizedEmail = email.trim().toLowerCase();
  const cleanPassword = password.trim();
  
  const user = users.find((u: any) => 
    u && u.email && u.email.toLowerCase() === normalizedEmail && u.password === cleanPassword
  );
  
  if (!user) return null;
  
  const profile: UserProfile = { 
    id: user.id, 
    name: user.name, 
    email: user.email, 
    joinedDate: user.joinedDate 
  };
  
  localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(profile));
  return profile;
};

export const logoutUser = () => {
  localStorage.removeItem(ACTIVE_USER_KEY);
};

export const getCurrentUser = (): UserProfile | null => {
  try {
    const data = localStorage.getItem(ACTIVE_USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

// --- Progress Methods ---

const getStorageKey = () => {
  const user = getCurrentUser();
  if (!user) return 'deutsch_pro_progress_guest'; 
  return `${PROGRESS_PREFIX}${user.id}`;
};

const DEFAULT_PROGRESS: UserProgress = {
  completedTopics: [],
  quizScores: {},
  dailyStreak: 0,
  lastLoginDate: new Date().toISOString().split('T')[0],
  unlockedAchievements: [],
  vocabStatus: {},
  customVocab: [],
  folders: []
};

export const getProgress = (): UserProgress => {
  try {
    const data = localStorage.getItem(getStorageKey());
    if (!data) return DEFAULT_PROGRESS;
    
    const parsed = JSON.parse(data);
    if (!parsed.unlockedAchievements) parsed.unlockedAchievements = [];
    if (!parsed.vocabStatus) parsed.vocabStatus = {};
    if (!parsed.customVocab) parsed.customVocab = [];
    if (!parsed.folders) parsed.folders = [];
    
    return parsed;
  } catch (e) {
    console.error("Failed to load progress", e);
    return DEFAULT_PROGRESS;
  }
};

export const saveProgress = (progress: UserProgress) => {
  try {
    localStorage.setItem(getStorageKey(), JSON.stringify(progress));
  } catch (e) {
    console.error("Failed to save progress", e);
  }
};

const checkAchievements = (current: UserProgress): string[] => {
  const newUnlocked: string[] = [];
  const alreadyUnlocked = new Set(current.unlockedAchievements);

  ACHIEVEMENTS.forEach(ach => {
    if (alreadyUnlocked.has(ach.id)) return;

    let unlocked = false;
    switch (ach.conditionType) {
      case 'streak':
        if (current.dailyStreak >= (ach.conditionValue as number)) unlocked = true;
        break;
      case 'topic_count':
        if (current.completedTopics.length >= (ach.conditionValue as number)) unlocked = true;
        break;
      case 'quiz_perfect':
        const hasPerfect = Object.values(current.quizScores).some(res => res.score === res.total && res.total > 0);
        if (hasPerfect) unlocked = true;
        break;
      case 'level_completion':
        const level = ach.conditionValue as string;
        const topicsInLevel = TOPICS.filter(t => t.level === level).map(t => t.id);
        if (topicsInLevel.length > 0 && topicsInLevel.every(id => current.completedTopics.includes(id))) {
          unlocked = true;
        }
        break;
    }

    if (unlocked) newUnlocked.push(ach.id);
  });

  return newUnlocked;
};

export const toggleTopicCompletion = (topicId: string): { progress: UserProgress, newAchievements: string[] } => {
  const current = getProgress();
  const isCompleted = current.completedTopics.includes(topicId);
  
  let newCompleted;
  if (isCompleted) {
    newCompleted = current.completedTopics.filter(id => id !== topicId);
  } else {
    newCompleted = [...current.completedTopics, topicId];
  }

  let newProgress = { ...current, completedTopics: newCompleted };
  const newlyUnlocked = checkAchievements(newProgress);
  newProgress.unlockedAchievements = [...newProgress.unlockedAchievements, ...newlyUnlocked];

  saveProgress(newProgress);
  return { progress: newProgress, newAchievements: newlyUnlocked };
};

export const saveQuizResult = (topicId: string, score: number, total: number): { progress: UserProgress, newAchievements: string[] } => {
  const current = getProgress();
  const newScores = { ...current.quizScores, [topicId]: { score, total } };
  
  let newCompleted = current.completedTopics;
  if (!newCompleted.includes(topicId) && (score / total) >= 0.7) {
      newCompleted = [...newCompleted, topicId];
  }

  let newProgress = { ...current, quizScores: newScores, completedTopics: newCompleted };
  const newlyUnlocked = checkAchievements(newProgress);
  newProgress.unlockedAchievements = [...newProgress.unlockedAchievements, ...newlyUnlocked];

  saveProgress(newProgress);
  return { progress: newProgress, newAchievements: newlyUnlocked };
};

export const updateStreak = (): { progress: UserProgress, newAchievements: string[] } => {
  const current = getProgress();
  const today = new Date().toISOString().split('T')[0];
  
  if (current.lastLoginDate === today) return { progress: current, newAchievements: [] };

  const lastLogin = new Date(current.lastLoginDate);
  const diffTime = Math.abs(new Date().getTime() - lastLogin.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

  let newStreak = current.dailyStreak;
  if (diffDays === 1) newStreak += 1;
  else if (diffDays > 1) newStreak = 1;

  let newProgress = { ...current, dailyStreak: newStreak, lastLoginDate: today };
  const newlyUnlocked = checkAchievements(newProgress);
  newProgress.unlockedAchievements = [...newProgress.unlockedAchievements, ...newlyUnlocked];
  
  saveProgress(newProgress);
  return { progress: newProgress, newAchievements: newlyUnlocked };
};

export const updateWordStatus = (word: string, status: 'known' | 'learning' | null): UserProgress => {
  const current = getProgress();
  const newVocabStatus = { ...current.vocabStatus };
  
  if (status === null) delete newVocabStatus[word];
  else newVocabStatus[word] = status;

  const newProgress = { ...current, vocabStatus: newVocabStatus };
  saveProgress(newProgress);
  return newProgress;
};

export const addCustomWord = (word: VocabWord): UserProgress => {
  const current = getProgress();
  const newCustomVocab = [...current.customVocab, word];
  const newProgress = { ...current, customVocab: newCustomVocab };
  saveProgress(newProgress);
  return newProgress;
};

export const createFolder = (name: string): UserProgress => {
  const current = getProgress();
  const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500', 'bg-rose-500', 'bg-cyan-500'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  const newFolder: VocabFolder = {
    id: Date.now().toString(),
    name: name.trim(),
    color: randomColor,
    createdAt: new Date().toISOString()
  };

  const newFolders = [...current.folders, newFolder];
  const newProgress = { ...current, folders: newFolders };
  saveProgress(newProgress);
  return newProgress;
};

// --- Backup & Restore ---

export const exportUserData = (): string => {
  const user = getCurrentUser();
  const progress = getProgress();
  return JSON.stringify({ user, progress, date: new Date().toISOString() });
};

export const importUserData = (jsonData: string): boolean => {
  try {
    const data = JSON.parse(jsonData);
    if (!data.user || !data.progress) return false;
    localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(data.user));
    localStorage.setItem(`${PROGRESS_PREFIX}${data.user.id}`, JSON.stringify(data.progress));
    return true;
  } catch { return false; }
};
