"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function p2pTransfer(to: string, amount: number) {
  const session = await getServerSession(authOptions);
  const from = session?.user.id;
  if (!from) {
    messege: "Error while Sending Money";
  }

  const user = await prisma.user.findFirst({
    where: {
      number: to,
    },
  });
  if (!user) {
    return {
      messege: "user not found",
    };
  }
  // transaction is use to  query either together all or none...
  await prisma.$transaction(async (tx) => {
    //the below line is written for locking the database so that no two or more request goes parallely, now they will execute sequentialy...
    await tx.$queryRaw`SELECT * FROM "balance" WHERE "userId" = ${Number(from)} FOR UPDATE`;
    const balance = await tx.balance.findUnique({
      where: {
        userId: Number(from),
      },
    });
    if (!balance || balance.amount < amount) {
      throw new Error("insufficient Fund");
    }

    await tx.balance.update({
      where: {
        userId: Number(from),
      },
      data: {
        amount: {
          decrement: amount,
        },
      },
    });
    await tx.balance.update({
      where: {
        userId: Number(user.id),
      },
      data: {
        amount: {
          increment: amount,
        },
      },
    });

    await tx.p2pTransaction.create({
      data: {
        amount,
        fromUserId: Number(from),
        toUserId: Number(user.id),
        timeStamp: new Date(),
      },
    });
  });
}
