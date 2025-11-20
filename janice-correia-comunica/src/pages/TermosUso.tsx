import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { SEO } from '@/components/SEO'

const TermosUso = () => {
  const updatedAt = '20 de novembro de 2025'
  return (
    <div className="min-h-screen bg-background">
      <SEO title="Termos de Uso" description="Condições de acesso e uso do serviço." />
      <Navbar />
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <header className="mb-8 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-2">Termos de Uso</h1>
          <p className="text-sm text-muted-foreground">Última atualização: {updatedAt}</p>
        </header>

        <section aria-labelledby="sec-aceitacao" className="mb-10">
          <h2 id="sec-aceitacao" className="font-serif text-2xl font-semibold text-primary mb-3">1. Aceitação dos termos</h2>
          <p className="text-muted-foreground">Ao acessar e utilizar o site <strong>janicecorreia.com.br</strong>, você concorda com estes Termos de Uso e com a Política de Privacidade correspondente.</p>
        </section>

        <section aria-labelledby="sec-condicoes" className="mb-10">
          <h2 id="sec-condicoes" className="font-serif text-2xl font-semibold text-primary mb-3">2. Condições de acesso e uso</h2>
          <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
            <li>O site é disponibilizado para consulta de conteúdos e contato profissional.</li>
            <li>Você se compromete a não realizar atividades que comprometam o funcionamento ou segurança da aplicação.</li>
            <li>O uso do site deve observar a legislação vigente e os direitos de terceiros.</li>
          </ol>
        </section>

        <section aria-labelledby="sec-restricoes" className="mb-10">
          <h2 id="sec-restricoes" className="font-serif text-2xl font-semibold text-primary mb-3">3. Restrições de uso</h2>
          <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
            <li>É vedado o uso para fins ilícitos ou que violem direitos de personalidade e propriedade.</li>
            <li>É proibida a tentativa de engenharia reversa, scraping abusivo ou acesso a áreas não autorizadas.</li>
          </ol>
        </section>

        <section aria-labelledby="sec-responsabilidades" className="mb-10">
          <h2 id="sec-responsabilidades" className="font-serif text-2xl font-semibold text-primary mb-3">4. Responsabilidades do usuário</h2>
          <p className="text-muted-foreground">O usuário é responsável pelas informações fornecidas e pelo uso correto do site. Ao enviar dados, garante veracidade e legitimidade das informações.</p>
        </section>

        <section aria-labelledby="sec-propriedade" className="mb-10">
          <h2 id="sec-propriedade" className="font-serif text-2xl font-semibold text-primary mb-3">5. Propriedade intelectual</h2>
          <p className="text-muted-foreground">Todos os conteúdos, marcas e materiais disponíveis no site são protegidos por direitos de propriedade intelectual e não podem ser reproduzidos sem autorização prévia.</p>
        </section>

        <section aria-labelledby="sec-limitacao" className="mb-10">
          <h2 id="sec-limitacao" className="font-serif text-2xl font-semibold text-primary mb-3">6. Limitação de responsabilidade</h2>
          <p className="text-muted-foreground">Empregamos esforços razoáveis para manter o site disponível e seguro, mas não garantimos funcionamento ininterrupto. Em nenhuma hipótese seremos responsáveis por danos indiretos ou lucros cessantes decorrentes do uso do site.</p>
        </section>

        <section aria-labelledby="sec-lei" className="mb-10">
          <h2 id="sec-lei" className="font-serif text-2xl font-semibold text-primary mb-3">7. Lei aplicável e foro</h2>
          <p className="text-muted-foreground">Estes Termos são regidos pela legislação brasileira. Fica eleito o foro da Comarca de São Paulo/SP para dirimir eventuais controvérsias.</p>
        </section>

        <section aria-labelledby="sec-contato" className="mb-10">
          <h2 id="sec-contato" className="font-serif text-2xl font-semibold text-primary mb-3">8. Contato</h2>
          <p className="text-muted-foreground">Dúvidas ou solicitações podem ser encaminhadas para <a href="mailto:contato@janicecorreia.com.br" className="text-primary underline">contato@janicecorreia.com.br</a>.</p>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default TermosUso