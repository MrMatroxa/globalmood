import { Router, Request, Response, NextFunction } from "express";
import userRoutes from "./user.routes";
import answerRoutes from "./answer.routes";
import insightRoutes from "./insight.routes";
import profileRoutes from "./profile.routes";
import questionRoutes from "./question.routes";
import responseRoutes from "./response.routes";
import selectedOptionRoutes from "./selectedOption.routes";
import surveyRoutes from "./survey.routes";

const router = Router();

router.use("/users", userRoutes);
router.use("/answers", answerRoutes);
router.use("/insights", insightRoutes);
router.use("/profiles", profileRoutes);
router.use("/questions", questionRoutes);
router.use("/responses", responseRoutes);
router.use("/selected-options", selectedOptionRoutes);
router.use("/surveys", surveyRoutes);

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json("All good in here");
});

export default router;