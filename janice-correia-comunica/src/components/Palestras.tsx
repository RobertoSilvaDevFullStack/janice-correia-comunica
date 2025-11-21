import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { useContactModal } from "@/hooks/useContactModal";
import { usePalestras } from "@/hooks/usePalestras";

const Palestras = () => {
  const { openModal } = useContactModal();
  const { data: palestras } = usePalestras();

  return (
    <section id="palestras" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-6">
            Treinamentos corporativos
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Palestras personalizadas que transformam a comunicação da sua
            empresa e geram resultados concretos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {(palestras || []).map((palestra, index) => (
            <Card key={index} className="overflow-hidden card-hover">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={(palestra.image || "").replace(/^http:\/\//, "https://")}
                  alt={palestra.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute top-4 right-4 bg-accent text-accent-foreground p-3 rounded-full">
                  <MessageSquare size={24} />
                </div>
              </div>
              <CardHeader>
                <CardTitle className="font-serif text-2xl text-primary">
                  {palestra.title}
                </CardTitle>
                <CardDescription className="text-base">
                  {palestra.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-sm font-semibold text-accent mb-2">
                    Público-alvo:
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {palestra.target_audience}
                  </p>
                </div>
                <div className="mb-4">
                  <p className="text-sm font-semibold text-primary mb-2">
                    Principais Tópicos:
                  </p>
                  <ul className="space-y-1">
                    {(palestra.topics || []).map((topic, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-muted-foreground flex items-center"
                      >
                        <span className="w-1.5 h-1.5 bg-accent rounded-full mr-2" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button
                  onClick={() => openModal("palestras")}
                  variant="default"
                  className="w-full"
                >
                  Solicitar Palestra
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Palestras customizadas para atender as necessidades específicas da
            sua empresa
          </p>
          <Button
            onClick={() => openModal("palestras")}
            size="lg"
            variant="outline"
          >
            Fale Conosco
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Palestras;
