import { Router } from "express";
import prisma from "../utils/prisma.js";
import express from "express";

/** @param {express.Application} app */
export default (app) => {
  const router = Router();

  app.use("/v1/users", router);

  router.post("/", async (req, res) => {
    const { name, email, password } = req.body;

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });

    res.status(201).json({
      user,
    });
  });

  router.get("/", async (req, res) => {
    const users = await prisma.user.findMany();

    res.status(200).json({
      users,
    });
  });

  router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    const users = await prisma.user.delete({
      where: {
        id: Number(id),
      },
    });

    res.status(200).json({
      users,
    });
  });

  router.patch("/:id", async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    const users = await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
      },
    });

    res.status(200).json({
      users,
    });
  });

  router.get("/:id", async (req, res) => {});
};
