import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useContactModal } from "@/hooks/useContactModal";
import mentoriaImage from "@/assets/mentoria.jpg";

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

  const programas = [
    {
      title: "Mentoria Individual em Oratória",
      description: "Programa personalizado para desenvolver suas habilidades de apresentação e comunicação em público.",
      duracao: "3 meses",
      formato: "8 sessões de 1h30 (online ou presencial)",
    },
    {
      title: "Treinamento Corporativo em Comunicação",
      description: "Programa in-company para equipes que desejam melhorar sua comunicação interna e externa.",
      duracao: "Customizável",
      formato: "Presencial ou online",
    },
    {
      title: "Preparação para Apresentações Importantes",
      description: "Sessões intensivas para preparar apresentações cruciais, como pitches, reuniões estratégicas ou eventos.",
      duracao: "1 a 4 semanas",
      formato: "Sessões focadas e práticas",
    },
  ];

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <img
              src={mentoriaImage}
              alt="Mentoria em Comunicação"
              className="w-full h-auto rounded-lg shadow-medium mb-8"
            />
            <h3 className="font-serif text-2xl font-bold text-primary mb-6">
              Nossos Diferenciais
            </h3>
            <ul className="space-y-4">
              {diferenciais.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
            <Button 
              onClick={() => openModal('mentorias')} 
              size="lg" 
              className="w-full mt-8 btn-gradient"
            >
              Quero Saber Mais
            </Button>
          </div>

          <div className="space-y-6">
            <h3 className="font-serif text-2xl font-bold text-primary mb-6">
              Programas Disponíveis
            </h3>
            {programas.map((programa, index) => (
              <Card key={index} className="card-hover">
                <CardHeader>
                  <CardTitle className="font-serif text-xl text-primary">
                    {programa.title}
                  </CardTitle>
                  <CardDescription>{programa.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
                    <div>
                      <span className="font-semibold text-primary">Duração:</span> {programa.duracao}
                    </div>
                    <div>
                      <span className="font-semibold text-primary">Formato:</span> {programa.formato}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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
