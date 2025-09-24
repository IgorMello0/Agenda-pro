import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Search, Filter, Download, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

const Payments = () => {
  const payments = [
    {
      id: 1,
      client: "Maria Silva",
      service: "Consulta Inicial",
      amount: 150,
      date: "2024-09-24",
      status: "paid",
      paymentMethod: "Dinheiro"
    },
    {
      id: 2,
      client: "João Santos",
      service: "Avaliação",
      amount: 120,
      date: "2024-09-23",
      status: "pending",
      paymentMethod: "PIX"
    },
    {
      id: 3,
      client: "Ana Costa",
      service: "Retorno",
      amount: 80,
      date: "2024-09-22",
      status: "overdue",
      paymentMethod: "Cartão"
    },
    {
      id: 4,
      client: "Pedro Lima",
      service: "Consulta",
      amount: 150,
      date: "2024-09-21",
      status: "paid",
      paymentMethod: "PIX"
    }
  ];

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "paid":
        return {
          label: "Pago",
          color: "bg-success/10 text-success border-success/20",
          icon: CheckCircle
        };
      case "pending":
        return {
          label: "Pendente", 
          color: "bg-warning/10 text-warning border-warning/20",
          icon: Clock
        };
      case "overdue":
        return {
          label: "Vencido",
          color: "bg-destructive/10 text-destructive border-destructive/20", 
          icon: AlertCircle
        };
      default:
        return {
          label: "Desconhecido",
          color: "bg-muted/10 text-muted-foreground border-muted/20",
          icon: Clock
        };
    }
  };

  const totalPaid = payments.filter(p => p.status === "paid").reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payments.filter(p => p.status === "pending").reduce((sum, p) => sum + p.amount, 0);
  const totalOverdue = payments.filter(p => p.status === "overdue").reduce((sum, p) => sum + p.amount, 0);

  const handleMarkAsPaid = (paymentId: number) => {
    // TODO: Implementar com Supabase
    console.log("Marcar como pago:", paymentId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Pagamentos</h2>
          <p className="text-muted-foreground">Controle financeiro dos seus atendimentos</p>
        </div>
        <Button variant="hero">
          <Download className="w-4 h-4 mr-2" />
          Exportar Relatório
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-card border-border/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Recebido</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">R$ {totalPaid.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Pagamentos confirmados</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pendente</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">R$ {totalPending.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Aguardando confirmação</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Em Atraso</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">R$ {totalOverdue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Pagamentos vencidos</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gradient-card border-border/20">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por cliente..."
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

      {/* Payments List */}
      <div className="space-y-4">
        {payments.map((payment) => {
          const statusInfo = getStatusInfo(payment.status);
          const StatusIcon = statusInfo.icon;
          
          return (
            <Card key={payment.id} className="bg-gradient-card border-border/20 hover:shadow-glow transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 border border-primary/20">
                      <DollarSign className="w-6 h-6 text-primary" />
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className="font-semibold">{payment.client}</h3>
                      <p className="text-muted-foreground">{payment.service}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(payment.date).toLocaleDateString('pt-BR')} • {payment.paymentMethod}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-lg font-bold">R$ {payment.amount.toFixed(2)}</div>
                      <Badge className={statusInfo.color}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusInfo.label}
                      </Badge>
                    </div>
                    
                    <div className="flex space-x-2">
                      {payment.status !== "paid" && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleMarkAsPaid(payment.id)}
                        >
                          Marcar como Pago
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        Detalhes
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
          <CardDescription>Gerencie seus pagamentos de forma eficiente</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <DollarSign className="w-6 h-6" />
              <span>Registrar Pagamento Manual</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Download className="w-6 h-6" />
              <span>Gerar Relatório Mensal</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Payments;