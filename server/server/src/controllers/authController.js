import * as authService from "../services/authService.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const register = asyncHandler(async (req, res) => {
  const data = await authService.registerUser(req.body);

  res.cookie("refreshToken", data.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(201).json({
    accessToken: data.accessToken,
    user: data.user,
  });
});

export const login = asyncHandler(async (req, res) => {
  const data = await authService.loginUser(req.body);

  res.cookie("refreshToken", data.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.json({
    accessToken: data.accessToken,
    user: data.user,
  });
});

export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;

  const data = await authService.refreshUserToken(token);

  res.cookie("refreshToken", data.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.json({
    accessToken: data.accessToken,
  });
});


export const logout = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;

  await authService.logoutUser(token);

  res.clearCookie("refreshToken");

  res.json({
    message: "Logged out successfully",
  });
});
