import { Item, ItemList, ItemListSchema, ItemSchema } from '@repo/types/item.schema';
import AxiosClient from '../api/axios-client';
import { z } from 'zod';

export const itemService = {
  createById: async (createdItem: Item) => {
    const parsedItem = ItemSchema.safeParse(createdItem);

    if (parsedItem.error)
      throw new Error(`Invalid item arguments ${z.prettifyError(parsedItem.error)}`);

    const response = await AxiosClient.post<Item>('item', parsedItem.data);

    return response.data;
  },

  getAll: async () => {
    try {
      const response = await AxiosClient.get<{ items: ItemList }>('item');

      const parsed = ItemListSchema.safeParse(response.data);

      if (parsed.error) {
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
      const response = await AxiosClient.get<{ item: Item }>(`item/${id}`);
      const parsed = ItemSchema.safeParse(response.data.item);

      if (parsed.error) {
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
