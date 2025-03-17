import { Router, Request, Response } from "express";
import { createUser, getUserById, getAllUsers } from "../models/User.model";

const router = Router();

router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { ip } = req.body;
    const user = await createUser(ip);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get("/", async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;