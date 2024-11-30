"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export const createOnRampTransaction = async (
  provider: string,
  amount: number
) => {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;
  if (!userId) {
    return {
      messege: "unauthenticated Request",
    };
  }

  const token = (Math.random() * 1000).toString();
  await prisma.onRampTransaction.create({
    data: {
      status: "Processing",
      startTime: new Date(),
      token: token,
      provider,
      amount: amount * 100,
      userId: Number(userId),
    },
  });
  return {
    messege: "done",
  };
};
