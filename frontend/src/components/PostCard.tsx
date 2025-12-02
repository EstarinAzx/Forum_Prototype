import { Link } from 'react-router-dom';
import { MessageSquare, ArrowBigUp, Share2 } from 'lucide-react';
import { Button } from './Button';
import { formatDate } from '../lib/utils';
import { useState } from 'react';
import { fetchWithAuth } from '../lib/api';

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
    upvotes?: { userId: string }[]; // Simplified for prototype
}

interface PostCardProps {
    post: Post;
}

export function PostCard({ post }: PostCardProps) {
    const [upvotes, setUpvotes] = useState(post._count.upvotes);
    const [isUpvoted, setIsUpvoted] = useState(false); // In a real app, check if user ID is in post.upvotes

    async function handleUpvote(e: React.MouseEvent) {
        e.preventDefault();
        try {
            const res = await fetchWithAuth(`/api/posts/${post.id}/upvote`, {
                method: 'POST',
            });
            if (res.ok) {
                const data = await res.json();
                setIsUpvoted(data.upvoted);
                setUpvotes(prev => data.upvoted ? prev + 1 : prev - 1);
            }
        } catch (error) {
            console.error('Failed to upvote:', error);
        }
    }

    return (
        <div className="bg-white rounded-md border hover:border-gray-400 transition-colors cursor-pointer">
            <div className="flex">
                {/* Vote Sidebar */}
                <div className="w-10 bg-gray-50 p-2 flex flex-col items-center rounded-l-md border-r">
                    <button
                        onClick={handleUpvote}
                        className={`p-1 rounded hover:bg-gray-200 ${isUpvoted ? 'text-orange-500' : 'text-gray-500'}`}
                    >
                        <ArrowBigUp size={24} fill={isUpvoted ? "currentColor" : "none"} />
                    </button>
                    <span className="text-sm font-bold text-gray-700">{upvotes}</span>
                </div>

                {/* Content */}
                <div className="p-3 flex-1">
                    <div className="flex items-center text-xs text-gray-500 mb-2 space-x-1">
                        <Link to={`/r/${post.community.name}`} className="font-bold text-black hover:underline">
                            r/{post.community.name}
                        </Link>
                        <span>•</span>
                        <span>Posted by u/{post.author.username || post.author.name}</span>
                        <span>•</span>
                        <span>{formatDate(post.createdAt)}</span>
                    </div>

                    <Link to={`/post/${post.id}`}>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">{post.title}</h3>
                        <div className="text-sm text-gray-500 line-clamp-3">
                            {post.content}
                        </div>
                    </Link>

                    <div className="flex items-center mt-3 space-x-2">
                        <Link to={`/post/${post.id}`}>
                            <Button variant="ghost" size="sm" className="text-gray-500">
                                <MessageSquare size={16} className="mr-2" />
                                {post._count.comments} Comments
                            </Button>
                        </Link>
                        <Button variant="ghost" size="sm" className="text-gray-500">
                            <Share2 size={16} className="mr-2" />
                            Share
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
