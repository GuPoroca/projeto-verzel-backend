/*
  Warnings:

  - You are about to drop the column `tmdbId` on the `Movie` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Movie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "rating" REAL NOT NULL,
    "image" TEXT NOT NULL
);
INSERT INTO "new_Movie" ("id", "image", "name", "rating") SELECT "id", "image", "name", "rating" FROM "Movie";
DROP TABLE "Movie";
ALTER TABLE "new_Movie" RENAME TO "Movie";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
