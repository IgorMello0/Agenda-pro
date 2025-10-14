import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { CalendarIcon } from "lucide-react";

interface Appointment {
  id: number;
  datetime: string;
  notes: string;
  clients?: {
    name: string;
  };
}

interface AppointmentLog {
  id: number;
  action: string;
  created_at: string;
  appointments?: {
    clients?: {
      name: string;
    };
  };
}

export const DashboardContent = () => {
  const { professional } = useAuth();
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [recentActivity, setRecentActivity] = useState<AppointmentLog[]>([]);

  useEffect(() => {
    if (professional) {
      fetchTodayAppointments();
      fetchRecentActivity();
    }
  }, [professional]);

  const fetchTodayAppointments = async () => {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const { data } = await supabase
      .from('appointments')
      .select(`
        *,
        clients (name)
      `)
      .eq('professional_id', professional?.id)
      .gte('datetime', startOfDay.toISOString())
      .lt('datetime', endOfDay.toISOString())
      .order('datetime', { ascending: true })
      .limit(3);

    setTodayAppointments(data || []);
  };

  const fetchRecentActivity = async () => {
    const { data } = await supabase
      .from('appointment_logs')
      .select(`
        *,
        appointments (
          clients (name)
        )
      `)
      .order('created_at', { ascending: false })
      .limit(3);

    setRecentActivity(data || []);
  };

  const formatTime = (datetime: string) => {
    return new Date(datetime).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRelativeTime = (datetime: string) => {
    const now = new Date();
    const past = new Date(datetime);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'agora mesmo';
    if (diffMins < 60) return `há ${diffMins} minuto${diffMins > 1 ? 's' : ''}`;
    if (diffHours < 24) return `há ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    return `há ${diffDays} dia${diffDays > 1 ? 's' : ''}`;
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="bg-gradient-card border-border/20">
        <CardHeader>
          <CardTitle>Próximos Agendamentos</CardTitle>
          <CardDescription>Seus compromissos para hoje</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {todayAppointments.length === 0 ? (
              <div className="text-center py-8">
                <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum agendamento para hoje</p>
              </div>
            ) : (
              todayAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <div>
                    <p className="font-medium">{appointment.clients?.name || "Cliente"}</p>
                    <p className="text-sm text-muted-foreground">{appointment.notes || "Consulta"}</p>
                  </div>
                  <div className="text-sm font-mono bg-primary/10 text-primary px-2 py-1 rounded">
                    {formatTime(appointment.datetime)}
                  </div>
                </div>
              ))
            )}
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
            {recentActivity.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Nenhuma atividade recente</p>
              </div>
            ) : (
              recentActivity.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <div>
                    <p className="font-medium">{log.action}</p>
                    <p className="text-sm text-muted-foreground">
                      {log.appointments?.clients?.name || "Cliente"}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {getRelativeTime(log.created_at)}
                  </div>
                </div>
              ))
            )}
          </div>
          <Button variant="outline" className="w-full mt-4" asChild>
            <Link to="/dashboard/reports">Ver Relatórios</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
