import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Community from './pages/Community';
import PostDetail from './pages/PostDetail';
import Profile from './pages/Profile';
import CreateCommunity from './pages/CreateCommunity';
import CreatePost from './pages/CreatePost';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Dashboard />} />
                        <Route path="r/:name" element={<Community />} />
                        <Route path="post/:id" element={<PostDetail />} />

                        {/* Auth Routes */}
                        <Route path="login" element={<Login />} />
                        <Route path="signup" element={<Signup />} />

                        {/* Protected Routes */}
                        <Route
                            path="profile"
                            element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="create-community"
                            element={
                                <ProtectedRoute>
                                    <CreateCommunity />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="create-post"
                            element={
                                <ProtectedRoute>
                                    <CreatePost />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="r/:name/submit"
                            element={
                                <ProtectedRoute>
                                    <CreatePost />
                                </ProtectedRoute>
                            }
                        />
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
