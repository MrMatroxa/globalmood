import { Router, Request, Response } from "express";
import { createSelectedOption, getSelectedOptionById } from "../models/SelectedOption.model";

const router = Router();

router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const selectedOption = await createSelectedOption(req.body);
    res.status(201).json(selectedOption);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const selectedOption = await getSelectedOptionById(req.params.id);
    if (selectedOption) {
      res.status(200).json(selectedOption);
    } else {
      res.status(404).json({ message: "SelectedOption not found" });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;