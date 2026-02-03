import React, { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import { Pedido, User } from './types'

const App: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    fetchPedidos()
  }, [])

  const fetchPedidos = async () => {
    setLoading(true)

  
    const { data, error } = await supabase
      .from('pedidos')
      .select('*') as { data: Pedido[] | null, error: any } 

    if (error) {
      console.error('Erro ao buscar usuários:', error)
    } else if (data) {
      setPedidos(data)
    }

    setLoading(false)
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard de Pedidos</h1>

      {loading ? (
        <p>Carregando pedidos...</p>
      ) : (
        <table border={1} cellPadding={10} style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>telefone</th>
              <th>Instagram</th>
              <th>Endereço</th>
              <th>Preço Unitário</th>
              <th>Quantidade</th>
              <th>Preço Total</th>
              <th>Forma de Pagamento</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.id}>
                <td>{pedido.id}</td>
                <td>{pedido.name}</td>
                <td>{pedido.telefone}</td>
                <td>{pedido.instagram_user}</td>
                <td>{pedido.address}</td>
                <td>{pedido.price}</td>
                <td>{pedido.Qtd}</td>
                <td>{pedido.total_price}</td>
                <td>{pedido.payment_method}</td>
                <td>{pedido.status}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default App
