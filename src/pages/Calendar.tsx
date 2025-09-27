import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, Clock, Plus, User, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Appointment {
  id: number;
  datetime: string;
  notes: string;
  status: string;
  professional_id: number;
  client_id: number;
  clients?: {
    name: string;
    email: string;
    phone: string;
  };
}

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
}

const Calendar = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { professional } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [newAppointment, setNewAppointment] = useState({
    client_id: "",
    date: "",
    time: "",
    notes: ""
  });

  useEffect(() => {
    if (professional) {
      fetchAppointments();
      fetchClients();
    }
  }, [professional, currentWeek]);

  const fetchAppointments = async () => {
    try {
      const weekStart = getWeekStart(currentWeek);
      const weekEnd = getWeekEnd(currentWeek);

      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          clients (
            name,
            email,
            phone
          )
        `)
        .eq('professional_id', professional?.id)
        .gte('datetime', weekStart.toISOString())
        .lte('datetime', weekEnd.toISOString())
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

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('id, name, email, phone')
        .eq('professional_id', professional?.id)
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching clients:', error);
        return;
      }

      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const getWeekStart = (date: Date) => {
    const day = date.getDay();
    const diff = date.getDate() - day;
    const start = new Date(date);
    start.setDate(diff);
    start.setHours(0, 0, 0, 0);
    return start;
  };

  const getWeekEnd = (date: Date) => {
    const start = getWeekStart(date);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return end;
  };

  const handleAddAppointment = async () => {
    if (!newAppointment.client_id || !newAppointment.date || !newAppointment.time) {
      toast({
        title: "Campos obrigatórios",
        description: "Cliente, data e horário são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    try {
      const datetime = new Date(`${newAppointment.date}T${newAppointment.time}`);
      
      const { data, error } = await supabase
        .from('appointments')
        .insert([
          {
            professional_id: professional?.id,
            client_id: parseInt(newAppointment.client_id),
            datetime: datetime.toISOString(),
            notes: newAppointment.notes || "",
            status: "scheduled"
          }
        ])
        .select(`
          *,
          clients (
            name,
            email,
            phone
          )
        `)
        .single();

      if (error) {
        console.error('Error adding appointment:', error);
        toast({
          title: "Erro ao agendar",
          description: "Não foi possível criar o agendamento.",
          variant: "destructive",
        });
        return;
      }

      setAppointments(prevAppointments => [...prevAppointments, data]);
      setNewAppointment({ client_id: "", date: "", time: "", notes: "" });
      setOpen(false);
      toast({
        title: "Agendamento criado",
        description: "Novo agendamento foi criado com sucesso.",
      });
    } catch (error) {
      console.error('Error adding appointment:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao criar agendamento.",
        variant: "destructive",
      });
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

  const getStartOfWeek = (date: Date) => {
    const day = date.getDay();
    const diff = date.getDate() - day;
    return new Date(date.setDate(diff));
  };

  const getDaysOfWeek = () => {
    const startOfWeek = getStartOfWeek(new Date(currentWeek));
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getHours = () => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      hours.push(`${i.toString().padStart(2, '0')}:00`);
    }
    return hours;
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newWeek);
  };

  const getAppointmentForDayAndHour = (day: Date, hour: string) => {
    return appointments.find(apt => {
      const aptDate = new Date(apt.datetime);
      const aptHour = aptDate.getHours().toString().padStart(2, '0') + ':00';
      return (
        aptDate.toDateString() === day.toDateString() &&
        aptHour === hour
      );
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Agenda</h2>
          <p className="text-muted-foreground">Visualização semanal dos seus agendamentos</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="hero">
              <Plus className="w-4 h-4 mr-2" />
              Novo Agendamento
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Agendamento</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="appointment-client">Cliente</Label>
                <Select value={newAppointment.client_id} onValueChange={(value) => setNewAppointment({...newAppointment, client_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id.toString()}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="appointment-date">Data</Label>
                <Input
                  id="appointment-date"
                  type="date"
                  value={newAppointment.date}
                  onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="appointment-time">Horário</Label>
                <Input
                  id="appointment-time"
                  type="time"
                  value={newAppointment.time}
                  onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="appointment-notes">Observações</Label>
                <Input
                  id="appointment-notes"
                  value={newAppointment.notes}
                  onChange={(e) => setNewAppointment({...newAppointment, notes: e.target.value})}
                  placeholder="Observações sobre o agendamento"
                />
              </div>
              <Button onClick={handleAddAppointment} className="w-full">
                Criar Agendamento
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Week Navigation */}
      <Card className="bg-gradient-card border-border/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => navigateWeek('prev')}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="text-center">
                <h3 className="text-lg font-semibold">
                  {getDaysOfWeek()[0].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} - {getDaysOfWeek()[6].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {appointments.length} agendamentos esta semana
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigateWeek('next')}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentWeek(new Date())}
            >
              Hoje
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Weekly Calendar Grid */}
      <Card className="bg-gradient-card border-border/20">
        <CardContent className="p-0">
          <div className="flex">
            {/* Time Column */}
            <div className="w-16 border-r border-border/20">
              <div className="h-12 border-b border-border/20"></div>
              {getHours().map(hour => (
                <div key={hour} className="h-16 border-b border-border/20 flex items-center justify-center text-xs text-muted-foreground">
                  {hour}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="flex-1 grid grid-cols-7">
              {/* Day Headers */}
              {getDaysOfWeek().map((day, index) => {
                const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
                const isToday = day.toDateString() === new Date().toDateString();
                return (
                  <div key={index} className={`h-12 border-r border-b border-border/20 flex flex-col items-center justify-center ${isToday ? 'bg-primary/10' : ''}`}>
                    <div className="text-xs text-muted-foreground">{dayNames[index]}</div>
                    <div className={`text-sm font-medium ${isToday ? 'text-primary' : ''}`}>
                      {day.getDate()}
                    </div>
                  </div>
                );
              })}
              
              {/* Time Slots */}
              {getHours().map(hour => (
                getDaysOfWeek().map((day, dayIndex) => {
                  const appointment = getAppointmentForDayAndHour(day, hour);
                  return (
                    <div 
                      key={`${hour}-${dayIndex}`} 
                      className="h-16 border-r border-b border-border/20 relative group hover:bg-accent/20 cursor-pointer"
                    >
                      {appointment && (
                        <div className={`absolute inset-1 rounded p-1 text-xs ${getStatusColor(appointment.status)} overflow-hidden`}>
                          <div className="font-medium truncate">
                            {appointment.clients?.name || 'Cliente'}
                          </div>
                          <div className="text-xs opacity-75 truncate">
                            {appointment.notes || 'Consulta'}
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                        <Plus className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  );
                })
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today's Appointments Sidebar */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
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

        <div>
          <Card className="bg-gradient-card border-border/20">
            <CardHeader>
              <CardTitle>Próximos Agendamentos</CardTitle>
              <CardDescription>Compromissos dos próximos dias</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {appointments.slice(0, 4).map((appointment) => (
                  <div key={appointment.id} className="flex items-center space-x-3 p-2 rounded-lg bg-background/50">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        {appointment.clients?.name || "Cliente"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatTime(appointment.datetime)} - {appointment.notes || "Consulta"}
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(appointment.status)}`}>
                      {getStatusText(appointment.status)}
                    </span>
                  </div>
                ))}
                {appointments.length === 0 && (
                  <div className="text-center py-4">
                    <CalendarIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Nenhum agendamento</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Calendar;