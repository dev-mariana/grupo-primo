-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "from_account_id" TEXT,
    "to_account_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "account_number_key" ON "account"("number");

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_from_account_id_fkey" FOREIGN KEY ("from_account_id") REFERENCES "account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_to_account_id_fkey" FOREIGN KEY ("to_account_id") REFERENCES "account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
