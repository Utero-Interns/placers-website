'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Tag, AlignLeft, Calendar, DollarSign, Image as ImageIcon } from 'lucide-react';
import { authService, User } from '@/app/lib/auth';
import { getImageUrl } from '@/app/lib/utils';
import '@/app/admin/dashboard/styles.css';
import Image from 'next/image';

interface DesignDetail {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    createdAt: string;
    updatedAt: string;
}

const SIDEBAR_ITEMS = [
    'Dashboard', 'Users', 'Sellers', 'Billboards',
    'Transactions', 'Categories', 'Designs',
    'Add-ons', 'Ratings', 'Notifications'
];

export default function DesignDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [design, setDesign] = useState<DesignDetail | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
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

                // 2. Fetch Target Design Detail
                // Endpoint: GET http://utero.viewdns.net:3100/design/{id} -> /api/proxy/design/{id}
                const res = await fetch(`/api/proxy/design/${id}`, {
                    credentials: 'include'
                });
                const json = await res.json();

                if (json.status && json.data) {
                    setDesign(json.data);
                } else {
                    setError(json.message || 'Failed to fetch design');
                }
            } catch {
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

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this design?')) return;

        try {
            const res = await fetch(`/api/proxy/design/${id}`, {
                method: 'DELETE'
            });
            const json = await res.json();
            if (json.status) {
                alert('Design deleted successfully');
                router.push('/admin/dashboard');
            } else {
                alert(json.message || 'Failed to delete design');
            }
        } catch (e) {
            console.error(e);
            alert('An error occurred');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        );
    }

    if (error || !design) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
                <p className="text-red-500 text-lg font-medium">{error || 'Design not found'}</p>
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
                            className={`nav-item ${item === 'Designs' ? 'active' : ''}`}
                            onClick={() => router.push('/admin/dashboard')} // Simple navigation back to dashboard
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
                        <h1 className="page-title">Design Details</h1>
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
                            Back to Designs
                        </Link>
                    </div>

                    {/* Main Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden animate-slide-up">
                        {/* Cover / Top Section */}
                        <div className="h-48 bg-gray-100 relative overflow-hidden">
                            {Array.isArray(design.images) && design.images.length > 0 ? (
                                <Image
                                    src={getImageUrl(design.images[0])}
                                    alt={design.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <ImageIcon className="w-12 h-12" />
                                </div>
                            )}
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/50 to-transparent"></div>
                            <div className="absolute bottom-6 left-8 text-white">
                                <h2 className="text-3xl font-bold shadow-sm">{design.name}</h2>
                                <p className="opacity-90 mt-1 flex items-center gap-2">
                                    <Tag className="w-4 h-4" />
                                    {design.id}
                                </p>
                            </div>
                        </div>

                        <div className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Info 1 */}
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2">Basic Information</h3>

                                    <div className="flex items-start gap-4 text-slate-700">
                                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 mt-1">
                                            <AlignLeft className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Description</p>
                                            <p className="font-medium leading-relaxed">{design.description}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 text-slate-700">
                                        <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                                            <DollarSign className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Price</p>
                                            <p className="font-medium text-lg">Rp {design.price.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Info 2 */}
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2">Additional Details</h3>

                                    <div className="flex items-center gap-4 text-slate-700">
                                        <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                                            <Calendar className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Created Date</p>
                                            <p className="font-medium">{new Date(design.createdAt).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}</p>
                                        </div>
                                    </div>

                                    {Array.isArray(design.images) && design.images.length > 1 && (
                                        <div>
                                            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-3">Gallery</p>
                                            <div className="flex gap-2 overflow-x-auto pb-2">
                                                {design.images.map((img, idx) => (
                                                    <div key={idx} className="w-20 h-20 rounded-lg border border-slate-200 overflow-hidden flex-shrink-0">
                                                        <Image
                                                            src={getImageUrl(img)}
                                                            alt=""
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                            <button
                                className="btn btn-outline bg-white"
                                onClick={() => alert('Editing from detail page is coming soon. Please use the dashboard edit button.')}
                            >
                                Edit Design
                            </button>
                            <button
                                onClick={handleDelete}
                                className="btn btn-primary bg-red-600 border-none hover:bg-red-700 scale-[1.01] shadow-xl shadow-red-200"
                            >
                                Delete Design
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
