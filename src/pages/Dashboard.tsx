import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Users, DollarSign, BarChart3, Bell, Settings, LogOut } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";

const Dashboard = () => {
  const location = useLocation();
  const isDashboardHome = location.pathname === "/dashboard";

  const navigationItems = [
    { icon: BarChart3, label: "Visão Geral", path: "/dashboard" },
    { icon: CalendarDays, label: "Agenda", path: "/dashboard/calendar" },
    { icon: Users, label: "Clientes", path: "/dashboard/clients" },
    { icon: DollarSign, label: "Pagamentos", path: "/dashboard/payments" },
    { icon: BarChart3, label: "Relatórios", path: "/dashboard/reports" },
  ];

  const stats = [
    { title: "Agendamentos Hoje", value: "8", change: "+12%", icon: CalendarDays },
    { title: "Clientes Ativos", value: "156", change: "+5%", icon: Users },
    { title: "Receita Mensal", value: "R$ 4.250", change: "+18%", icon: DollarSign },
    { title: "Taxa de Conversão", value: "74%", change: "+3%", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border/40 bg-card/20">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg"></div>
            <span className="text-lg font-bold">AgendaPro</span>
          </div>
          
          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="absolute bottom-6 left-6 right-6 space-y-2">
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="w-4 h-4 mr-2" />
            Configurações
          </Button>
          <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive">
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Bem-vindo de volta! Aqui está sua agenda hoje.</p>
          </div>
          <Button variant="hero">
            <Bell className="w-4 h-4 mr-2" />
            Notificações
          </Button>
        </div>

        {isDashboardHome ? (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Card key={stat.title} className="bg-gradient-card border-border/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </CardTitle>
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <p className="text-xs text-success">
                        {stat.change} em relação ao mês passado
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Main Content Sections */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-card border-border/20">
                <CardHeader>
                  <CardTitle>Próximos Agendamentos</CardTitle>
                  <CardDescription>Seus compromissos para hoje</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { time: "09:00", client: "Maria Silva", service: "Consulta" },
                      { time: "10:30", client: "João Santos", service: "Avaliação" },
                      { time: "14:00", client: "Ana Costa", service: "Retorno" },
                    ].map((appointment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                        <div>
                          <p className="font-medium">{appointment.client}</p>
                          <p className="text-sm text-muted-foreground">{appointment.service}</p>
                        </div>
                        <div className="text-sm font-mono bg-primary/10 text-primary px-2 py-1 rounded">
                          {appointment.time}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <Link to="/dashboard/calendar">Ver Agenda Completa</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border/20">
                <CardHeader>
                  <CardTitle>Atividade Recente</CardTitle>
                  <CardDescription>Últimas ações no sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { action: "Novo agendamento", client: "Pedro Lima", time: "há 2 minutos" },
                      { action: "Pagamento confirmado", client: "Laura Mendes", time: "há 1 hora" },
                      { action: "Cliente reagendou", client: "Carlos Rocha", time: "há 3 horas" },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                        <div>
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-muted-foreground">{activity.client}</p>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {activity.time}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <Link to="/dashboard/reports">Ver Relatórios</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
};

export default Dashboard;