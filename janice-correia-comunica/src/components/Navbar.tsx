import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  type MenuItem = {
    label: string;
    href: string;
    submenu?: { label: string; href: string }[];
  };

  const menuItems: MenuItem[] = [
    { label: "Home", href: "#home" },
    { label: "Sobre", href: "#sobre" },
    { label: "Palestras", href: "#palestras", submenu: [{ label: "Treinamento para empresas", href: "/treinamento-empresas" }] },
    { label: "Mentoria", href: "/mentoria", submenu: [{ label: "Mentoria Individual", href: "/mentoria#mentoria-individual" }] },
    { label: "Depoimentos", href: "#depoimentos" },
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
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown((prev) => (prev === item.label ? null : prev))}
              >
                <button
                  onClick={() => scrollToSection(item.href)}
                  className="text-foreground hover:text-primary transition-colors"
                  aria-label={`Ir para ${item.label}`}
                  onFocus={() => setOpenDropdown(item.label)}
                  onBlur={() => setOpenDropdown((prev) => (prev === item.label ? null : prev))}
                >
                  {item.label}
                </button>
                {item.submenu && openDropdown === item.label && (
                  <div className="absolute left-0 top-full w-64 rounded-lg shadow-soft border border-border bg-background">
                    {item.submenu.map((sub) => (
                      <button
                        key={sub.label}
                        onClick={() => {
                          setIsOpen(false);
                          window.location.href = sub.href;
                        }}
                        className="block w-full text-left px-4 py-3 hover:bg-muted/50 text-sm"
                      >
                        {sub.label}
                      </button>
                    ))}
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
                <div key={item.label}>
                  <button
                    onClick={() => scrollToSection(item.href)}
                    className="text-left text-foreground hover:text-primary transition-colors py-2"
                    aria-label={`Ir para ${item.label}`}
                  >
                    {item.label}
                  </button>
                  {item.submenu?.map((sub) => (
                    <button
                      key={sub.label}
                      onClick={() => { setIsOpen(false); window.location.href = sub.href; }}
                      className="ml-4 block text-left text-muted-foreground hover:text-primary transition-colors py-1 text-sm"
                      aria-label={`Ir para ${sub.label}`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              ))}
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
