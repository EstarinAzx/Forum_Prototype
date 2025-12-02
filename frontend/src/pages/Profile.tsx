import { useAuth } from '../context/AuthContext';


export default function Profile() {
    const { user } = useAuth();

    if (!user) return <div>Please login</div>;

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="bg-primary h-32"></div>
                <div className="px-6 py-4 relative">
                    <div className="absolute -top-12 left-6">
                        <div className="h-24 w-24 rounded-full bg-white p-1">
                            <div className="h-full w-full rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500">
                                {user.username?.[0]?.toUpperCase() || user.name[0].toUpperCase()}
                            </div>
                        </div>
                    </div>

                    <div className="mt-12">
                        <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                        <p className="text-gray-500">u/{user.username}</p>
                    </div>

                    <div className="mt-6 border-t pt-6">
                        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Email</dt>
                                <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Role</dt>
                                <dd className="mt-1 text-sm text-gray-900">{user.role}</dd>
                            </div>
                            {/* <div>
                <dt className="text-sm font-medium text-gray-500">Joined</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatDate(user.createdAt)}</dd>
              </div> */}
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
}
