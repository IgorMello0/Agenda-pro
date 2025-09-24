import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Calendar as CalendarIcon, Clock, User } from "lucide-react";

const Calendar = () => {
  const appointments = [
    {
      id: 1,
      time: "09:00",
      duration: "60 min",
      client: "Maria Silva",
      service: "Consulta Inicial",
      status: "confirmed",
      phone: "(11) 99999-9999"
    },
    {
      id: 2,
      time: "10:30",
      duration: "45 min",
      client: "João Santos", 
      service: "Avaliação",
      status: "confirmed",
      phone: "(11) 98888-8888"
    },
    {
      id: 3,
      time: "14:00",
      duration: "30 min",
      client: "Ana Costa",
      service: "Retorno",
      status: "pending",
      phone: "(11) 97777-7777"
    },
    {
      id: 4,
      time: "15:30",
      duration: "60 min",
      client: "Pedro Lima",
      service: "Consulta",
      status: "confirmed",
      phone: "(11) 96666-6666"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-success/10 text-success border-success/20";
      case "pending":
        return "bg-warning/10 text-warning border-warning/20";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmado";
      case "pending":
        return "Pendente";
      default:
        return "Não confirmado";
    }
  };

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
              <CardTitle>Hoje - 24 de Setembro, 2024</CardTitle>
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
        {appointments.map((appointment) => (
          <Card key={appointment.id} className="bg-gradient-card border-border/20 hover:shadow-glow transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-primary/10 border border-primary/20">
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary">{appointment.time}</div>
                      <div className="text-xs text-muted-foreground">{appointment.duration}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <h3 className="font-semibold">{appointment.client}</h3>
                    </div>
                    <p className="text-muted-foreground">{appointment.service}</p>
                    <p className="text-sm text-muted-foreground">{appointment.phone}</p>
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
                    <Button variant="outline" size="sm">
                      WhatsApp
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
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