import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { logger } from "../middleware/logger";
import { prismaClient } from "..";
import type { CanvasObject } from "@repo/types/canvasObject.schema";

type CanvasBody = Pick<CanvasObject, "name" | "content">;

export const getCanvas = asyncHandler(async (req: Request, res: Response) => {
  logger.info("Fetching all canvas data");
  const canvasData = await prismaClient.canvas.findMany();
  logger.info(
    `Successfully fetched canvas data: ${String(canvasData.length)} entries`,
  );
  res.status(200).json(canvasData);
});

export const getCanvasByID = asyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    const canvasId = Number(id);

    logger.info("Fetching Canvas object: ", canvasId);

    const requestedCanvas = await prismaClient.canvas.findUnique({
      where: {
        id: canvasId,
      },
      include: {
        lines: true,
        rectangle: true,
        text: true,
        circle: true,
        menuItem: true,
      },
    });

    logger.info(`Successfully fetched canvas data for ID: ${id}`);
    res.status(200).json(requestedCanvas);
  },
);

export const createCanvas = asyncHandler(
  async (req: Request, res: Response) => {
    const { name } = req.body as { name: string };
    logger.info("Creating new canvas with the name " + name);

    const newCanvas = await prismaClient.canvas.create({
      data: { name },
    });

    logger.info(`Successfully created canvas with ID: ${String(newCanvas.id)}`);
    res.status(201).json(newCanvas);
  },
);

export const updateCanvas = asyncHandler(
  async (req: Request<{ id: string }, unknown, CanvasBody>, res: Response) => {
    const { id } = req.params;
    const canvasId = Number(id);
    logger.info("Updating canvas", canvasId);

    if (isNaN(canvasId)) {
      logger.warn(`Invalid canvas ID provided: ${id}`);
      res.status(400).json({ error: "Invalid canvas ID" });
      throw new Error("Invalid canvas ID");
    }

    const { name, content } = req.body;

    const updatedCanvas = await prismaClient.canvas.update({
      where: { id: canvasId },
      data: { name, content },
    });

    logger.info(
      `Successfully updated canvas with ID: ${String(updatedCanvas.id)}`,
    );
    res.status(201).json({ updatedCanvas });
  },
);

export const deleteCanvas = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const canvasId = Number(id);
    logger.info("Deleting canvas with ID: " + String(canvasId));

    if (isNaN(canvasId)) {
      logger.warn(`Invalid canvas ID provided: ${id}`);
      res.status(400).json({ error: "Invalid canvas ID" });
      throw new Error("Invalid canvas ID");
    }

    const canvas = await prismaClient.canvas.delete({
      where: { id: canvasId },
    });

    logger.info(`Successfully deleted canvas with ID: ${id}`);
    res.status(200).json({ canvas });
  },
);
