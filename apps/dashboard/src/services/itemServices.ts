import { Item } from '@repo/types/item.schema';
import AxiosClient from '../api/axios-client';
import { z } from 'zod';

export const itemService = {
  createById: async () => {
    const response = await AxiosClient.post<Item>('item');

    return response.data;
  },

  getAll: async () => {
    try {
      const response = await AxiosClient.get<{ items: unknown[] }>('item');
      const parsed = z.array(Item).safeParse(response.data.items);

      if (!parsed.success) {
        throw new Error(
          `Data from server does not match Item schema:\n${z.prettifyError(parsed.error)}`,
        );
      }

      return parsed.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get all items';
      throw new Error(`${errorMessage} (during getting all items from database)`);
    }
  },

  getById: async (id: string) => {
    try {
      const response = await AxiosClient.get<{ item: unknown }>(`item/${id}`);
      const parsed = Item.safeParse(response.data.item);
      if (!parsed.success) {
        throw new Error(
          `Item ${id} data is corrupted or invalid: \n${z.prettifyError(parsed.error)}`,
        );
      }

      return parsed.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get item by ID';
      throw new Error(`${errorMessage} (during getting item by ID from database)`);
    }
  },

  updateItem: async (updatedItem: Item) => {
    const stringId = String(updatedItem.id);
    await AxiosClient.put<Item>(`item/${stringId}`, updatedItem);
    return itemService.getById(stringId);
  },

  deleteItem: async (id: string) => {
    const response = await AxiosClient.delete<Item>(`items/${id}`);
    return response.data;
  },
};
