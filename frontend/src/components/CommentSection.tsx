import { useState, useEffect } from 'react';
import { fetchWithAuth } from '../lib/api';
import { Button } from './Button';
import { formatDate } from '../lib/utils';
import { MessageSquare } from 'lucide-react';

interface Comment {
    id: string;
    content: string;
    author: {
        username: string | null;
        name: string;
    };
    createdAt: string;
    replies: Comment[];
}

interface CommentSectionProps {
    postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState('');

    useEffect(() => {
        loadComments();
    }, [postId]);

    async function loadComments() {
        try {
            const res = await fetchWithAuth(`/api/comments/post/${postId}`);
            if (res.ok) {
                const data = await res.json();
                setComments(data);
            }
        } catch (error) {
            console.error('Failed to load comments:', error);
        }
    }

    async function handleSubmit(e: React.FormEvent, parentId: string | null = null) {
        e.preventDefault();
        const content = parentId ? replyContent : newComment;

        try {
            const res = await fetchWithAuth('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content, postId, parentId }),
            });

            if (res.ok) {
                setNewComment('');
                setReplyContent('');
                setReplyingTo(null);
                loadComments();
            }
        } catch (error) {
            console.error('Failed to post comment:', error);
        }
    }

    const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
        <div className={`py-4 ${isReply ? 'ml-8 border-l-2 border-gray-100 pl-4' : 'border-b'}`}>
            <div className="flex items-center space-x-2 text-xs text-gray-500 mb-1">
                <span className="font-bold text-gray-900">{comment.author.username || comment.author.name}</span>
                <span>•</span>
                <span>{formatDate(comment.createdAt)}</span>
            </div>

            <div className="text-sm text-gray-800 mb-2">{comment.content}</div>

            <div className="flex items-center space-x-2">
                <button
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    className="text-xs font-bold text-gray-500 hover:bg-gray-100 px-2 py-1 rounded flex items-center"
                >
                    <MessageSquare size={12} className="mr-1" />
                    Reply
                </button>
            </div>

            {replyingTo === comment.id && (
                <form onSubmit={(e) => handleSubmit(e, comment.id)} className="mt-2">
                    <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        className="w-full p-2 border rounded-md text-sm"
                        placeholder="What are your thoughts?"
                        rows={3}
                    />
                    <div className="flex justify-end mt-2 space-x-2">
                        <Button type="button" variant="ghost" size="sm" onClick={() => setReplyingTo(null)}>Cancel</Button>
                        <Button type="submit" size="sm">Reply</Button>
                    </div>
                </form>
            )}

            {comment.replies && comment.replies.length > 0 && (
                <div className="mt-2">
                    {comment.replies.map(reply => (
                        <CommentItem key={reply.id} comment={reply} isReply={true} />
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <div className="bg-white rounded-md border p-4">
            <form onSubmit={(e) => handleSubmit(e)} className="mb-6">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    placeholder="What are your thoughts?"
                    rows={4}
                />
                <div className="flex justify-end mt-2">
                    <Button type="submit" disabled={!newComment.trim()}>Comment</Button>
                </div>
            </form>

            <div className="space-y-2">
                {comments.map(comment => (
                    <CommentItem key={comment.id} comment={comment} />
                ))}
            </div>
        </div>
    );
}
