'use client';

import Image from "next/image";
import { Globe, ShoppingCart } from 'lucide-react';

export default function NavBar() {
    return (
        <nav className="flex items-center justify-between px-20 pt-[74px] pb-14">
      {/* Left: Logo */}  
        <div className="flex items-center space-x-24">
          <Image
            src="/placers-logo.png"
            alt="Placers Logo"
            width={176}
            height={0}
            className="h-auto -mt-12"
          />

          <ul className="flex space-x-12">
            <li>
              <a href="/" className="text-gray-700 font-medium text-2xl hover:text-[--color-primary]">Beranda</a>
            </li>
            <li className="relative group">
              <button className="text-gray-700 font-medium text-2xl hover:text-[--color-primary]">Populer</button>
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
              <a href="/" className="text-gray-700 font-medium text-2xl hover:text-[--color-primary]">Upgrade ke Seller</a>
            </li>
          </ul>
        </div>


        {/* Right: Language, Cart, Button */}
        <div className="flex items-center space-x-9">
          {/* Language Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1 text-gray-700 hover:text-[--color-primary]">
              <Globe className="w-10 h-10" />
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
          <a href="/cart" className="text-gray-700 hover:text-[--color-primary]">
            <ShoppingCart className="w-10 h-10" />
          </a>

          {/* Daftar Button */}
          <a
            href="/register"
            className="bg-red-600 text-2xl text-white px-4 py-2 rounded-2xl font-medium hover:bg-red-700 transition w-40 h-16 flex items-center justify-center"
          >
            Daftar
          </a>
        </div>
      </nav>
    );
}