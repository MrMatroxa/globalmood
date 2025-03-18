import { Router, Request, Response } from "express";
import {
  createResponse,
  getResponseById,
  hasUserVotedToday,
} from "../models/Response.model";

const router = Router();

router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { surveyId, userId } = req.body;

    // Check if user has already voted today
    if (userId) {
      const alreadyVoted = await hasUserVotedToday(userId);
      if (alreadyVoted) {
        res.status(403).json({
          message: "You have already submitted your mood for today",
          alreadyVoted: true,
        });
        return;
      }
    }

    // Proceed with creating the response if they haven't voted
    const response = await createResponse(req.body);
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const response = await getResponseById(req.params.id);
    if (response) {
      res.status(200).json(response);
    } else {
      res.status(404).json({ message: "Response not found" });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get("/check/:userId", async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const alreadyVoted = await hasUserVotedToday(userId);
    res.json({ alreadyVoted });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
