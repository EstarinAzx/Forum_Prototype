// ====== SECTION 1: SETUP ======
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchWithAuth } from '../lib/api';
import { PostCard } from '../components/PostCard';
import { CommentSection } from '../components/CommentSection';

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

export default function PostDetail() {
    // ====== SECTION 2: INITIAL STATE & PARAMS ======
    const { id } = useParams<{ id: string }>();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);

    // ====== SECTION 3: DATA FETCH FLOW ======
    useEffect(() => {
        if (id) {
            loadPost(id);
        }
    }, [id]);

    async function loadPost(postId: string) {
        try {
            const res = await fetchWithAuth(`/api/posts/${postId}`);
            if (res.ok) {
                const data = await res.json();
                setPost(data);
            }
        } catch (error) {
            console.error('Failed to load post:', error);
        } finally {
            setLoading(false);
        }
    }

    // ====== SECTION 4: RENDERING ======
    if (loading) return <div>Loading...</div>;
    if (!post) return <div>Post not found</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <PostCard post={post} />
            </div>

            <div className="bg-gray-50 rounded-lg">
                <CommentSection postId={post.id} />
            </div>
        </div>
    );
}
