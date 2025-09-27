import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { User, Bell, Shield, Palette, Globe, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { professional } = useAuth();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    name: professional?.name || "",
    email: professional?.email || "",
    bio: "",
    notifications: {
      email: true,
      push: false,
      sms: true
    },
    privacy: {
      profileVisible: true,
      showEmail: false,
      showPhone: true
    },
    appearance: {
      darkMode: false,
      language: "pt"
    }
  });

  const handleSave = () => {
    toast({
      title: "Configurações salvas",
      description: "Suas configurações foram atualizadas com sucesso.",
    });
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
  };

  const handlePrivacyChange = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie suas preferências e configurações da conta
        </p>
      </div>

      <div className="grid gap-6">
        {/* Profile Settings */}
        <Card className="bg-gradient-card border-border/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Perfil
            </CardTitle>
            <CardDescription>
              Atualize suas informações pessoais
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src="" />
                <AvatarFallback className="text-lg">
                  {settings.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <Button variant="outline" size="sm">
                  Alterar foto
                </Button>
                <p className="text-xs text-muted-foreground mt-1">
                  JPG, PNG ou GIF. Máximo 2MB.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={settings.name}
                  onChange={(e) => setSettings(prev => ({...prev, name: e.target.value}))}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings(prev => ({...prev, email: e.target.value}))}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="bio">Biografia</Label>
              <Textarea
                id="bio"
                placeholder="Conte um pouco sobre você..."
                value={settings.bio}
                onChange={(e) => setSettings(prev => ({...prev, bio: e.target.value}))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-gradient-card border-border/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notificações
            </CardTitle>
            <CardDescription>
              Configure como você deseja receber notificações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications">Notificações por Email</Label>
                <p className="text-sm text-muted-foreground">Receba atualizações importantes por email</p>
              </div>
              <Switch
                id="email-notifications"
                checked={settings.notifications.email}
                onCheckedChange={(checked) => handleNotificationChange('email', checked)}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="push-notifications">Notificações Push</Label>
                <p className="text-sm text-muted-foreground">Receba notificações no navegador</p>
              </div>
              <Switch
                id="push-notifications"
                checked={settings.notifications.push}
                onCheckedChange={(checked) => handleNotificationChange('push', checked)}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sms-notifications">Notificações SMS</Label>
                <p className="text-sm text-muted-foreground">Receba lembretes por SMS</p>
              </div>
              <Switch
                id="sms-notifications"
                checked={settings.notifications.sms}
                onCheckedChange={(checked) => handleNotificationChange('sms', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card className="bg-gradient-card border-border/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Privacidade
            </CardTitle>
            <CardDescription>
              Controle a visibilidade das suas informações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="profile-visible">Perfil Público</Label>
                <p className="text-sm text-muted-foreground">Tornar seu perfil visível para outros usuários</p>
              </div>
              <Switch
                id="profile-visible"
                checked={settings.privacy.profileVisible}
                onCheckedChange={(checked) => handlePrivacyChange('profileVisible', checked)}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="show-email">Mostrar Email</Label>
                <p className="text-sm text-muted-foreground">Permitir que outros vejam seu email</p>
              </div>
              <Switch
                id="show-email"
                checked={settings.privacy.showEmail}
                onCheckedChange={(checked) => handlePrivacyChange('showEmail', checked)}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="show-phone">Mostrar Telefone</Label>
                <p className="text-sm text-muted-foreground">Permitir que outros vejam seu telefone</p>
              </div>
              <Switch
                id="show-phone"
                checked={settings.privacy.showPhone}
                onCheckedChange={(checked) => handlePrivacyChange('showPhone', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Subscription */}
        <Card className="bg-gradient-card border-border/20">
          <CardHeader>
            <CardTitle>Assinatura</CardTitle>
            <CardDescription>
              Gerencie seu plano e faturamento
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">Plano Atual</h3>
                  <Badge variant="outline">Pro</Badge>
                </div>
                <p className="text-sm text-muted-foreground">R$ 49,90/mês</p>
              </div>
              <Button variant="outline">
                Gerenciar Assinatura
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Salvar Configurações
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;