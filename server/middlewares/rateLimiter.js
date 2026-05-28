import rateLimit from "express-rate-limit";

const json = (message) => ({ success: false, message });

// Broad protection for the whole API surface.
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 600,
  standardHeaders: true,
  legacyHeaders: false,
  message: json("Too many requests, please slow down and try again later."),
});

// Tight limit for credential endpoints to blunt brute-force / credential stuffing.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: json("Too many login attempts. Please try again in a few minutes."),
});

// Limit for unauthenticated public writes (orders, contact messages) to curb spam.
export const writeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: json("Too many submissions from this network. Please try again later."),
});
