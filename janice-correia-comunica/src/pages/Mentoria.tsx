import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { SEO } from "@/components/SEO";
import { useContactModal } from "@/hooks/useContactModal";
import { useState } from "react";

type Mentor = {
  id: string;
  name: string;
  area: "comunicacao" | "oratoria" | "cx" | "lideranca";
  bio: string;
  rating: number;
};

const Mentoria = () => {
  const { openModal } = useContactModal();

  const handleMentorClick = (mentor: Mentor) => {
    openModal("mentorias");
  };

  const handleQueroSerMentor = () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      window.location.href = "/admin";
    } else {
      window.location.href = "/admin/login";
    }
  };

  const handleAgendar = () => {
    openModal("mentorias");
  };

  return (
    <main className="bg-background">
      <Navbar />
      <SEO
        title="Mentoria"
        description="Programa de mentoria com foco em comunicação, oratória e experiência do cliente."
        keywords="mentoria, comunicação, oratória, experiência do cliente, liderança, soft skills"
        url="/mentoria"
      />

      <section className="pt-24 md:pt-28 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-6">Mentoria</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Mentoria personalizada para evoluir sua comunicação com clareza, presença e resultados. Estruturamos encontros
            práticos com feedback detalhado, exercícios e simulações, alinhados ao seu contexto profissional.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="font-serif text-2xl text-primary">Sobre o Programa</CardTitle>
              <CardDescription>Benefícios e objetivos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Desenvolva autoconfiança, presença comunicativa e clareza de ideias. Trabalhamos voz, ritmo e estrutura de
                conteúdos para apresentações e interações mais eficazes.
              </p>
              <p>
                Objetivos: reduzir ruídos, aumentar a assertividade, fortalecer credibilidade e melhorar a experiência do
                cliente nas suas conversas e apresentações.
              </p>
              <p>
                Processo: diagnóstico, plano personalizado, prática guiada e acompanhamento contínuo com materiais e
                recomendações específicas.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-2xl text-primary">Inscrição</CardTitle>
              <CardDescription>Como participar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full btn-gradient" onClick={() => openModal("mentorias")} aria-label="Abrir formulário de mentoria">
                Buscar Mentoria
              </Button>
              <Button className="w-full" variant="outline" onClick={handleQueroSerMentor} aria-label="Quero ser mentor">
                Quero ser mentor
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-12" id="mentoria-individual">
        <div className="container mx-auto px-4">
          <article className="prose prose-neutral max-w-none">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-6">Curso particular de oratória</h2>
            <p>Desenvolvimento individual para comunicar com clareza, segurança e presença</p>
            <p>O curso particular é um treinamento personalizado para quem deseja evoluir de forma rápida e prática. Cada encontro trabalha técnicas aplicáveis às suas necessidades: apresentações, reuniões, vídeos, discursos ou interações com clientes.</p>
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-primary">Como o curso pode te ajudar:</h3>
            <ul>
              <li><strong>Autoconfiança:</strong> supere o medo de falar em público e ganhe desenvoltura em qualquer ambiente.</li>
              <li><strong>Presença comunicativa:</strong> postura, gestos e expressão que fortalecem sua autoridade.</li>
              <li><strong>Voz e ritmo:</strong> projeção, firmeza e fluidez para prender a atenção do público.</li>
              <li><strong>Apresentações impactantes:</strong> técnicas de oratória para planejar, estruturar e conduzir falas claras e convincentes.</li>
              <li><strong>Argumentação sob pressão:</strong> como contornar situações difíceis e responder com segurança.</li>
              <li><strong>Eliminação de vícios de linguagem:</strong> evite ruídos que prejudicam sua credibilidade.</li>
              <li><strong>Dicção, entonação e articulação:</strong> ajuste fino para uma voz mais clara, firme e agradável.</li>
              <li><strong>Organização de ideias:</strong> comunique mensagens estruturadas, objetivas e memoráveis.</li>
            </ul>
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-primary">Para quem é</h3>
            <ul>
              <li>Quem deseja superar o medo de falar em público.</li>
              <li>Profissionais que falam com clientes.</li>
              <li>Líderes e especialistas que apresentam ideias.</li>
              <li>Pessoas que precisam se posicionar com mais segurança no trabalho.</li>
              <li>Estudantes e jovens que querem desenvolver comunicação profissional desde cedo.</li>
            </ul>
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-primary">Como funciona</h3>
            <ol>
              <li><strong>Diagnóstico inicial:</strong> avaliação do seu nível atual e das demandas específicas da sua comunicação.</li>
              <li><strong>Plano personalizado:</strong> as aulas são adaptadas às suas metas e desafios reais.</li>
              <li><strong>Prática guiada:</strong> exercícios práticos, simulações e aplicação direta no seu dia a dia.</li>
              <li><strong>Feedback imediato:</strong> ajustes de voz, postura, ritmo, estrutura e linguagem para evolução rápida.</li>
              <li><strong>Acompanhamento contínuo:</strong> orientações entre as aulas, materiais de apoio e recomendações específicas.</li>
            </ol>
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-primary">Diferenciais</h3>
            <ul>
              <li>Treinamento individual e realmente personalizado.</li>
              <li>Aulas on-line e ao vivo, com interação e prática real.</li>
              <li>Feedback detalhado e direcionado ao seu contexto profissional.</li>
              <li>Criação e revisão de roteiros de fala.</li>
              <li>Treino de apresentações, reuniões e pitches.</li>
              <li>Técnicas de comunicação profissional e oratória contemporânea.</li>
            </ul>
          </article>
        </div>
      </section>

      

      

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-6">FAQ</h2>
          <div className="space-y-4 text-muted-foreground max-w-3xl">
            <details>
              <summary className="font-medium text-foreground">Como funcionam os encontros?</summary>
              <p>Encontros semanais ou quinzenais, com prática guiada e feedback imediato.</p>
            </details>
            <details>
              <summary className="font-medium text-foreground">A mentoria é personalizada?</summary>
              <p>Sim, diagnóstico inicial e plano de evolução alinhado às suas metas.</p>
            </details>
            <details>
              <summary className="font-medium text-foreground">Posso fazer on-line?</summary>
              <p>Sim, há opções presenciais e on-line.</p>
            </details>
          </div>
        </div>
      </section>

      <footer className="py-12 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">Dúvidas? Entre em contato.</p>
          <div className="flex gap-3 justify-center mt-4">
            <Button variant="outline" onClick={() => openModal("mentorias")}>Falar com a equipe</Button>
            <Button className="btn-gradient" onClick={() => window.location.hash = "#contato"}>Ver contatos</Button>
          </div>
        </div>
      </footer>
      <Footer />
      <WhatsAppButton />
    </main>
  );
};

export default Mentoria;