

import React, { useState, useEffect } from 'react';
import { generateQuiz, playPronunciation } from '../services/geminiService';
import { Topic, QuizQuestion } from '../types';
import { Loader2, CheckCircle2, XCircle, RefreshCw, Volume2, Type, Check, X } from 'lucide-react';

interface QuizProps {
  topic: Topic;
  onComplete: (score: number, total: number) => void;
}

export const Quiz: React.FC<QuizProps> = ({ topic, onComplete }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQ, setCurrentQ] = useState(0);
  
  // State for different answer types
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [textAnswer, setTextAnswer] = useState<string>('');

  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [playingAudio, setPlayingAudio] = useState(false);

  useEffect(() => {
    loadQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic]);

  const loadQuiz = async () => {
    setLoading(true);
    setQuizFinished(false);
    setCurrentQ(0);
    setScore(0);
    setSelectedOption(null);
    setTextAnswer('');
    setShowExplanation(false);
    setIsCorrect(false);
    const qs = await generateQuiz(topic.title, topic.level, topic.category);
    setQuestions(qs);
    setLoading(false);
  };

  const handlePlayQuestion = async (text: string) => {
    if (playingAudio) return;
    setPlayingAudio(true);
    await playPronunciation(text);
    setPlayingAudio(false);
  }

  const handleOptionClick = (index: number) => {
    if (showExplanation) return;
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    const q = questions[currentQ];
    let correct = false;

    if (q.type === 'fill-gap') {
       if (!textAnswer.trim()) return;
       // Case insensitive comparison for text
       const userAnswerClean = textAnswer.trim().toLowerCase();
       const correctAnswerClean = (q.correctAnswerText || '').toLowerCase();
       correct = userAnswerClean === correctAnswerClean;
    } else {
       if (selectedOption === null) return;
       correct = selectedOption === q.correctIndex;
    }
    
    setIsCorrect(correct);
    if (correct) setScore(s => s + 1);
    
    setShowExplanation(true);
  };

  const handleNext = () => {
    const isLastQuestion = currentQ === questions.length - 1;
    
    if (!isLastQuestion) {
      setShowExplanation(false);
      setSelectedOption(null);
      setTextAnswer('');
      setIsCorrect(false);
      setCurrentQ(c => c + 1);
    } else {
      setQuizFinished(true);
      onComplete(score, questions.length);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-gray-500">
        <Loader2 className="animate-spin h-10 w-10 mb-4 text-brand-500" />
        <p>AI генерирует уникальный тест...</p>
      </div>
    );
  }

  if (quizFinished) {
    const percentage = questions.length ? Math.round((score / questions.length) * 100) : 0;
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-2xl font-bold mb-4 dark:text-white">Тест завершен!</h3>
        <div className="text-6xl font-black text-brand-500 mb-6">{percentage}%</div>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          Вы ответили правильно на {score} из {questions.length} вопросов.
        </p>
        <button 
          onClick={loadQuiz}
          className="inline-flex items-center px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition"
        >
          <RefreshCw className="mr-2 h-5 w-5" />
          Попробовать снова
        </button>
      </div>
    );
  }

  const q = questions[currentQ];
  const isListening = topic.category === 'Listening';

  if (!q) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-xl font-bold mb-3 dark:text-white">Не удалось собрать тест</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Попробуйте загрузить вопросы ещё раз. Если AI вернул неполные данные, мы запросим новый набор.
        </p>
        <button
          onClick={loadQuiz}
          className="inline-flex items-center px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition"
        >
          <RefreshCw className="mr-2 h-5 w-5" />
          Загрузить заново
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 h-2">
        <div 
          className="bg-brand-500 h-2 transition-all duration-300" 
          style={{ width: `${((currentQ) / questions.length) * 100}%` }}
        ></div>
      </div>

      <div className="p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
           <span className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
             Вопрос {currentQ + 1} из {questions.length}
           </span>
           <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-bold text-gray-500 dark:text-gray-300 uppercase">
             {q.type === 'fill-gap' ? 'Заполнить пропуск' : q.type === 'true-false' ? 'Верно / Неверно' : 'Выбор ответа'}
           </span>
        </div>
        
        {/* Context for Reading/Listening if available textually */}
        {q.context && (
            <div className="mb-6 p-5 bg-gray-50 dark:bg-gray-700/30 rounded-lg border-l-4 border-brand-500 italic text-gray-700 dark:text-gray-300 text-lg leading-relaxed font-serif">
              "{q.context}"
            </div>
        )}

        <div className="flex items-start gap-4 mt-2 mb-6">
          {isListening && (
            <button 
              onClick={() => handlePlayQuestion(q.question)}
              className="p-3 bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-300 rounded-full hover:bg-brand-200 transition-colors flex-shrink-0"
              title="Прослушать"
            >
              {playingAudio ? <Loader2 className="animate-spin h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
            </button>
          )}
          <h3 className="text-xl md:text-2xl font-bold dark:text-white leading-relaxed">
            {q.question.replace('___', '________')}
          </h3>
        </div>

        {/* --- ANSWER AREA BASED ON TYPE --- */}
        <div className="space-y-4">
          
          {/* 1. Multiple Choice & True/False (Button Selection) */}
          {(q.type === 'multiple-choice' || q.type === 'true-false') && (
            <div className={`grid ${q.type === 'true-false' ? 'grid-cols-2 gap-4' : 'grid-cols-1 gap-3'}`}>
              {q.options.map((opt, idx) => {
                let className = "w-full text-left p-4 rounded-lg border-2 transition-all duration-200 flex items-center justify-between ";
                
                // Styling based on state
                if (showExplanation) {
                  if (idx === q.correctIndex) {
                    className += "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300";
                  } else if (idx === selectedOption) {
                    className += "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300";
                  } else {
                    className += "border-gray-200 dark:border-gray-700 opacity-50";
                  }
                } else {
                  if (selectedOption === idx) {
                    className += "border-brand-500 bg-brand-50 dark:bg-brand-900/20 ring-1 ring-brand-500 dark:text-white";
                  } else {
                    className += "border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-gray-500 dark:text-gray-200";
                  }
                }

                return (
                  <button 
                    key={idx}
                    disabled={showExplanation}
                    onClick={() => handleOptionClick(idx)}
                    className={className}
                  >
                    <span className="font-medium text-lg">{opt}</span>
                    {showExplanation && idx === q.correctIndex && <CheckCircle2 className="h-6 w-6 text-green-600" />}
                    {showExplanation && idx === selectedOption && idx !== q.correctIndex && <XCircle className="h-6 w-6 text-red-600" />}
                  </button>
                );
              })}
            </div>
          )}

          {/* 2. Fill in the Blank (Input Field) */}
          {q.type === 'fill-gap' && (
             <div className="mt-4">
                <div className="relative">
                   <Type className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                   <input 
                     type="text" 
                     value={textAnswer}
                     onChange={(e) => !showExplanation && setTextAnswer(e.target.value)}
                     disabled={showExplanation}
                     placeholder="Введите пропущенное слово..."
                     className={`w-full pl-10 pr-4 py-4 text-lg rounded-lg border-2 bg-gray-50 dark:bg-gray-900 focus:outline-none transition-colors ${
                       showExplanation 
                         ? isCorrect 
                             ? 'border-green-500 text-green-700 dark:text-green-300' 
                             : 'border-red-500 text-red-700 dark:text-red-300'
                         : 'border-gray-300 dark:border-gray-600 focus:border-brand-500 dark:text-white'
                     }`}
                   />
                   {showExplanation && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {isCorrect ? <Check className="text-green-500 h-6 w-6" /> : <X className="text-red-500 h-6 w-6" />}
                      </div>
                   )}
                </div>
                
                {showExplanation && !isCorrect && (
                   <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded-lg border border-green-200 dark:border-green-800 text-sm">
                      Правильный ответ: <strong>{q.correctAnswerText}</strong>
                   </div>
                )}
             </div>
          )}

        </div>

        {/* Explanation Block */}
        {showExplanation && (
          <div className={`mt-6 p-4 rounded-lg border ${isCorrect ? 'bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-800/30' : 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800'}`}>
            <h4 className={`font-bold mb-1 ${isCorrect ? 'text-green-900 dark:text-green-100' : 'text-blue-900 dark:text-blue-100'}`}>
              {isCorrect ? 'Верно!' : 'Объяснение:'}
            </h4>
            <p className={`text-sm leading-relaxed ${isCorrect ? 'text-green-800 dark:text-green-200' : 'text-blue-800 dark:text-blue-200'}`}>
              {q.explanation}
            </p>
          </div>
        )}

        <div className="mt-8 flex justify-end">
          {!showExplanation ? (
             <button
             disabled={q.type === 'fill-gap' ? !textAnswer.trim() : selectedOption === null}
             onClick={handleSubmitAnswer}
             className="px-6 py-3 bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium hover:bg-brand-700 transition shadow-sm"
           >
             Проверить
           </button>
          ) : (
            <button
            onClick={handleNext}
            className="px-6 py-3 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition flex items-center shadow-sm"
          >
            {currentQ < questions.length - 1 ? 'Следующий вопрос' : 'Завершить'}
          </button>
          )}
        </div>
      </div>
    </div>
  );
};
