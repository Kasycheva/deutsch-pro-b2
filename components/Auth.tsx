import React, { useState } from 'react';
import { loginUser, registerUser } from '../services/storageService';
import { UserProfile } from '../types';
import { GraduationCap, ArrowRight, Mail, Lock, User } from 'lucide-react';

interface AuthProps {
  onLogin: (user: UserProfile) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const user = loginUser(email, password);
      if (user) {
        onLogin(user);
      } else {
        setError('Неверный email или пароль');
        setPassword(''); // Clear password on error
      }
    } else {
      if (!name || !email || !password) {
        setError('Пожалуйста, заполните все поля');
        return;
      }
      const user = registerUser(name, email, password);
      if (user) {
        onLogin(user);
      } else {
        setError('Пользователь с таким email уже существует или произошла ошибка при сохранении');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        
        <div className="bg-brand-600 p-8 text-center text-white">
           <div className="flex justify-center mb-4">
             <div className="p-3 bg-white/20 rounded-full">
               <GraduationCap size={40} className="text-white" />
             </div>
           </div>
           <h1 className="text-3xl font-bold">DeutschPro B2</h1>
           <p className="text-brand-100 mt-2">Твой путь к успешной сдаче экзамена</p>
        </div>

        <div className="p-8">
          <div className="flex mb-6 border-b border-gray-200 dark:border-gray-700">
            <button
              className={`flex-1 pb-3 text-center font-medium text-sm transition-colors ${isLogin ? 'text-brand-600 border-b-2 border-brand-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => { setIsLogin(true); setError(''); }}
            >
              Вход
            </button>
            <button
              className={`flex-1 pb-3 text-center font-medium text-sm transition-colors ${!isLogin ? 'text-brand-600 border-b-2 border-brand-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => { setIsLogin(false); setError(''); }}
            >
              Регистрация
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Ваше имя</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:text-white"
                    placeholder="Иван Иванов"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:text-white"
                  placeholder="hello@example.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Пароль</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:text-white"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-200 text-sm rounded-lg text-center animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-lg transition duration-200 mt-6"
            >
              <span>{isLogin ? 'Войти' : 'Создать аккаунт'}</span>
              <ArrowRight size={18} />
            </button>
          </form>
          
          <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
            Прогресс сохраняется автоматически в вашем профиле.
          </p>
        </div>
      </div>
    </div>
  );
}