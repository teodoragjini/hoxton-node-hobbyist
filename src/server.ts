import express, { response } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ log: ["warn", "error", "info", "query"] });
const app = express();
app.use(cors());
app.use(express.json());

const port = 1234;

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany({
    include: { hobbies: true },
  });
  res.send(users);
});

app.get("/users/:id", async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(req.params.id) },
    include: { hobbies: true },
  });

  if (user) {
    res.send(user);
  } else {
    res.status(404).send({ error: "User not found" });
  }
});

app.post("/users", async (req, res) => {
  const userData = { hobbies: req.body.hobbies ? req.body.hobbies : [] };

  const user = await prisma.user.create({
    data: {
      name: req.body.name,
      url: req.body.url,
      email: req.body.email,
      hobbies: {
        //@ts-ignore
        connectOrCreate: userData.hobbies.map((hobby) => ({
          where: { name: hobby },
          create: { name: hobby },
        })),
      },
    },
    include: { hobbies: true },
  });
  res.send(user);
});

app.delete("/users/:id", async (req, res) => {
  const id = Number(req.params.id);
  const user = await prisma.user.delete({
    where: { id },
  });
  res.send(user);
});

app.patch("/users/:id", async (req, res) => {
  const id = Number(req.params.id);
  const user = await prisma.user.update({
    where: { id },
    data: req.body,
    include: { hobbies: true },
  });
  res.send(user);
});

//HOBBIES

app.get("/hobbies", async (req, res) => {
  const hobby = await prisma.hobby.findMany({
    include: { users: true },
  });
  res.send(hobby);
});

app.get("/hobbies/:id", async (req, res) => {
  const id = Number(req.params.id);
  const hobby = await prisma.hobby.findUnique({
    where: { id },
    include: { users: true },
  });

  if (hobby) {
    res.send(hobby);
  } else {
    res.status(404).send({ error: "Hobby not found." });
  }
});

app.post("/hobbies", async (req, res) => {
  const hobbyData = {
    users: req.body.users ? req.body.users : [],
  };

  const hobby = await prisma.hobby.create({
    data: {
      name: req.body.name,
      image: req.body.image,
      active: req.body.active,
      users: {
        //@ts-ignore

        connectOrCreate: hobbyData.users.map((user) => ({
          where: { name: user },
          create: { name: user },
        })),
      },
    },
    include: { users: true },
  });
  res.send(hobby);
});

app.delete("/hobbies/:id", async (req, res) => {
  const id = Number(req.params.id);
  const hobby = await prisma.hobby.delete({
    where: { id },
  });
  res.send(hobby);
});

app.patch("/hobbies/:id", async (req, res) => {
  const id = Number(req.params.id);
  const hobby = await prisma.hobby.update({
    where: { id },
    data: req.body,
    include: { users: true },
  });
  res.send(hobby);
});

app.listen(port, () => {
  console.log(`Runing: http://localhost:${port}`);
});


//Red underlines, but the server is runing without problems