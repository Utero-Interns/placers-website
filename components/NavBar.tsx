'use client';

import Image from "next/image";
import { Globe, Menu, X, ChevronDown, TicketPercent, Newspaper } from 'lucide-react';
import { useState } from "react";

export default function NavBar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isPopulerOpen, setIsPopulerOpen] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);

    // Function to close all mobile dropdowns
    const closeAllDropdowns = () => {
        setIsPopulerOpen(false);
        setIsLangOpen(false);
    };

    // Toggle main menu and reset dropdowns
    const toggleMenu = () => {
        if (isMenuOpen) {
            closeAllDropdowns();
        }
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="flex items-center justify-between lg:px-2 xl:px-7 2xl:px-14 lg:pt-6 xl:pt-8 2xl:pt-[74px] lg:pb-2 xl:pb-3 2xl:pb-1 p-4 relative">
            {/* Left: Logo and Desktop Menu */}
            <div className="flex items-center lg:space-x-8 xl:space-x-14 2xl:space-x-24">
                <Image
                    src="/placers-logo.png"
                    alt="Placers Logo"
                    width={176}
                    height={0}
                    className="h-auto w-20 md:w-24 lg:w-[80px] xl:w-[110px] 2xl:w-[176px] lg:-mt-5 xl:-mt-8 2xl:-mt-12"
                />

                {/* Desktop Menu */}
                <ul className="hidden lg:flex lg:space-x-3 xl:space-x-8 2xl:space-x-12">
                    <li>
                        <a href="/" className="text-gray-700 font-medium lg:text-sm xl:text-base 2xl:text-2xl hover:text-[var(--color-primary)]">Beranda</a>
                    </li>
                    <li className="relative group">
                        <button className="flex items-center gap-1 text-gray-700 font-medium lg:text-sm xl:text-base 2xl:text-2xl hover:text-[var(--color-primary)] group-hover:text-[var(--color-primary)]">
                            Populer
                            <ChevronDown className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:rotate-180" />
                        </button>
                        {/* Dropdown */}
                        <ul className="absolute left-0 mt-3 w-44 bg-white rounded-2xl shadow-lg opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 transform -translate-y-2 invisible group-hover:visible z-10 p-3"> {/*border border-[0.5px] border-[#A5A5A5]*/}
                            {/* Item Promo */}
                            <li className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-red-50 cursor-pointer">
                                {/* Icon placeholder */}
                                <TicketPercent className="w-5 h-5 text-gray-700" />
                                <a href="/promo" className="text-gray-800 font-medium">Promo</a>
                            </li>

                            {/* Item Blog */}
                            <li className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-red-50 cursor-pointer">
                                {/* Icon placeholder */}
                                <Newspaper className="w-5 h-5 text-gray-700" />
                                <a href="/blog" className="text-gray-800 font-medium">Blog</a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="/" className="text-gray-700 font-medium lg:text-sm xl:text-base 2xl:text-2xl hover:text-[var(--color-primary)]">Upgrade ke Seller</a>
                    </li>
                </ul>
            </div>

            {/* Right: Desktop Icons and Button */}
            <div className="hidden lg:flex items-center lg:space-x-3 xl:space-x-6 2xl:space-x-9">
                {/* Language Dropdown */}
                <div className="relative group">
                    <button className="flex items-center gap-1 text-gray-700 font-medium lg:text-sm xl:text-base 2xl:text-2xl hover:text-[var(--color-primary)] group-hover:text-[var(--color-primary)]">
                        <Globe className="lg:w-4 xl:w-6 2xl:w-10 lg:h-4 xl:h-6 2xl:h-10" />
                        <ChevronDown className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:rotate-180" />
                    </button>
                    {/* Dropdown */}
                    <ul className="absolute right-0 mt-3 w-44 bg-white rounded-2xl shadow-lg opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 transform -translate-y-2 invisible group-hover:visible z-10 p-3">
                        <li className="px-3 py-2 rounded-xl hover:bg-red-50 cursor-pointer">
                            <a href="/lang/en" className="text-gray-800 font-medium">English</a>
                        </li>
                        <li className="px-3 py-2 rounded-xl hover:bg-red-50 cursor-pointer">
                            <a href="/lang/id" className="text-gray-800 font-medium">Bahasa Indonesia</a>
                        </li>
                    </ul>
                </div>

                {/* Daftar Button */}
                <a
                    href="/register"
                    className="bg-[var(--color-primary)] lg:text-sm xl:text-base 2xl:text-2xl text-white lg:px-1 xl:px-2 2xl:px-4 lg:py-0.5 xl:py-1 2xl:py-2 lg:rounded-sm xl:rounded-xl 2xl:rounded-2xl font-medium hover:bg-gray-200 hover:text-[var(--color-primary)] transition lg:w-16 xl:w-28 2xl:w-40 lg:h-6 xl:h-10 2xl:h-16 flex items-center justify-center"
                >
                    Daftar
                </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center">
                <button onClick={toggleMenu}>
                    {isMenuOpen ? <X className="w-6 h-6 text-black" /> : <Menu className="w-6 h-6 text-black" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-md z-20">
                    <ul className="flex flex-col items-center space-y-2 p-4">
                        <li className="w-full">
                            <a href="/" className="block text-center p-2 text-gray-700 font-medium text-lg hover:text-[var(--color-primary)]">Beranda</a>
                        </li>
                        {/* Mobile Populer Dropdown */}
                        <li className="w-full text-center">
                            <button
                                onClick={() => setIsPopulerOpen(!isPopulerOpen)}
                                className="flex items-center justify-center w-full p-2 text-gray-700 font-medium text-lg hover:text-[var(--color-primary)]"
                            >
                                Populer
                                <ChevronDown className={`w-5 h-5 ml-1 transition-transform duration-200 ${isPopulerOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isPopulerOpen && (
                                <ul className="mt-2 w-full bg-gray-50 border rounded shadow-inner">
                                    <li>
                                        <a href="/news" className="block px-4 py-2 text-gray-700 hover:bg-red-100">News</a>
                                    </li>
                                    <li>
                                        <a href="/updates" className="block px-4 py-2 text-gray-700 hover:bg-red-100">Promos</a>
                                    </li>
                                </ul>
                            )}
                        </li>
                        <li className="w-full">
                            <a href="/" className="block text-center p-2 text-gray-700 font-medium text-lg hover:text-[var(--color-primary)]">Upgrade ke Seller</a>
                        </li>

                        <li className="w-full border-t pt-4 mt-2 flex flex-col items-center space-y-4">
                             {/* Mobile Language Dropdown */}
                            <div className="w-full text-center">
                                <button
                                    onClick={() => setIsLangOpen(!isLangOpen)}
                                    className="flex items-center justify-center w-full p-2 text-gray-700 font-medium text-lg hover:text-[var(--color-primary)]"
                                >
                                    <Globe className="w-6 h-6 mr-2" />
                                    Bahasa
                                    <ChevronDown className={`w-5 h-5 ml-1 transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {isLangOpen && (
                                    <ul className="mt-2 w-full bg-gray-50 border rounded shadow-inner">
                                        <li>
                                            <a href="/lang/en" className="block px-4 py-2 text-gray-700 hover:bg-red-100">
                                                English
                                            </a>
                                        </li>
                                        <li>
                                            <a href="/lang/id" className="block px-4 py-2 text-gray-700 hover:bg-red-100">
                                                Bahasa Indonesia
                                            </a>
                                        </li>
                                    </ul>
                                )}
                            </div>

                            {/* Daftar Button */}
                            <a
                                href="/register"
                                className="bg-[var(--color-primary)] text-lg text-white px-4 py-2 rounded-xl font-medium hover:bg-gray-200 hover:text-[var(--color-primary)] transition w-full h-12 flex items-center justify-center"
                            >
                                Daftar
                            </a>
                        </li>
                    </ul>
                </div>
            )}
        </nav>
    );
}