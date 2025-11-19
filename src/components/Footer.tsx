import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Mail,
  Phone,
  Linkedin,
  Instagram,
  Facebook,
  MapPin,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Footer = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    toast({
      title: "Inscrição realizada!",
      description: "Você receberá nossos conteúdos exclusivos em breve.",
    });

    setEmail("");
    setIsOpen(false);
  };

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const quickLinks = [
    { label: "Home", href: "#home" },
    { label: "Sobre", href: "#sobre" },
    { label: "Palestras", href: "#palestras" },
    { label: "Mentorias", href: "#mentorias" },
    { label: "Blog", href: "#blog" },
    { label: "Depoimentos", href: "#depoimentos" },
  ];

  return (
    <footer id="contato" className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Sobre */}
          <div>
            <h3 className="font-serif text-2xl font-bold mb-4">
              Janice Correia
            </h3>
            <p className="text-primary-foreground/80 mb-4">
              Especialista em comunicação corporativa e oratória, ajudando
              profissionais e empresas a alcançarem resultados extraordinários.
            </p>
            <p className="text-sm italic text-primary-foreground/70">
              "Comunicar bem é investir nos resultados do seu negócio"
            </p>
          </div>

          {/* Links Rápidos */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">
              Links Rápidos
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">Contato</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Mail size={18} />
                <a
                  href="mailto:contato@janicecorreia.com.br"
                  className="text-primary-foreground/80 hover:text-primary-foreground"
                >
                  contato@janicecorreia.com.br
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={18} />
                <a
                  href="tel:+5511999999999"
                  className="text-primary-foreground/80 hover:text-primary-foreground"
                >
                  (11) 99999-9999
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={18} />
                <span className="text-primary-foreground/80">
                  São Paulo, SP
                </span>
              </li>
            </ul>

            <div className="flex gap-4 mt-6">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
              >
                <Linkedin size={24} />
              </a>
              <a
                href="https://www.instagram.com/janic_correia/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
              >
                <Instagram size={24} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
              >
                <Facebook size={24} />
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">
              Newsletter
            </h4>
            <p className="text-primary-foreground/80 mb-4">
              Receba conteúdos exclusivos, dicas e novidades sobre comunicação
              corporativa.
            </p>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button variant="secondary" className="w-full">
                  Inscrever-se
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-serif text-2xl">
                    Newsletter Exclusiva
                  </DialogTitle>
                  <DialogDescription>
                    Inscreva-se para receber conteúdos exclusivos, dicas
                    práticas e informações sobre próximos eventos e palestras.
                  </DialogDescription>
                </DialogHeader>
                <form
                  onSubmit={handleNewsletterSubmit}
                  className="space-y-4 mt-4"
                >
                  <Input
                    type="email"
                    placeholder="Seu melhor e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Button type="submit" className="w-full btn-gradient">
                    Confirmar Inscrição
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Seus dados estão seguros. Não compartilhamos informações com
                    terceiros.
                  </p>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/70">
            <p>© 2025 Janice Correia. Todos os direitos reservados.</p>
            <div className="flex gap-6">
              <a
                href="#"
                className="hover:text-primary-foreground transition-colors"
              >
                Política de Privacidade
              </a>
              <a
                href="#"
                className="hover:text-primary-foreground transition-colors"
              >
                Termos de Uso
              </a>
            </div>
          </div>
          <p className="text-center text-xs text-primary-foreground/60 mt-4">
            Jornalista | Mestre em Comunicação | CRM 12345
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
