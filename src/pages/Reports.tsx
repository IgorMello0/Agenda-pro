import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, Calendar, Download, Filter } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

interface MonthlyStats {
  appointments: number;
  clients: number;
  revenue: number;
  conversionRate: number;
}

interface WeeklyData {
  day: string;
  appointments: number;
  revenue: number;
}

interface TopService {
  name: string;
  count: number;
  revenue: number;
}

interface BotStats {
  conversations: number;
  autoAppointments: number;
  conversionRate: number;
}

const Reports = () => {
  const { professional } = useAuth();
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats>({
    appointments: 0,
    clients: 0,
    revenue: 0,
    conversionRate: 0
  });
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [topServices, setTopServices] = useState<TopService[]>([]);
  const [botStats, setBotStats] = useState<BotStats>({
    conversations: 0,
    autoAppointments: 0,
    conversionRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (professional) {
      fetchReportsData();
    }
  }, [professional]);

  const fetchReportsData = async () => {
    try {
      await Promise.all([
        fetchMonthlyStats(),
        fetchWeeklyData(),
        fetchTopServices(),
        fetchBotStats()
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthlyStats = async () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Get appointments count
    const { data: appointments } = await supabase
      .from('appointments')
      .select('id')
      .eq('professional_id', professional?.id)
      .gte('created_at', startOfMonth.toISOString());

    // Get unique clients count
    const { data: clients } = await supabase
      .from('clients')
      .select('id')
      .eq('professional_id', professional?.id);

    // Get revenue
    const { data: payments } = await supabase
      .from('payments')
      .select('amount')
      .eq('professional_id', professional?.id)
      .eq('status', 'paid')
      .gte('created_at', startOfMonth.toISOString());

    const revenue = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
    const appointmentCount = appointments?.length || 0;
    const clientCount = clients?.length || 0;
    
    // Simple conversion rate calculation
    const conversionRate = clientCount > 0 ? Math.round((appointmentCount / clientCount) * 100) : 0;

    setMonthlyStats({
      appointments: appointmentCount,
      clients: clientCount,
      revenue,
      conversionRate
    });
  };

  const fetchWeeklyData = async () => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const weekData: WeeklyData[] = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

      const { data: dayAppointments } = await supabase
        .from('appointments')
        .select('id')
        .eq('professional_id', professional?.id)
        .gte('datetime', dayStart.toISOString())
        .lt('datetime', dayEnd.toISOString());

      const { data: dayPayments } = await supabase
        .from('payments')
        .select('amount')
        .eq('professional_id', professional?.id)
        .eq('status', 'paid')
        .gte('created_at', dayStart.toISOString())
        .lt('created_at', dayEnd.toISOString());

      const revenue = dayPayments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

      weekData.push({
        day: days[date.getDay()],
        appointments: dayAppointments?.length || 0,
        revenue
      });
    }

    setWeeklyData(weekData);
  };

  const fetchTopServices = async () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const { data: appointments } = await supabase
      .from('appointments')
      .select('notes')
      .eq('professional_id', professional?.id)
      .gte('created_at', startOfMonth.toISOString());

    // Group by service type (notes field)
    const serviceCount: { [key: string]: { count: number; revenue: number } } = {};
    
    appointments?.forEach(apt => {
      const service = apt.notes || 'Consulta';
      if (!serviceCount[service]) {
        serviceCount[service] = { count: 0, revenue: 0 };
      }
      serviceCount[service].count++;
      serviceCount[service].revenue += 150; // Default service price
    });

    const services = Object.entries(serviceCount)
      .map(([name, data]) => ({
        name,
        count: data.count,
        revenue: data.revenue
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    setTopServices(services);
  };

  const fetchBotStats = async () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const { data: chatHistories } = await supabase
      .from('n8n_chat_histories')
      .select('id, session_id')
      .eq('professional_id', professional?.id);

    // Count unique conversations by session_id
    const uniqueSessions = new Set(chatHistories?.map(chat => chat.session_id)).size;
    
    // Get appointments that might be from bot
    const { data: appointments } = await supabase
      .from('appointments')
      .select('id, source')
      .eq('professional_id', professional?.id)
      .eq('source', 'bot')
      .gte('created_at', startOfMonth.toISOString());

    const autoAppointments = appointments?.length || 0;
    const conversionRate = uniqueSessions > 0 ? Math.round((autoAppointments / uniqueSessions) * 100) : 0;

    setBotStats({
      conversations: uniqueSessions,
      autoAppointments,
      conversionRate
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Relatórios</h2>
            <p className="text-muted-foreground">Carregando dados...</p>
          </div>
        </div>
      </div>
    );
  }

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
          <Button variant="default">
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
                <span className="font-semibold">{botStats.conversations}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                <span className="text-muted-foreground">Agendamentos Automáticos</span>
                <span className="font-semibold">{botStats.autoAppointments}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                <span className="text-muted-foreground">Taxa de Conversão Bot</span>
                <span className="font-semibold text-success">{botStats.conversionRate}%</span>
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