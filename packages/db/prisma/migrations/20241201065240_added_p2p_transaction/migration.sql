-- CreateTable
CREATE TABLE "P2pTransaction" (
    "id" SERIAL NOT NULL,
    "amount" INTEGER NOT NULL,
    "timeStamp" TIMESTAMP(3) NOT NULL,
    "toUserId" INTEGER NOT NULL,
    "fromUserId" INTEGER NOT NULL,

    CONSTRAINT "P2pTransaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "P2pTransaction" ADD CONSTRAINT "P2pTransaction_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "P2pTransaction" ADD CONSTRAINT "P2pTransaction_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
