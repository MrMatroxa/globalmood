import { Router, Request, Response } from "express";
import { createProfile, getProfileById } from "../models/Profile.model";

const router = Router();

router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const profile = await createProfile(req.body);
    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const profile = await getProfileById(req.params.id);
    if (profile) {
      res.status(200).json(profile);
    } else {
      res.status(404).json({ message: "Profile not found" });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;