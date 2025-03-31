-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMINISTRADOR', 'ASESOR');

-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('Credito de Consumo', 'Libranza Libre Inversión', 'Tarjeta de Credito');

-- CreateEnum
CREATE TYPE "Franchise" AS ENUM ('AMEX', 'VISA', 'MASTERCARD');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('ABIERTO', 'EN_PROCESO', 'FINALIZADO');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ASESOR',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "productType" "ProductType" NOT NULL,
    "requestedQuota" INTEGER NOT NULL,
    "franchise" "Franchise",
    "rate" DOUBLE PRECISION,
    "status" "ProductStatus" NOT NULL DEFAULT 'ABIERTO',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by_id" INTEGER NOT NULL,
    "updated_by_id" INTEGER NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
