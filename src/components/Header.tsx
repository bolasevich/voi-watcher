'use client';

import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';

const Header = () => {
  return (
    <header className='bg-white dark:bg-gray-800 shadow-md'>
      <div className='max-w-7xl mx-auto px-6 py-4 flex items-center justify-between'>
        <Link
          href='/'
          className='text-2xl font-bold text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors flex items-center gap-2 group'
        >
          <svg
            className='w-8 h-8 stroke-current group-hover:rotate-12 transition-transform duration-300'
            viewBox='0 0 24 24'
            fill='none'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <circle cx='10' cy='10' r='7' />
            <line x1='15.5' y1='15.5' x2='21' y2='21' />
          </svg>
          <span className='bg-gradient-to-r from-purple-600 to-blue-500 dark:from-purple-400 dark:to-blue-300 bg-clip-text text-transparent'>
            Voi Watcher
          </span>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
