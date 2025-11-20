import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const WhatsAppButton = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const whatsappNumber =
    import.meta.env.VITE_WHATSAPP_NUMBER || "5511999999999";
  const message = encodeURIComponent(
    "Olá! Gostaria de conhecer mais sobre seus serviços."
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  // Removido efeito automático de tooltip para evitar piscando

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50"
            style={{ backgroundColor: "#25D366" }}
            asChild
          >
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Conversar no WhatsApp"
            >
              <MessageCircle className="h-6 w-6 text-white" />
            </a>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" className="bg-background border shadow-md">
          <p className="font-medium">Oi! 👋 Podemos conversar?</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
