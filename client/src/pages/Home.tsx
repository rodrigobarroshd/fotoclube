import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { supabase } from "../lib/supabase";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronRight, Search, Filter, Package, Truck, CheckCircle, Clock, AlertCircle,} from "lucide-react";
import { Pedido } from "@/types/types";


export const statusConfig = {
  AGUARDANDO_COMPROVANTE: {
    label: "Aguardando Comprovante",
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
  },
  APROVADO: {
    label: "Aprovado",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
  CANCELADO: {
    label: "Cancelado",
    color: "bg-red-100 text-red-800",
    icon: AlertCircle,
  },
  ENVIADO: {
    label: "Enviado",
    color: "bg-green-100 text-green-800",
    icon: AlertCircle,
  },
  ENTREGUE: {
    label: "Entregue",
    color: "bg-green-100 text-green-800",
    icon: AlertCircle,
  },
} as const;

// Tipagem de chaves
export type StatusPedido = keyof typeof statusConfig;


//   { key: "id", label: "ID", width: "60px", sticky: true },
//   { key: "comprovante", label: "Comprovante", width: "60px", sticky: true },
//   { key: "name", label: "Nome", width: "160px" },
//   { key: "telefone", label: "Telefone", width: "120px" },
//   { key: "instagram_user", label: "Instagram", width: "140px" },
//   { key: "address", label: "Endereço", width: "200px" },
//   { key: "price", label: "Preço Unitário", width: "120px" },
//   { key: "Qtd", label: "Quantidade", width: "100px" },
//   { key: "total_price", label: "Preço Total", width: "140px" },
//   { key: "payment_method", label: "Forma de Pagamento", width: "160px" },
//   { key: "status", label: "Status", width: "120px" },

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [openItens, setOpenItens] = useState(false)
  const [editingStatus, setEditingStatus] = useState(false)
  const [openStatusModal, setOpenStatusModal] = useState(false)
  const [newStatus, setNewStatus] = useState<StatusPedido | undefined>(
    selectedPedido?.status
  )
  
  useEffect(() => {
    async function fetchPedidos() {
      setLoading(true);
      const { data, error } = await supabase
        .from<Pedido>("pedidos") // ou o nome real da sua tabela
        .select("*")
        .order("created_at", { ascending: false });
  
      if (error) {
        console.error("Erro ao buscar pedidos:", error);
      } else if (data) {
        setPedidos(data);
      }
      setLoading(false);
    }
  
    fetchPedidos();
  }, []);

  const filteredPedidos = useMemo(() => {
    const search = searchQuery.toLowerCase();
  
    return pedidos.filter((pedido) => {
      // converte todos os campos em string segura
      const name = pedido.name?.toLowerCase() ?? "";
      const instagram = pedido.instagram_user?.toLowerCase() ?? "";
      const id = pedido.id?.toString() ?? "";
      const address = pedido.address?.toLowerCase() ?? "";
      const telefone = pedido.telefone?.toString() ?? "";
  
      const matchesSearch =
      name.includes(search) ||
      instagram.includes(search) ||
      id.includes(search) || 
      address.includes(search) ||
      telefone.includes(search);  
  
      const matchesStatus =
        statusFilter === "all" || pedido.status === statusFilter;
  
      return matchesSearch && matchesStatus;
    });
  }, [pedidos, searchQuery, statusFilter]);
  

  
  const stats = useMemo(() => {
    return {
      total: pedidos.length,
      aguardando_comprovante: pedidos.filter(
        (o) => o.status === "AGUARDANDO_COMPROVANTE"
      ).length,
      aprovado: pedidos.filter((o) => o.status === "APROVADO").length,
      cancelado: pedidos.filter((o) => o.status === "CANCELADO").length,
      enviado: pedidos.filter((o) => o.status === "ENVIADO").length,
      entregue: pedidos.filter((o) => o.status === "ENTREGUE").length,
    };
  }, [pedidos]);
  // Para pegar o status do pedido selecionado
  const statusKey = selectedPedido?.status ?? "AGUARDANDO_COMPROVANTE";
  
  useEffect(() => {
    setNewStatus(selectedPedido?.status)
  }, [selectedPedido])




// modal para mudar o status
  const handleChangeStatus = async () => {
    if (!newStatus || !selectedPedido) return;
  
    // 1️⃣ Atualiza no estado local
    setSelectedPedido((prev) =>
      prev ? { ...prev, status: newStatus } : prev
    );
  
    setOpenStatusModal(false);
  };

  // modal para atualizar o pedido
  const handleUpdateStatus = async () => {
    if (!selectedPedido || !newStatus) return;
  
    const { error } = await supabase
      .from("pedidos")
      .update({ status: newStatus })
      .eq("id", selectedPedido.id);
  
    if (error) {
      console.error(error);
      return;
    }
  
    // 1️⃣ Atualiza pedido selecionado
    setSelectedPedido((prev) =>
      prev ? { ...prev, status: newStatus } : prev
    );
  
    // 2️⃣ Atualiza a tabela
    setPedidos((prev) =>
      prev.map((pedido) =>
        pedido.id === selectedPedido.id
          ? { ...pedido, status: newStatus }
          : pedido
      )
    );
  
    // 3️⃣ Fecha modais
    setOpenStatusModal(false);
    setSelectedPedido(null);
  };
  
  

  

  
  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full border-b border-border bg-sidebar lg:w-64 lg:border-b-0 lg:border-r">
          <div className="flex flex-col gap-6 p-6">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Package className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-sidebar-foreground">
                  Pedidos
                </h1>
                <p className="text-xs text-sidebar-foreground/60">
                  Loja de Camisas
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-3">
              <div className="rounded-lg bg-white p-3 shadow-sm">
                <p className="text-xs font-medium text-sidebar-foreground/60">
                  Total de Pedidos
                </p>
                <p className="text-2xl font-bold text-sidebar-foreground">
                  {stats.total}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
                <div className="rounded-lg bg-yellow-50 p-2">
                  <p className="text-xs text-yellow-700">Pendentes</p>
                  <p className="text-lg font-semibold text-yellow-900">
                    {stats.aguardando_comprovante}
                  </p>
                </div>
                <div className="rounded-lg bg-blue-50 p-2">
                  <p className="text-xs text-blue-700">Aprovados</p>
                  <p className="text-lg font-semibold text-blue-900">
                    {stats.aprovado}
                  </p>
                </div>
                <div className="rounded-lg bg-purple-50 p-2">
                  <p className="text-xs text-purple-700">Enviados</p>
                  <p className="text-lg font-semibold text-purple-900">
                    {stats.cancelado}
                  </p>
                </div>
                <div className="rounded-lg bg-green-50 p-2">
                  <p className="text-xs text-green-700">Entregues</p>
                  <p className="text-lg font-semibold text-green-900">
                    {stats.entregue}
                  </p>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="space-y-3 border-t border-sidebar-border pt-4">
              <p className="text-xs font-semibold uppercase text-sidebar-foreground/60">
                Filtros
              </p>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="AGUARDANDO_COMPROVANTE">Aguardando Comprovante</SelectItem>
                  <SelectItem value="APROVADO">Aprovado</SelectItem>
                  <SelectItem value="ENVIADO">Enviado</SelectItem>
                  <SelectItem value="ENTREGUE">Entregue</SelectItem>
                  <SelectItem value="CANCELADO">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Seus Pedidos
                </h2>
                <p className="text-sm text-muted-foreground">
                  Gerencie e acompanhe todos os pedidos da sua loja
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por ID, cliente ou email..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            {/* Orders Table */}
            <Card className="overflow-hidden border border-border shadow-sm">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-border hover:bg-transparent align-middle">
                      <TableHead className="text-center font-semibold text-foreground">
                        ID do Pedido
                      </TableHead>
                      <TableHead className="text-center  font-semibold text-foreground">
                        Comprovante
                      </TableHead>
                      <TableHead className="text-center  font-semibold text-foreground">
                        Cliente
                      </TableHead>
                      <TableHead className="text-center  font-semibold text-foreground">
                        Telefone
                      </TableHead>
                      <TableHead className="text-center  font-semibold text-foreground">
                        Instagram
                      </TableHead>
                      <TableHead className="text-center  font-semibold text-foreground">
                        Endereço
                      </TableHead>
                      <TableHead className="text-center  font-semibold text-foreground">
                        Qtd
                      </TableHead>
                      <TableHead className="text-center font-semibold text-foreground">
                        Preço Total
                      </TableHead>
                      <TableHead className=" w-45 text-center font-semibold text-foregroundtext-center font-semibold text-foreground">
                        Status
                      </TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPedidos.length > 0 ? (
                      filteredPedidos.map((pedido) => {
                        const statusInfo =
                          statusConfig[pedido.status as keyof typeof statusConfig];
                        const StatusIcon = statusInfo.icon;

                        return (
                          <TableRow
                            key={pedido.id}
                            className="text-center border-b border-border hover:bg-secondary/30 transition-colors cursor-pointer align-middle "
                            onClick={() => setSelectedPedido(pedido)}
                          >
                            <TableCell className="font-mono text-sm font-medium text-foreground">
                              {pedido.id}
                            </TableCell>
                            <TableCell className="text-center text-sm text-foreground">
                              {pedido.comprovante}
                            </TableCell>
                            <TableCell className="text-center  text-sm text-foreground">
                              {pedido.name}
                            </TableCell>
                            <TableCell className="text-center  text-sm text-foreground">
                              {pedido.telefone}
                            </TableCell>
                            <TableCell className="text-center text-sm text-foreground">
                              {pedido.instagram_user}
                            </TableCell>
                            <TableCell className="text-center text-sm text-foreground max-w-3 md:max-w-3 truncate">
                              {pedido.address}
                            </TableCell>
                            <TableCell className="text-center text-sm text-foreground">
                              {pedido.Qtd}
                            </TableCell>
                            <TableCell className="text-center align-middle font-semibold text-foreground">
                              <div className="flex justify-center">
                                R$ {Number(pedido.total_price ?? 0).toFixed(2)}
                              </div>
                            </TableCell>

                            <TableCell className="text-center">
                              <div className="flex justify-center">
                                <Badge
                                  className={`${statusInfo.color} flex items-center gap-1.5 px-2.5 py-1`}
                                >
                                  <StatusIcon className="h-3.5 w-3.5" />
                                  <span className="text-xs font-medium">
                                    {statusInfo.label}
                                  </span>
                                </Badge>
                              </div>
                            </TableCell> 
                            <TableCell>
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={10}
                          className="py-8 text-center text-muted-foreground"
                        >
                          Nenhum pedido encontrado
                        </TableCell>
                        </TableRow>

                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>

            {/* Results Info */}
            <div className="text-sm text-muted-foreground">
              Mostrando {filteredPedidos.length} de {pedidos.length} pedidos
            </div>
          </div>
        </main>
      </div>

      {/* Order Detail Modal - Simple overlay */}
      {selectedPedido && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center "
          onClick={() => setSelectedPedido(null)}
        >
          <Card
            className="w-full max-w-md border border-border shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
          <div className="space-y-4 p-4">
            <div className="space-y-3">
                <p className="text-lg font-medium flex items-center gap-2">
                  <span>
                    {selectedPedido.id}.
                  </span>
                  <span className="">
                    {selectedPedido.name}
                  </span>
                </p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">
                Endereço
              </p>
              <p className="font-semibold text-foreground wrap-break-word">
                {selectedPedido.address}
              </p>
            </div>

              <div className="space-y-4 border-t border-border pt-4">
              <div className="grid grid-cols-2 gap-6">
  
              <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Preço</p>
                  <p className="font-semibold text-foreground">
                    {selectedPedido?.price}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground ">Quantidade</p>
                  <button
                    type="button"
                    onClick={() => setOpenItens(true)}
                    className="font-semibold text-primary hover:underline"
                  >
                    {selectedPedido?.Qtd} Itens
                  </button>
                </div>

             
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Total</p>
                  <p className="font-semibold text-foreground">
                    R$ {Number(selectedPedido?.total_price ?? 0).toFixed(2)}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Comprovante</p>

                  {selectedPedido?.comprovante ? (
                    <a
                      href={selectedPedido.comprovante}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-primary hover:underline break-all"
                    >
                      Ver comprovante
                    </a>
                  ) : (
                    <p className="text-sm text-muted-foreground">Não enviado</p>
                  )}
                </div>
              </div>



              <div className="border-t border-border pt-4 space-y-1">
                <p className="text-xs font-medium text-muted-foreground">
                  Status
                </p>

                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => setOpenStatusModal(true)}
                    className="cursor-pointer"
                  >
                    {selectedPedido?.status && statusConfig[selectedPedido.status] ? (
                      (() => {
                        const statusInfo = statusConfig[selectedPedido.status]
                        const StatusIcon = statusInfo.icon

                        return (
                          <Badge
                            className={`${statusInfo.color} flex w-fit items-center gap-1.5 px-3 py-1.5 hover:opacity-80`}
                          >
                            <StatusIcon className="h-4 w-4" />
                            <span className="font-medium">{statusInfo.label}</span>
                          </Badge>
                        )
                      })()
                    ) : (
                      <Badge className="bg-gray-100 text-gray-800 px-3 py-1.5">
                        Sem status
                      </Badge>
                    )}
                  </button>
                </div>
              </div>





                <div className="border-t border-border pt-4 space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Data do Pedido
                  </p>
                  <p className="font-semibold text-foreground">
                    {new Date(selectedPedido.created_at).toLocaleDateString(
                      "pt-BR"
                    )}
                  </p>
                </div>

                <div className="border-t border-border pt-4 space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Telefone
                  </p>
                  <p className="font-semibold text-foreground">
                    {selectedPedido.telefone}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 border-t border-border pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setSelectedPedido(null)}
                >
                  Fechar
                </Button>
                <Button
                  className="flex-1"
                 
                  onClick={handleUpdateStatus}
                >
                  Atualizar Status
                </Button>

              </div>
            </div>
          </Card>
        </div>
      )}
      
{openStatusModal && selectedPedido && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center "
    onClick={() => setOpenStatusModal(false)}
  >
    <Card
      className="w-full max-w-sm border border-border shadow-lg"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-6 space-y-4">
        <h3 className="text-lg font-bold text-foreground">
          Alterar status
        </h3>

        <Select
          value={newStatus}
          onValueChange={(value) =>
            setNewStatus(value as StatusPedido)
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione o status" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(statusConfig).map(([key, value]) => (
              <SelectItem key={key} value={key}>
                {value.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2 pt-2">
          <Button
            className="flex-1"
            onClick={handleChangeStatus}
          >
            Salvar
          </Button>

          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setOpenStatusModal(false)}
          >
            Cancelar
          </Button>
        </div>
      </div>
    </Card>
  </div>
)}

      {/* Modal das Camisas */}
      {openItens && selectedPedido?.itens && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center "
          onClick={() => setOpenItens(false)}
        >
          <Card
            className="w-full max-w-sm border border-border shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground">
                  Itens do Pedido
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setOpenItens(false)}
                >
                  ✕
                </Button>
              </div>

              <div className="space-y-3">
                {selectedPedido.itens.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-md border border-border p-3"
                  >
                    <span className="font-medium text-foreground">
                      Tamanho {item.tamanho}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Quantidade: {item.quantidade}
                    </span>
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setOpenItens(false)}
              >
                Fechar
              </Button>
            </div>
          </Card>
        </div>
      )}

    </div>
  );
}
