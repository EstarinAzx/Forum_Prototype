import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PostCard } from '../components/PostCard';
import { fetchWithAuth } from '../lib/api';
import { Button } from '../components/Button';

interface Community {
    id: string;
    name: string;
    description: string | null;
    _count: {
        posts: number;
    };
}

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

export default function Community() {
    const { name } = useParams<{ name: string }>();
    const [community, setCommunity] = useState<Community | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (name) {
            loadCommunity(name);
        }
    }, [name]);

    async function loadCommunity(communityName: string) {
        setLoading(true);
        try {
            // Fetch community details
            const commRes = await fetchWithAuth(`/api/communities/${communityName}`);
            if (commRes.ok) {
                const commData = await commRes.json();
                setCommunity(commData);

                // Fetch posts for this community
                const postsRes = await fetchWithAuth(`/api/posts?communityId=${commData.id}`);
                if (postsRes.ok) {
                    const postsData = await postsRes.json();
                    setPosts(postsData);
                }
            }
        } catch (error) {
            console.error('Failed to load community:', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <div>Loading...</div>;
    if (!community) return <div>Community not found</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
                <div className="bg-white p-4 rounded-lg border mb-4">
                    <h1 className="text-3xl font-bold">r/{community.name}</h1>
                    <p className="text-gray-500 mt-1">r/{community.name}</p>
                </div>

                {posts.length === 0 ? (
                    <div className="text-center py-10 bg-white rounded-lg border">
                        <p className="text-gray-500">No posts yet.</p>
                    </div>
                ) : (
                    posts.map(post => (
                        <PostCard key={post.id} post={post} />
                    ))
                )}
            </div>

            <div className="md:col-span-1">
                <div className="bg-white p-4 rounded-lg border shadow-sm sticky top-20">
                    <h2 className="font-bold text-lg mb-2">About Community</h2>
                    <p className="text-sm text-gray-600 mb-4">
                        {community.description || "Welcome to the community!"}
                    </p>
                    <div className="text-sm text-gray-500 mb-4">
                        {community._count.posts} posts
                    </div>
                    <Link to={`/r/${community.name}/submit`}>
                        <Button className="w-full">Create Post</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
