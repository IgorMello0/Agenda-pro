import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Plus, Download, Eye, FileText, Signature } from "lucide-react";

interface Contract {
  id: number;
  title: string;
  client_id: number | null;
  document_url: string;
  signed_document_url: string | null;
  status: string;
  signature_positions: any;
  created_at: string;
  signed_at: string | null;
  clients?: {
    name: string;
  };
}

interface Client {
  id: number;
  name: string;
}

export default function Contracts() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [contractTitle, setContractTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [signatureMode, setSignatureMode] = useState<number | null>(null);
  const [signaturePositions, setSignaturePositions] = useState<{x: number, y: number}[]>([]);
  const [documentUrl, setDocumentUrl] = useState<string>("");
  const { user } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const fetchContracts = async () => {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .select(`
          *,
          clients (name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContracts(data || []);
    } catch (error) {
      console.error('Error fetching contracts:', error);
      toast.error('Erro ao carregar contratos');
    }
  };

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchContracts(), fetchClients()]);
      setLoading(false);
    };

    loadData();
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      toast.error('Por favor, selecione um arquivo PDF');
    }
  };

  const uploadDocument = async (file: File): Promise<string> => {
    const fileName = `${user?.id}/${Date.now()}_${file.name}`;
    
    const { data, error } = await supabase.storage
      .from('contracts')
      .upload(fileName, file);

    if (error) throw error;
    return fileName;
  };

  const handleAddContract = async () => {
    if (!contractTitle || !selectedFile) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    try {
      const documentPath = await uploadDocument(selectedFile);
      
      const { error } = await supabase
        .from('contracts')
        .insert({
          title: contractTitle,
          client_id: selectedClient ? parseInt(selectedClient) : null,
          document_url: documentPath,
          status: 'pending'
        });

      if (error) throw error;

      toast.success('Contrato adicionado com sucesso!');
      setIsAddDialogOpen(false);
      setContractTitle("");
      setSelectedClient("");
      setSelectedFile(null);
      fetchContracts();
    } catch (error) {
      console.error('Error adding contract:', error);
      toast.error('Erro ao adicionar contrato');
    }
  };

  const openSignatureMode = async (contractId: number, documentUrl: string) => {
    setSignatureMode(contractId);
    setSignaturePositions([]);
    
    // Get signed URL for document
    const { data } = await supabase.storage
      .from('contracts')
      .createSignedUrl(documentUrl, 3600);
    
    if (data?.signedUrl) {
      setDocumentUrl(data.signedUrl);
    }
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    setSignaturePositions(prev => [...prev, { x, y }]);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "secondary",
      signed: "default",
      cancelled: "destructive"
    };
    
    const labels = {
      pending: "Pendente",
      signed: "Assinado",
      cancelled: "Cancelado"
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] as any}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando contratos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Contratos</h1>
          <p className="text-muted-foreground">Gerencie contratos e assinaturas digitais</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Contrato
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Contrato</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Título do Contrato</Label>
                <Input
                  id="title"
                  value={contractTitle}
                  onChange={(e) => setContractTitle(e.target.value)}
                  placeholder="Digite o título do contrato"
                />
              </div>
              
              <div>
                <Label htmlFor="client">Cliente (Opcional)</Label>
                <Select value={selectedClient} onValueChange={setSelectedClient}>
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
                <Label htmlFor="document">Documento PDF</Label>
                <Input
                  id="document"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                />
              </div>

              <Button onClick={handleAddContract} className="w-full">
                Adicionar Contrato
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {contracts.map((contract) => (
          <Card key={contract.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {contract.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Cliente: {contract.clients?.name || 'Não especificado'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Criado em: {new Date(contract.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {getStatusBadge(contract.status)}
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => openSignatureMode(contract.id, contract.document_url)}
                    >
                      <Signature className="h-4 w-4 mr-1" />
                      Assinar
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {signatureMode && (
        <Dialog open={true} onOpenChange={() => setSignatureMode(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Posicionar Assinatura</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Clique no documento onde deseja posicionar a assinatura
              </p>
              
              <div className="relative border rounded-lg overflow-hidden">
                <canvas
                  ref={canvasRef}
                  onClick={handleCanvasClick}
                  className="w-full cursor-crosshair"
                />
                {documentUrl && (
                  <img
                    ref={imageRef}
                    src={documentUrl}
                    alt="Document"
                    className="hidden"
                    onLoad={() => {
                      const canvas = canvasRef.current;
                      const img = imageRef.current;
                      if (canvas && img) {
                        canvas.width = img.naturalWidth;
                        canvas.height = img.naturalHeight;
                        const ctx = canvas.getContext('2d');
                        if (ctx) {
                          ctx.drawImage(img, 0, 0);
                        }
                      }
                    }}
                  />
                )}
              </div>

              <div className="flex gap-2">
                <Button onClick={() => setSignaturePositions([])}>
                  Limpar Posições
                </Button>
                <Button variant="outline" onClick={() => setSignatureMode(null)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}