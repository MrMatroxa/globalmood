import { Router, Request, Response } from "express";
import { createSurvey, getSurveyById } from "../models/Survey.model";

const router = Router();

router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const survey = await createSurvey(req.body);
    res.status(201).json(survey);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const survey = await getSurveyById(req.params.id);
    if (survey) {
      res.status(200).json(survey);
    } else {
      res.status(404).json({ message: "Survey not found" });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;