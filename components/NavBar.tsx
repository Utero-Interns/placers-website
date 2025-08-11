'use client';

import Image from "next/image";
import { Globe, ShoppingCart } from 'lucide-react';

export default function NavBar() {
    return (
        <nav className="flex items-center justify-between lg:px-2 xl:px-7 2xl:px-14 lg:pt-6 xl:pt-8 2xl:pt-[74px] lg:pb-2 xl:pb-3 2xl:pb-1">
            {/* Left: Logo */}  
            <div className="flex items-center lg:space-x-8 xl:space-x-14 2xl:space-x-24">
                <Image
                    src="/placers-logo.png"
                    alt="Placers Logo"
                    width={176}
                    height={0}
                    className="h-auto lg:-mt-5 xl:-mt-8 2xl:-mt-12 lg:w-[80px] xl:w-[110px] 2xl:w-[176px]"
                />

                <ul className="flex lg:space-x-3 xl:space-x-8 2xl:space-x-12">
                    <li>
                        <a href="/" className="text-gray-700 font-medium lg:text-sm xl:text-base 2xl:text-2xl hover:text-[var(--color-primary)]">Beranda</a>
                    </li>
                    <li className="relative group">
                        <button className="text-gray-700 font-medium lg:text-sm xl:text-base 2xl:text-2xl hover:text-[var(--color-primary)]">Populer</button>
                        <ul className="absolute left-0 mt-2 w-40 bg-white border rounded shadow-md opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 transform -translate-y-2 invisible group-hover:visible z-10">
                            <li>
                                <a href="/news" className="block px-4 py-2 text-gray-700 hover:bg-red-100">News</a>
                            </li>
                            <li>
                                <a href="/updates" className="block px-4 py-2 text-gray-700 hover:bg-red-100">Promos</a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="/" className="text-gray-700 font-medium lg:text-sm xl:text-base 2xl:text-2xl hover:text-[var(--color-primary)]">Upgrade ke Seller</a>
                    </li>
                </ul>
            </div>

            {/* Right: Language, Cart, Button */}
            <div className="flex items-center lg:space-x-3 xl:space-x-6 2xl:space-x-9">
                {/* Language Dropdown */}
                <div className="relative group">
                    <button className="flex items-center gap-1 text-gray-700 hover:text-[var(--color-primary)]">
                        <Globe className="lg:w-4 xl:w-6 2xl:w-10 lg:h-4 xl:h-6 2xl:h-10" />
                    </button>
                    <ul className="absolute left-0 mt-2 w-40 bg-white border rounded shadow-md opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 transform -translate-y-2 invisible group-hover:visible z-10">
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
                </div>

                {/* Cart Icon */}
                <a href="/cart" className="text-gray-700 hover:text-[var(--color-primary)]">
                    <ShoppingCart className="lg:w-4 xl:w-6 2xl:w-10 lg:h-4 xl:h-6 2xl:h-10" />
                </a>

                {/* Daftar Button */}
                <a
                    href="/register"
                    className="bg-[var(--color-primary)] lg:text-sm xl:text-base 2xl:text-2xl text-white lg:px-1 xl:px-2 2xl:px-4 lg:py-0.5 xl:py-1 2xl:py-2 lg:rounded-sm xl:rounded-xl 2xl:rounded-2xl font-medium hover:bg-gray-200 hover:text-[var(--color-primary)] transition lg:w-16 xl:w-28 2xl:w-40 lg:h-6 xl:h-10 2xl:h-16 flex items-center justify-center"
                >
                    Daftar
                </a>
            </div>
        </nav>
    );
}
