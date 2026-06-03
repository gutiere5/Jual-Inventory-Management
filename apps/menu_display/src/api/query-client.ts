import { QueryClient, queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { canvasObjectService } from '../services/canvas-service';
import type { CanvasObject } from '@repo/types/canvasObject.schema';
import { itemService } from '../services/item-service';
import { Item } from '@repo/types/item.schema';

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
  item: (id: string) => [...itemKeys.list(), id] as const,
};

const canvasKeys = {
  all: ['canvas'] as const,
  list: () => [...canvasKeys.all, 'list'] as const,
  canvas: (id: string) => [...canvasKeys.list(), id] as const,
};

export function listCanvasQueryOptions() {
  return queryOptions({
    queryKey: canvasKeys.list(),
    queryFn: canvasObjectService.getAll,
  });
}

function canvasQueryOptions(id: string) {
  return queryOptions({
    queryKey: canvasKeys.canvas(id),
    queryFn: () => canvasObjectService.getById(id),
    initialData: () => {
      const canvases = queryClient.getQueryData<CanvasObject[]>(canvasKeys.list());
      return canvases?.find((canvas: CanvasObject) => canvas.id === Number(id));
    },
  });
}

function itemQueryOptions(id: string) {
  return queryOptions({
    queryKey: itemKeys.item(id),
    queryFn: () => itemService.getById(id),
    initialData: () => {
      const items = queryClient.getQueryData<Item[]>(itemKeys.list());
      return items?.find((item: Item) => item.id === Number(id));
    },
  });
}

export function useCanvasQuery(id: string) {
  return useSuspenseQuery(canvasQueryOptions(id));
}

export function useItemQuery(id: string) {
  return useSuspenseQuery(itemQueryOptions(id));
}

export default queryClient;
