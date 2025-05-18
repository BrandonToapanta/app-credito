-- AddForeignKey
ALTER TABLE "Credit" ADD CONSTRAINT "Credit_clientAddress_fkey" FOREIGN KEY ("clientAddress") REFERENCES "User"("walletAddress") ON DELETE RESTRICT ON UPDATE CASCADE;
