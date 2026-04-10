import React, { useState } from 'react';
import BlogCard from '../components/blog/BlogCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading] = useState(false);

  const posts = [
    {
      postId: 1,
      title: 'Walking in Faith During Difficult Times',
      excerpt: 'Discover how to maintain your faith when life gets challenging and how our community can support you through it all.',
      category: 'SERMON',
      publishedAt: '2026-03-15',
      authorName: 'Rev. John Doe',
      viewCount: 245,
    },
    {
      postId: 2,
      title: 'Youth Leadership Program Launch',
      excerpt: 'We are excited to announce our new youth leadership program designed to equip the next generation of church leaders.',
      category: 'ANNOUNCEMENT',
      publishedAt: '2026-03-10',
      authorName: 'Pastor Jane Smith',
      viewCount: 189,
    },
    {
      postId: 3,
      title: 'Community Service Report 2026',
      excerpt: 'Read about all the amazing work our members did this year serving our local communities with love and dedication.',
      category: 'NEWS',
      publishedAt: '2026-03-05',
      authorName: 'Deacon Michael Brown',
      viewCount: 312,
    },
    {
      postId: 4,
      title: 'My Testimony of God\'s Grace',
      excerpt: 'A personal story of how God transformed my life through the AME Church YPD community and the power of prayer.',
      category: 'TESTIMONY',
      publishedAt: '2026-02-28',
      authorName: 'Sister Sarah Johnson',
      viewCount: 428,
    },
    {
      postId: 5,
      title: 'Bible Study Resources for Youth',
      excerpt: 'A collection of helpful resources, study guides and devotionals specially curated for young believers.',
      category: 'RESOURCE',
      publishedAt: '2026-02-20',
      authorName: 'Pastor Jane Smith',
      viewCount: 156,
    },
    {
      postId: 6,
      title: 'The Power of Community Prayer',
      excerpt: 'Exploring how praying together as a community strengthens our faith and brings us closer to God and each other.',
      category: 'SERMON',
      publishedAt: '2026-02-15',
      authorName: 'Rev. John Doe',
      viewCount: 267,
    },
  ];

  const categories = ['ALL', 'SERMON', 'ANNOUNCEMENT', 'TESTIMONY', 'NEWS', 'RESOURCE'];

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'ALL' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-800 to-emerald-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Blog & Resources</h1>
          <p className="text-xl text-emerald-200 max-w-2xl mx-auto">
            Sermons, announcements, testimonies and resources
            from our community.
          </p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="bg-white shadow-md py-6">
        <div className="container mx-auto px-4">
          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-6">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-semibold transition ${
                  selectedCategory === category
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-amber-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {loading ? (
            <LoadingSpinner />
          ) : filteredPosts.length > 0 ? (
            <>
              <p className="text-gray-600 mb-8 text-center">
                Showing {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
                  <BlogCard key={post.postId} post={post} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📖</div>
              <h3 className="text-2xl font-bold text-gray-600 mb-2">
                No posts found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filter to find what
                you are looking for.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BlogPage;