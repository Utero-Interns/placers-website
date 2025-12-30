'use client';

import { authService, User } from '@/app/lib/auth';
import { Bookmark, History, Home, LayoutDashboard, LogOut, Menu, Newspaper, TicketPercent, User as UserIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Import Tabs
import BookmarkTab from './components/BookmarkTab';
import DashboardTab from './components/DashboardTab';
import HistoryTab from './components/HistoryTab';
import HomepageTab from './components/HomepageTab';
import ProfileTab from './components/ProfileTab';

type Tab = 'dashboard' | 'history' | 'bookmark' | 'profile' | 'homepage';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await authService.getProfile();
        if (res.error || (!res.user && !res.data)) {
          router.push('/login');
          return;
        }

        const userData = res.user || res.data;
        if (userData?.level === 'ADMIN') {
          router.push('/admin/dashboard');
          return;
        }

        setUser((userData as User) || null);
        setLoading(false);
      } catch (err) {
        console.error("Auth check failed", err);
        router.push('/login');
      }
    };
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await authService.logout();
    router.push('/login');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;
  }

  if (!user) return null;

  const NavItem = ({ id, label, icon: Icon }: { id: Tab, label: string, icon: React.ElementType }) => (
    <button
      onClick={() => {
        setActiveTab(id);
        setSidebarOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
        activeTab === id 
          ? 'bg-red-50 text-red-600' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon size={20} />
      {label}
    </button>
  );

  const LinkItem = ({ href, label, icon: Icon }: { href: string, label: string, icon: React.ElementType }) => (
    <Link
      href={href}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
    >
      <Icon size={20} />
      {label}
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 z-30 w-64 h-screen bg-white border-r border-gray-200 transition-transform transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
           <Link href="/">
             <Image src="/placers-logo.png" alt="Placers" width={150} height={45} className="h-10 w-auto" />
           </Link>
        </div>
        
        <div className="p-4 space-y-2">
           <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Menu
           </div>
           <NavItem id="dashboard" label="Dashboard" icon={LayoutDashboard} />
           <NavItem id="homepage" label="Homepage" icon={Home} />
           <NavItem id="history" label="Order History" icon={History} />
           <NavItem id="bookmark" label="Bookmark" icon={Bookmark} />
           <NavItem id="profile" label="Profile" icon={UserIcon} />
           
           <div className="px-4 py-2 mt-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Discover
           </div>
           <LinkItem href="/" label="Landing Page" icon={LayoutDashboard} />
           <LinkItem href="/promo" label="Promo" icon={TicketPercent} />
           <LinkItem href="/blog" label="Blog" icon={Newspaper} />
        </div>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-10">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
          >
            <Menu size={24} />
          </button>

          <div className="flex items-center gap-4 ml-auto">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium text-gray-900">{user.username}</div>
              <div className="text-xs text-gray-500">{user.email}</div>
            </div>
            <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden border border-gray-300">
               {user.profilePicture ? (
                  <Image 
                    src={`/api/uploads/${user.profilePicture.replace(/^uploads\//, "")}`} 
                    alt="Profile" 
                    width={40} 
                    height={40} 
                    className="w-full h-full object-cover"
                  />
               ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                    <UserIcon size={20} />
                  </div>
               )}
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
           {activeTab === 'dashboard' && <DashboardTab user={user} />}
           {activeTab === 'homepage' && <HomepageTab />}
           {activeTab === 'history' && <HistoryTab />}
           {activeTab === 'bookmark' && <BookmarkTab />}
           {activeTab === 'profile' && <ProfileTab />}
        </div>
      </main>
    </div>
  );
}
