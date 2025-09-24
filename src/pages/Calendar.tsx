import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Calendar as CalendarIcon, Clock, User } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Appointment {
  id: number;
  datetime: string;
  status: string;
  notes?: string;
  clients: {
    name: string;
    phone?: string;
  };
}

const Calendar = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

      const { data, error } = await supabase
        .from('appointments')
        .select(`
          id,
          datetime,
          status,
          notes,
          clients (
            name,
            phone
          )
        `)
        .gte('datetime', startOfDay.toISOString())
        .lt('datetime', endOfDay.toISOString())
        .order('datetime', { ascending: true });

      if (error) {
        console.error('Error fetching appointments:', error);
        return;
      }

      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-success/10 text-success border-success/20";
      case "completed":
        return "bg-primary/10 text-primary border-primary/20";
      case "cancelled":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "scheduled":
        return "Agendado";
      case "completed":
        return "Concluído";
      case "cancelled":
        return "Cancelado";
      default:
        return "Pendente";
    }
  };

  const formatTime = (datetime: string) => {
    return new Date(datetime).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Agenda</h2>
            <p className="text-muted-foreground">Carregando agendamentos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Agenda</h2>
          <p className="text-muted-foreground">Gerencie seus agendamentos e horários</p>
        </div>
        <Button variant="hero">
          <Plus className="w-4 h-4 mr-2" />
          Novo Agendamento
        </Button>
      </div>

      {/* Calendar Header */}
      <Card className="bg-gradient-card border-border/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="w-5 h-5 text-primary" />
              <CardTitle>
                Hoje - {new Date().toLocaleDateString('pt-BR', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </CardTitle>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">Semana</Button>
              <Button variant="outline" size="sm">Mês</Button>
            </div>
          </div>
          <CardDescription>
            {appointments.length} agendamentos para hoje
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Appointments List */}
      <div className="space-y-4">
        {appointments.length === 0 ? (
          <Card className="bg-gradient-card border-border/20">
            <CardContent className="p-6 text-center">
              <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum agendamento hoje</h3>
              <p className="text-muted-foreground mb-4">
                Você não tem agendamentos para hoje. Que tal criar um novo?
              </p>
              <Button variant="hero">
                <Plus className="w-4 h-4 mr-2" />
                Novo Agendamento
              </Button>
            </CardContent>
          </Card>
        ) : (
          appointments.map((appointment) => (
            <Card key={appointment.id} className="bg-gradient-card border-border/20 hover:shadow-glow transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-primary/10 border border-primary/20">
                      <div className="text-center">
                        <div className="text-lg font-bold text-primary">
                          {formatTime(appointment.datetime)}
                        </div>
                        <div className="text-xs text-muted-foreground">60 min</div>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <h3 className="font-semibold">{appointment.clients?.name || "Cliente não encontrado"}</h3>
                      </div>
                      <p className="text-muted-foreground">
                        {appointment.notes || "Consulta"}
                      </p>
                      {appointment.clients?.phone && (
                        <p className="text-sm text-muted-foreground">
                          {appointment.clients.phone}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                      {getStatusText(appointment.status)}
                    </span>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                      {appointment.clients?.phone && (
                        <Button variant="outline" size="sm">
                          WhatsApp
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-card border-border/20">
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>Gerencie sua agenda de forma eficiente</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <CalendarIcon className="w-6 h-6" />
              <span>Sincronizar Google Calendar</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Clock className="w-6 h-6" />
              <span>Definir Horários Disponíveis</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <User className="w-6 h-6" />
              <span>Importar Contatos</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Calendar;