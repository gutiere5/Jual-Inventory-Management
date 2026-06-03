import axiosClient from '../api/axios-client';

export const menuItemService = {
  getAll: async () => {
    try {
      const response = await axiosClient.get('/item');
      const parsedItems = Array.isArray(response.data)
        ? response.data
        : (response.data?.items ?? []);
      return parsedItems;
    } catch (error) {
      alert('Failed to fetch menu items. Please try again later.', error);
      return [];
    }
  },
  getById: async (id) => {
    const response = await axiosClient.get(`/item/${id}`);
    return response.data;
  },
};
