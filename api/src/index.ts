import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import blogRoutes from "./routes/blog.routes";
import leadsRoutes from "./routes/leads.routes";
import testimonialsRoutes from "./routes/testimonials.routes";
import palestrasRoutes from "./routes/palestras.routes";
import mentoriasRoutes from "./routes/mentorias.routes";
import adminRoutes from "./routes/admin.routes";
import mediaRoutes from "./routes/media.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Behind reverse proxy (EasyPanel/Nginx) so trust X-Forwarded-* to get correct https
app.set("trust proxy", true);

// Security middleware
app.use(helmet());

// CORS configuration
const additionalOrigins = (process.env.CORS_ADDITIONAL_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:8080",
  "http://localhost:8081",
  process.env.FRONTEND_URL,
  ...additionalOrigins,
].filter(Boolean);

const allowedHosts = (allowedOrigins
  .map((o) => {
    try {
      return new URL(o as string).hostname.replace(/^www\./, "");
    } catch {
      return null;
    }
  })
  .filter(Boolean) as string[]);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      try {
        const host = new URL(origin).hostname.replace(/^www\./, "");
        if (allowedHosts.includes(host)) {
          return callback(null, true);
        }
      } catch (e) {
        return callback(new Error("Not allowed by CORS"));
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Muitas requisições deste IP, tente novamente em 15 minutos.",
});
app.use("/api/", limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads directory
const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express.static(uploadsDir));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/leads", leadsRoutes);
app.use("/api/testimonials", testimonialsRoutes);
app.use("/api/palestras", palestrasRoutes);
app.use("/api/mentorias", mentoriasRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/media", mediaRoutes);

// Static serving of uploads (already configured above)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada" });
});

// Error handler
app.use(
  (
    err: unknown,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Error:", err);

    let status = 500;
    let message = "Erro interno do servidor";

    if (typeof err === "object" && err !== null) {
      const e = err as { status?: unknown; message?: unknown };
      if (typeof e.status === "number") status = e.status;
      if (typeof e.message === "string") message = e.message;
    } else if (typeof err === "string") {
      message = err;
    }

    res.status(status).json({
      error: message,
    });
  }
);

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 Ambiente: ${process.env.NODE_ENV || "development"}`);
});
