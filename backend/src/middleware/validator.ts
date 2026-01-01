import { Request, Response, NextFunction } from "express";
import { z } from "zod";

const urlSchema = z.object({
  url: z.string().url("Invalid URL format").max(2048, "URL too long"),
});

export const validatePreviewRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validated = urlSchema.parse(req.query);
    req.validatedQuery = validated;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation failed",
        details: error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      });
    }
    return res.status(400).json({ error: "Invalid request" });
  }
};

declare global {
  namespace Express {
    interface Request {
      validatedQuery?: z.infer<typeof urlSchema>;
    }
  }
}

