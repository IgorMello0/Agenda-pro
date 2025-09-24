import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Filter, UserPlus, Phone, MessageCircle, Calendar } from "lucide-react";

const Clients = () => {
  const clients = [
    {
      id: 1,
      name: "Maria Silva",
      phone: "(11) 99999-9999",
      email: "maria@email.com",
      lastAppointment: "2024-09-24",
      totalAppointments: 5,
      status: "active",
      totalSpent: 750
    },
    {
      id: 2,
      name: "João Santos",
      phone: "(11) 98888-8888", 
      email: "joao@email.com",
      lastAppointment: "2024-09-23",
      totalAppointments: 3,
      status: "active",
      totalSpent: 450
    },
    {
      id: 3,
      name: "Ana Costa",
      phone: "(11) 97777-7777",
      email: "ana@email.com", 
      lastAppointment: "2024-09-22",
      totalAppointments: 8,
      status: "vip",
      totalSpent: 1200
    },
    {
      id: 4,
      name: "Pedro Lima",
      phone: "(11) 96666-6666",
      email: "pedro@email.com",
      lastAppointment: "2024-08-15",
      totalAppointments: 2,
      status: "inactive",
      totalSpent: 300
    }
  ];

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "active":
        return {
          label: "Ativo",
          color: "bg-success/10 text-success border-success/20"
        };
      case "vip":
        return {
          label: "VIP",
          color: "bg-warning/10 text-warning border-warning/20"
        };
      case "inactive":
        return {
          label: "Inativo",
          color: "bg-muted/10 text-muted-foreground border-muted/20"
        };
      default:
        return {
          label: "Desconhecido",
          color: "bg-muted/10 text-muted-foreground border-muted/20"
        };
    }
  };

  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.status === "active" || c.status === "vip").length;
  const vipClients = clients.filter(c => c.status === "vip").length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Clientes</h2>
          <p className="text-muted-foreground">Gerencie sua base de clientes e histórico</p>
        </div>
        <Button variant="hero">
          <UserPlus className="w-4 h-4 mr-2" />
          Adicionar Cliente
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-card border-border/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Clientes</CardTitle>
            <UserPlus className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClients}</div>
            <p className="text-xs text-muted-foreground">Cadastrados no sistema</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Clientes Ativos</CardTitle>
            <UserPlus className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{activeClients}</div>
            <p className="text-xs text-muted-foreground">Com agendamentos recentes</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Clientes VIP</CardTitle>
            <UserPlus className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{vipClients}</div>
            <p className="text-xs text-muted-foreground">Clientes preferenciais</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="bg-gradient-card border-border/20">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, telefone ou email..."
                  className="pl-10 bg-background/50"
                />
              </div>
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Clients List */}
      <div className="space-y-4">
        {clients.map((client) => {
          const statusInfo = getStatusInfo(client.status);
          
          return (
            <Card key={client.id} className="bg-gradient-card border-border/20 hover:shadow-glow transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <span className="text-lg font-semibold text-primary">
                        {client.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{client.name}</h3>
                        <Badge className={statusInfo.color}>
                          {statusInfo.label}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {client.phone}
                        </span>
                        <span>{client.email}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {client.totalAppointments} agendamentos • Último: {new Date(client.lastAppointment).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-lg font-bold">R$ {client.totalSpent.toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">Total gasto</div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        WhatsApp
                      </Button>
                      <Button variant="outline" size="sm">
                        <Calendar className="w-4 h-4 mr-1" />
                        Agendar
                      </Button>
                      <Button variant="ghost" size="sm">
                        Ver Perfil
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-card border-border/20">
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>Gerencie seus clientes de forma eficiente</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <UserPlus className="w-6 h-6" />
              <span>Importar Contatos WhatsApp</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <MessageCircle className="w-6 h-6" />
              <span>Enviar Mensagem em Lote</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Calendar className="w-6 h-6" />
              <span>Campanhas de Reagendamento</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Clients;