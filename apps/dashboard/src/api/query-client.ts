import { mutationOptions, QueryClient, queryOptions } from '@tanstack/react-query';
import { itemService } from '../services/itemServices';
import { Item } from '@repo/types/item.schema';
import { R2Service } from '../services/r2-service';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 60 * 1000,
      gcTime: 60 * 60 * 1000,
      retry: 3,
    },
  },
});

const itemKeys = {
  all: ['items'] as const,
  list: () => [...itemKeys.all, 'list'] as const,
  item: (id: number) => [...itemKeys.list(), id] as const,
  update: () => [...itemKeys.all, 'update'] as const,
};

const imageKeys = {
  all: ['images'],
  list: () => [...imageKeys.all, 'list'],
  upload: () => [...imageKeys.all, 'upload'],
  delete: () => [...imageKeys.all, 'delete'],
};

export function listItemsQueryOptions() {
  return queryOptions({
    queryKey: itemKeys.list(),
    queryFn: itemService.getAll,
  });
}

export function itemQueryOptions(id: number) {
  return queryOptions({
    queryKey: itemKeys.item(id),
    queryFn: () => itemService.getById(String(id)),
    initialData: () => {
      const items = queryClient.getQueryData<Item[]>(itemKeys.list());
      return items?.find((item: Item) => item.id === id);
    },
  });
}

export function updateItemMutationOptions() {
  return mutationOptions({
    mutationKey: itemKeys.update(),
    mutationFn: (updatedItem: Item) => itemService.updateItem(updatedItem),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: itemKeys.all });
    },
  });
}

export function uploadFileQueryOptions() {
  return mutationOptions({
    mutationKey: imageKeys.upload(),
    mutationFn: (image: { fileName: string; fileContent: File }) =>
      R2Service.uploadObject(image.fileName, image.fileContent),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: imageKeys.all,
      });
    },
  });
}

export default queryClient;
