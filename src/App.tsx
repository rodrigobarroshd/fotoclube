import React, { useEffect, useMemo, useState } from 'react'
import { supabase } from './supabaseClient'
import { Pedido, User } from './types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/table/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/table/avatar";
import { Badge } from "./ui/table/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/table/dropdown-menu";
import { Button } from "./ui/table/button";
import { cn } from './lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { Input } from './ui/table/input';
import { Checkbox } from './ui/table/checkbox';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';

type ColumnDef = {
  key: keyof Pedido;
  label: string;
  width?: string;
  sticky?: boolean;
};
/** --- Colunas --- */
const defaultColumns: ColumnDef[] = [
  { key: "id", label: "ID", width: "60px", sticky: true },
  { key: "name", label: "Nome", width: "160px" },
  { key: "telefone", label: "Telefone", width: "120px" },
  { key: "instagram_user", label: "Instagram", width: "140px" },
  { key: "address", label: "Endereço", width: "200px" },
  { key: "price", label: "Preço Unitário", width: "120px" },
  { key: "Qtd", label: "Quantidade", width: "100px" },
  { key: "total_price", label: "Preço Total", width: "140px" },
  { key: "payment_method", label: "Forma de Pagamento", width: "160px" },
  { key: "status", label: "Status", width: "120px" },
];


const App: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  // Column visibility & order 
  const columnKeys = defaultColumns.map((c) => c.key as string);
  const [columnOrder, setColumnOrder] = useState<string[]>(columnKeys);
  const [visible, setVisible] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    columnKeys.forEach((k) => (initial[k] = true));
    return initial;
  });

  const [query, setQuery] = useState("");

    useEffect(() => {
    fetchPedidos()
  }, [])

  const fetchPedidos = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("pedidos").select("*") as { data: Pedido[] | null; error: any };
    if (error) console.error(error);
    else if (data) setPedidos(data);
    setLoading(false);
  };

  
    // const { data, error } = await supabase
    //   .from('pedidos')
    //   .select('*') as { data: Pedido[] | null, error: any } 

    // if (error) {
    //   console.error('Erro ao buscar usuários:', error)
    // } else if (data) {
    //   setPedidos(data)
    // }

  //   setLoading(false)
  // }
  const orderedColumns = useMemo(() => {
    return columnOrder
      .map((key) => defaultColumns.find((c) => c.key === key))
      .filter(Boolean) as ColumnDef[];
  }, [columnOrder]);

  const filtered = useMemo(() => {
    if (!query) return pedidos;
    const q = query.toLowerCase();
    return pedidos.filter((r) =>
      [r.name, r.telefone, r.instagram_user, r.address, r.status, r.payment_method]
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [pedidos, query]);

/** --- Drag & Drop --- */
// const dragSrcRef = React.useRef<number | null>(null);
// const onDragStart = (e: React.DragEvent, index: number) => { dragSrcRef.current = index; e.dataTransfer.effectAllowed = "move"; };
// const onDragOver = (e: React.DragEvent) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; };
// const onDrop = (e: React.DragEvent, targetIndex: number) => {
//   e.preventDefault();
//   const srcIndex = dragSrcRef.current ?? parseInt(e.dataTransfer.getData("text/plain"), 10);
//   if (isNaN(srcIndex) || srcIndex === targetIndex) return;
//   setColumnOrder((prev) => { const next = [...prev]; const [moved] = next.splice(srcIndex, 1); next.splice(targetIndex, 0, moved); return next; });
//   dragSrcRef.current = null;
// };

const moveColumn = (key: string, dir: -1 | 1) => {
  setColumnOrder((prev) => {
    const idx = prev.indexOf(key); if (idx === -1) return prev;
    const newIndex = idx + dir; if (newIndex < 0 || newIndex >= prev.length) return prev;
    const next = [...prev]; const [moved] = next.splice(idx, 1); next.splice(newIndex, 0, moved); return next;
  });
};

const toggleVisible = (key: string) => setVisible((prev) => ({ ...prev, [key]: !prev[key] }));

const resetLayout = () => { setColumnOrder(columnKeys); const def: Record<string, boolean> = {}; columnKeys.forEach(k => def[k] = true); setVisible(def); };
return (
  <div className="w-full max-w-7xl mx-auto p-4">
    <h1 className="text-2xl mb-4">Dashboard de Pedidos</h1>

    <div className="flex items-center justify-between mb-3 gap-3">
      <div className="flex gap-2 items-center">
        <Input placeholder="Buscar..." value={query} onChange={(e) => setQuery(e.target.value)} className="w-80" />
        <Button variant="outline" onClick={() => setQuery("")}>Limpar</Button>
      </div>
      <Popover>
        <PopoverTrigger asChild><Button variant="outline">Colunas</Button></PopoverTrigger>
        <PopoverContent className="w-48">
          <div className="flex flex-col gap-2">
            {defaultColumns.map((col) => (
              <label key={String(col.key)} className="flex items-center gap-2">
                <Checkbox checked={!!visible[String(col.key)]} onCheckedChange={() => toggleVisible(String(col.key))} />
                <span>{col.label}</span>
              </label>
            ))}
            <div className="flex justify-between pt-2">
              <Button variant="ghost" size="sm" onClick={resetLayout}>Reset</Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>

    {loading ? <p>Carregando pedidos...</p> : (
      <div className="border rounded-md overflow-auto ">
        <Table className="min-w-full border-separate border-spacing-0">
          <TableHeader className="sticky top-0 z-20 bg-background/90 backdrop-blur-sm ">
            <TableRow>
              {orderedColumns.map((colDef, idx) => {
                const key = String(colDef.key);
                if (!visible[key]) return null;
                return (
                  // <TableHead key={key} style={{ width: colDef.width }}>
                  //   <div draggable onDragStart={(e) => onDragStart(e, idx)} onDragOver={onDragOver} onDrop={(e) => onDrop(e, idx)} className="flex justify-between items-center">
                  //     <span>{colDef.label}</span>
                  //     <div className="flex gap-1">
                  //       <Button size="icon" variant="ghost" onClick={() => moveColumn(key, -1)}><ChevronsLeft className="h-4 w-4"/></Button>
                  //       <Button size="icon" variant="ghost" onClick={() => moveColumn(key, 1)}><ChevronsRight className="h-4 w-4"/></Button>
                  //     </div>
                  //   </div>
                  // </TableHead>
                  <TableHead key={key} style={{ width: colDef.width }}>
                  <span className="font-medium">{colDef.label}</span>
                  </TableHead>

                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((pedido) => (
              <TableRow key={pedido.id} className="hover:bg-muted/10">
                {orderedColumns.map((colDef) => {
                  const key = String(colDef.key);
                  if (!visible[key]) return null;
                  let content: React.ReactNode = String(pedido[colDef.key]);
                  if (colDef.key === "price" || colDef.key === "total_price") {
                    content = `$${Number(pedido[colDef.key]).toLocaleString()}`;
                  }
                  return <TableCell key={key}>{content}</TableCell>;
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )}
  </div>
);
}
//   return (
//     <div style={{ padding: '20px' }}>
//       <h1>Dashboard de Pedidos</h1>

//       {loading ? (
//         <p>Carregando pedidos...</p>
//       ) : (
//         <table border={1} cellPadding={10} style={{ borderCollapse: 'collapse', width: '100%' }}>
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Nome</th>
//               <th>telefone</th>
//               <th>Instagram</th>
//               <th>Endereço</th>
//               <th>Preço Unitário</th>
//               <th>Quantidade</th>
//               <th>Preço Total</th>
//               <th>Forma de Pagamento</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {pedidos.map((pedido) => (
//               <tr key={pedido.id}>
//                 <td>{pedido.id}</td>
//                 <td>{pedido.name}</td>
//                 <td>{pedido.telefone}</td>
//                 <td>{pedido.instagram_user}</td>
//                 <td>{pedido.address}</td>
//                 <td>{pedido.price}</td>
//                 <td>{pedido.Qtd}</td>
//                 <td>{pedido.total_price}</td>
//                 <td>{pedido.payment_method}</td>
//                 <td>{pedido.status}</td>
                
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   )
// }


export default App
