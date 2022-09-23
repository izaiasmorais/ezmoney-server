import express from "express";
import cors from "cors";
import { PrismaClient, Transaction } from "@prisma/client";

const app = express();

app.use(express.json());
app.use(cors());

const prisma = new PrismaClient();

app.post("/clients", async (request, response) => {
  const body: { name: string; email: string } = request.body;

  const transactions = await prisma.client.create({
    data: {
      name: body.name,
      email: body.email,
    },
  });

  return response.json(transactions);
});

app.get("/clients", async (request, response) => {
  const clients = await prisma.client.findMany({
    include: {
      transactions: true,
    },
  });

  return response.json(clients);
});

// =====================================================================

app.post("/clients/:id/transactions", async (request, response) => {
  const clientId = request.params.id;
  const body: Omit<Transaction, "id"> = request.body;

  const transaction = await prisma.transaction.create({
    data: {
      clientId,
      createAt: new Date(),
      description: body.description,
      price: body.price,
      title: body.title,
      type: body.type,
    },
  });

  return response.status(201).json(transaction);
});

// =====================================================================

app.listen(3333);
