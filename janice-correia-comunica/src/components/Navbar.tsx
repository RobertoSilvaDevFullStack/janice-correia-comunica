import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  type MenuItem = {
    label: string;
    href: string;
    submenu?: { label: string; href: string }[];
  };

  const menuItems: MenuItem[] = [
    { label: "Home", href: "#home" },
    { label: "Sobre", href: "#sobre" },
    { label: "Palestras", href: "#palestras", submenu: [{ label: "Treinamento para empresas", href: "/treinamento-empresas" }] },
    { label: "Mentoria", href: "/mentoria" },
    { label: "Blog", href: "#blog" },
    { label: "Depoimentos", href: "#depoimentos" },
    { label: "Contato", href: "#contato" },
  ];

  const scrollToSection = (href: string) => {
    setIsOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      const id = href.startsWith('#') ? href : `#${href}`;
      window.location.href = `/${id}`;
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <a href="#home" className="font-serif text-2xl font-bold text-primary">
            Janice Correia
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <div key={item.label} className="relative group">
                <button
                  onClick={() => scrollToSection(item.href)}
                  className="text-foreground hover:text-primary transition-colors"
                  aria-label={`Ir para ${item.label}`}
                >
                  {item.label}
                </button>
                {item.submenu && (
                  <div className="absolute left-0 mt-2 w-64 rounded-lg shadow-soft border border-border bg-background opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto">
                    <button
                      onClick={() => { setIsOpen(false); window.location.href = item.submenu?.[0]?.href || item.href; }}
                      className="block w-full text-left px-4 py-3 hover:bg-muted/50 text-sm"
                    >
                      {item.submenu?.[0]?.label || item.label}
                    </button>
                  </div>
                )}
              </div>
            ))}
            <Button onClick={() => scrollToSection("#contato")} variant="default" size="sm">
              Entrar em Contato
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.href)}
                  className="text-left text-foreground hover:text-primary transition-colors py-2"
                  aria-label={`Ir para ${item.label}`}
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => { setIsOpen(false); window.location.href = "/treinamento-empresas"; }}
                className="text-left text-foreground hover:text-primary transition-colors py-2"
                aria-label="Ir para Treinamento para empresas"
              >
                Treinamento para empresas
              </button>
              <Button onClick={() => scrollToSection("#contato")} variant="default" className="w-full">
                Entrar em Contato
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
