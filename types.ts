

export type Difficulty = 'A1' | 'A2' | 'B1' | 'B2';

export type TopicCategory = 'Grammar' | 'Vocabulary' | 'Speaking' | 'Reading' | 'Listening' | 'Test' | 'Exam';

export type QuestionType = 'multiple-choice' | 'true-false' | 'fill-gap';

export interface Topic {
  id: string;
  title: string;
  category: TopicCategory;
  level: Difficulty;
  description: string;
  isCompleted?: boolean;
  theoryContent?: string; // HTML content for the lesson theory
}

export interface Section {
  id: string;
  title: string;
  germanTitle: string;
  icon: string;
  description: string;
  path: string;
  color: string;
}

export interface VocabFolder {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

export interface VocabWord {
  german: string;
  russian: string;
  example: string;
  level: Difficulty;
  tags: string[];
  folderId?: string; // Optional link to a folder
}

export interface QuizQuestion {
  type: QuestionType;
  question: string;
  options: string[]; // For MC and T/F (Empty for fill-gap)
  correctIndex: number; // For MC and T/F (-1 for fill-gap)
  correctAnswerText?: string; // For fill-gap
  explanation: string;
  context?: string; // Optional: Text passage for Reading or Transcript for Listening
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  conditionType: 'streak' | 'topic_count' | 'quiz_perfect' | 'level_completion';
  conditionValue: number | string; 
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  joinedDate: string;
}

export interface UserProgress {
  completedTopics: string[]; // array of topic IDs
  quizScores: Record<string, { score: number; total: number }>; // topicID -> result
  dailyStreak: number;
  lastLoginDate: string;
  unlockedAchievements: string[]; // array of achievement IDs
  vocabStatus: Record<string, 'known' | 'learning'>; // word (german) -> status
  customVocab: VocabWord[]; // User added words
  folders: VocabFolder[]; // User created folders
}

export interface SpeakingTemplate {
  id: string;
  title: string;
  category: string;
  phrases: { german: string; russian: string }[];
}