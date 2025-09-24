import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Users, BarChart3, Shield, Zap, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-dashboard.jpg";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/95 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg"></div>
            <span className="text-xl font-bold">AgendaPro</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Recursos</a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Preços</a>
          </nav>
          <div className="flex space-x-2">
            <Button variant="ghost" asChild>
              <Link to="/login">Entrar</Link>
            </Button>
            <Button variant="hero" asChild>
              <Link to="/register">Começar Grátis</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
              Gerencie seus agendamentos como um profissional
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Sistema completo de agendamentos com integração ao Google Calendar, 
              relatórios avançados e controle financeiro para profissionais autônomos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" asChild>
                <Link to="/register">Começar Agora</Link>
              </Button>
              <Button variant="glass" size="xl">
                Ver Demonstração
              </Button>
            </div>
          </div>
          
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-primary rounded-2xl blur-2xl opacity-20"></div>
            <img 
              src={heroImage} 
              alt="Dashboard do AgendaPro" 
              className="relative rounded-2xl shadow-elegant border border-border/20"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-card/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Tudo que você precisa para crescer</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ferramentas profissionais para gerenciar agendamentos, clientes e finanças
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-gradient-card border-border/20 hover:shadow-glow transition-all duration-300">
              <CardHeader>
                <CalendarDays className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Integração com Google Calendar</CardTitle>
                <CardDescription>
                  Sincronização automática de agendamentos com seu calendário pessoal
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gradient-card border-border/20 hover:shadow-glow transition-all duration-300">
              <CardHeader>
                <Users className="w-12 h-12 text-accent-blue mb-4" />
                <CardTitle>Gestão de Clientes</CardTitle>
                <CardDescription>
                  Histórico completo de conversas e dados dos seus clientes organizados
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gradient-card border-border/20 hover:shadow-glow transition-all duration-300">
              <CardHeader>
                <BarChart3 className="w-12 h-12 text-success mb-4" />
                <CardTitle>Relatórios Avançados</CardTitle>
                <CardDescription>
                  Acompanhe performance, agendamentos e resultados financeiros
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gradient-card border-border/20 hover:shadow-glow transition-all duration-300">
              <CardHeader>
                <Shield className="w-12 h-12 text-warning mb-4" />
                <CardTitle>Multi-tenant Seguro</CardTitle>
                <CardDescription>
                  Cada profissional tem acesso apenas aos seus próprios dados
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gradient-card border-border/20 hover:shadow-glow transition-all duration-300">
              <CardHeader>
                <Zap className="w-12 h-12 text-primary-glow mb-4" />
                <CardTitle>Bot Integrado</CardTitle>
                <CardDescription>
                  Automatize agendamentos via WhatsApp com histórico completo
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gradient-card border-border/20 hover:shadow-glow transition-all duration-300">
              <CardHeader>
                <Clock className="w-12 h-12 text-accent-blue mb-4" />
                <CardTitle>Controle de Pagamentos</CardTitle>
                <CardDescription>
                  Gerencie status de pagamentos e controle financeiro manual
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">Pronto para começar?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Experimente gratuitamente e veja como o AgendaPro pode transformar sua gestão
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/register">Criar Conta Grátis</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 px-4">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 AgendaPro. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;