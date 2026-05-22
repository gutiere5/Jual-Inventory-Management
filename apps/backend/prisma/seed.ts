import {
  PrismaClient,
  TransactionType,
  WasteReason,
  UnitOfMeasure,
  Category, // Added Category here
} from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { DATABASE_URL } from "../src/secrets";
import { logger } from "../src/middleware/logger";

const connectionString = DATABASE_URL;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Create a Default User
  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      username: "admin",
      password: "hashed_password_here",
    },
  });

  // 1. Create Vendors
  const farmA = await prisma.vendor.upsert({
    where: { clover_id: "VEN_001" },
    update: {},
    create: { clover_id: "VEN_001", name: "Local Farm A" },
  });

  const bakeryCorp = await prisma.vendor.upsert({
    where: { clover_id: "VEN_002" },
    update: {},
    create: { clover_id: "VEN_002", name: "Best Bakery Inc." },
  });

  const bevDist = await prisma.vendor.upsert({
    where: { clover_id: "VEN_003" },
    update: {},
    create: { clover_id: "VEN_003", name: "Drink Distributors" },
  });

  const apple = await prisma.item.upsert({
    where: { sku: "APPLE-002" },
    update: {},
    create: {
      sku: "APPLE-002",
      name: "Gala Apple",
      description: "Crisp, sweet, and juicy red apples from local orchards.",
      ingredients: "100% Gala Apple",
      image_url: "https://images.unsplash.com/photo-1560806887-1e4cd0b6bcd6",
      uom: UnitOfMeasure.EA,
      category: Category.PRODUCE,
      vendor_id: farmA.id,
      low_stock_threshold: 50,
      price: 0.99,
    },
  });

  const milk = await prisma.item.upsert({
    where: { sku: "MILK-001" },
    update: {},
    create: {
      sku: "MILK-001",
      name: "Organic Whole Milk",
      description: "Grade A pasteurized whole milk from grass-fed cows.",
      ingredients: "Organic Milk, Vitamin D3",
      image_url: "https://images.unsplash.com/photo-1550583724-1255818c053b",
      uom: UnitOfMeasure.L,
      category: Category.DAIRY,
      vendor_id: farmA.id,
      low_stock_threshold: 10,
      price: 4.5,
    },
  });

  const bread = await prisma.item.upsert({
    where: { sku: "BREAD-001" },
    update: {},
    create: {
      sku: "BREAD-001",
      name: "Sourdough Bread",
      description: "Artisan sourdough loaf with a thick crust and airy center.",
      ingredients: "Wheat Flour, Water, Sea Salt, Natural Sourdough Starter",
      image_url: "https://images.unsplash.com/photo-1585478259715-876acc5be8eb",
      uom: UnitOfMeasure.EA,
      category: Category.BAKERY,
      vendor_id: bakeryCorp.id,
      low_stock_threshold: 15,
      price: 6.0,
    },
  });

  const juice = await prisma.item.upsert({
    where: { sku: "JUICE-001" },
    update: {},
    create: {
      sku: "JUICE-001",
      name: "Orange Juice",
      description: "Custom Description for juice",
      image_url: "https://images.unsplash.com/photo-1585478259715-876acc5be8eb",
      ingredients: "100% Orange Juice",
      uom: UnitOfMeasure.L,
      category: Category.BEVERAGES,
      vendor_id: bevDist.id,
      low_stock_threshold: 20,
      price: 5.0,
    },
  });

  const salmon = await prisma.item.upsert({
    where: { sku: "FISH-001" },
    update: {},
    create: {
      sku: "FISH-001",
      name: "Wild Caught Salmon",
      description: "Freshly caught Atlantic salmon fillets.",
      ingredients: "Salmon",
      image_url: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2",
      uom: UnitOfMeasure.LB,
      category: Category.SEAFOOD,
      vendor_id: farmA.id,
      low_stock_threshold: 5,
      price: 18.99,
    },
  });

  const water = await prisma.item.upsert({
    where: { sku: "WATER-001" },
    update: {},
    create: {
      sku: "WATER-001",
      name: "Spring Water",
      description: "Just Plain Water",
      ingredients: "Water",
      image_url: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2",
      uom: UnitOfMeasure.ML,
      category: Category.BEVERAGES,
      vendor_id: bevDist.id,
      low_stock_threshold: 100,
      price: 5.99,
    },
  });

  // 3. Create Batches (Inventory Layer)
  const appleBatch = await prisma.stock_batch.create({
    data: {
      item_id: apple.id,
      quantity_received: 100,
      quantity_remaining: 95,
      cost_at_purchase: 0.5,
      expiration_date: new Date("2026-03-01"),
    },
  });

  const waterBatch = await prisma.stock_batch.create({
    data: {
      item_id: water.id,
      quantity_received: 100,
      quantity_remaining: 95,
      cost_at_purchase: 0.5,
      expiration_date: new Date("2026-03-01"),
    },
  });

  const salmonBatch = await prisma.stock_batch.create({
    data: {
      item_id: salmon.id,
      quantity_received: 100,
      quantity_remaining: 95,
      cost_at_purchase: 0.5,
      expiration_date: new Date("2026-03-01"),
    },
  });

  const breadBatch = await prisma.stock_batch.create({
    data: {
      item_id: bread.id,
      quantity_received: 50,
      quantity_remaining: 20,
      cost_at_purchase: 2.0,
      expiration_date: new Date("2026-01-10"),
    },
  });

  const juiceBatch = await prisma.stock_batch.create({
    data: {
      item_id: juice.id,
      quantity_received: 200,
      quantity_remaining: 190,
      cost_at_purchase: 1.5,
      expiration_date: new Date("2026-06-01"),
    },
  });

  // 4. Create Transactions (Audit Layer)
  await prisma.transaction.createMany({
    data: [
      {
        item_id: apple.id,
        batch_id: appleBatch.id,
        type: TransactionType.PURCHASE,
        quantity: 100,
      },
      {
        item_id: water.id,
        batch_id: waterBatch.id,
        type: TransactionType.PURCHASE,
        quantity: 100,
      },
      {
        item_id: salmon.id,
        batch_id: salmonBatch.id,
        type: TransactionType.PURCHASE,
        quantity: 100,
      },
      {
        item_id: apple.id,
        batch_id: appleBatch.id,
        type: TransactionType.SALE,
        quantity: 5,
      },
      {
        item_id: bread.id,
        batch_id: breadBatch.id,
        type: TransactionType.PURCHASE,
        quantity: 50,
      },
      {
        item_id: bread.id,
        batch_id: breadBatch.id,
        type: TransactionType.SALE,
        quantity: 30,
      },
      {
        item_id: juice.id,
        batch_id: juiceBatch.id,
        type: TransactionType.PURCHASE,
        quantity: 200,
      },
      {
        item_id: juice.id,
        batch_id: juiceBatch.id,
        type: TransactionType.SALE,
        quantity: 10,
      },
    ],
  });

  // 5. Create Waste Record
  await prisma.waste.createMany({
    data: [
      { item_id: milk.id, quantity: 1, reason: WasteReason.DAMAGED },
      {
        item_id: bread.id,
        batch_id: breadBatch.id,
        quantity: 2,
        reason: WasteReason.EXPIRED,
      },
    ],
  });
}

main()
  .catch((e: unknown) => {
    logger.error("Error seeding database", { error: e });
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
