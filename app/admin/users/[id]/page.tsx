'use client';

import { ArrowLeft, Award, Calendar, Mail, Phone } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';

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

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [user, setUser] = useState<UserDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Unwrap params
    const { id } = use(params);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`http://utero.viewdns.net:3100/user/${id}`);
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
            fetchUser();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
        <div className="min-h-screen bg-[#f8f9fa] p-8 font-sans">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/admin/dashboard"
                        className="inline-flex items-center text-gray-500 hover:text-gray-800 transition-colors mb-4 text-sm font-medium"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">User Details</h1>
                    <p className="text-gray-500 mt-1">Manage and view user information</p>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Cover / Top Section */}
                    <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
                        <div className="absolute -bottom-16 left-8">
                            <div className="w-32 h-32 rounded-full border-4 border-white shadow-md bg-gray-200 overflow-hidden">
                                <img
                                    src={user.profilePicture?.startsWith('http') ? user.profilePicture : `http://utero.viewdns.net:3100/${user.profilePicture}`}
                                    alt={user.username}
                                    className="w-full h-full object-cover"
                                    onError={(e) => (e.currentTarget.src = 'https://ui-avatars.com/api/?name=' + user.username)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-20 pb-8 px-8">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{user.username}</h2>
                                <p className="text-gray-500 text-sm mt-1">ID: {user.id}</p>
                            </div>
                            <div className="flex gap-3">
                                <span className={`px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide ${user.level === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                                        user.level === 'SELLER' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                                    }`}>
                                    {user.level}
                                </span>
                                <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-600 border border-gray-200">
                                    {user.provider}
                                </span>
                            </div>
                        </div>

                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Contact Info */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2">Contact Information</h3>

                                <div className="flex items-center gap-4 text-gray-700">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Email Address</p>
                                        <p className="font-medium">{user.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 text-gray-700">
                                    <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Phone Number</p>
                                        <p className="font-medium">{user.phone || 'Not provided'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Account Details */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2">Account Details</h3>

                                <div className="flex items-center gap-4 text-gray-700">
                                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Joined Date</p>
                                        <p className="font-medium">{new Date(user.createdAt).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}</p>
                                    </div>
                                </div>

                                {user.seller && (
                                    <div className="flex items-center gap-4 text-gray-700">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                            <Award className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Seller Profile</p>
                                            <p className="font-medium">Active Seller</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                        <button className="px-6 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors shadow-sm">
                            Edit User
                        </button>
                        <button className="px-6 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors shadow-md shadow-red-200">
                            Delete User
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
