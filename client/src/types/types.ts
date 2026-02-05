import { StatusPedido } from "@/pages/Home"

export interface User {
    id: number
    nome: string
    telefone: string
  }
  
  export interface PedidoItem {
    tamanho: string
    quantidade: string
  }
  export interface Pedido {
    id: number // bigint no Postgres vira number no TS
    created_at: string // timestamp com timezone, pode ser string ISO
    instagram_user?: string | null
    status?: StatusPedido;
    payment_method?: string | null
    tamanho?: string | null
    Qtd?: string | null
    price?: string | null
    comprovante?: string | null
    name?: string | null
    total_price?: string | null
    address?: string | null
    telefone?: string | null
    tipo_entrega?: string | null
    follow_up?: string | null
    // itens?: Record<string, any>[] | null // jsonb[]
    itens?: PedidoItem[] | null
  }
  
  export type CamisaTamanho = {
    tamanho: string;
    estoque: number;
  };
  export interface Camisa {
    id: number;
    nome: string;
    tamanhos: CamisaTamanho[]; 
    price: number;
    estoque: number;
    image: string;
    account: string;
    frete: number;
    ponto_entrega: string;
  }
  