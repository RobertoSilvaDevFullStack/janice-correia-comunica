import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useContactModal } from "@/hooks/useContactModal";
import { useMentorias } from "@/hooks/useMentorias";

const Mentorias = () => {
  const { toast } = useToast();
  const { openModal } = useContactModal();
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    empresa: "",
    mensagem: "",
  });

  const diferenciais = [
    "Atendimento personalizado e individual",
    "Metodologia comprovada e baseada em cases reais",
    "Acompanhamento contínuo e feedbacks construtivos",
    "Exercícios práticos e aplicação imediata",
    "Materiais exclusivos e suporte pós-mentoria",
  ];

  const { data: mentorias } = useMentorias();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.email || !formData.mensagem) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Mensagem enviada!",
      description: "Entraremos em contato em breve para agendar uma conversa.",
    });

    setFormData({
      nome: "",
      email: "",
      telefone: "",
      empresa: "",
      mensagem: "",
    });
  };

  return (
    <section id="mentorias" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-6">
            Mentorias e Treinamentos
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Programas personalizados para transformar sua comunicação e alcançar resultados extraordinários
          </p>
        </div>

        {/* Programas Disponíveis centralizados em 2 colunas x 2 linhas */}
        <div className="mb-16">
          <h3 className="font-serif text-2xl font-bold text-primary mb-6 text-center">
            Programas Disponíveis
          </h3>
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {(mentorias || []).slice(0, 4).map((programa, index) => (
              <Card key={index} className="card-hover">
                <CardHeader>
                  <CardTitle className="font-serif text-xl text-primary text-center">
                    {programa.title}
                  </CardTitle>
                  <CardDescription className="text-center">
                    {programa.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center gap-6 text-sm text-muted-foreground">
                    <div>
                      <span className="font-semibold text-primary">Duração:</span> {programa.duration}
                    </div>
                    <div>
                      <span className="font-semibold text-primary">Formato:</span> {programa.format}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Nossos Diferenciais centralizados abaixo */}
        <div className="mb-16">
          <h3 className="font-serif text-2xl font-bold text-primary mb-6 text-center">
            Nossos Diferenciais
          </h3>
          <ul className="max-w-3xl mx-auto space-y-4">
            {diferenciais.map((item, index) => (
              <li key={index} className="flex items-start gap-3 justify-center">
                <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
          <div className="text-center mt-8">
            <Button onClick={() => openModal('mentorias')} size="lg" className="btn-gradient">
              Quero Saber Mais
            </Button>
          </div>
        </div>

        <Card className="max-w-2xl mx-auto shadow-medium">
          <CardHeader className="text-center">
            <CardTitle className="font-serif text-3xl text-primary">
              Manifestar Interesse
            </CardTitle>
            <CardDescription>
              Preencha o formulário abaixo e entraremos em contato para agendar uma conversa inicial gratuita
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  placeholder="Nome completo *"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="E-mail *"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Input
                  placeholder="Telefone"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                />
              </div>
              <div>
                <Input
                  placeholder="Empresa"
                  value={formData.empresa}
                  onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                />
              </div>
              <div>
                <Textarea
                  placeholder="Conte-nos mais sobre seus objetivos e desafios de comunicação *"
                  value={formData.mensagem}
                  onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                  rows={5}
                  required
                />
              </div>
              <Button type="submit" className="w-full btn-gradient" size="lg">
                Enviar Mensagem
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Mentorias;
