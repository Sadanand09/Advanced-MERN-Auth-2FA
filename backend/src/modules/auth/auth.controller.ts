import { HTTPSTATUS } from '../../config/http.config';
import { Request, Response } from "express";
import { asyncHandler } from '../../middlewares/asyncHandler';
import { AuthService } from './auth.service';

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }
  public register = asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
      return res.status(HTTPSTATUS.CREATED).json({
        message: "User registered successfully",
      });
    }
  );
}