import { Router, Request, Response } from "express";
import { createQuestion, getQuestionById } from "../models/Question.model";

const router = Router();

router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const question = await createQuestion(req.body);
    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const question = await getQuestionById(req.params.id);
    if (question) {
      res.status(200).json(question);
    } else {
      res.status(404).json({ message: "Question not found" });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;