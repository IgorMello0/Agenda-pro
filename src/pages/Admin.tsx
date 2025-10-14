import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Shield, Plus, Edit, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UserWithRole {
  id: string;
  email: string;
  professionals: {
    name: string;
    subscription_status: string;
  }[];
  user_roles: {
    role: string;
  }[];
}

const Admin = () => {
  const { toast } = useToast();
  const { professional } = useAuth();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const checkAdminStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    setIsAdmin(!!data);
    setLoading(false);
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          professionals (
            name,
            email,
            subscription_status
          ),
          user_roles (
            role
          )
        `);

      if (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Erro ao carregar usuários",
          description: "Não foi possível carregar os dados dos usuários.",
          variant: "destructive",
        });
        return;
      }

      // Transform data to match our interface
      const transformedData: UserWithRole[] = (data || []).map((profile: any) => ({
        id: profile.id,
        email: profile.professionals?.[0]?.email || '',
        professionals: profile.professionals || [],
        user_roles: profile.user_roles || []
      }));

      setUsers(transformedData);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleToggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    
    try {
      if (currentRole === 'user') {
        // Add admin role
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role: 'admin' });

        if (error) throw error;
      } else {
        // Remove admin role
        const { error } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId)
          .eq('role', 'admin');

        if (error) throw error;
      }

      toast({
        title: "Função atualizada",
        description: `Usuário agora é ${newRole === 'admin' ? 'administrador' : 'usuário comum'}.`,
      });

      fetchUsers();
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a função do usuário.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Administração</h1>
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-card border-border/20">
          <CardContent className="p-6 text-center">
            <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Acesso Negado</h3>
            <p className="text-muted-foreground">
              Você não tem permissão para acessar esta área.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getRoleColor = (role: string) => {
    return role === "admin" ? "bg-destructive/10 text-destructive border-destructive/20" : "bg-accent/10 text-accent-foreground border-accent/20";
  };

  const getStatusColor = (status: string) => {
    return status === "active" ? "bg-success/10 text-success border-success/20" : "bg-muted/10 text-muted-foreground border-muted/20";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Administração</h1>
          <p className="text-muted-foreground">
            Gerencie usuários e permissões do sistema
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-card border-border/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Usuários
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-success">
              +2 novos este mês
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Administradores
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.user_roles?.[0]?.role === "admin").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Usuários com privilégios
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Usuários Ativos
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.professionals?.[0]?.subscription_status === "active").length}
            </div>
            <p className="text-xs text-success">
              {users.length > 0 ? Math.round((users.filter(u => u.professionals?.[0]?.subscription_status === "active").length / users.length) * 100) : 0}% do total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="bg-gradient-card border-border/20">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Usuários</CardTitle>
                <CardDescription>Gerencie funções de todos os usuários do sistema</CardDescription>
              </div>
            </div>
          </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const role = user.user_roles?.[0]?.role || 'user';
                const professional = user.professionals?.[0];
                
                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{professional?.name || 'N/A'}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge className={getRoleColor(role)}>
                        {role === "admin" ? "Administrador" : "Usuário"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(professional?.subscription_status || '')}>
                        {professional?.subscription_status === "active" ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleToggleRole(user.id, role)}
                      >
                        <Shield className="w-4 h-4 mr-1" />
                        {role === 'admin' ? 'Remover Admin' : 'Tornar Admin'}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;