import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fetchWithAuth } from '../lib/api';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

interface Community {
    id: string;
    name: string;
}

export default function CreatePost() {
    const [communities, setCommunities] = useState<Community[]>([]);
    const [selectedCommunity, setSelectedCommunity] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const preselectedCommunity = searchParams.get('r');

    useEffect(() => {
        loadCommunities();
    }, []);

    async function loadCommunities() {
        try {
            const res = await fetchWithAuth('/api/communities');
            if (res.ok) {
                const data = await res.json();
                setCommunities(data);
                if (preselectedCommunity) {
                    const found = data.find((c: Community) => c.name === preselectedCommunity);
                    if (found) setSelectedCommunity(found.id);
                }
            }
        } catch (error) {
            console.error('Failed to load communities');
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!selectedCommunity) {
            setError('Please select a community');
            setLoading(false);
            return;
        }

        try {
            const res = await fetchWithAuth('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    content,
                    communityId: selectedCommunity
                }),
            });

            if (res.ok) {
                const data = await res.json();
                navigate(`/post/${data.id}`);
            } else {
                const err = await res.json();
                setError(err.error || 'Failed to create post');
            }
        } catch (error) {
            setError('An error occurred');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg border">
            <h1 className="text-2xl font-bold mb-6">Create a Post</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700">Community</label>
                    <select
                        value={selectedCommunity}
                        onChange={(e) => setSelectedCommunity(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-input px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-white"
                        required
                    >
                        <option value="">Select a community</option>
                        {communities.map(c => (
                            <option key={c.id} value={c.id}>r/{c.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <Input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-1"
                        placeholder="Title"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Content</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-input px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        rows={8}
                        placeholder="Text (optional)"
                    />
                </div>

                <div className="flex justify-end space-x-4">
                    <Button type="button" variant="ghost" onClick={() => navigate(-1)}>Cancel</Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Post' : 'Post'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
