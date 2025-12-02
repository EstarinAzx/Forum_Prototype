import { useEffect, useState } from 'react';
import { PostCard } from '../components/PostCard';
import { fetchWithAuth } from '../lib/api';
import { Button } from '../components/Button';
import { Link } from 'react-router-dom';

interface Post {
    id: string;
    title: string;
    content: string;
    author: {
        username: string | null;
        name: string;
    };
    community: {
        name: string;
    };
    createdAt: string;
    _count: {
        comments: number;
        upvotes: number;
    };
}

export default function Dashboard() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPosts();
    }, []);

    async function loadPosts() {
        try {
            const res = await fetchWithAuth('/api/posts');
            if (res.ok) {
                const data = await res.json();
                setPosts(data);
            }
        } catch (error) {
            console.error('Failed to load posts:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
                <h1 className="text-2xl font-bold mb-4">Your Feed</h1>

                {loading ? (
                    <div>Loading posts...</div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-10 bg-white rounded-lg border">
                        <p className="text-gray-500">No posts yet. Join a community to see content!</p>
                    </div>
                ) : (
                    posts.map(post => (
                        <PostCard key={post.id} post={post} />
                    ))
                )}
            </div>

            <div className="md:col-span-1">
                <div className="bg-white p-4 rounded-lg border shadow-sm sticky top-20">
                    <h2 className="font-bold text-lg mb-2">Home</h2>
                    <p className="text-sm text-gray-600 mb-4">
                        Your personal Reddit frontpage. Come here to check in with your favorite communities.
                    </p>
                    <Link to="/create-post">
                        <Button className="w-full mb-2">Create Post</Button>
                    </Link>
                    <Link to="/create-community">
                        <Button variant="outline" className="w-full">Create Community</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
