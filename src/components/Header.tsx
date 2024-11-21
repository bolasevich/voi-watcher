'use client';

import Link from "next/link";

const Header = () => {
    return (
        <header className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold text-purple-600 hover:text-purple-700 transition-colors">
                    Voi Watcher
                </Link>
            </div>
        </header>
    );
};

export default Header;
