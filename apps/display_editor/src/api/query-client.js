import { mutationOptions, QueryClient, queryOptions } from '@tanstack/react-query';
import { r2Service } from '../services/r2-service';
import { menuItemService } from '../services/menuItemService';
import { canvasDataService } from '../services/canvasDataService';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000,
      cacheTime: 30 * 60 * 1000,
      retry: 3,
    },
  },
});

const imageKeys = {
  all: ['images'],
  list: () => [...imageKeys.all, 'list'],
  upload: () => [...imageKeys.all, 'upload'],
  delete: () => [...imageKeys.all, 'delete'],
};

const menuItemKeys = {
  all: ['menuItems'],
  list: () => [...menuItemKeys.all, 'list'],
  item: (id) => [...menuItemKeys.list(), id],
};

const canvasDataKeys = {
  all: ['canvasData'],
  list: () => [...canvasDataKeys.all, 'list'],
  delete: () => [...canvasDataKeys.all, 'delete'],
  create: () => [...canvasDataKeys.all, 'create'],
};

export function listImageQueryOptions() {
  return queryOptions({
    queryKey: imageKeys.list(),
    queryFn: r2Service.listObjects,
  });
}

export function uploadFileQueryOptions() {
  return mutationOptions({
    mutationKey: imageKeys.upload(),
    mutationFn: ({ fileName, fileContent }) => r2Service.uploadObject({ fileName, fileContent }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: imageKeys.all,
      });
    },
  });
}

export function deleteFileMutationOptions() {
  return mutationOptions({
    mutationKey: imageKeys.delete(),
    mutationFn: ({ imageUrl }) => r2Service.deleteObject({ imageUrl }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: imageKeys.all,
      });
    },
  });
}

export function listMenuItemsQueryOptions() {
  return queryOptions({
    queryKey: menuItemKeys.list(),
    queryFn: menuItemService.getAll,
  });
}

export function menuItemQueryOptions(id) {
  return queryOptions({
    queryKey: menuItemKeys.item(id),
    queryFn: () => menuItemService.getById(id),
    initialData: () => {
      const menuItems = queryClient.getQueryData(menuItemKeys.list());
      return menuItems?.find((item) => item.id === id);
    },
  });
}

export function listCanvasDataQueryOptions() {
  return queryOptions({
    queryKey: canvasDataKeys.list(),
    queryFn: canvasDataService.getAll,
  });
}

export function deleteCanvasDataQueryOptions() {
  return mutationOptions({
    mutationKey: canvasDataKeys.delete(),
    mutationFn: (id) => canvasDataService.deleteById(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: canvasDataKeys.all,
      });
    },
  });
}

export function createCanvasDataQueryOptions() {
  return mutationOptions({
    mutationKey: canvasDataKeys.create(),
    mutationFn: ({ name, content }) => canvasDataService.createCanvas(name, content),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: canvasDataKeys.all,
      });
    },
  });
}

export default queryClient;
