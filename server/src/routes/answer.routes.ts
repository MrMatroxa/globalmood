import { Router, Request, Response } from "express";
import { createAnswer, getAnswerById } from "../models/Answer.model";

const router = Router();

router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const answer = await createAnswer(req.body);
    res.status(201).json(answer);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const answer = await getAnswerById(req.params.id);
    if (answer) {
      res.status(200).json(answer);
    } else {
      res.status(404).json({ message: "Answer not found" });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;