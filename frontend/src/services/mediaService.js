import api from './api';

const mediaService = {
  
  // ══════════════════════════════════════════════════════════════
  // UPLOAD FILE
  // ══════════════════════════════════════════════════════════════
  
  upload: async (formData) => {
    try {
      return await api.post('/media/upload', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
    } catch (error) {
      throw error?.response?.data?.error || 'Upload failed';
    }
  },

  // ══════════════════════════════════════════════════════════════
  // SAVE YOUTUBE VIDEO
  // ══════════════════════════════════════════════════════════════
  
  saveYoutubeVideo: async (data) => {
    try {
      const params = new URLSearchParams();
      params.append('youtubeVideoId', data.youtubeVideoId);
      if (data.title) params.append('title', data.title);
      if (data.description) params.append('description', data.description);
      if (data.uploadedBy) params.append('uploadedBy', data.uploadedBy);
      if (data.category) params.append('category', data.category);
      if (data.usage) params.append('usage', data.usage);

      return await api.post('/media/youtube', params);
    } catch (error) {
      throw error?.response?.data?.error || 'Failed to save YouTube video';
    }
  },

  // ══════════════════════════════════════════════════════════════
  // GET ALL MEDIA
  // ══════════════════════════════════════════════════════════════
  
  getAll: async (params = {}) => {
    try {
      return await api.get('/media', { params });
    } catch (error) {
      throw error?.response?.data?.message || 'Failed to fetch media';
    }
  },

  // ══════════════════════════════════════════════════════════════
  // GET BY TYPE
  // ══════════════════════════════════════════════════════════════
  
  getByType: async (mediaType) => {
    try {
      return await api.get(`/media/type/${mediaType}`);
    } catch (error) {
      throw error?.response?.data?.message || 'Failed to fetch media';
    }
  },

  // ══════════════════════════════════════════════════════════════
  // GET BY CATEGORY
  // ══════════════════════════════════════════════════════════════
  
  getByCategory: async (category) => {
    try {
      return await api.get(`/media/category/${category}`);
    } catch (error) {
      throw error?.response?.data?.message || 'Failed to fetch media';
    }
  },

  // ══════════════════════════════════════════════════════════════
  // GET BY USAGE
  // ══════════════════════════════════════════════════════════════
  
  getByUsage: async (usage) => {
    try {
      return await api.get(`/media/usage/${usage}`);
    } catch (error) {
      throw error?.response?.data?.message || 'Failed to fetch media';
    }
  },

  // ══════════════════════════════════════════════════════════════
  // GET BY CATEGORY AND USAGE
  // ══════════════════════════════════════════════════════════════
  
  getByCategoryAndUsage: async (category, usage) => {
    try {
      return await api.get(`/media/category/${category}/usage/${usage}`);
    } catch (error) {
      throw error?.response?.data?.message || 'Failed to fetch media';
    }
  },

  // ══════════════════════════════════════════════════════════════
  // GET SINGLE MEDIA
  // ══════════════════════════════════════════════════════════════
  
  getById: async (id) => {
    try {
      return await api.get(`/media/${id}`);
    } catch (error) {
      throw error?.response?.data?.message || 'Media not found';
    }
  },

  // ══════════════════════════════════════════════════════════════
  // DELETE MEDIA
  // ══════════════════════════════════════════════════════════════
  
  remove: async (id) => {
    try {
      await api.delete(`/media/${id}`);
    } catch (error) {
      throw error?.response?.data?.message || 'Failed to delete media';
    }
  },

  // ══════════════════════════════════════════════════════════════
  // HELPER: Get file URL
  // ══════════════════════════════════════════════════════════════
  
  getFileUrl: (fileName) => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';
    return `${baseUrl}/media/files/${fileName}`;
  },

  // ══════════════════════════════════════════════════════════════
  // HELPER: Extract YouTube video ID from URL
  // ══════════════════════════════════════════════════════════════
  
  extractYoutubeId: (url) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/,
      /^([A-Za-z0-9_-]{11})$/  // Just the ID itself
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  },
};

export default mediaService;