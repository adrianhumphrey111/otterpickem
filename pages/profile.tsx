import React from 'react';
import { useRouter } from 'next/router';
import { useUser } from '../utils/auth';

const Profile: React.FC = () => {
  const router = useRouter();
  const { user, loading } = useUser();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    router.push('/signup');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Account Information</h3>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Email address</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.email}</dd>
              </div>
              {/* Add more account settings here */}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
