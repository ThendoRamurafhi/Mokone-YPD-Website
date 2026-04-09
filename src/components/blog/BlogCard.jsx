import React from 'react';
import { Link } from 'react-router-dom';

const categoryColors = {
  ANNOUNCEMENT: 'bg-blue-100 text-blue-800',
  SERMON: 'bg-purple-100 text-purple-800',
  TESTIMONY: 'bg-green-100 text-green-800',
  NEWS: 'bg-amber-100 text-amber-800',
  RESOURCE: 'bg-red-100 text-red-800'
};

const BlogCard = ({ post }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategory = () => {
    return categoryColors[post.category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <div className="w-full h-48 bg-amber-50 flex items-center justify-center">
        <span className="text-amber-400 text-5xl">📖</span>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className={"px-3 py-1 rounded-full text-xs font-semibold " + getCategory()}>
            {post.category}
          </span>
          <span className="text-sm text-gray-500">
            {formatDate(post.publishedAt || post.createdAt)}
          </span>
        </div>

        <h3 className="text-xl font-bold text-emerald-800 mb-2">
          {post.title}
        </h3>

        <p className="text-gray-600 mb-4">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>✍️ {post.authorName || 'AME YPD'}</span>
          <span>👁️ {post.viewCount || 0} views</span>
        </div>

        <Link
          to={"/blog/" + post.postId}
          className="block w-full text-center bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded transition"
        >
          Read More
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;