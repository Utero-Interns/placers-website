'use client';

import { authService, User } from "@/app/lib/auth";
import { Bookmark, ChevronDown, History, LayoutDashboard, LogOut, Menu, Newspaper, TicketPercent, User as UserIcon, X } from 'lucide-react';
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function NavBar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isPopulerOpen, setIsPopulerOpen] = useState(false);

    
    // Auth state
    const [user, setUser] = useState<User | null>(null);

    const pathname = usePathname() ?? '/';
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const result = await authService.getProfile();
            if (result.user) {
                setUser(result.user);

            }
        };
        checkAuth();
    }, []);

    const handleLogout = async () => {
        await authService.logout();
        setUser(null);
        toast.success("Berhasil logout");
        router.push('/login');
        router.refresh();
    };

    // Helper to check active active link
    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    // Parent "Populer" is active if any child page is active
    const isPopulerActive = isActive('/promo') || isActive('/blog');

    // Function to close all mobile dropdowns
    const closeAllDropdowns = () => {
        setIsPopulerOpen(false);
    };


    // Toggle main menu and reset dropdowns
    const toggleMenu = () => {
        if (isMenuOpen) {
            closeAllDropdowns();
        }
        setIsMenuOpen(!isMenuOpen);
    };

    // NOTE: remove default text color from base class and apply text color conditionally
    const baseNoColor = "font-medium lg:text-sm xl:text-base 2xl:text-2xl hover:text-[var(--color-primary)]";
    const activeClass = "text-[var(--color-primary)]";

    return (
        <nav className="flex items-center justify-between lg:px-2 xl:px-7 2xl:px-14 lg:pt-6 xl:pt-8 2xl:pt-[74px] lg:pb-2 xl:pb-3 2xl:pb-1 p-4 relative">
            {/* Left: Logo and Desktop Menu */}
            <div className="flex items-center lg:space-x-8 xl:space-x-14 2xl:space-x-24">
                <Link href="/">
                    <Image
                        src="/placers-logo.png"
                        alt="Placers Logo"
                        width={176}
                        height={0}
                        className="h-auto w-20 md:w-24 lg:w-[80px] xl:w-[110px] 2xl:w-[176px] lg:-mt-5 xl:-mt-8 2xl:-mt-12"
                    />
                </Link>

                {/* Desktop Menu */}
                <ul className="hidden lg:flex lg:space-x-3 xl:space-x-8 2xl:space-x-12">
                    <li>
                        <Link href="/homepage" className={`${baseNoColor} ${isActive('/homepage') ? activeClass : 'text-gray-700'}`}>Beranda</Link>
                    </li>
                    <li>
                        <Link href="/dashboard" className={`${baseNoColor} ${isActive('/dashboard') ? activeClass : 'text-gray-700'}`}>Dashboard</Link>
                    </li>
                    <li className="relative group">
                        <button className={`flex items-center gap-1 ${baseNoColor} ${isPopulerActive ? activeClass : 'text-gray-700'} group-hover:text-[var(--color-primary)]`}>
                            Populer
                            <ChevronDown className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:rotate-180" />
                        </button>
                        {/* Dropdown */}
                        <ul className="absolute left-0 mt-3 w-44 bg-white rounded-2xl shadow-lg opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 transform -translate-y-2 invisible group-hover:visible z-10 p-3">
                            {/* Item Promo */}
                            <li className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-red-50 cursor-pointer">
                                <TicketPercent className="w-5 h-5 text-gray-700" />
                                <Link href="/promo" className={`font-medium ${isActive('/promo') ? activeClass : 'text-gray-800'}`}>Promo</Link>
                            </li>

                            {/* Item Blog */}
                            <li className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-red-50 cursor-pointer">
                                <Newspaper className="w-5 h-5 text-gray-700" />
                                <Link href="/blog" className={`font-medium ${isActive('/blog') ? activeClass : 'text-gray-800'}`}>Blog</Link>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <Link href="/seller" className={`${baseNoColor} ${isActive('/seller') ? activeClass : 'text-gray-700'}`}>Upgrade ke Seller</Link>
                    </li>
                </ul>
            </div>

            {/* Right: Desktop Icons and Button */}
            <div className="hidden lg:flex items-center lg:space-x-3 xl:space-x-6 2xl:space-x-9">
                {/* Language Dropdown */}

                {/* Auth Button / User Menu */}
                {user ? (
                    <div className="relative group">
                        <button className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors">
                             {/* User Icon */}
                             <div className="w-8 h-8 xl:w-10 xl:h-10 2xl:w-12 2xl:h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border border-gray-300">
                                {user.profilePicture ? (
                                    <Image src={`/api/uploads/${user.profilePicture.replace(/^uploads\//, "")}`} alt="Profile" width={48} height={48} className="w-full h-full object-cover" />
                                ) : (
                                    <UserIcon className="w-5 h-5 xl:w-6 xl:h-6 text-gray-600" />
                                )}
                             </div>
                             <ChevronDown className="w-4 h-4 text-gray-600 transition-transform duration-200 group-hover:rotate-180" />
                        </button>
                        
                        {/* User Dropdown */}
                        <ul className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-lg opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 transform -translate-y-2 invisible group-hover:visible z-10 p-2 border border-gray-100">
                             <li className="px-4 py-2 border-b mb-1">
                                <p className="font-semibold text-gray-800 truncate">{user.username || 'User'}</p>
                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                             </li>
                             
                             {user.level === 'ADMIN' ? (
                                <li className="rounded-xl hover:bg-red-50 cursor-pointer">
                                    <Link href="/admin/dashboard" className="flex items-center gap-2 px-3 py-2 text-gray-700 font-medium">
                                        <LayoutDashboard className="w-4 h-4" />
                                        Dashboard
                                    </Link>
                                </li>
                             ) : (
                                <>
                                    <li className="rounded-xl hover:bg-red-50 cursor-pointer">
                                        <Link href="/order-history" className="flex items-center gap-2 px-3 py-2 text-gray-700 font-medium">
                                            <History className="w-4 h-4" />
                                            History
                                        </Link>
                                    </li>
                                    <li className="rounded-xl hover:bg-red-50 cursor-pointer">
                                        <Link href="/bookmark" className="flex items-center gap-2 px-3 py-2 text-gray-700 font-medium">
                                            <Bookmark className="w-4 h-4" />
                                            Bookmark
                                        </Link>
                                    </li>
                                    <li className="rounded-xl hover:bg-red-50 cursor-pointer">
                                        <Link href="/profile" className="flex items-center gap-2 px-3 py-2 text-gray-700 font-medium">
                                            <UserIcon className="w-4 h-4" />
                                            Profile
                                        </Link>
                                    </li>
                                </>
                             )}

                             <li className="my-1 border-t"></li>
                             <li className="rounded-xl hover:bg-red-50 cursor-pointer" onClick={handleLogout}>
                                <button className="flex w-full items-center gap-2 px-3 py-2 text-red-600 font-medium cursor-pointer">
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                             </li>
                        </ul>
                    </div>
                ) : (
                    <a
                        href="/register"
                        className="bg-[var(--color-primary)] lg:text-sm xl:text-base 2xl:text-2xl text-white lg:px-1 xl:px-2 2xl:px-4 lg:py-0.5 xl:py-1 2xl:py-2 lg:rounded-sm xl:rounded-xl 2xl:rounded-2xl font-medium hover:bg-gray-200 hover:text-[var(--color-primary)] transition lg:w-16 xl:w-28 2xl:w-40 lg:h-6 xl:h-10 2xl:h-16 flex items-center justify-center"
                    >
                        Daftar
                    </a>
                )}
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
                            <Link href="/homepage" className={`block text-center p-2 font-medium text-lg hover:text-[var(--color-primary)] ${isActive('/homepage') ? activeClass : 'text-gray-700'}`}>Beranda</Link>
                        </li>
                        <li className="w-full">
                            <Link href="/dashboard" className={`block text-center p-2 font-medium text-lg hover:text-[var(--color-primary)] ${isActive('/dashboard') ? activeClass : 'text-gray-700'}`}>Dashboard</Link>
                        </li>
                        {/* Mobile Populer Dropdown */}
                        <li className="w-full text-center">
                            <button
                                onClick={() => setIsPopulerOpen(!isPopulerOpen)}
                                className={`flex items-center justify-center w-full p-2 font-medium text-lg hover:text-[var(--color-primary)] ${isPopulerActive ? activeClass : 'text-gray-700'}`}
                            >
                                Populer
                                <ChevronDown className={`w-5 h-5 ml-1 transition-transform duration-200 ${isPopulerOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isPopulerOpen && (
                                <ul className="mt-2 w-full bg-gray-50 border rounded shadow-inner">
                                    <li>
                                        <Link href="/promo" className={`block px-4 py-2 hover:bg-red-100 ${isActive('/promo') ? activeClass : 'text-gray-700'}`}>Promo</Link>
                                    </li>
                                    <li>
                                        <Link href="/blog" className={`block px-4 py-2 hover:bg-red-100 ${isActive('/blog') ? activeClass : 'text-gray-700'}`}>Blog</Link>
                                    </li>
                                </ul>
                            )}
                        </li>
                        <li className="w-full">
                            <Link href="/seller" className={`block text-center p-2 font-medium text-lg hover:text-[var(--color-primary)] ${isActive('/seller') ? activeClass : 'text-gray-700'}`}>Upgrade ke Seller</Link>
                        </li>

                        <li className="w-full border-t pt-4 mt-2 flex flex-col items-center space-y-4">


                            {/* Mobile Auth Section */}
                            {user ? (
                                <div className="w-full">
                                    <div className="flex items-center justify-center gap-3 p-2 bg-gray-50 rounded-xl mb-2">
                                         <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                                            {user.profilePicture ? (
                                                <Image src={`/api/uploads/${user.profilePicture.replace(/^uploads\//, "")}`} alt="Profile" width={40} height={40} className="w-full h-full object-cover" />
                                            ) : (
                                                <UserIcon className="w-6 h-6 text-gray-600" />
                                            )}
                                         </div>
                                         <div className="text-left">
                                            <p className="font-semibold text-gray-800 text-sm">{user.username}</p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                         </div>
                                    </div>
                                    <ul className="space-y-1">
                                         {user.level === 'ADMIN' ? (
                                            <li>
                                                <Link href="/admin/dashboard" className="flex items-center justify-center gap-2 p-2 text-gray-700 hover:bg-red-50 rounded-lg">
                                                    <LayoutDashboard className="w-5 h-5" /> Dashboard
                                                </Link>
                                            </li>
                                         ) : (
                                            <>
                                                <li>
                                                    <Link href="/order-history" className="flex items-center justify-center gap-2 p-2 text-gray-700 hover:bg-red-50 rounded-lg">
                                                        <History className="w-5 h-5" /> History
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link href="/bookmark" className="flex items-center justify-center gap-2 p-2 text-gray-700 hover:bg-red-50 rounded-lg">
                                                        <Bookmark className="w-5 h-5" /> Bookmark
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link href="/profile" className="flex items-center justify-center gap-2 p-2 text-gray-700 hover:bg-red-50 rounded-lg">
                                                        <UserIcon className="w-5 h-5" /> Profile
                                                    </Link>
                                                </li>
                                            </>
                                         )}
                                         <li>
                                            <button onClick={handleLogout} className="flex w-full items-center justify-center gap-2 p-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer">
                                                <LogOut className="w-5 h-5" /> Logout
                                            </button>
                                         </li>
                                    </ul>
                                </div>
                            ) : (
                                <a
                                    href="/register"
                                    className="bg-[var(--color-primary)] text-lg text-white px-4 py-2 rounded-xl font-medium hover:bg-gray-200 hover:text-[var(--color-primary)] transition w-full h-12 flex items-center justify-center"
                                >
                                    Daftar
                                </a>
                            )}
                        </li>
                    </ul>
                </div>
            )}
        </nav>
    );
}
