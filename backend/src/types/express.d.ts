declare global {
  namespace Express {
    interface Request {
      userId?: Types.ObjectId;
    }
  }
}

export {};
