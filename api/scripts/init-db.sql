-- Criar tabela de usuários (admins)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(20) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar índice no email
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Criar tabela de posts do blog
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt VARCHAR(300),
  category VARCHAR(50) NOT NULL,
  image VARCHAR(500),
  keywords TEXT[],
  meta_description VARCHAR(160),
  status VARCHAR(20) DEFAULT 'draft',
  author_id UUID REFERENCES users(id),
  published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices para posts
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);

-- Criar tabela de leads/contatos
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  interest VARCHAR(50) NOT NULL,
  message TEXT,
  status VARCHAR(20) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices para leads
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);

-- Criar tabela de depoimentos
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  position VARCHAR(100),
  company VARCHAR(100),
  content TEXT NOT NULL,
  avatar VARCHAR(500),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  display_order INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices para testimonials
CREATE INDEX IF NOT EXISTS idx_testimonials_status ON testimonials(status);
CREATE INDEX IF NOT EXISTS idx_testimonials_display_order ON testimonials(display_order);

-- Inserir usuário admin padrão (senha: Admin@123)
-- Você DEVE mudar esta senha em produção!
INSERT INTO users (email, password_hash, name, role)
VALUES (
  'admin@janicecorreia.com',
  '$2b$10$YourHashedPasswordHere',
  'Administrador',
  'admin'
) ON CONFLICT (email) DO NOTHING;

-- Comentário: Para gerar o hash da senha, use:
-- const bcrypt = require('bcrypt');
-- bcrypt.hash('Admin@123', 10, (err, hash) => console.log(hash));
