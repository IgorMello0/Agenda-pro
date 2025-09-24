import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, Calendar, Download, Filter } from "lucide-react";

const Reports = () => {
  const monthlyStats = {
    appointments: 45,
    clients: 28,
    revenue: 4250,
    conversionRate: 74
  };

  const weeklyData = [
    { day: "Seg", appointments: 8, revenue: 650 },
    { day: "Ter", appointments: 6, revenue: 480 },
    { day: "Qua", appointments: 10, revenue: 820 },
    { day: "Qui", appointments: 7, revenue: 590 },
    { day: "Sex", appointments: 9, revenue: 740 },
    { day: "Sáb", appointments: 5, revenue: 400 },
    { day: "Dom", appointments: 0, revenue: 0 }
  ];

  const topServices = [
    { name: "Consulta Inicial", count: 18, revenue: 2700 },
    { name: "Retorno", count: 15, revenue: 1200 },
    { name: "Avaliação", count: 12, revenue: 1440 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Relatórios</h2>
          <p className="text-muted-foreground">Análise detalhada do seu desempenho</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          <Button variant="hero">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Monthly Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-card border-border/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Agendamentos</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyStats.appointments}</div>
            <p className="text-xs text-success flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12% vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Clientes Únicos</CardTitle>
            <Users className="h-4 w-4 text-accent-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyStats.clients}</div>
            <p className="text-xs text-success flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              +5% vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Receita Total</CardTitle>
            <BarChart3 className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {monthlyStats.revenue.toLocaleString()}</div>
            <p className="text-xs text-success flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              +18% vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Taxa Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyStats.conversionRate}%</div>
            <p className="text-xs text-success flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              +3% vs mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Performance Chart */}
      <Card className="bg-gradient-card border-border/20">
        <CardHeader>
          <CardTitle>Performance Semanal</CardTitle>
          <CardDescription>Agendamentos e receita por dia da semana</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weeklyData.map((day, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 text-center font-medium">{day.day}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <div className="w-40 bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${(day.appointments / 10) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-muted-foreground">{day.appointments} agendamentos</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">R$ {day.revenue}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Services */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-card border-border/20">
          <CardHeader>
            <CardTitle>Serviços Mais Procurados</CardTitle>
            <CardDescription>Ranking dos seus serviços este mês</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topServices.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{service.name}</div>
                      <div className="text-sm text-muted-foreground">{service.count} agendamentos</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">R$ {service.revenue.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/20">
          <CardHeader>
            <CardTitle>Análise do Bot</CardTitle>
            <CardDescription>Performance do atendimento automatizado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                <span className="text-muted-foreground">Conversas Iniciadas</span>
                <span className="font-semibold">127</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                <span className="text-muted-foreground">Agendamentos Automáticos</span>
                <span className="font-semibold">34</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                <span className="text-muted-foreground">Taxa de Conversão Bot</span>
                <span className="font-semibold text-success">26.8%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                <span className="text-muted-foreground">Tempo Médio Resposta</span>
                <span className="font-semibold">&lt; 1min</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <Card className="bg-gradient-card border-border/20">
        <CardHeader>
          <CardTitle>Relatórios Detalhados</CardTitle>
          <CardDescription>Acesse relatórios completos para análise avançada</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Calendar className="w-6 h-6" />
              <span>Relatório de Agendamentos</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Users className="w-6 h-6" />
              <span>Análise de Clientes</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <BarChart3 className="w-6 h-6" />
              <span>Relatório Financeiro</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;