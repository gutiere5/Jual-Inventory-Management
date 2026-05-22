import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { prismaClient } from "..";
import { logger } from "../middleware/logger";
import type { Item } from "@repo/types/item.schema";

export const getItems = asyncHandler(async (req: Request, res: Response) => {
  logger.info("Fetching all items");
  const items = await prismaClient.item.findMany({
    include: {
      stock_batch: {
        select: {
          quantity_received: true,
          quantity_remaining: true,
          expiration_date: true,
          received_at: true,
          cost_at_purchase: true,
        },
      },
      transaction: {
        select: { type: true, quantity: true, transaction_date: true },
      },
      waste: {
        select: { quantity: true, reason: true, created_at: true },
      },
    },
  });

  logger.info(`Successfully fetched ${String(items.length)} items`);
  res.status(200).json({ items: items });
});

export const getItemsByID = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const itemId = Number(id);
    logger.info("Fetching item by ID");

    const requestedItem = await prismaClient.item.findUnique({
      where: {
        id: itemId,
      },
      include: {
        stock_batch: {
          select: {
            quantity_received: true,
            quantity_remaining: true,
            expiration_date: true,
            received_at: true,
            cost_at_purchase: true,
          },
        },
        transaction: {
          select: { type: true, quantity: true, transaction_date: true },
        },
        waste: {
          select: { quantity: true, reason: true, created_at: true },
        },
      },
    });
    logger.info(`Successfully fetched item data for ID: ${String(itemId)}`);
    res.status(200).json({ item: requestedItem });
  },
);

export const createItem = asyncHandler(async (req: Request, res: Response) => {
  const { sku, name, category, uom, low_stock_threshold } = req.body as Item;
  const existingItem = await prismaClient.item.findUnique({ where: { sku } });
  logger.info("Creating new item");

  if (existingItem) {
    logger.warn(`Attempt to create item with existing SKU: ${sku}`);
    throw new Error("Item with this SKU already exists");
  }

  const item = await prismaClient.item.create({
    data: { sku, name, uom, category, low_stock_threshold },
  });

  logger.info(`Successfully created Item ${String(item.name)}`);
  res.status(201).json({ item });
});

export const updateItem = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const itemId = Number(id);
  logger.info(`Updating item with ID: ${id}`);

  if (isNaN(itemId)) {
    res.status(400);
    throw new Error("Invalid Item ID");
  }

  const { name, uom, low_stock_threshold, category, image_url } =
    req.body as Item;

  const item = await prismaClient.item.update({
    where: { id: itemId },
    data: { name, uom, low_stock_threshold, category, image_url },
  });

  logger.info(`Successfully updated Item ${String(item.name)}`);
  res.status(201).json({ item });
});

export const deleteItem = asyncHandler(async (req: Request, res: Response) => {
  const { sku } = req.params as { sku: string };
  const item = await prismaClient.item.delete({ where: { sku } });
  logger.info("Deleting item");

  logger.info(`Successfully deleted Item with SKU: ${sku}`);
  res.status(200).json({ item });
});
