import { Request, Response, NextFunction, RequestHandler } from "express";
import { validationResult, ValidationChain } from "express-validator";

export abstract class BaseValidator {
  protected abstract rules(): ValidationChain[];

  public get validate(): RequestHandler[] {
    return [
      ...this.rules(),
      (req: Request, res: Response, next: NextFunction): void => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          res.status(400).json({ errors: errors.array() });
          return;
        }
        next();
      },
    ];
  }
}
