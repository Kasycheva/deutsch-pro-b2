
import React, { useState, useEffect, useMemo } from 'react';
import { marked } from 'marked';

const md = (text: string): string => marked.parse(text) as string;
import { HashRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Auth } from './components/Auth';
import { Quiz } from './components/Quiz';
import { TOPICS, SPEAKING_TEMPLATES, MOCK_VOCAB, ACHIEVEMENTS, MAIN_SECTIONS } from './constants';
import { getProgress, toggleTopicCompletion, updateStreak, saveQuizResult, getCurrentUser, logoutUser, updateWordStatus, addCustomWord, createFolder } from './services/storageService';
import { explainGrammar, checkSentence, playPronunciation, generateTranslationTask, evaluateTranslation, generateTheoryContent } from './services/geminiService';
import { 
  CheckCircle, 
  Circle, 
  Trophy, 
  Flame, 
  Search, 
  MessageSquare,
  Mic,
  Volume2,
  Star,
  Flag,
  GraduationCap,
  Lock,
  Bookmark,
  Loader2,
  BookOpen,
  Brain,
  Headphones,
  Library,
  MessageCircle,
  FileText,
  BarChart,
  ArrowRight,
  Plus,
  RotateCcw,
  LayoutGrid,
  List,
  X,
  Folder,
  FolderPlus,
  ChevronLeft,
  Languages,
  PenTool
} from 'lucide-react';
import { Topic, UserProfile, Section, VocabWord, VocabFolder } from './types';

// --- Helper for Icons ---
const IconMap: Record<string, any> = {
  Flag,
  Flame,
  Star,
  GraduationCap,
  Trophy,
  BookOpen,
  Brain,
  Headphones,
  Library,
  MessageCircle,
  FileText,
  BarChart
};

// --- Sub-Components ---

const SentenceChecker = () => {
  const [textInput, setTextInput] = useState("");
  const [result, setResult] = useState<{corrected: string, explanation: string} | null>(null);
  const [checking, setChecking] = useState(false);

  const handleCheck = async () => {
    if (!textInput.trim()) return;
    setChecking(true);
    setResult(null);
    const resp = await checkSentence(textInput);
    setResult(resp);
    setChecking(false);
  };

  const handleClear = () => {
    setTextInput("");
    setResult(null);
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm mt-8">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
        <PenTool className="h-5 w-5 text-brand-500" />
        Проверка предложений (Korrektur)
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Напишите предложение на немецком. ИИ найдет ошибки, объяснит грамматические правила и подскажет правильный вариант.
      </p>
      <div className="space-y-4">
        <textarea
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          className="w-full p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-brand-500 min-h-[100px] text-gray-900 dark:text-white placeholder-gray-400 font-medium"
          placeholder="Например: Ich habe gestern ins Kino gegangen. (Попробуйте написать с ошибкой!)"
        ></textarea>
        
        <div className="flex justify-end space-x-3">
           {textInput && (
             <button 
               onClick={handleClear}
               className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm font-medium"
             >
               Очистить
             </button>
           )}
          <button 
            onClick={handleCheck}
            disabled={checking || !textInput.trim()}
            className="bg-brand-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-700 disabled:opacity-50 transition flex items-center gap-2"
          >
            {checking ? <Loader2 className="animate-spin h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
            {checking ? 'Анализ...' : 'Проверить'}
          </button>
        </div>

        {result && (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
            {/* Correction Section */}
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
               <h4 className="text-xs uppercase tracking-wider font-bold text-green-700 dark:text-green-300 mb-1">Исправление (Korrektur)</h4>
               <p className="text-lg font-bold text-gray-900 dark:text-white">{result.corrected}</p>
            </div>

            {/* Explanation Section */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
               <h4 className="text-xs uppercase tracking-wider font-bold text-blue-700 dark:text-blue-300 mb-1 flex items-center gap-1">
                 <Brain size={14} />
                 Разбор (Erklärung)
               </h4>
               <div className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
                 {result.explanation}
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const TranslationTrainer = ({ category }: { category: string }) => {
  const [task, setTask] = useState<string>("");
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);

  useEffect(() => {
    loadNewTask();
  }, [category]);

  const loadNewTask = async () => {
    setIsLoading(true);
    setFeedback("");
    setInput("");
    const phrase = await generateTranslationTask(category);
    setTask(phrase);
    setIsLoading(false);
  };

  const handleCheck = async () => {
    if (!input.trim()) return;
    setIsEvaluating(true);
    const result = await evaluateTranslation(task, input);
    setFeedback(result);
    setIsEvaluating(false);
  };

  return (
    <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-6 border border-indigo-200 dark:border-indigo-800 shadow-sm mt-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Languages size={100} className="text-indigo-600 dark:text-indigo-300" />
      </div>

      <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-indigo-900 dark:text-indigo-100 relative z-10">
        <RotateCcw className="h-5 w-5" />
        Тренировка перевода: {category}
      </h2>
      
      <div className="relative z-10 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="animate-spin h-8 w-8 text-indigo-500" />
            <span className="ml-3 text-indigo-700 dark:text-indigo-300">ИИ подбирает фразу...</span>
          </div>
        ) : (
          <>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-l-4 border-indigo-500 shadow-sm">
              <span className="text-xs uppercase text-gray-500 font-bold tracking-wider">Задание (Русский)</span>
              <p className="text-xl font-medium text-gray-900 dark:text-white mt-1">{task}</p>
            </div>

            <div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full p-4 rounded-lg border border-indigo-200 dark:border-indigo-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-indigo-500 min-h-[80px] text-gray-900 dark:text-white placeholder-gray-400"
                placeholder="Напишите перевод на немецком..."
              ></textarea>
            </div>

            <div className="flex justify-between items-center">
               <button 
                 onClick={loadNewTask}
                 className="text-sm text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-300 underline"
               >
                 Пропустить / Другая фраза
               </button>
               
               <button 
                onClick={handleCheck}
                disabled={isEvaluating || !input.trim()}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition flex items-center gap-2 shadow-sm"
              >
                {isEvaluating ? <Loader2 className="animate-spin h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                {isEvaluating ? 'Проверяю...' : 'Проверить'}
              </button>
            </div>
          </>
        )}

        {feedback && (
          <div className="mt-4 p-5 bg-white dark:bg-gray-800 rounded-lg border border-green-200 dark:border-green-800 shadow-sm animate-in fade-in slide-in-from-top-2">
             <h4 className="font-bold text-green-700 dark:text-green-300 mb-2 flex items-center gap-2">
               <CheckCircle size={18} /> Результат:
             </h4>
             <div className="text-gray-800 dark:text-gray-200 text-sm whitespace-pre-wrap leading-relaxed">
               {feedback}
             </div>
             <div className="mt-4 flex justify-end">
               <button 
                 onClick={loadNewTask} 
                 className="flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200 rounded-lg text-sm font-medium hover:bg-indigo-200 dark:hover:bg-indigo-800 transition"
               >
                 Следующая фраза <ArrowRight size={16} />
               </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Dashboard = ({ user }: { user: UserProfile }) => {
  const [progress, setProgress] = useState(getProgress());

  useEffect(() => {
    const { progress: updated } = updateStreak();
    setProgress(updated);
  }, []);

  const completedCount = progress.completedTopics.length;
  const totalCount = TOPICS.length;
  const percentage = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Willkommen, {user.name}!</h1>
        <p className="text-gray-600 dark:text-gray-400">Выберите раздел для подготовки к экзамену B2:</p>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {MAIN_SECTIONS.map((section) => {
           const Icon = IconMap[section.icon] || Star;
           return (
             <Link 
              to={section.path} 
              key={section.id}
              className="group bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
             >
               <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${section.color} flex items-center justify-center text-white mb-4 shadow-md`}>
                  <Icon size={24} />
               </div>
               <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-brand-600 transition-colors">{section.germanTitle}</h3>
               <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">{section.title}</p>
               <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{section.description}</p>
             </Link>
           );
        })}
      </div>

      {/* Mini Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-gradient-to-r from-brand-600 to-brand-700 rounded-xl p-6 text-white shadow-md flex items-center justify-between">
           <div>
             <h3 className="font-bold text-lg">Общий прогресс</h3>
             <p className="text-brand-100 text-sm">Выполнено {completedCount} из {totalCount} заданий</p>
           </div>
           <div className="text-right">
              <span className="text-3xl font-bold">{percentage}%</span>
           </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-700 flex items-center space-x-4">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-full">
              <Flame size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">{progress.dailyStreak} дней подряд</h3>
              <p className="text-gray-500 text-sm">Отличная работа, так держать!</p>
            </div>
        </div>
      </div>
    </div>
  );
};

const SectionView = () => {
  const { sectionId } = useParams<{ sectionId: string }>();
  const [progress, setProgress] = useState(getProgress());
  const navigate = useNavigate();

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  // Map URL param to Topic Category
  const categoryMap: Record<string, string> = {
    'listening': 'Listening',
    'reading': 'Reading',
    'grammar': 'Grammar',
    'tests': 'Test',
    'exam': 'Exam'
  };

  const currentSection = MAIN_SECTIONS.find(s => s.id === sectionId);
  
  if (!currentSection) {
    return <div className="text-center p-10">Раздел не найден</div>;
  }

  const targetCategory = categoryMap[sectionId || ''];
  const filteredTopics = TOPICS.filter(t => t.category === targetCategory);

  return (
    <div className="space-y-6">
       <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
        <Link to="/" className="hover:text-brand-600">Главная</Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-white font-medium">{currentSection.title}</span>
      </div>

      <header className="mb-6">
        <div className="flex items-center gap-3 mb-2">
           <div className={`p-2 rounded-lg bg-gradient-to-br ${currentSection.color} text-white`}>
              {IconMap[currentSection.icon] && React.createElement(IconMap[currentSection.icon], { size: 24 })}
           </div>
           <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{currentSection.germanTitle}</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg">{currentSection.description}</p>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {filteredTopics.map(topic => {
          const isDone = progress.completedTopics.includes(topic.id);
          return (
            <Link to={`/learn/${topic.id}`} key={topic.id} className="block group">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-brand-400 dark:hover:border-brand-500 transition-all flex items-center justify-between shadow-sm hover:shadow-md">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full flex-shrink-0 ${isDone ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'}`}>
                    {isDone ? <CheckCircle size={24} /> : <Circle size={24} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg group-hover:text-brand-600 transition-colors">{topic.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{topic.description}</p>
                  </div>
                </div>
                <div className="hidden md:block">
                   <ArrowRight className="text-gray-300 group-hover:text-brand-500" />
                </div>
              </div>
            </Link>
          );
        })}
        {filteredTopics.length === 0 && (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
             <p className="text-gray-500">Материалы для этого раздела скоро появятся.</p>
          </div>
        )}
      </div>

      {/* Integrate Sentence Checker for Grammar and Exam sections */}
      {(sectionId === 'grammar' || sectionId === 'exam') && (
        <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8 animate-in fade-in">
           <div className="bg-gradient-to-r from-brand-600 to-brand-700 p-1 rounded-2xl shadow-lg">
             <div className="bg-white dark:bg-gray-800 rounded-xl p-1">
                <SentenceChecker />
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

const ProgressView = () => {
  const [progress, setProgress] = useState(getProgress());

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  const completedCount = progress.completedTopics.length;
  const totalCount = TOPICS.length;
  const percentage = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Мой прогресс</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Main Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
           <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">Общая статистика</h3>
           <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600 dark:text-gray-400">Пройдено тем</span>
              <span className="font-bold text-xl dark:text-white">{completedCount} / {totalCount}</span>
           </div>
           <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-6">
              <div className="bg-brand-600 h-4 rounded-full transition-all duration-1000" style={{ width: `${percentage}%` }}></div>
           </div>
           
           <div className="grid grid-cols-2 gap-4">
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                 <div className="flex items-center space-x-2 text-orange-600 dark:text-orange-400 mb-1">
                    <Flame size={18} />
                    <span className="font-bold">Стрик</span>
                 </div>
                 <p className="text-2xl font-bold text-gray-900 dark:text-white">{progress.dailyStreak} дн.</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                 <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 mb-1">
                    <Trophy size={18} />
                    <span className="font-bold">Достижения</span>
                 </div>
                 <p className="text-2xl font-bold text-gray-900 dark:text-white">{progress.unlockedAchievements.length}</p>
              </div>
           </div>
        </div>

        {/* Learning Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
           <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">Словарь</h3>
           <div className="space-y-4">
              <div className="flex justify-between items-center">
                 <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400"><CheckCircle size={16} className="text-green-500"/> Выучено</span>
                 <span className="font-bold dark:text-white">{Object.values(progress.vocabStatus).filter(s => s === 'known').length} слов</span>
              </div>
              <div className="flex justify-between items-center">
                 <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400"><Bookmark size={16} className="text-yellow-500"/> В процессе</span>
                 <span className="font-bold dark:text-white">{Object.values(progress.vocabStatus).filter(s => s === 'learning').length} слов</span>
              </div>
           </div>
        </div>
      </div>

      {/* Achievements List */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Награды</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {ACHIEVEMENTS.map(ach => {
            const isUnlocked = progress.unlockedAchievements.includes(ach.id);
            const IconComponent = IconMap[ach.icon] || Star;
            
            return (
              <div key={ach.id} className={`p-4 rounded-xl border ${isUnlocked ? 'bg-brand-50 dark:bg-brand-900/20 border-brand-200 dark:border-brand-800' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-60 grayscale'}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className={`p-2 rounded-lg ${isUnlocked ? 'bg-brand-100 dark:bg-brand-800 text-brand-600 dark:text-brand-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'}`}>
                    <IconComponent size={20} />
                  </div>
                  {!isUnlocked && <Lock size={16} className="text-gray-400" />}
                </div>
                <h3 className={`font-bold text-sm ${isUnlocked ? 'text-brand-900 dark:text-brand-100' : 'text-gray-500 dark:text-gray-400'}`}>{ach.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{ach.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const LessonView = () => {
  const { id } = useParams<{ id: string }>();
  const topic = TOPICS.find(t => t.id === id);
  const [activeTab, setActiveTab] = useState<'theory' | 'practice'>('theory');
  const [isCompleted, setIsCompleted] = useState(false);
  const [aiExplanation, setAiExplanation] = useState("");
  const [userQuery, setUserQuery] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const [newAchievement, setNewAchievement] = useState<string | null>(null);
  const [theoryContent, setTheoryContent] = useState<string>("");
  const [isTheoryLoading, setIsTheoryLoading] = useState(false);
  
  // Custom Labels for Test topics
  const isTest = topic?.category === 'Test';

  useEffect(() => {
    if (topic) {
      const p = getProgress();
      setIsCompleted(p.completedTopics.includes(topic.id));
      // Auto-switch to practice if it's a test
      if (topic.category === 'Test') {
        setActiveTab('practice');
      } else {
        // Load theory if not a test
        loadTheory();
      }
    }
  }, [topic]);

  const loadTheory = async () => {
    if (!topic) return;
    
    // 1. Check if topic has hardcoded theory
    if (topic.theoryContent) {
      setTheoryContent(topic.theoryContent);
      return;
    }

    // 2. Check cache (localStorage)
    const cacheKey = `theory_cache_${topic.id}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      setTheoryContent(cached);
      return;
    }
    
    setIsTheoryLoading(true);
    try {
      const content = await generateTheoryContent(topic);
      setTheoryContent(content);
      // Save to cache
      localStorage.setItem(cacheKey, content);
    } catch (error) {
      console.error("Failed to load theory:", error);
      setTheoryContent("<p class='text-red-500'>Ошибка загрузки теории. Попробуйте позже.</p>");
    } finally {
      setIsTheoryLoading(false);
    }
  };

  if (!topic) return <div>Тема не найдена</div>;

  const handleToggleComplete = () => {
    const { progress, newAchievements } = toggleTopicCompletion(topic.id);
    setIsCompleted(progress.completedTopics.includes(topic.id));
    if (newAchievements.length > 0) setNewAchievement(newAchievements[0]);
  };

  const handleQuizComplete = (score: number, total: number) => {
    const { newAchievements } = saveQuizResult(topic.id, score, total);
    if (newAchievements.length > 0) setNewAchievement(newAchievements[0]);
  }

  const askAI = async () => {
    if (!userQuery.trim()) return;
    setIsAsking(true);
    const answer = await explainGrammar(topic.title, userQuery);
    setAiExplanation(answer);
    setIsAsking(false);
  };

  return (
    <div className="space-y-6 relative">
      {/* Achievement Notification */}
      {newAchievement && (
        <div className="absolute top-0 left-0 right-0 -mt-4 z-10 animate-bounce">
          <div className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded-lg shadow-lg flex items-center justify-center gap-2">
             <Trophy size={20} />
             <span className="font-bold">Новое достижение разблокировано!</span>
          </div>
        </div>
      )}

      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
        <Link to="/" className="hover:text-brand-600">Главная</Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-white font-medium">{topic.title}</span>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 md:p-8 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="text-brand-600 font-bold tracking-wider text-sm uppercase">{topic.level} {topic.category}</span>
            <h1 className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">{topic.title}</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">{topic.description}</p>
          </div>
          <button 
            onClick={handleToggleComplete}
            className={`p-3 rounded-full transition-colors ${isCompleted ? 'bg-green-100 text-green-600' : 'bg-gray-100 hover:bg-gray-200 text-gray-400'}`}
            title="Mark as done"
          >
            <CheckCircle size={28} />
          </button>
        </div>

        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          <button 
            onClick={() => setActiveTab('theory')}
            className={`pb-3 px-1 mr-6 font-medium text-sm transition-colors border-b-2 ${activeTab === 'theory' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            {isTest ? 'Инструкция' : 'Теория'}
          </button>
          <button 
            onClick={() => setActiveTab('practice')}
            className={`pb-3 px-1 font-medium text-sm transition-colors border-b-2 ${activeTab === 'practice' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            {isTest ? 'Начать тест' : 'Практика (Quiz)'}
          </button>
        </div>

        {activeTab === 'theory' ? (
          <div className="space-y-6 animate-in fade-in duration-300">
             <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200">
               {isTheoryLoading ? (
                 <div className="flex flex-col items-center justify-center p-12 space-y-4">
                   <Loader2 className="animate-spin h-10 w-10 text-brand-500" />
                   <p className="text-gray-500 animate-pulse">ИИ готовит учебный материал для вас...</p>
                 </div>
               ) : (
                 <>
                  {isTest ? (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-100 dark:border-blue-800">
                      <h4 className="font-bold text-lg text-blue-900 dark:text-blue-100 mb-2">Информация о тесте</h4>
                      <p className="mb-4">Это симуляция части экзамена B2. Вам будет предложено 5 вопросов.</p>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>Не пользуйтесь словарем.</li>
                        <li>У вас нет ограничения по времени, но старайтесь отвечать быстро.</li>
                        <li>В конце вы увидите свой результат.</li>
                      </ul>
                      <button onClick={() => setActiveTab('practice')} className="mt-4 text-blue-600 dark:text-blue-300 font-bold underline">
                        Перейти к тесту
                      </button>
                    </div>
                  ) : (
                    <div className="markdown-body" dangerouslySetInnerHTML={{ __html: md(theoryContent) }} />
                  )}
                 </>
               )}

               {topic.category === 'Listening' && (
                 <div className="flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-600 mt-4">
                    <Headphones size={40} className="text-brand-400 mb-2" />
                    <p className="font-medium">Аудио-материал загружается...</p>
                    <p className="text-xs text-gray-500">Нажмите "Практика", чтобы начать упражнения.</p>
                 </div>
               )}
             </div>

             {/* INTEGRATION: Sentence Checker for Writing Tips */}
             {topic.id === 'exam-tips-write' && (
                <SentenceChecker />
             )}

             {/* AI Helper Section */}
             <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-700">
               <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                 <MessageSquare className="h-5 w-5 text-brand-500" />
                 AI-Тьютор
               </h3>
               <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                 <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Не поняли правило? Спросите, и я объясню.</p>
                 <div className="flex gap-2">
                   <input 
                    type="text" 
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                    placeholder="Например: В чем разница между..."
                    className="flex-1 rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 text-sm focus:ring-2 focus:ring-brand-500 dark:text-white"
                   />
                   <button 
                    onClick={askAI}
                    disabled={isAsking}
                    className="bg-brand-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand-700 disabled:opacity-50"
                   >
                     {isAsking ? '...' : 'Спросить'}
                   </button>
                 </div>
                 {aiExplanation && (
                   <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-sm leading-relaxed text-gray-800 dark:text-gray-200 markdown-body" dangerouslySetInnerHTML={{ __html: md(aiExplanation) }} />
                 )}
               </div>
             </div>
          </div>
        ) : (
          <div className="animate-in fade-in duration-300">
            <Quiz topic={topic} onComplete={handleQuizComplete} />
          </div>
        )}
      </div>
    </div>
  );
};

interface FlashcardProps {
  word: VocabWord;
  onPlayAudio: (text: string) => void;
  playingWord: string | null;
  status: 'known' | 'learning' | undefined;
  onStatusChange: (targetStatus: 'known' | 'learning') => void;
}

const Flashcard: React.FC<FlashcardProps> = ({ word, onPlayAudio, playingWord, status, onStatusChange }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      onClick={() => setIsFlipped(!isFlipped)}
      className="group h-64 w-full [perspective:1000px] cursor-pointer"
    >
      <div className={`relative h-full w-full transition-all duration-500 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
        
        {/* Front */}
        <div className={`absolute inset-0 h-full w-full rounded-xl bg-white dark:bg-gray-800 border-2 p-6 flex flex-col items-center justify-center shadow-sm [backface-visibility:hidden] ${
            status === 'known' ? 'border-green-400 dark:border-green-600' :
            status === 'learning' ? 'border-yellow-400 dark:border-yellow-600' :
            'border-gray-200 dark:border-gray-700'
        }`}>
           {/* Status Badge on Front */}
           <div className="absolute top-4 right-4">
             {status === 'known' && <CheckCircle className="text-green-500 h-6 w-6" />}
             {status === 'learning' && <Bookmark className="text-yellow-500 h-6 w-6" fill="currentColor" />}
           </div>

           <h3 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-2">{word.german}</h3>
           <p className="text-sm text-brand-600 dark:text-brand-400 text-center italic mb-4">"{word.example}"</p>
           <p className="text-xs text-gray-400 mb-4 text-center">Tap to flip</p>
           <button 
             onClick={(e) => { e.stopPropagation(); onPlayAudio(word.german); }}
             disabled={playingWord === word.german}
             className="p-3 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-500 hover:bg-brand-100 dark:hover:bg-brand-900/50 transition-colors z-10"
           >
              {playingWord === word.german ? <Loader2 className="h-6 w-6 animate-spin" /> : <Volume2 className="h-6 w-6" />}
           </button>
        </div>

        {/* Back */}
        <div className="absolute inset-0 h-full w-full rounded-xl bg-brand-600 text-white p-6 flex flex-col items-center justify-center shadow-sm [transform:rotateY(180deg)] [backface-visibility:hidden]">
           <h3 className="text-2xl font-bold text-center mb-2">{word.russian}</h3>
           
           <div className="flex flex-wrap gap-2 justify-center mt-2 mb-4">
              {word.tags.map(t => (
                <span key={t} className="text-xs bg-white/20 px-2 py-1 rounded">{t}</span>
              ))}
           </div>

           {/* Status Controls on Back */}
           <div className="flex gap-4 mt-auto" onClick={(e) => e.stopPropagation()}>
              <button 
                onClick={() => onStatusChange('learning')}
                className={`p-2 rounded-full bg-white/10 hover:bg-white/20 transition ${status === 'learning' ? 'text-yellow-300' : 'text-white'}`}
                title="Учу"
              >
                <Bookmark size={24} fill={status === 'learning' ? "currentColor" : "none"} />
              </button>
              <button 
                 onClick={() => onStatusChange('known')}
                 className={`p-2 rounded-full bg-white/10 hover:bg-white/20 transition ${status === 'known' ? 'text-green-300' : 'text-white'}`}
                 title="Выучено"
              >
                <CheckCircle size={24} fill={status === 'known' ? "currentColor" : "none"} />
              </button>
           </div>
        </div>

      </div>
    </div>
  );
};

const AddWordModal = ({ isOpen, onClose, onAdd, folders }: { isOpen: boolean, onClose: () => void, onAdd: (word: VocabWord) => void, folders: VocabFolder[] }) => {
  const [german, setGerman] = useState('');
  const [russian, setRussian] = useState('');
  const [example, setExample] = useState('');
  const [tag, setTag] = useState('');
  const [folderId, setFolderId] = useState('');
  
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!german || !russian) return;
    
    onAdd({
      german,
      russian,
      example: example || 'Kein Beispiel',
      level: 'B2',
      tags: tag ? [tag] : ['Custom'],
      folderId: folderId || undefined
    });
    
    // Reset
    setGerman('');
    setRussian('');
    setExample('');
    setTag('');
    setFolderId('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
       <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md p-6 shadow-xl animate-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Добавить слово</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"><X size={24}/></button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
             <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Немецкий</label>
               <input 
                 type="text" 
                 required
                 value={german}
                 onChange={e => setGerman(e.target.value)}
                 className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-brand-500 dark:text-white" 
                 placeholder="Wort"
               />
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Русский</label>
               <input 
                 type="text" 
                 required
                 value={russian}
                 onChange={e => setRussian(e.target.value)}
                 className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-brand-500 dark:text-white" 
                 placeholder="Слово"
               />
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Пример (необязательно)</label>
               <input 
                 type="text" 
                 value={example}
                 onChange={e => setExample(e.target.value)}
                 className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-brand-500 dark:text-white" 
                 placeholder="Satzbeispiel"
               />
             </div>
             
             <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Папка</label>
                  <select
                    value={folderId}
                    onChange={e => setFolderId(e.target.value)}
                    className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-brand-500 dark:text-white"
                  >
                    <option value="">Без папки</option>
                    {folders.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Тег</label>
                  <input 
                    type="text" 
                    value={tag}
                    onChange={e => setTag(e.target.value)}
                    className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-brand-500 dark:text-white" 
                    placeholder="Arbeit..."
                  />
                </div>
             </div>

             <div className="flex justify-end pt-2">
               <button type="button" onClick={onClose} className="mr-3 px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Отмена</button>
               <button type="submit" className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 font-medium">Сохранить</button>
             </div>
          </form>
       </div>
    </div>
  );
};

const AddFolderModal = ({ isOpen, onClose, onAdd }: { isOpen: boolean, onClose: () => void, onAdd: (name: string) => void }) => {
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name);
      setName('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
       <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-sm p-6 shadow-xl animate-in zoom-in-95 duration-200">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Создать папку</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
             <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Название папки</label>
               <input 
                 type="text" 
                 required
                 autoFocus
                 value={name}
                 onChange={e => setName(e.target.value)}
                 className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-brand-500 dark:text-white" 
                 placeholder="Например: Глаголы"
               />
             </div>
             <div className="flex justify-end pt-2">
               <button type="button" onClick={onClose} className="mr-3 px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Отмена</button>
               <button type="submit" className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 font-medium">Создать</button>
             </div>
          </form>
       </div>
    </div>
  );
};

const Dictionary = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState<'all' | 'known' | 'learning' | 'new'>('all');
  const [progress, setProgress] = useState(getProgress());
  const [playingWord, setPlayingWord] = useState<string | null>(null);
  
  // New States
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('list');
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isAddFolderModalOpen, setAddFolderModalOpen] = useState(false);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);

  const handleToggleStatus = (word: string, currentStatus: 'known' | 'learning' | undefined, targetStatus: 'known' | 'learning') => {
    const newStatus = currentStatus === targetStatus ? null : targetStatus;
    const updated = updateWordStatus(word, newStatus);
    setProgress(updated);
  };

  const handlePlayAudio = async (text: string) => {
    if (playingWord) return;
    setPlayingWord(text);
    await playPronunciation(text);
    setPlayingWord(null);
  };

  const handleAddWord = (newWord: VocabWord) => {
    // If we are currently inside a folder, auto-assign the new word to it
    if (currentFolderId && !newWord.folderId) {
      newWord.folderId = currentFolderId;
    }
    const updated = addCustomWord(newWord);
    setProgress(updated);
  };

  const handleCreateFolder = (name: string) => {
    const updated = createFolder(name);
    setProgress(updated);
  };

  // Merge MOCK + Custom
  const allVocab = useMemo(() => {
    return [...MOCK_VOCAB, ...progress.customVocab];
  }, [progress.customVocab]);

  const currentFolder = progress.folders.find(f => f.id === currentFolderId);

  const counts = useMemo(() => {
    let learning = 0;
    let known = 0;
    allVocab.forEach(w => {
       const s = progress.vocabStatus[w.german];
       if (s === 'learning') learning++;
       if (s === 'known') known++;
    });
    return {
        all: allVocab.length,
        learning,
        known,
        new: allVocab.length - learning - known
    };
  }, [progress.vocabStatus, allVocab]);

  // Filter Logic: Search + Tag + Status + FOLDER
  const filtered = allVocab.filter(w => {
    const matchesSearch = w.german.toLowerCase().includes(search.toLowerCase()) || w.russian.toLowerCase().includes(search.toLowerCase());
    const matchesTag = filter === 'All' || w.tags.includes(filter);
    
    const status = progress.vocabStatus[w.german];
    let matchesStatus = true;
    if (statusFilter === 'known') matchesStatus = status === 'known';
    else if (statusFilter === 'learning') matchesStatus = status === 'learning';
    else if (statusFilter === 'new') matchesStatus = !status;

    // Folder Logic
    let matchesFolder = true;
    if (currentFolderId) {
      matchesFolder = w.folderId === currentFolderId;
    }

    return matchesSearch && matchesTag && matchesStatus && matchesFolder;
  });

  const uniqueTags = useMemo(() => Array.from(new Set(allVocab.flatMap(w => w.tags))), [allVocab]);

  return (
    <div className="space-y-6">
       <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
        <Link to="/" className="hover:text-brand-600">Главная</Link>
        <span>/</span>
        <button onClick={() => setCurrentFolderId(null)} className="hover:text-brand-600">Словарь</button>
        {currentFolder && (
          <>
            <span>/</span>
            <span className="text-gray-900 dark:text-white font-medium">{currentFolder.name}</span>
          </>
        )}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div className="flex items-center gap-3">
            {currentFolderId && (
              <button 
                onClick={() => setCurrentFolderId(null)} 
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
              >
                <ChevronLeft size={24} />
              </button>
            )}
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {currentFolder ? currentFolder.name : 'Wortschatz (Словарь)'}
            </h1>
         </div>
         
         <div className="flex flex-wrap items-center gap-2">
           {/* Folder Add Button (Only on root) */}
           {!currentFolderId && (
              <button 
                onClick={() => setAddFolderModalOpen(true)}
                className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-2.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition font-medium border border-gray-200 dark:border-gray-700"
              >
                <FolderPlus size={18} />
                <span className="hidden sm:inline">Папка</span>
              </button>
           )}

           {/* View Toggle */}
           <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm text-brand-600 dark:text-brand-300' : 'text-gray-500'}`}
                title="List View"
              >
                <List size={20} />
              </button>
              <button 
                onClick={() => setViewMode('cards')}
                className={`p-2 rounded-md transition-all ${viewMode === 'cards' ? 'bg-white dark:bg-gray-700 shadow-sm text-brand-600 dark:text-brand-300' : 'text-gray-500'}`}
                title="Flashcards View"
              >
                <LayoutGrid size={20} />
              </button>
           </div>

           {/* Add Word Button */}
           <button 
             onClick={() => setAddModalOpen(true)}
             className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2.5 rounded-lg hover:bg-brand-700 transition font-medium shadow-sm"
           >
             <Plus size={20} />
             <span className="hidden sm:inline">Слово</span>
           </button>
         </div>
      </div>
      
      {/* Folder Grid (Only visible in Root view) */}
      {!currentFolderId && progress.folders.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          {progress.folders.map(folder => (
            <div 
              key={folder.id}
              onClick={() => setCurrentFolderId(folder.id)}
              className="cursor-pointer bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-600 hover:shadow-md transition-all group"
            >
               <div className={`w-10 h-10 rounded-lg ${folder.color} bg-opacity-10 dark:bg-opacity-20 flex items-center justify-center text-${folder.color.replace('bg-', '')} mb-3`}>
                  <Folder size={20} className={`${folder.color.replace('bg-', 'text-')}`} />
               </div>
               <h4 className="font-bold text-gray-900 dark:text-white truncate">{folder.name}</h4>
               <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                 {allVocab.filter(w => w.folderId === folder.id).length} слов
               </p>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-4">
        {/* Search and Tag Filter Row */}
        <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input 
                type="text" 
                placeholder="Поиск слова..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-500 dark:text-white"
              />
            </div>
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
            >
              <option value="All">Все темы</option>
              {uniqueTags.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex space-x-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {[
                { id: 'all', label: 'Все слова', count: counts.all },
                { id: 'learning', label: 'Учу', count: counts.learning },
                { id: 'known', label: 'Выучено', count: counts.known },
                { id: 'new', label: 'Новые', count: counts.new }
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setStatusFilter(tab.id as any)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                        statusFilter === tab.id
                        ? 'bg-brand-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                >
                    {tab.label}
                    <span className={`text-xs py-0.5 px-1.5 rounded-full ${
                        statusFilter === tab.id ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                    }`}>
                        {tab.count}
                    </span>
                </button>
            ))}
        </div>
      </div>

      {/* Content Area */}
      {viewMode === 'list' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4">
            {filtered.map((word, idx) => {
                const status = progress.vocabStatus[word.german];
                return (
                  <div key={idx} className={`bg-white dark:bg-gray-800 p-4 rounded-xl border hover:shadow-sm transition-all ${
                      status === 'known' ? 'border-green-200 dark:border-green-900 bg-green-50/30 dark:bg-green-900/10' :
                      status === 'learning' ? 'border-yellow-200 dark:border-yellow-900 bg-yellow-50/30 dark:bg-yellow-900/10' :
                      'border-gray-100 dark:border-gray-700'
                  }`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{word.german}</h3>
                          <button 
                            onClick={() => handlePlayAudio(word.german)}
                            disabled={playingWord === word.german}
                            className="text-brand-500 hover:text-brand-600 dark:text-brand-400 p-1 rounded-full hover:bg-brand-50 dark:hover:bg-brand-900/20"
                            title="Прослушать"
                          >
                            {playingWord === word.german ? <Loader2 className="h-5 w-5 animate-spin" /> : <Volume2 className="h-5 w-5" />}
                          </button>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">{word.russian}</p>
                      </div>
                      
                      <div className="flex space-x-1">
                          <button 
                            onClick={() => handleToggleStatus(word.german, status, 'learning')}
                            title="Учу"
                            className={`p-2 rounded-full transition-colors ${
                                status === 'learning' 
                                ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400' 
                                : 'text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                          >
                              <Bookmark size={20} fill={status === 'learning' ? "currentColor" : "none"} />
                          </button>
                          <button 
                            onClick={() => handleToggleStatus(word.german, status, 'known')}
                            title="Выучено"
                            className={`p-2 rounded-full transition-colors ${
                                status === 'known' 
                                ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' 
                                : 'text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                          >
                              <CheckCircle size={20} fill={status === 'known' ? "currentColor" : "none"} />
                          </button>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-50 dark:border-gray-700/50">
                      <p className="text-sm text-gray-500 italic">"{word.example}"</p>
                      <div className="mt-2 flex justify-between items-center">
                        <div className="flex gap-2">
                            {word.tags.map(tag => (
                            <span key={tag} className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">{tag}</span>
                            ))}
                        </div>
                        <span className="text-xs font-bold text-brand-200">{word.level}</span>
                      </div>
                    </div>
                  </div>
                );
            })}
          </div>
      ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
             {filtered.map((word, idx) => (
               <Flashcard 
                 key={idx} 
                 word={word} 
                 onPlayAudio={handlePlayAudio} 
                 playingWord={playingWord}
                 status={progress.vocabStatus[word.german]}
                 onStatusChange={(s) => handleToggleStatus(word.german, progress.vocabStatus[word.german], s)}
               />
             ))}
          </div>
      )}
      
      {filtered.length === 0 && (
        <div className="text-center mt-10 p-8 border border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
           <p className="text-gray-500 dark:text-gray-400">В этой папке пока нет слов.</p>
           <button onClick={() => setAddModalOpen(true)} className="mt-2 text-brand-600 font-medium">Добавить первое слово</button>
        </div>
      )}

      <AddWordModal 
        isOpen={isAddModalOpen} 
        onClose={() => setAddModalOpen(false)} 
        onAdd={handleAddWord}
        folders={progress.folders}
      />

      <AddFolderModal 
        isOpen={isAddFolderModalOpen}
        onClose={() => setAddFolderModalOpen(false)}
        onAdd={handleCreateFolder}
      />
    </div>
  );
};

const SpeakingPractice = () => {
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);

  // Helper to find title of category for the Trainer
  const selectedCategoryTitle = activeTemplate 
    ? SPEAKING_TEMPLATES.find(t => t.id === activeTemplate)?.category || "Allgemein"
    : null;

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
        <Link to="/" className="hover:text-brand-600">Главная</Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-white font-medium">Разговор</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Redemittel (Разговорные шаблоны)</h1>
        <p className="text-gray-600 dark:text-gray-400">Полезные фразы для устной части экзамена B2.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SPEAKING_TEMPLATES.map(tmpl => (
          <div 
            key={tmpl.id} 
            onClick={() => setActiveTemplate(activeTemplate === tmpl.id ? null : tmpl.id)}
            className={`cursor-pointer rounded-xl border transition-all duration-200 overflow-hidden ${
              activeTemplate === tmpl.id 
              ? 'border-brand-500 ring-1 ring-brand-500 bg-brand-50 dark:bg-brand-900/10' 
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-brand-300'
            }`}
          >
            <div className="p-5">
               <div className="flex justify-between items-center mb-2">
                 <h3 className="font-bold text-lg text-gray-900 dark:text-white">{tmpl.title}</h3>
                 <Volume2 className="h-4 w-4 text-gray-400" />
               </div>
               <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{tmpl.category}</span>
            </div>
            
            {activeTemplate === tmpl.id && (
              <div className="bg-white dark:bg-gray-800 border-t border-brand-200 dark:border-brand-800/30 p-4 space-y-3">
                 {tmpl.phrases.map((phrase, idx) => (
                   <div key={idx} className="group">
                     <p className="font-medium text-brand-800 dark:text-brand-200">{phrase.german}</p>
                     <p className="text-sm text-gray-500">{phrase.russian}</p>
                   </div>
                 ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Conditional Rendering: If a topic is selected, show Translation Trainer */}
      {selectedCategoryTitle ? (
        <TranslationTrainer category={selectedCategoryTitle} />
      ) : (
        <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl text-center border border-dashed border-gray-300 dark:border-gray-700 text-gray-500">
           👆 Выберите категорию выше, чтобы открыть тренировку перевода с ИИ.
        </div>
      )}

      {/* General Sentence Checker */}
      <SentenceChecker />
    </div>
  );
};


// --- Main App Component ---

const App = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setCheckingAuth(false);
  }, []);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
  };

  if (checkingAuth) {
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-900"></div>;
  }

  if (!user) {
    return <Auth onLogin={setUser} />;
  }

  return (
    <Router>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Dashboard user={user} />} />
          <Route path="/section/:sectionId" element={<SectionView />} />
          <Route path="/learn/:id" element={<LessonView />} />
          <Route path="/dictionary" element={<Dictionary />} />
          <Route path="/speaking" element={<SpeakingPractice />} />
          <Route path="/progress" element={<ProgressView />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
