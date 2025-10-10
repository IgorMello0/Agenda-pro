import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Users, BarChart3, Shield, Zap, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-dashboard.jpg";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border backdrop-blur-sm bg-card/80 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
              <CalendarDays className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground">AgendaPro</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Recursos</a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Preços</a>
          </nav>
          <div className="flex space-x-3">
            <Button variant="ghost" asChild>
              <Link to="/login">Entrar</Link>
            </Button>
            <Button asChild>
              <Link to="/register">Começar Grátis</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto mb-16">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-foreground leading-tight">
              Gerencie seus agendamentos como um profissional
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Sistema completo de agendamentos com integração ao Google Calendar, 
              relatórios avançados e controle financeiro para profissionais autônomos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="xl" asChild>
                <Link to="/register">Começar Agora</Link>
              </Button>
              <Button variant="outline" size="xl">
                Ver Demonstração
              </Button>
            </div>
          </div>
          
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-primary/5 rounded-3xl blur-3xl"></div>
            <img 
              src={heroImage} 
              alt="Dashboard do AgendaPro" 
              className="relative rounded-2xl shadow-elegant border border-border"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Tudo que você precisa para crescer</h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Ferramentas profissionais para gerenciar agendamentos, clientes e finanças
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-border hover:border-primary/30 transition-all duration-300 hover:scale-[1.02] p-8">
              <CardHeader className="p-0">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <CalendarDays className="w-6 h-6 text-primary" strokeWidth={2} />
                </div>
                <CardTitle className="mb-2">Integração com Google Calendar</CardTitle>
                <CardDescription className="text-base">
                  Sincronização automática de agendamentos com seu calendário pessoal
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:border-accent/30 transition-all duration-300 hover:scale-[1.02] p-8">
              <CardHeader className="p-0">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-accent" strokeWidth={2} />
                </div>
                <CardTitle className="mb-2">Gestão de Clientes</CardTitle>
                <CardDescription className="text-base">
                  Histórico completo de conversas e dados dos seus clientes organizados
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:border-success/30 transition-all duration-300 hover:scale-[1.02] p-8">
              <CardHeader className="p-0">
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-success" strokeWidth={2} />
                </div>
                <CardTitle className="mb-2">Relatórios Avançados</CardTitle>
                <CardDescription className="text-base">
                  Acompanhe performance, agendamentos e resultados financeiros
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:border-warning/30 transition-all duration-300 hover:scale-[1.02] p-8">
              <CardHeader className="p-0">
                <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-warning" strokeWidth={2} />
                </div>
                <CardTitle className="mb-2">Multi-tenant Seguro</CardTitle>
                <CardDescription className="text-base">
                  Cada profissional tem acesso apenas aos seus próprios dados
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:border-primary/30 transition-all duration-300 hover:scale-[1.02] p-8">
              <CardHeader className="p-0">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-primary" strokeWidth={2} />
                </div>
                <CardTitle className="mb-2">Bot Integrado</CardTitle>
                <CardDescription className="text-base">
                  Automatize agendamentos via WhatsApp com histórico completo
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:border-accent/30 transition-all duration-300 hover:scale-[1.02] p-8">
              <CardHeader className="p-0">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-accent" strokeWidth={2} />
                </div>
                <CardTitle className="mb-2">Controle de Pagamentos</CardTitle>
                <CardDescription className="text-base">
                  Gerencie status de pagamentos e controle financeiro manual
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto bg-card rounded-3xl p-12 md:p-16 border border-border shadow-elegant">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">Pronto para começar?</h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl mx-auto">
              Experimente gratuitamente e veja como o AgendaPro pode transformar sua gestão
            </p>
            <Button size="xl" asChild>
              <Link to="/register">Criar Conta Grátis</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6">
        <div className="container mx-auto text-center text-muted-foreground">
          <p className="text-sm">&copy; 2024 AgendaPro. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;