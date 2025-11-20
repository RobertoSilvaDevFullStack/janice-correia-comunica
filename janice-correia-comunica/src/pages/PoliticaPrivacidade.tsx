import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { SEO } from '@/components/SEO'

const PoliticaPrivacidade = () => {
  const updatedAt = '20 de novembro de 2025'
  return (
    <div className="min-h-screen bg-background">
      <SEO title="Política de Privacidade" description="Saiba como coletamos, usamos e protegemos seus dados." />
      <Navbar />
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <header className="mb-8 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-2">Política de Privacidade</h1>
          <p className="text-sm text-muted-foreground">Última atualização: {updatedAt}</p>
        </header>

        <section aria-labelledby="sec-introducao" className="mb-10">
          <h2 id="sec-introducao" className="font-serif text-2xl font-semibold text-primary mb-3">1. Introdução</h2>
          <p className="text-muted-foreground">Esta Política de Privacidade descreve como coletamos, utilizamos, armazenamos e protegemos dados pessoais no site <strong>janicecorreia.com.br</strong>, em conformidade com a LGPD (Lei nº 13.709/2018).</p>
        </section>

        <section aria-labelledby="sec-dados" className="mb-10">
          <h2 id="sec-dados" className="font-serif text-2xl font-semibold text-primary mb-3">2. Dados coletados</h2>
          <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
            <li>Identificação: nome, e-mail, telefone e empresa (quando informados).</li>
            <li>Mensagens: conteúdo fornecido em formulários de contato/mentorias.</li>
            <li>Dados técnicos: endereço IP, páginas visitadas, dispositivo, navegador e cookies.</li>
          </ol>
        </section>

        <section aria-labelledby="sec-finalidade" className="mb-10">
          <h2 id="sec-finalidade" className="font-serif text-2xl font-semibold text-primary mb-3">3. Finalidade da coleta</h2>
          <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
            <li>Atendimento a contatos, propostas e agendamentos.</li>
            <li>Envio de conteúdos e comunicações relacionadas (newsletter).</li>
            <li>Melhoria de serviços e experiência do usuário.</li>
            <li>Cumprimento de obrigações legais e exercício regular de direitos.</li>
          </ol>
        </section>

        <section aria-labelledby="sec-armazenamento" className="mb-10">
          <h2 id="sec-armazenamento" className="font-serif text-2xl font-semibold text-primary mb-3">4. Armazenamento e proteção</h2>
          <p className="text-muted-foreground">Empregamos medidas técnicas e administrativas razoáveis para proteger os dados contra acesso não autorizado, uso indevido, perda ou alteração. O acesso é restrito a pessoas autorizadas e os dados são armazenados em provedores confiáveis.</p>
        </section>

        <section aria-labelledby="sec-direitos" className="mb-10">
          <h2 id="sec-direitos" className="font-serif text-2xl font-semibold text-primary mb-3">5. Direitos do usuário</h2>
          <p className="text-muted-foreground mb-2">Você pode exercer os seguintes direitos previstos na LGPD:</p>
          <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
            <li>Acesso aos dados pessoais tratados.</li>
            <li>Correção de dados incompletos ou desatualizados.</li>
            <li>Eliminação de dados desnecessários ou excessivos.</li>
            <li>Portabilidade, quando aplicável.</li>
            <li>Informações sobre compartilhamento e revogação de consentimento.</li>
          </ol>
          <p className="text-muted-foreground mt-2">Para exercer seus direitos, contate: <a href="mailto:contato@janicecorreia.com.br" className="text-primary underline">contato@janicecorreia.com.br</a>.</p>
        </section>

        <section aria-labelledby="sec-cookies" className="mb-10">
          <h2 id="sec-cookies" className="font-serif text-2xl font-semibold text-primary mb-3">6. Cookies e tecnologias similares</h2>
          <p className="text-muted-foreground">Utilizamos cookies para melhorar a navegação, lembrar preferências e avaliar desempenho. Você pode gerenciar cookies pelo navegador. O bloqueio pode impactar funcionalidades do site.</p>
        </section>

        <section aria-labelledby="sec-compartilhamento" className="mb-10">
          <h2 id="sec-compartilhamento" className="font-serif text-2xl font-semibold text-primary mb-3">7. Compartilhamento com terceiros</h2>
          <p className="text-muted-foreground">Os dados podem ser compartilhados com provedores de hospedagem, e-mail, análise e CRM, exclusivamente para viabilizar o serviço e observando esta Política. Não vendemos dados pessoais.</p>
        </section>

        <section aria-labelledby="sec-retencao" className="mb-10">
          <h2 id="sec-retencao" className="font-serif text-2xl font-semibold text-primary mb-3">8. Retenção e eliminação</h2>
          <p className="text-muted-foreground">Mantemos os dados pelo tempo necessário às finalidades e para cumprimento de obrigações legais. Após o período, os dados são eliminados com segurança.</p>
        </section>

        <section aria-labelledby="sec-alteracoes" className="mb-10">
          <h2 id="sec-alteracoes" className="font-serif text-2xl font-semibold text-primary mb-3">9. Alterações desta Política</h2>
          <p className="text-muted-foreground">Podemos atualizar esta Política para refletir mudanças legais ou operacionais. A versão vigente será publicada nesta página com a data de atualização.</p>
        </section>

        <section aria-labelledby="sec-contato" className="mb-10">
          <h2 id="sec-contato" className="font-serif text-2xl font-semibold text-primary mb-3">10. Contato</h2>
          <p className="text-muted-foreground">Em caso de dúvidas, fale conosco: <a href="mailto:contato@janicecorreia.com.br" className="text-primary underline">contato@janicecorreia.com.br</a>.</p>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default PoliticaPrivacidade