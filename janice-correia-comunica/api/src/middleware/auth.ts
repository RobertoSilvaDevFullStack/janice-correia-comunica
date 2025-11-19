import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Se precisar gerar o hash, faça isso fora do middleware!
// import bcrypt from "bcrypt"; // Só se for realmente usar aqui no contexto

interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload;
  }
}

// Middleware para autenticação do token JWT
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET não configurado");
    }

    // NÃO GERE O HASH AQUI !!!
    // Se quiser gerar/checar senha, isso é feito durante o login via bcrypt.compare()

    const decoded = jwt.verify(token, secret) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Token inválido ou expirado" });
  }
};

// Middleware para exigir role 'admin'
export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || req.user.role !== "admin") {
    return res
      .status(403)
      .json({ error: "Acesso negado. Requer permissões de administrador." });
  }
  next();
};
