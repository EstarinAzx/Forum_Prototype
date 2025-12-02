import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../lib/api';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

export default function CreateCommunity() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetchWithAuth('/api/communities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description }),
            });

            if (res.ok) {
                const data = await res.json();
                navigate(`/r/${data.name}`);
            } else {
                const err = await res.json();
                setError(err.error || 'Failed to create community');
            }
        } catch (error) {
            setError('An error occurred');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg border">
            <h1 className="text-2xl font-bold mb-6">Create a Community</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                            r/
                        </span>
                        <Input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="rounded-l-none"
                            placeholder="community_name"
                        />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                        Community names including capitalization cannot be changed.
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-input px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        rows={4}
                    />
                </div>

                <div className="flex justify-end space-x-4">
                    <Button type="button" variant="ghost" onClick={() => navigate(-1)}>Cancel</Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Community'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
