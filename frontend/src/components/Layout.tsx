import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './Button';
import { LogOut, User, Menu } from 'lucide-react';
import { useState } from 'react';

export default function Layout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    function handleLogout() {
        logout();
        navigate('/login');
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white border-b sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <Link to="/" className="flex-shrink-0 flex items-center">
                                <span className="text-2xl font-bold text-primary">Forum</span>
                            </Link>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden sm:flex sm:items-center sm:space-x-4">
                            {user ? (
                                <>
                                    <Link to="/profile">
                                        <Button variant="ghost" className="flex items-center gap-2">
                                            <User size={18} />
                                            {user.username || user.name}
                                        </Button>
                                    </Link>
                                    <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
                                        <LogOut size={18} />
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login">
                                        <Button variant="ghost">Login</Button>
                                    </Link>
                                    <Link to="/signup">
                                        <Button>Sign Up</Button>
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="flex items-center sm:hidden">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                            >
                                <Menu size={24} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="sm:hidden bg-white border-b">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            {user ? (
                                <>
                                    <Link
                                        to="/profile"
                                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Profile
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsMenuOpen(false);
                                        }}
                                        className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>
        </div>
    );
}
