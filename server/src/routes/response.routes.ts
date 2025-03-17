import { Router, Request, Response } from "express";
import { createResponse, getResponseById } from "../models/Response.model";

const router = Router();

router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
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

export default router;