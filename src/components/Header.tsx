import React from 'react';

interface HeaderProps {
  darkMode?: boolean;
  setDarkMode?: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = () => {
  return (
    <header className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 sm:px-8 py-4 transition-colors duration-200 shrink-0 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Title & Tagline Branding */}
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Shell Sort
            </h1>
          </div>
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Created By: <span className="text-slate-900 dark:text-slate-100 font-semibold">Sheeraz Iqbal</span>
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

