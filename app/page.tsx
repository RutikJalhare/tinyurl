'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface LinkData {
  id: string;
  code: string;
  targetUrl: string;
  clicks: number;
  lastClicked: string | null;
  createdAt: string;
}

export default function Home() {
  const [links, setLinks] = useState<LinkData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [targetUrl, setTargetUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'clicks'>('createdAt');

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/links');
      if (response.ok) {
        const data = await response.json();
        setLinks(data);
      }
    } catch (error) {
      console.error('Error fetching links:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    // Validate URL
    try {
      new URL(targetUrl);
    } catch {
      setFormError('Please enter a valid URL');
      setFormLoading(false);
      return;
    }

    // Validate custom code if provided
    if (customCode && !/^[A-Za-z0-9]{6,8}$/.test(customCode)) {
      setFormError('Custom code must be 6-8 alphanumeric characters');
      setFormLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUrl,
          code: customCode || undefined,
        }),
      });

      if (response.ok) {
        setTargetUrl('');
        setCustomCode('');
        setShowAddForm(false);
        fetchLinks();
      } else {
        const data = await response.json();
        setFormError(data.error || 'Failed to create link');
      }
    } catch (error) {
      setFormError('Failed to create link');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (code: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return;

    try {
      const response = await fetch(`/api/links/${code}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchLinks();
      } else {
        alert('Failed to delete link');
      }
    } catch (error) {
      alert('Failed to delete link');
    }
  };

  const copyToClipboard = (code: string) => {
    const url = `${window.location.origin}/${code}`;
    navigator.clipboard.writeText(url);
  };

  const filteredLinks = links
    .filter(link =>
      link.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.targetUrl.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'clicks') {
        return b.clicks - a.clicks;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">TinyLink</h1>
            <div className="text-sm text-gray-500">URL Shortener</div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Link Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {showAddForm ? 'Create New Short Link' : 'Quick Actions'}
            </h2>
            <button
              onClick={() => {
                setShowAddForm(!showAddForm);
                setFormError('');
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {showAddForm ? 'Cancel' : '+ Add New Link'}
            </button>
          </div>

          {showAddForm && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target URL *
                </label>
                <input
                  type="url"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="https://example.com/very/long/url"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Code (Optional)
                </label>
                <input
                  type="text"
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value)}
                  placeholder="mycode (6-8 alphanumeric characters)"
                  pattern="[A-Za-z0-9]{6,8}"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder:text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to generate automatically
                </p>
              </div>

              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {formError}
                </div>
              )}

              <button
                type="submit"
                disabled={formLoading}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
              >
                {formLoading ? 'Creating...' : 'Create Short Link'}
              </button>
            </form>
          )}
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by code or URL..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder:text-gray-500"
              />
            </div>
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'createdAt' | 'clicks')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              >
                <option value="createdAt">Sort by Date</option>
                <option value="clicks">Sort by Clicks</option>
              </select>
            </div>
          </div>
        </div>

        {/* Links Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              All Links ({filteredLinks.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : filteredLinks.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-2">
                {searchTerm ? 'No links found matching your search' : 'No links yet'}
              </div>
              {!searchTerm && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Create your first link
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Short Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Target URL
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Clicks
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Clicked
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredLinks.map((link) => (
                    <tr key={link.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <code className="px-2 py-1 bg-blue-100 text-blue-800 rounded font-mono text-sm">
                            {link.code}
                          </code>
                          <button
                            onClick={() => copyToClipboard(link.code)}
                            className="text-gray-400 hover:text-gray-600"
                            title="Copy short URL"
                          >
                            📋
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={link.targetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 max-w-xs block truncate"
                          title={link.targetUrl}
                        >
                          {link.targetUrl}
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          {link.clicks}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {link.lastClicked
                          ? new Date(link.lastClicked).toLocaleString()
                          : 'Never'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/code/${link.code}`}
                            className="px-3 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors text-sm font-medium"
                          >
                            Stats
                          </Link>
                          <button
                            onClick={() => handleDelete(link.code)}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-500 text-sm">
            TinyLink - URL Shortener © {new Date().getFullYear()}
          </div>
        </div>
      </footer>
    </div>
  );
}
