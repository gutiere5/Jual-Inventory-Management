-- CreateTable
CREATE TABLE "CanvasSettings" (
    "id" SERIAL NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "backgroundColor" TEXT NOT NULL,
    "showGrid" BOOLEAN NOT NULL,
    "gridSize" BOOLEAN NOT NULL,
    "canvasId" INTEGER,

    CONSTRAINT "CanvasSettings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CanvasSettings" ADD CONSTRAINT "CanvasSettings_canvasId_fkey" FOREIGN KEY ("canvasId") REFERENCES "Canvas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
