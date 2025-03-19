import { Router, Request, Response } from "express";
import prisma from "../db/index";

const router = Router();

// Helper function to get date range based on period
const getDateRange = (period: string): { start: Date; end: Date } => {
  const now = new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  switch (period) {
    case 'today':
      return { start: today, end: tomorrow };
    case 'yesterday': {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return { start: yesterday, end: today };
    }
    case 'week': {
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      const sixDaysAgo = new Date(weekAgo);
      sixDaysAgo.setDate(sixDaysAgo.getDate() + 1);
      return { start: weekAgo, end: sixDaysAgo };
    }
    case 'month': {
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      const monthAgoCopy = new Date(monthAgo);
      monthAgoCopy.setDate(monthAgoCopy.getDate() + 1);
      return { start: monthAgo, end: monthAgoCopy };
    }
    default:
      return { start: today, end: tomorrow }; 
  }
};

// Helper function to get mood counts for a date range
const getMoodCounts = async (startDate: Date, endDate: Date) => {
  const goodCount = await prisma.selectedOption.count({
    where: {
      value: "good",
      answer: {
        question: { id: "mood-question-1" },
        response: {
          createdAt: {
            gte: startDate,
            lt: endDate
          }
        }
      }
    }
  });

  const badCount = await prisma.selectedOption.count({
    where: {
      value: "bad",
      answer: {
        question: { id: "mood-question-1" },
        response: {
          createdAt: {
            gte: startDate,
            lt: endDate
          }
        }
      }
    }
  });

  return { good: goodCount, bad: badCount };
};

// Enhanced endpoint that supports comparison between periods
router.get("/mood", async (req: Request, res: Response): Promise<void> => {
  try {
    const period = (req.query.period as string) || 'today';
    const comparison = req.query.comparison as string;
    
    // Get primary period data
    const { start, end } = getDateRange(period);
    const primaryData = await getMoodCounts(start, end);
    
    let result: any = {
      [period]: primaryData
    };
    
    // Add comparison data if requested
    if (comparison) {
      const comparisonRange = getDateRange(comparison);
      const comparisonData = await getMoodCounts(comparisonRange.start, comparisonRange.end);
      result[comparison] = comparisonData;
    }
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;