'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface LinkData {
  id: string;
  code: string;
  targetUrl: string;
  clicks: number;
  lastClicked: string | null;
  createdAt: string;
}

export default function StatsPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;
  const [link, setLink] = useState<LinkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchLinkStats();
  }, [code]);

  const fetchLinkStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/links/${code}`);

      if (!response.ok) {
        if (response.status === 404) {
          setError('Link not found');
        } else {
          setError('Failed to fetch link stats');
        }
        return;
      }

      const data = await response.json();
      setLink(data);
    } catch (err) {
      setError('Failed to fetch link stats');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this link?')) return;

    try {
      const response = await fetch(`/api/links/${code}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/');
      } else {
        alert('Failed to delete link');
      }
    } catch (err) {
      alert('Failed to delete link');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error || !link) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="text-red-600 text-center mb-4">{error || 'Link not found'}</div>
          <Link
            href="/"
            className="block text-center text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const shortUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/${link.code}` 
    : `/${link.code}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Link Statistics</h1>

          {/* Short URL */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Short URL
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={shortUrl}
                readOnly
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-white text-black placeholder:text-gray-500"
              />
              <button
                onClick={() => copyToClipboard(shortUrl)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Target URL */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target URL
            </label>
            <div className="p-4 bg-gray-50 rounded-lg break-all">
              <a
                href={link.targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                {link.targetUrl}
              </a>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Total Clicks</div>
              <div className="text-3xl font-bold text-green-700">{link.clicks}</div>
            </div>

            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Last Clicked</div>
              <div className="text-lg font-semibold text-purple-700">
                {link.lastClicked
                  ? new Date(link.lastClicked).toLocaleString()
                  : 'Never'}
              </div>
            </div>

            <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Created At</div>
              <div className="text-lg font-semibold text-orange-700">
                {new Date(link.createdAt).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={handleDelete}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
