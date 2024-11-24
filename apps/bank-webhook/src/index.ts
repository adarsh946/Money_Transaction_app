import db from "@repo/db/client";
import express from "express";

const app = express();

app.get("/hdfcWebhook", async (req, res) => {
  const paymentValidation = {
    token: req.body.token,
    userId: req.body.user_identifier,
    amount: req.body.amount,
  };

  try {
    await db.$transaction([
      db.balance.updateMany({
        where: {
          userId: Number(paymentValidation.userId),
        },
        data: {
          amount: {
            increment: paymentValidation.amount,
          },
        },
      }),
      db.onRampTransaction.updateMany({
        where: {
          token: paymentValidation.token,
        },
        data: {
          status: "Success",
        },
      }),
    ]);
    res.status(200).json({
      messege: "Captured",
    });
  } catch (error) {
    console.error(error);
    res.status(411).json({
      messege: "Error while processing webhook",
    });
  }
});

app.listen(3003);
