import { z } from "zod";

export const TransactionType = [
  "PURCHASE",
  "SALE",
  "RETURN",
  "WASTE",
  "ADJUSTMENT",
] as const;
export const UnitOfMeasure = ["EA", "LB", "OZ", "KG", "G", "L", "ML"] as const;
export const Category = [
  "PRODUCE",
  "DAIRY",
  "BEVERAGES",
  "MEAT",
  "SEAFOOD",
  "BAKERY",
  "DRY_GOODS",
  "CANNED_GOODS",
  "FROZEN",
  "SPICES",
  "HOUSEHOLD",
  "PREPARED",
  "OTHER",
] as const;

export const MeatChoices = [
  "CARNE_ASADA",
  "CHORIZO",
  "TRIPA",
  "LENGUA",
  "PASTOR",
  "CHICHARRONES",
  "ASADA_DE_POLLO",
] as const;

const MeatChoicesEnum = z.enum(MeatChoices);

export const StockBatchSchema = z.object({
  quantity_received: z.coerce.number().min(0),
  quantity_remaining: z.coerce.number().min(0),
  expiration_date: z.iso.datetime().or(z.string()).optional().default("N/A"),
  received_at: z.iso.datetime().or(z.string()).nullable().optional(),
  cost_of_purchase: z.string().nullable().optional(),
});

export const TransactionSchema = z.object({
  type: z.enum(TransactionType),
  quantity: z.coerce.number(),
  transaction_date: z.iso.datetime().or(z.string()),
});

export const WasteSchema = z.object({
  quantity: z.coerce.number(),
  reason: z.string().min(1, "Reason is required"),
  created_at: z.iso.datetime().or(z.string()),
});

export const ItemSchema = z
  .object({
    id: z.coerce.number(),
    clover_id: z.string().nullable().optional(),
    sku: z.string().min(1, "SKU is required"),
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    ingredients: z.string().optional(),
    uom: z.enum(UnitOfMeasure).optional(),
    price: z.coerce.number().min(0).optional(),
    vendor_id: z.number().nullable().optional(),
    low_stock_threshold: z.coerce.number().optional(),
    category: z.enum(Category),
    image_url: z.string().optional(),

    meat_choices: z.array(MeatChoicesEnum).optional().default([]),
    stock_batch: z.array(StockBatchSchema).optional().default([]),
    transaction: z.array(TransactionSchema).optional().default([]),
    waste: z.array(WasteSchema).optional().default([]),
  })
  .transform((item) => {
    const totalFromBatches = item.stock_batch.reduce(
      (sum, batch) => sum + batch.quantity_remaining,
      0,
    );
    return {
      ...item,
      quantity_remaining: totalFromBatches,
    };
  });

export type Item = z.infer<typeof ItemSchema>;
export type StockBatch = z.infer<typeof StockBatchSchema>;
export type Transaction = z.infer<typeof TransactionSchema>;
export type Waste = z.infer<typeof WasteSchema>;
