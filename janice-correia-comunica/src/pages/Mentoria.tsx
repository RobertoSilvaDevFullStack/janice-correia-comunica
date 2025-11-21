import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { SEO } from "@/components/SEO";
import { useContactModal } from "@/hooks/useContactModal";
import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

type Mentor = {
  id: string;
  name: string;
  area: "comunicacao" | "oratoria" | "cx" | "lideranca";
  bio: string;
  rating: number;
};

const mentors: Mentor[] = [
  { id: "m1", name: "Janice Correia", area: "comunicacao", bio: "Comunicação estratégica e prática em ambientes corporativos.", rating: 5 },
  { id: "m2", name: "Mentor Convidado", area: "oratoria", bio: "Oratória aplicada a apresentações internas e externas.", rating: 5 },
  { id: "m3", name: "Especialista CX", area: "cx", bio: "Experiência do cliente e comunicação em canais digitais.", rating: 4 },
];

const Mentoria = () => {
  const { openModal } = useContactModal();
  type AreaFilter = Mentor["area"] | "todos";
  const [area, setArea] = useState<AreaFilter>("todos");
  const toAreaFilter = (v: string): AreaFilter => {
    const allowed = ["comunicacao", "oratoria", "cx", "lideranca", "todos"] as const;
    return (allowed as readonly string[]).includes(v) ? (v as AreaFilter) : "todos";
  };
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const filtered = mentors.filter(m => area === "todos" ? true : m.area === area);

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

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-6">Buscar mentor</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4 md:col-span-1">
              <label className="text-sm text-muted-foreground" htmlFor="area">Área</label>
              <Select value={area} onValueChange={(v) => setArea(toAreaFilter(v))}>
                <SelectTrigger id="area" aria-label="Filtrar por área">
                  <SelectValue placeholder="Selecione uma área" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas</SelectItem>
                  <SelectItem value="comunicacao">Comunicação</SelectItem>
                  <SelectItem value="oratoria">Oratória</SelectItem>
                  <SelectItem value="cx">Experiência do Cliente</SelectItem>
                  <SelectItem value="lideranca">Liderança</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Buscar por nome" aria-label="Buscar por nome" />
            </div>
            <div className="md:col-span-2 space-y-4">
              {filtered.length === 0 ? (
                <p className="text-muted-foreground">Nenhum mentor encontrado.</p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {filtered.map((m) => (
                    <Card key={m.id} className="overflow-hidden">
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-primary">{m.name}</CardTitle>
                        <Badge>{m.area}</Badge>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">{m.bio}</p>
                        <Button onClick={() => handleMentorClick(m)} aria-label={`Selecionar mentor ${m.name}`}>Selecionar</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-6">Calendário</h2>
          <div className="rounded-lg border border-border p-4 shadow-soft bg-background">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              weekStartsOn={1}
              className="!text-foreground"
              captionLayout="dropdown"
              fromYear={new Date().getFullYear() - 1}
              toYear={new Date().getFullYear() + 1}
            />
            <div className="text-center mt-4">
              <Button onClick={handleAgendar} disabled={!selectedDate} aria-disabled={!selectedDate}>Agendar</Button>
            </div>
          </div>
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
    </main>
  );
};

export default Mentoria;