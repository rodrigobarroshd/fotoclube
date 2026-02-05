import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { useRouter } from "next/router";
import { Card } from "@/components/ui/card";
import { supabase } from "../lib/supabase";
import { useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react";
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
import { Camisa, CamisaTamanho, Pedido } from "@/types/types";


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
type View = "pedidos" | "camisas";

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
  const [, setLocation] = useLocation();
  // const [loadingAuth, setLoadingAuth] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [openItens, setOpenItens] = useState(false)
  // const [editingStatus, setEditingStatus] = useState(false)
  const [openStatusModal, setOpenStatusModal] = useState(false)
  const [newStatus, setNewStatus] = useState<StatusPedido | undefined>(
    selectedPedido?.status
  )
  const [currentView, setCurrentView] = useState<View>("pedidos");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [camisas, setCamisas] = useState<Camisa[]>([]);
  const [nome, setNome] = useState("");
  const [account, setAccount] = useState("");
  const [frete, setFrete] = useState(0);
  const [pontoEntrega, setPontoEntrega] = useState("");
  const [tamanho, setTamanho] = useState("");
  const [price, setPrice] = useState(0);
  const [estoque, setEstoque] = useState(0);
  const [openCreateCamisaModal, setOpenCreateCamisaModal] = useState(false);
  const [camisaTamanhos, setCamisaTamanhos] = useState<
  { tamanho: string; estoque: number }[]
>([{ tamanho: "", estoque: 0 }]);
// const estoqueTotal = camisaTamanhos.reduce((acc, t) => acc + Number(t.estoque), 0);
const [estoqueTotal, setEstoqueTotal] = useState(0);
  const handleSelect = (view: View) => {
    setCurrentView(view);
    setDropdownOpen(false);
  };
  
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
  
  const [editNome, setEditNome] = useState("");
  const [editPrice, setEditPrice] = useState(0);
  const [editCamisaTamanhos, setEditCamisaTamanhos] = useState<CamisaTamanho[]>([]);
  const [editEstoqueTotal, setEditEstoqueTotal] = useState(0);
  
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


const addTamanho = () => {
  setCamisaTamanhos([...camisaTamanhos, { tamanho: "", estoque: 0 }]);
};

const removeTamanho = (index: number) => {
  const novaLista = [...camisaTamanhos];
  novaLista.splice(index, 1);
  setCamisaTamanhos(novaLista);
  atualizarEstoqueTotal(novaLista);
};
  const updateTamanho = (index: number, campo: "tamanho" | "estoque", valor: string | number) => {
    const novaLista = [...camisaTamanhos];
    novaLista[index] = { ...novaLista[index], [campo]: valor };
    setCamisaTamanhos(novaLista);
    atualizarEstoqueTotal(novaLista);
  };

  const atualizarEstoqueTotal = (lista: CamisaTamanho[]) => {
    const total = lista.reduce((acc, t) => acc + t.estoque, 0);
    setEstoqueTotal(total);
  };

  useEffect(() => {
    async function fetchCamisas() {
      setLoading(true);
      const { data, error } = await supabase
        .from<Camisa>("camisas") // nome da tabela exato no Supabase
        .select("*")
        .order("id", { ascending: true });
  
      if (error) {
        console.error("Erro ao buscar camisas:", error);
      } else if (data) {
        setCamisas(data);
      }
      setLoading(false);
    }
  
    fetchCamisas();
  }, []);
  type CamisaEdit = Camisa & { imagemFile?: File };

  const handleCreateCamisa = async () => {
    if (!nome || price <= 0 || estoqueTotal <= 0) {
      alert("Preencha nome, preço e estoque corretamente!");
      return;
    }
  
    let uploadedUrl = "";
  
    if (imagemFile) {
      uploadedUrl = await uploadImagem(imagemFile); // função que você já tem
      if (!uploadedUrl) {
        alert("Erro ao enviar imagem!");
        return;
      }
    }
  
    const novaCamisa: Omit<Camisa, "id"> = {
      nome,
      price,
      image: uploadedUrl,
      estoque: estoqueTotal,
      tamanhos: camisaTamanhos,
      ponto_entrega: pontoEntrega,
      frete,
      account
    };
  
    try {
      const { data, error } = await supabase
        .from("camisas")
        .insert([novaCamisa])
        .select();
  
      if (error) throw error;
  
      setCamisas([...camisas, data[0]]);
      setOpenCreateCamisaModal(false);
      setNome("");
      setPrice(0);
      setCamisaTamanhos([{ tamanho: "", estoque: 0 }]);
      setEstoqueTotal(0);
      setImagemFile(null);
      setImagemUrl(null);
  
      console.log("Camisa criada com sucesso:", data[0]);
    } catch (err) {
      console.error("Erro ao criar camisa:", err);
      alert("Erro ao criar camisa, veja o console.");
    }
  };



  const [selectedCamisa, setSelectedCamisa] = useState<Camisa | null>(null);
  const [openManageCamisasModal, setOpenManageCamisasModal] = useState(false);

  // const handleEditCamisa = (c: Camisa) => {
  //   setSelectedCamisa(c);
  //   setEditNome(c.nome);
  //   setEditPrice(c.price);
  //   setEditCamisaTamanhos(c.tamanhos);
  //   const total = c.tamanhos.reduce((acc, t) => acc + t.estoque, 0);
  //   setEditEstoqueTotal(total);
  // };
  const [imagemFile, setImagemFile] = useState<File | null>(null);
  const [imagemUrl, setImagemUrl] = useState<string | null>(null);

  // Upload de imagem no Supabase Storage
  const uploadImagem = async (file: File) => {
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
        .from("camisas") // nome do bucket
        .upload(fileName, file);

      if (error) {
        console.error("Erro ao fazer upload:", error);
        return null;
      }

      const url = supabase.storage.from("camisas").getPublicUrl(fileName).data.publicUrl;
      return url;
    };
    const qtdpedidos = Number(selectedPedido?.Qtd ?? 0);

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
                  FotoClub
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
            <div className="relative">
              <h2
                className="text-2xl font-bold text-foreground flex items-center gap-2 cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {currentView === "pedidos" ? "Pedidos" : "Camisas"}
                <ChevronDown className="h-5 w-5" />
              </h2>
              <p className="text-sm text-muted-foreground">
                {currentView === "pedidos"
                  ? "Gerencie e acompanhe todos os pedidos da sua loja"
                  : "Gerencie o estoque de camisas disponíveis"}
              </p>

              {dropdownOpen && (
                <div className="absolute mt-1 bg-white border border-border rounded-md shadow-md w-40 z-50">
                  <div
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => { setCurrentView("pedidos"); setDropdownOpen(false); }}
                  >
                    Pedidos
                  </div>
                  <div
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => { setCurrentView("camisas"); setDropdownOpen(false); }}
                  >
                    Camisas
                  </div>
                </div>
              )}
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
              <Button
                variant="outline"
                onClick={async () => {
                  await supabase.auth.signOut();
                  setLocation("/login");
                }}>
                Sair
              </Button>
            </div>

            {/* Pedidos Table */}
            {/* Tabela Condicional */}
          {currentView === "pedidos" ? (

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

            // Camisas Table
              ) : (<div> <Card className="overflow-hidden border border-border shadow-sm">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-border hover:bg-transparent align-middle" >
                      
                      <TableHead className="text-center font-semibold text-foreground">ID</TableHead>
                      <TableHead className="text-center font-semibold text-foreground">Imagem</TableHead>
                      <TableHead className="text-center font-semibold text-foreground">Nome</TableHead>
                      <TableHead className="text-center font-semibold text-foreground">Preço</TableHead>
                      <TableHead className="text-center font-semibold text-foreground">Frete</TableHead>
                      <TableHead className="text-center font-semibold text-foreground">Ponto de Entrega</TableHead>
                      <TableHead className="text-center font-semibold text-foreground">Estoque</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {camisas.length > 0 ? (
                      camisas.map((c) => (
                        <TableRow key={c.id} className="text-center border-b border-border hover:bg-secondary/30 cursor-pointer"  onClick={() => setSelectedCamisa(c)}>
                          <TableCell>{c.id}</TableCell>
                          <TableCell>
                            {c.image ? (
                              <img
                                src={c.image}
                                alt={c.nome}
                                className="w-16 h-16 object-cover mx-auto rounded"
                              />
                            ) : (
                              <span className="text-muted-foreground">Sem imagem</span>
                            )}
                          </TableCell>
                          <TableCell>{c.nome}</TableCell>
                          <TableCell>R${c.price.toFixed(2)}</TableCell>
                          <TableCell>R${c.frete.toFixed(2)}</TableCell>
                          <TableCell>{c.ponto_entrega}</TableCell>
                          <TableCell>{c.estoque}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                          Nenhuma camisa encontrada
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              </Card>
              </div>
              )}

              {currentView === "camisas" && (
                <div className="flex justify-end mb-2 gap-2">
                  <Button onClick={() => setOpenCreateCamisaModal(true)}>
                    Criar Camisa
                  </Button>
                  <Button
                    className="bg-red-500"
                    onClick={() => setOpenManageCamisasModal(true)}
                  >
                    Gerenciar Camisas
                  </Button>
                </div>
              )}

            {/* Results Info */}
            {currentView === "pedidos" && (
              <div className="text-sm text-muted-foreground">
                Mostrando {filteredPedidos.length} de {pedidos.length} pedidos
              </div>
            )}

            {currentView === "camisas" && (
              <div className="text-sm text-muted-foreground">
                Mostrando {camisas.length} de {camisas.length} camisas
              </div>
            )}

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
                  R$ {Number(selectedPedido?.price ?? 0).toFixed(2)}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground ">Quantidade</p>
                  
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenItens(true);
                    }}
                    className="font-semibold text-primary hover:underline"
                  >
                  {qtdpedidos} {qtdpedidos === 1 ? "Item" : "Itens"}
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







        {selectedCamisa && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={() => setSelectedCamisa(null)}
          >
            <Card
              className="w-full max-w-md border border-border shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-4 p-4">

              <div className="flex items-start gap-2">
                  <div className="flex-1 flex flex-col gap-3">
                    <p className="text-xs font-medium text-muted-foreground">Nome</p>
                    <Input
                      value={selectedCamisa.nome}
                      onChange={(e) =>
                        setSelectedCamisa({ ...selectedCamisa, nome: e.target.value })
                      }
                      placeholder="Nome da Camisa"
                      className="font-bold text-lg w-full"
                    />
                    <p className="text-xs font-medium text-muted-foreground">Ponto de Entrega</p>
                    <Input
                      value={selectedCamisa.ponto_entrega}
                      onChange={(e) =>
                        setSelectedCamisa({ ...selectedCamisa, ponto_entrega: e.target.value })
                      }
                      placeholder="Ponto de Entrega"
                      className="font-bold text-lg w-full"
                    />
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCamisa(null)}
                    className="mt-6" 
                  >
                    ✕
                  </Button>
                </div>

                <div className="mt-2">
                  <p className="text-xs font-medium text-muted-foreground">Imagem</p>

              {selectedCamisa.image && (
                <img
                  src={selectedCamisa.image}
                  alt="Camisa"
                  className="w-32 h-32 object-cover rounded mb-2"
                />
              )}

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setImagemFile(e.target.files[0]);
                  }
                }}
              />

             </div>

                <div className="grid grid-cols-2 gap-6 border-t border-border pt-4">
                  <div className="space-y-3">
                    <p className="text-xs font-medium text-muted-foreground">Preço Unitário</p>
                    <Input
                      type="number"
                      value={selectedCamisa.price}
                      onChange={(e) =>
                        setSelectedCamisa({
                          ...selectedCamisa,
                          price: Number(e.target.value),
                        })
                      }
                    />
                    <p className="text-xs font-medium text-muted-foreground">Frete</p>
                    <Input
                      type="number"
                      value={selectedCamisa.frete}
                      onChange={(e) =>
                        setSelectedCamisa({
                          ...selectedCamisa,
                          price: Number(e.target.value),
                        })
                      }
                    />
                  </div>


                  <div className="space-y-3">
                 
                      <p className="text-xs font-medium text-muted-foreground">Conta Bancária</p>
                      <Input
                        value={selectedCamisa.account || ""}
                        onChange={(e) =>
                          setSelectedCamisa({
                            ...selectedCamisa,
                            account: e.target.value,
                          })
                        }
                      />
                    <p className="text-xs font-medium text-muted-foreground">Estoque Total</p>
                    <p className="h-10 flex items-center font-semibold text-foreground">
                    {(() => {
                      const total = selectedCamisa.tamanhos.reduce(
                        (acc, t) => acc + t.estoque,
                        0
                      );

                      return (
                        <span>
                          {total} {total === 1 ? "camisa" : "camisas"}
                        </span>
                      );
                    })()}

                    </p>
                  </div>
                </div>
             

                <div className="border-t border-border pt-4 space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Tamanhos</p>
                  {selectedCamisa.tamanhos.map((t, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <Input
                        placeholder="Tamanho"
                        value={t.tamanho}
                        onChange={(e) => {
                          const novaLista = [...selectedCamisa.tamanhos];
                          novaLista[i] = { ...novaLista[i], tamanho: e.target.value };
                          setSelectedCamisa({ ...selectedCamisa, tamanhos: novaLista });
                        }}
                      />
                      <Input
                        type="number"
                        placeholder="Estoque"
                        value={t.estoque}
                        onChange={(e) => {
                          const novaLista = [...selectedCamisa.tamanhos];
                          novaLista[i] = { ...novaLista[i], estoque: Number(e.target.value) };
                          setSelectedCamisa({ ...selectedCamisa, tamanhos: novaLista });
                        }}
                      />
                      {selectedCamisa.tamanhos.length > 1 && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            const novaLista = [...selectedCamisa.tamanhos];
                            novaLista.splice(i, 1);
                            setSelectedCamisa({ ...selectedCamisa, tamanhos: novaLista });
                          }}
                        >
                          ✕
                        </Button>
                      )}
                    </div>
                  ))}

                  <Button
                    variant="ghost"
                    onClick={() =>
                      setSelectedCamisa({
                        ...selectedCamisa,
                        tamanhos: [...selectedCamisa.tamanhos, { tamanho: "", estoque: 0 }],
                      })
                    }
                  >
                    + Adicionar tamanho
                  </Button>
                </div>

                <div className="flex gap-2 border-t border-border pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setSelectedCamisa(null)}
                  >
                    Fechar
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={async () => {
                      let uploadedUrl = selectedCamisa.image; // mantém a imagem atual se não trocar
                      if (imagemFile) {
                        const url = await uploadImagem(imagemFile);
                        if (!url) {
                          alert("Erro ao enviar imagem!");
                          return;
                        }
                        uploadedUrl = url;
                      }

                      const { data, error } = await supabase
                        .from("camisas")
                        .update({
                          nome: selectedCamisa.nome,
                          price: selectedCamisa.price,
                          image: uploadedUrl,
                          estoque: selectedCamisa.tamanhos.reduce((acc, t) => acc + t.estoque, 0),
                          tamanhos: selectedCamisa.tamanhos,
                          ponto_entrega: selectedCamisa.ponto_entrega,
                          frete: selectedCamisa.frete,
                          account: selectedCamisa.account,
                        })
                        .eq("id", selectedCamisa.id)
                        .select();

                      if (error) {
                        console.error(error);
                        return;
                      }

                      setCamisas((prev) =>
                        prev.map((c) => (c.id === selectedCamisa.id ? data[0] : c))
                      );
                      setSelectedCamisa(null);
                      setImagemFile(null);
                      setImagemUrl(null);
                    }}
                  >
                    Salvar
                  </Button>

                </div>
              </div>
            </Card>
          </div>
        )}

        {/*  Modal Tamanhos da Camisa */}
        {openItens && selectedPedido && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center "
          onClick={() => setOpenItens(false)}
        >
          <Card
            className="w-full max-w-sm p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-4">Itens do Pedido</h3>

            <div className="space-y-2">
              {selectedPedido.itens?.map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b border-border pb-2"
                >
                  <div className="flex items-center gap-2 text-base">
                    <span className="text-muted-foreground">Tamanho</span>
                    <span className="font-semibold">{item.tamanho}</span>
                  </div>
                  <span className="font-semibold">
                    {item.quantidade}{" "}
                    {item.quantidade === 1 ? "camisa" : "camisas"}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={() => setOpenItens(false)}>
                Fechar
              </Button>
            </div>
          </Card>
        </div>
        )}







      {/* create camisa modal */}
  {openCreateCamisaModal && (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={() => setOpenCreateCamisaModal(false)}
    >
    <Card
      className="w-full max-w-sm p-6"
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="text-lg font-bold mb-4">Criar Camisa</h3>

      <Input
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />
      
        <div className="mt-2">
          <p className="text-xs font-medium text-muted-foreground">Imagem</p>
          {imagemUrl && (
            <img
              src={imagemUrl}
              alt="Camisa"
              className="w-32 h-32 object-cover rounded mb-2"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files) setImagemFile(e.target.files[0]);
            }}
          />
        </div>

      {/* Preço unitário */}
      <Input
        placeholder="Preço unitário"
        type="number"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        className="mt-2"
      />

      {/* Tamanhos */}
      <div className="space-y-2 mt-2">
        {camisaTamanhos.map((t, index) => (
          <div key={index} className="flex gap-2 items-center">
            <Input
              placeholder="Tamanho"
              value={t.tamanho}
              onChange={(e) => updateTamanho(index, "tamanho", e.target.value)}
            />
            <Input
              placeholder="Estoque"
              type="number"
              value={t.estoque}
              onChange={(e) =>
                updateTamanho(index, "estoque", Number(e.target.value))
              }
            />
            {camisaTamanhos.length > 1 && (
              <Button
                variant="outline"
                onClick={() => removeTamanho(index)}
              >
                ✕
              </Button>
            )}
          </div>
        ))}
      </div>

      <Button
        variant="ghost"
        className="mt-2"
        onClick={addTamanho}
      >
        + Adicionar tamanho
      </Button>

      {/* Estoque total */}
      <p className="mt-2 text-sm text-muted-foreground">
        Estoque total: <span className="font-semibold">{estoqueTotal}</span>
      </p>

      <div className="flex gap-2 mt-4">
        <Button onClick={handleCreateCamisa}>Criar</Button>
        <Button
          variant="outline"
          onClick={() => setOpenCreateCamisaModal(false)}
        >
          Cancelar
        </Button>
      </div>
    </Card>
  </div>
)}


{openManageCamisasModal && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    onClick={() => setOpenManageCamisasModal(false)}
  >
    <Card
      className="w-full max-w-3xl p-6"
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="text-lg font-bold mb-4">Gerenciar Camisas</h3>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Imagem</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Estoque</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {camisas.length > 0 ? (
              camisas.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.id}</TableCell>
                  <TableCell>
                    {c.image && (
                      <img
                        src={c.image}
                        alt={c.nome}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                  </TableCell>
                  <TableCell>{c.nome}</TableCell>
                  <TableCell>R${c.price.toFixed(2)}</TableCell>
                  <TableCell>{c.estoque}</TableCell>
                  <TableCell className="flex gap-2 justify-center">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedCamisa(c);
                        setOpenManageCamisasModal(false);
                      }}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={async () => {
                        if (!confirm("Tem certeza que deseja excluir esta camisa?")) return;

                        const { error } = await supabase
                          .from("camisas")
                          .delete()
                          .eq("id", c.id);

                        if (error) {
                          console.error(error);
                          alert("Erro ao excluir a camisa");
                        } else {
                          setCamisas((prev) =>
                            prev.filter((cam) => cam.id !== c.id)
                          );
                        }
                      }}
                    >
                      Excluir
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                  Nenhuma camisa encontrada
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end mt-4">
        <Button
          variant="outline"
          onClick={() => setOpenManageCamisasModal(false)}
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
