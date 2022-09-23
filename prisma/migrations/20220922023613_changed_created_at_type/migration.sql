/*
  Warnings:

  - You are about to alter the column `createAt` on the `Transaction` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "createAt" DATETIME NOT NULL,
    "type" TEXT NOT NULL
);
INSERT INTO "new_Transaction" ("createAt", "description", "id", "price", "title", "type") SELECT "createAt", "description", "id", "price", "title", "type" FROM "Transaction";
DROP TABLE "Transaction";
ALTER TABLE "new_Transaction" RENAME TO "Transaction";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
