'use client';

import { ArrowLeft, Award, Calendar, Mail, Phone } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { authService } from '../../../lib/auth';
import { getImageUrl } from '../../../lib/utils';

interface UserDetail {
    id: string;
    username: string;
    email: string;
    phone: string;
    level: string;
    provider: string;
    profilePicture: string;
    createdAt: string;
    updatedAt: string;
    seller: any;
}

const SIDEBAR_ITEMS = [
    'Dashboard', 'Users', 'Sellers', 'Billboards',
    'Transactions', 'Categories', 'Designs',
    'Add-ons', 'Ratings', 'Notifications'
];

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [user, setUser] = useState<UserDetail | null>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Unwrap params
    const { id } = use(params);

    useEffect(() => {
        const init = async () => {
            try {
                // 1. Fetch Current Admin User
                const profileRes = await authService.getProfile();
                if (profileRes.user) {
                    setCurrentUser(profileRes.user);
                }

                // 2. Fetch Target User Detail
                const res = await fetch(`/api/proxy/user/${id}`, {
                    credentials: 'include'
                });
                const json = await res.json();

                if (json.status && json.data) {
                    setUser(json.data);
                } else {
                    setError(json.message || 'Failed to fetch user');
                }
            } catch (err) {
                setError('Network error or invalid response');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            init();
        }
    }, [id]);

    const handleLogout = async () => {
        await authService.logout();
        window.location.href = '/login';
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
                <p className="text-red-500 text-lg font-medium">{error || 'User not found'}</p>
                <Link href="/admin/dashboard" className="text-blue-600 hover:underline">
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="admin-container font-sans text-[#1e293b]">
            <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    PLACERS ADMIN
                </div>
                <nav className="sidebar-nav">
                    {SIDEBAR_ITEMS.map((item) => (
                        <div
                            key={item}
                            className={`nav-item ${item === 'Users' ? 'active' : ''}`}
                            onClick={() => router.push('/admin/dashboard')} // Simple navigation back to dashboard for now
                        >
                            {item}
                        </div>
                    ))}
                </nav>
            </aside>

            <main className="main-content">
                <header className="top-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button className="mobile-toggle" onClick={toggleSidebar}>☰</button>
                        <h1 className="page-title">User Details</h1>
                    </div>
                    <div className="user-menu" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span className="font-medium text-sm text-slate-600">
                            Hello, {currentUser?.username || 'Admin'}
                        </span>
                        <button onClick={handleLogout} className="btn btn-outline btn-sm">Logout</button>
                    </div>
                </header>

                <div id="content-area">
                    {/* Breadcrumb / Back */}
                    <div className="mb-6">
                        <Link
                            href="/admin/dashboard"
                            className="inline-flex items-center text-slate-500 hover:text-red-600 transition-colors text-sm font-medium"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Users
                        </Link>
                    </div>

                    {/* Main Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden animate-slide-up">
                        {/* Cover / Top Section */}
                        <div className="h-32 bg-gradient-to-r from-red-500 to-red-700 relative">
                            <div className="absolute -bottom-12 left-8">
                                <div className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-gray-200 overflow-hidden">
                                    <img
                                        src={getImageUrl(user.profilePicture)}
                                        alt={user.username}
                                        className="w-full h-full object-cover"
                                        onError={(e) => (e.currentTarget.src = 'https://ui-avatars.com/api/?name=' + user.username)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-16 pb-8 px-8">
                            <div className="flex justify-between items-start flex-wrap gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">{user.username}</h2>
                                    <p className="text-slate-500 text-sm mt-1">ID: {user.id}</p>
                                </div>
                                <div className="flex gap-2">
                                    <span className={`badge ${user.level === 'ADMIN' ? 'badge-info' : user.level === 'SELLER' ? 'badge-warning' : 'badge-success'}`}>
                                        {user.level}
                                    </span>
                                    <span className="badge badge-neutral">
                                        {user.provider}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Contact Info */}
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2">Contact Information</h3>

                                    <div className="flex items-center gap-4 text-slate-700">
                                        <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Email Address</p>
                                            <p className="font-medium">{user.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 text-slate-700">
                                        <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Phone Number</p>
                                            <p className="font-medium">{user.phone || 'Not provided'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Account Details */}
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2">Account Details</h3>

                                    <div className="flex items-center gap-4 text-slate-700">
                                        <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                                            <Calendar className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Joined Date</p>
                                            <p className="font-medium">{new Date(user.createdAt).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}</p>
                                        </div>
                                    </div>

                                    {user.seller && (
                                        <div className="flex items-center gap-4 text-slate-700">
                                            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                                <Award className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Seller Profile</p>
                                                <p className="font-medium">Active Seller</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                            <button className="btn btn-outline bg-white">
                                Edit User
                            </button>
                            <button className="btn btn-primary bg-red-600 border-none hover:bg-red-700 scale-[1.01] shadow-xl shadow-red-200">
                                Delete User
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
