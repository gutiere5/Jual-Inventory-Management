import {
  PrismaClient,
  TransactionType,
  WasteReason,
  UnitOfMeasure,
  Category,
} from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { DATABASE_URL } from "../src/secrets";
import { logger } from "../src/middleware/logger";

const connectionString = DATABASE_URL;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function getOrCreateVendor(name: string) {
  const found = await prisma.vendor.findFirst({ where: { name } });
  if (found) return found;
  return prisma.vendor.create({ data: { name } });
}

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

  // Vendors (using find-or-create because `name` is not marked unique)
  const farmA = await getOrCreateVendor("Local Farm A");
  const bakeryCorp = await getOrCreateVendor("Best Bakery Inc.");
  const bevDist = await getOrCreateVendor("Drink Distributors");

  // Items (sku is unique so upsert works)
  const apple = await prisma.item.upsert({
    where: { sku: "APPLE-002" },
    update: {},
    create: {
      sku: "APPLE-002",
      name: "Gala Apple",
      description: "Crisp, sweet, and juicy red apples from local orchards.",
      ingredients: "100% Gala Apple",
      imageUrl: "https://images.unsplash.com/photo-1560806887-1e4cd0b6bcd6",
      uom: UnitOfMeasure.EA,
      category: Category.PRODUCE,
      vendorId: farmA.id,
      lowStockThreshold: 50,
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
      imageUrl: "https://images.unsplash.com/photo-1550583724-1255818c053b",
      uom: UnitOfMeasure.L,
      category: Category.DAIRY,
      vendorId: farmA.id,
      lowStockThreshold: 10,
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
      imageUrl: "https://images.unsplash.com/photo-1585478259715-876acc5be8eb",
      uom: UnitOfMeasure.EA,
      category: Category.BAKERY,
      vendorId: bakeryCorp.id,
      lowStockThreshold: 15,
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
      imageUrl: "https://images.unsplash.com/photo-1585478259715-876acc5be8eb",
      ingredients: "100% Orange Juice",
      uom: UnitOfMeasure.L,
      category: Category.BEVERAGES,
      vendorId: bevDist.id,
      lowStockThreshold: 20,
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
      imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2",
      uom: UnitOfMeasure.LB,
      category: Category.SEAFOOD,
      vendorId: farmA.id,
      lowStockThreshold: 5,
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
      imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2",
      uom: UnitOfMeasure.ML,
      category: Category.BEVERAGES,
      vendorId: bevDist.id,
      lowStockThreshold: 100,
      price: 5.99,
    },
  });

  // Batches (inventory)
  const appleBatch = await prisma.stockBatch.create({
    data: {
      itemId: apple.id,
      quantityReceived: 100,
      quantityRemaining: 95,
      costAtPurchase: 0.5,
      expirationDate: new Date("2026-03-01"),
    },
  });

  const waterBatch = await prisma.stockBatch.create({
    data: {
      itemId: water.id,
      quantityReceived: 100,
      quantityRemaining: 95,
      costAtPurchase: 0.5,
      expirationDate: new Date("2026-03-01"),
    },
  });

  const salmonBatch = await prisma.stockBatch.create({
    data: {
      itemId: salmon.id,
      quantityReceived: 100,
      quantityRemaining: 95,
      costAtPurchase: 0.5,
      expirationDate: new Date("2026-03-01"),
    },
  });

  const breadBatch = await prisma.stockBatch.create({
    data: {
      itemId: bread.id,
      quantityReceived: 50,
      quantityRemaining: 20,
      costAtPurchase: 2.0,
      expirationDate: new Date("2026-01-10"),
    },
  });

  const juiceBatch = await prisma.stockBatch.create({
    data: {
      itemId: juice.id,
      quantityReceived: 200,
      quantityRemaining: 190,
      costAtPurchase: 1.5,
      expirationDate: new Date("2026-06-01"),
    },
  });

  // Transactions (audit)
  await prisma.transaction.createMany({
    data: [
      {
        itemId: apple.id,
        batchId: appleBatch.id,
        type: TransactionType.PURCHASE,
        quantity: 100,
      },
      {
        itemId: water.id,
        batchId: waterBatch.id,
        type: TransactionType.PURCHASE,
        quantity: 100,
      },
      {
        itemId: salmon.id,
        batchId: salmonBatch.id,
        type: TransactionType.PURCHASE,
        quantity: 100,
      },
      {
        itemId: apple.id,
        batchId: appleBatch.id,
        type: TransactionType.SALE,
        quantity: 5,
      },
      {
        itemId: bread.id,
        batchId: breadBatch.id,
        type: TransactionType.PURCHASE,
        quantity: 50,
      },
      {
        itemId: bread.id,
        batchId: breadBatch.id,
        type: TransactionType.SALE,
        quantity: 30,
      },
      {
        itemId: juice.id,
        batchId: juiceBatch.id,
        type: TransactionType.PURCHASE,
        quantity: 200,
      },
      {
        itemId: juice.id,
        batchId: juiceBatch.id,
        type: TransactionType.SALE,
        quantity: 10,
      },
    ],
  });

  // Waste records
  await prisma.waste.createMany({
    data: [
      { itemId: milk.id, quantity: 1, reason: WasteReason.DAMAGED },
      {
        itemId: bread.id,
        batchId: breadBatch.id,
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
