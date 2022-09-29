import express from "express";
import cors from "cors";
import { PrismaClient, Transaction, Invoice } from "@prisma/client";

const app = express();

app.use(express.json());
app.use(cors());

const prisma = new PrismaClient();

// HANDLE CLIENTS

app.post("/clients", async (request, response) => {
  const body: { name: string; email: string } = request.body;

  await prisma.client.create({
    data: {
      name: body.name,
      email: body.email,
    },
  });

  const clients = await prisma.client.findMany({
    include: {
      transactions: true,
      invoices: true,
    },
  });

  return response.json(clients);
});

app.get("/clients", async (request, response) => {
  const clients = await prisma.client.findMany({
    include: {
      transactions: true,
      invoices: true,
    },
  });

  return response.json(clients);
});

// HANDLE TRANSACTIONS

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

app.get("/clients/:id/transactions", async (request, response) => {
  const clientId = request.params.id;

  const transactions = await prisma.transaction.findMany({
    select: {
      id: true,
      title: true,
      createAt: true,
      type: true,
      price: true,
      description: true,
    },
    where: {
      clientId,
    },
    orderBy: {
      createAt: "asc",
    },
  });

  return response.json(transactions);
});

// HANDLE INVOICES

app.post("/clients/:id/invoices", async (request, response) => {
  const clientId = request.params.id;
  const body: Omit<Invoice, "id"> = request.body;

  const invoice = await prisma.invoice.create({
    data: {
      clientId,
      title: body.title,
      status: body.status,
      price: body.price,
      dueDate: new Date(body.dueDate),
    },
  });

  return response.status(201).json(invoice);
});

app.get("/clients/:id/invoices", async (request, response) => {
  const clientId = request.params.id;

  const invoices = await prisma.invoice.findMany({
    select: {
      id: true,
      title: true,
      status: true,
      price: true,
      dueDate: true,
    },
    where: {
      clientId,
    },
    orderBy: {
      dueDate: "asc",
    },
  });

  return response.json(invoices);
});

app.listen(3333);
