'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, DollarSign, Layers, Info, Image as ImageIcon } from 'lucide-react';
import { authService, User } from '@/app/lib/auth';
import { getImageUrl } from '@/app/lib/utils';
import '@/app/admin/dashboard/styles.css';

interface BillboardDetail {
    id: string;
    location: string;
    description: string;
    img: string;
    category: string;
    cityId: string;
    provinceId: string;
    status: string;
    mode: string;
    size: string;
    orientation: string;
    display: string;
    lighting: string;
    tax: string;
    landOwnership: string;
    rentPrice: number;
    sellPrice: number;
    servicePrice: number;
    image: { url: string }[];
    gPlaceId?: string;
    formattedAddress?: string;
    latitude?: number;
    longitude?: number;
    createdAt: string;
    updatedAt: string;
}

const SIDEBAR_ITEMS = [
    'Dashboard', 'Users', 'Sellers', 'Billboards',
    'Transactions', 'Categories', 'Designs',
    'Add-ons', 'Ratings', 'Notifications'
];

export default function BillboardDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [billboard, setBillboard] = useState<BillboardDetail | null>(null);
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

                // 2. Fetch Billboard Detail
                const res = await fetch(`/api/proxy/billboard/detail/${id}`, {
                    credentials: 'include'
                });
                const json = await res.json();

                if (json.status && json.data) {
                    setBillboard(json.data);
                } else {
                    setError(json.message || 'Failed to fetch billboard');
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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        );
    }

    if (error || !billboard) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
                <p className="text-red-500 text-lg font-medium">{error || 'Billboard not found'}</p>
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
                            className={`nav-item ${item === 'Billboards' ? 'active' : ''}`}
                            onClick={() => router.push('/admin/dashboard')}
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
                        <h1 className="page-title">Billboard Details</h1>
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
                            Back to Billboards
                        </Link>
                    </div>

                    {/* Main Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden animate-slide-up">
                        {/* Cover Image */}
                        <div className="h-[400px] w-full relative">
                            {billboard.image && billboard.image.length > 0 ? (
                                <img
                                    src={getImageUrl(billboard.image[0].url)}
                                    alt={billboard.location}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400">
                                    <ImageIcon className="w-16 h-16" />
                                    <span className="text-xl mt-2">No Image Available</span>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                                <div className="p-8 text-white w-full">
                                    <h2 className="text-3xl font-bold shadow-sm">{billboard.location}</h2>
                                    <p className="opacity-90 mt-2 flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        {billboard.formattedAddress || 'Address not specified'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8">
                            {/* Status & Mode badges */}
                            <div className="flex gap-3 mb-8">
                                <span className={`badge ${billboard.status === 'Available' ? 'badge-success' : 'badge-danger'} px-4 py-1.5 text-sm`}>
                                    {billboard.status}
                                </span>
                                <span className="badge badge-neutral px-4 py-1.5 text-sm">
                                    {billboard.mode} Mode
                                </span>
                                <span className="badge badge-info px-4 py-1.5 text-sm">
                                    {billboard.orientation}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* Left Column: Key Details */}
                                <div className="md:col-span-2 space-y-8">
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2 mb-4 flex items-center gap-2">
                                            <ImageIcon className="w-5 h-5 text-purple-500" />
                                            Gallery
                                        </h3>
                                        <div className="grid grid-cols-4 gap-2">
                                            {billboard.image && billboard.image.map((imgObj, idx) => (
                                                <div key={idx} className="aspect-square rounded-lg border border-slate-200 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                                                    <img
                                                        src={getImageUrl(imgObj.url)}
                                                        alt={`Gallery ${idx + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2 mb-4 flex items-center gap-2">
                                            <Info className="w-5 h-5 text-red-500" />
                                            Description
                                        </h3>
                                        <p className="text-slate-600 leading-relaxed text-lg">
                                            {billboard.description || 'No description provided.'}
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2 mb-4 flex items-center gap-2">
                                            <Layers className="w-5 h-5 text-blue-500" />
                                            Specifications
                                        </h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                                            <div className="bg-slate-50 p-4 rounded-lg">
                                                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Dimensions</p>
                                                <p className="font-medium text-slate-800 text-lg">{billboard.size}</p>
                                            </div>
                                            <div className="bg-slate-50 p-4 rounded-lg">
                                                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Lighting</p>
                                                <p className="font-medium text-slate-800 text-lg">{billboard.lighting}</p>
                                            </div>
                                            <div className="bg-slate-50 p-4 rounded-lg">
                                                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Display</p>
                                                <p className="font-medium text-slate-800 text-lg">{billboard.display}</p>
                                            </div>
                                            <div className="bg-slate-50 p-4 rounded-lg">
                                                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Ownership</p>
                                                <p className="font-medium text-slate-800 text-lg">{billboard.landOwnership}</p>
                                            </div>
                                            <div className="bg-slate-50 p-4 rounded-lg">
                                                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Tax</p>
                                                <p className="font-medium text-slate-800 text-lg">{billboard.tax}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Map Preview (If coordinates exist) */}
                                    {billboard.latitude && billboard.longitude && (
                                        <div>
                                            <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2 mb-4 flex items-center gap-2">
                                                <MapPin className="w-5 h-5 text-green-500" />
                                                Location Map
                                            </h3>
                                            <div className="w-full h-64 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                                                {/* In a real scenario, embed Google Map here */}
                                                <span>Map Preview ({billboard.latitude}, {billboard.longitude})</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Right Column: Pricing & Actions */}
                                <div className="space-y-6">
                                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                            <DollarSign className="w-5 h-5 text-green-600" />
                                            Pricing
                                        </h3>

                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                                                <span className="text-slate-500 text-sm">Rent Price</span>
                                                <span className="font-bold text-slate-800 text-lg">
                                                    {billboard.rentPrice > 0 ? `Rp ${billboard.rentPrice.toLocaleString()}` : '-'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                                                <span className="text-slate-500 text-sm">Sell Price</span>
                                                <span className="font-bold text-slate-800 text-lg">
                                                    {billboard.sellPrice > 0 ? `Rp ${billboard.sellPrice.toLocaleString()}` : '-'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                                                <span className="text-slate-500 text-sm">Service Fee</span>
                                                <span className="font-bold text-slate-800 text-lg">
                                                    {billboard.servicePrice > 0 ? `Rp ${billboard.servicePrice.toLocaleString()}` : '-'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-4">
                                        <button className="btn w-full btn-outline bg-white hover:bg-slate-50">
                                            Edit Billboard
                                        </button>
                                        <button className="btn w-full btn-primary bg-red-600 border-none hover:bg-red-700 shadow-lg shadow-red-200">
                                            Delete Billboard
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
