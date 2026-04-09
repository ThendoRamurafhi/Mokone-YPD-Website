import React, { useState } from 'react';
import LoadingSpinner from '../components/common/LoadingSpinner';

const MediaPage = () => {
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [loading] = useState(false);

  const mediaItems = [
    {
      mediaId: 1,
      title: 'Youth Conference 2025 Highlights',
      mediaType: 'VIDEO',
      thumbnail: null,
      category: 'Events',
      description: 'Highlights from our amazing Youth Conference 2025.',
      fileUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    },
    {
      mediaId: 2,
      title: 'Community Outreach Day Photos',
      mediaType: 'IMAGE',
      thumbnail: null,
      category: 'Outreach',
      description: 'Photos from our community outreach day.',
    },
    {
      mediaId: 3,
      title: 'Sunday Worship Service',
      mediaType: 'VIDEO',
      thumbnail: null,
      category: 'Worship',
      description: 'Recording of our Sunday worship service.',
      fileUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    },
    {
      mediaId: 4,
      title: 'Annual Conference 2025',
      mediaType: 'IMAGE',
      thumbnail: null,
      category: 'Events',
      description: 'Photos from our Annual Conference 2025.',
    },
    {
      mediaId: 5,
      title: 'Youth Leadership Training',
      mediaType: 'IMAGE',
      thumbnail: null,
      category: 'Training',
      description: 'Photos from our Youth Leadership Training program.',
    },
    {
      mediaId: 6,
      title: 'Christmas Service 2025',
      mediaType: 'VIDEO',
      thumbnail: null,
      category: 'Worship',
      description: 'Recording of our Christmas worship service.',
      fileUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    },
  ];

  const types = ['ALL', 'IMAGE', 'VIDEO'];

  const filteredMedia = selectedType === 'ALL'
    ? mediaItems
    : mediaItems.filter(item => item.mediaType === selectedType);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-800 to-emerald-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Media Gallery</h1>
          <p className="text-xl text-emerald-200 max-w-2xl mx-auto">
            Photos and videos from our events, services
            and community activities.
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="bg-white shadow-md py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-6 py-2 rounded-full font-semibold transition ${
                  selectedType === type
                    ? 'bg-emerald-700 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-emerald-100'
                }`}
              >
                {type === 'ALL' ? '🎬 All Media' :
                 type === 'IMAGE' ? '🖼️ Photos' : '📹 Videos'}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Media Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {loading ? (
            <LoadingSpinner />
          ) : filteredMedia.length > 0 ? (
            <>
              <p className="text-gray-600 mb-8 text-center">
                Showing {filteredMedia.length} item{filteredMedia.length !== 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredMedia.map((item) => (
                  <div
                    key={item.mediaId}
                    className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer"
                    onClick={() => setSelectedMedia(item)}
                  >
                    {/* Thumbnail */}
                    <div className="w-full h-48 bg-emerald-100 flex items-center justify-center relative">
                      <span className="text-6xl">
                        {item.mediaType === 'VIDEO' ? '🎬' : '🖼️'}
                      </span>
                      {item.mediaType === 'VIDEO' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                            <span className="text-white text-2xl ml-1">▶</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          item.mediaType === 'VIDEO'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {item.mediaType === 'VIDEO' ? '📹 Video' : '🖼️ Photo'}
                        </span>
                        <span className="text-xs text-gray-500">{item.category}</span>
                      </div>
                      <h3 className="text-lg font-bold text-emerald-800 mb-1">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🎬</div>
              <h3 className="text-2xl font-bold text-gray-600 mb-2">
                No media found
              </h3>
              <p className="text-gray-500">
                Check back soon for photos and videos!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Media Modal */}
      {selectedMedia && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedMedia(null)}
        >
          <div
            className="bg-white rounded-lg max-w-2xl w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-xl font-bold text-emerald-800">
                {selectedMedia.title}
              </h3>
              <button
                onClick={() => setSelectedMedia(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4">
              {selectedMedia.mediaType === 'VIDEO' ? (
                <iframe
                  src={selectedMedia.fileUrl}
                  title={selectedMedia.title}
                  className="w-full h-64 rounded"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-64 bg-emerald-100 flex items-center justify-center rounded">
                  <span className="text-8xl">🖼️</span>
                </div>
              )}
              <p className="text-gray-600 mt-4">{selectedMedia.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaPage;