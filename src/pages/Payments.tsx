import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Search, Filter, Download, CheckCircle, Clock, AlertCircle, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Payment {
  id: number;
  amount: number;
  method: string;
  status: string;
  created_at: string;
  clients: {
    name: string;
  };
  appointments: {
    notes?: string;
  };
}

const Payments = () => {
  const { professional } = useAuth();
  const { toast } = useToast();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [newPayment, setNewPayment] = useState({
    client: "",
    amount: "",
    method: "",
    status: "pending"
  });

  useEffect(() => {
    if (professional) {
      fetchPayments();
    }
  }, [professional]);

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          clients (name),
          appointments (notes)
        `)
        .eq('professional_id', professional?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching payments:', error);
        toast({
          title: "Erro ao carregar pagamentos",
          description: "Não foi possível carregar os dados dos pagamentos.",
          variant: "destructive",
        });
        return;
      }

      setPayments(data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao carregar os dados.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter(payment =>
    payment.clients?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const totalPaid = payments.filter(p => p.status === "paid").reduce((sum, p) => sum + Number(p.amount), 0);
  const totalPending = payments.filter(p => p.status === "pending").reduce((sum, p) => sum + Number(p.amount), 0);
  const totalOverdue = payments.filter(p => p.status === "overdue").reduce((sum, p) => sum + Number(p.amount), 0);

  const handleMarkAsPaid = async (paymentId: number) => {
    try {
      const { error } = await supabase
        .from('payments')
        .update({ status: 'paid' })
        .eq('id', paymentId);

      if (error) {
        toast({
          title: "Erro",
          description: "Não foi possível marcar o pagamento como pago.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sucesso",
        description: "Pagamento marcado como pago.",
      });

      fetchPayments();
    } catch (error) {
      console.error('Error updating payment:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao atualizar o pagamento.",
        variant: "destructive",
      });
    }
  };

  const handleAddPayment = () => {
    // In a real app, this would create a payment in the database
    console.log("Adding payment:", newPayment);
    setNewPayment({ client: "", amount: "", method: "", status: "pending" });
    setOpen(false);
    toast({
      title: "Pagamento registrado",
      description: "Novo pagamento foi adicionado com sucesso.",
    });
    fetchPayments(); // Refresh the list
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Pagamentos</h2>
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
          <h2 className="text-2xl font-bold">Pagamentos</h2>
          <p className="text-muted-foreground">Controle financeiro dos seus atendimentos</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="hero">
                <Plus className="w-4 h-4 mr-2" />
                Registrar Pagamento
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar Novo Pagamento</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="payment-client">Cliente</Label>
                  <Input
                    id="payment-client"
                    value={newPayment.client}
                    onChange={(e) => setNewPayment({...newPayment, client: e.target.value})}
                    placeholder="Nome do cliente"
                  />
                </div>
                <div>
                  <Label htmlFor="payment-amount">Valor</Label>
                  <Input
                    id="payment-amount"
                    type="number"
                    step="0.01"
                    value={newPayment.amount}
                    onChange={(e) => setNewPayment({...newPayment, amount: e.target.value})}
                    placeholder="0,00"
                  />
                </div>
                <div>
                  <Label htmlFor="payment-method">Método de Pagamento</Label>
                  <Select value={newPayment.method} onValueChange={(value) => setNewPayment({...newPayment, method: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o método" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cartão de Crédito">Cartão de Crédito</SelectItem>
                      <SelectItem value="Cartão de Débito">Cartão de Débito</SelectItem>
                      <SelectItem value="PIX">PIX</SelectItem>
                      <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                      <SelectItem value="Transferência">Transferência</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="payment-status">Status</Label>
                  <Select value={newPayment.status} onValueChange={(value) => setNewPayment({...newPayment, status: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="paid">Pago</SelectItem>
                      <SelectItem value="overdue">Vencido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddPayment} className="w-full">
                  Registrar Pagamento
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar Relatório
          </Button>
        </div>
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
        {filteredPayments.length === 0 ? (
          <Card className="bg-gradient-card border-border/20">
            <CardContent className="p-6 text-center">
              <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchTerm ? "Nenhum pagamento encontrado" : "Nenhum pagamento registrado"}
              </h3>
              <p className="text-muted-foreground">
                {searchTerm ? "Tente ajustar os termos de busca." : "Quando você receber pagamentos, eles aparecerão aqui."}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredPayments.map((payment) => {
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
                      <h3 className="font-semibold">{payment.clients?.name || "Cliente não encontrado"}</h3>
                      <p className="text-muted-foreground">{payment.appointments?.notes || "Pagamento"}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(payment.created_at).toLocaleDateString('pt-BR')} • {payment.method || "Não informado"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-lg font-bold">R$ {Number(payment.amount).toFixed(2)}</div>
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
          })
        )}
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