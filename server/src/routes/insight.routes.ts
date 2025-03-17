import { Router, Request, Response } from "express";
import { createInsight, getInsightById } from "../models/Insight.model";

const router = Router();

router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const insight = await createInsight(req.body);
    res.status(201).json(insight);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const insight = await getInsightById(req.params.id);
    if (insight) {
      res.status(200).json(insight);
    } else {
      res.status(404).json({ message: "Insight not found" });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;