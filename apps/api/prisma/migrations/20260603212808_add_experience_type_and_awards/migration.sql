-- CreateEnum
CREATE TYPE "ExperienceType" AS ENUM ('WORK', 'INTERNSHIP', 'FREELANCE', 'LEADERSHIP');

-- AlterEnum
ALTER TYPE "PageSectionType" ADD VALUE 'ACHIEVEMENTS';

-- AlterTable
ALTER TABLE "Experience" ADD COLUMN     "experienceType" "ExperienceType" NOT NULL DEFAULT 'WORK';

-- CreateTable
CREATE TABLE "Award" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "issuer" TEXT NOT NULL,
    "description" TEXT,
    "year" INTEGER NOT NULL,
    "iconUrl" TEXT,
    "url" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Award_pkey" PRIMARY KEY ("id")
);
