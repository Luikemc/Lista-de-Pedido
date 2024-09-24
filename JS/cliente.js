import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Inicialização do Supabase
const supabaseUrl = 'https://bikfafcfvfavjtizaavl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpa2ZhZmNmdmZhdmp0aXphYXZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY4Njk4NzEsImV4cCI6MjA0MjQ0NTg3MX0.KTruo6Sot6ma-I2RwG_5eg-076yzw7J75QZeEfSwESI';
const supabase = createClient(supabaseUrl, supabaseKey);

class Cliente {

    // Função para carregar clientes, endereços e pedidos do banco de dados
    async carregarClientes() {
        try {
            const { data: clientes, error } = await supabase
                .from('cliente')
                .select(`
                    cliente_id, nome, telefone, 
                    endereco:endereco (endereco_id, endereco),
                    pedidos:pedido (tipoPedido, quantidade, preco, detalhes)
                `);

            if (error) {
                console.error('Erro ao carregar clientes:', error);
                return;
            }
            
            const tabelaClientes = document.getElementById('tabela-clientes');
            tabelaClientes.innerHTML = '';  // Limpa a tabela

            // Itera sobre os clientes e adiciona as linhas à tabela
            clientes.forEach(cliente => {
                const endereco = cliente.endereco ? cliente.endereco[0].endereco : 'Endereço não encontrado';
                
                cliente.pedidos.forEach(pedido => {
                    const linha = `
                        <tr>
                            <td>${cliente.nome}</td>
                            <td>${endereco}</td>
                            <td>${cliente.telefone}</td>
                            <td>${pedido.tipoPedido}</td>
                            <td>${pedido.quantidade}</td>
                            <td>R$ ${pedido.preco}</td>
                            <td>${pedido.detalhes}</td>
                            <td>
                                <button type="button" class="btn btn-warning btn-sm" onclick="cliente.editarCliente(${cliente.cliente_id})">Editar</button>
                                <button type="button" class="btn btn-danger btn-sm" onclick="cliente.excluirCliente(${cliente.cliente_id})">Excluir</button>
                            </td>
                        </tr>
                    `;
                    tabelaClientes.insertAdjacentHTML('beforeend', linha);
                });
            });
        } catch (error) {
            console.error('Erro ao carregar clientes:', error);
        }
    }

    // Função para redirecionar para a página de edição (index.html)
    async editarCliente(clienteId) {
        // Redirecionar para o index.html passando o clienteId na URL
        window.location.href = `index.html?clienteId=${clienteId}`;
    }


    async atualizarCliente(clienteId) {
        const nomeCliente = document.getElementById('nome').value;
        const telefoneCliente = document.getElementById('telefone').value;
        const enderecoCliente = document.getElementById('endereco').value;
        const tipoPedidoCliente = document.getElementById('pedido').value;
        const quantidadePedido = document.getElementById('quantidade').value;
        const precoPedido = document.getElementById('preco').value;
        const detalhesPedido = document.getElementById('detalhes').value;

        try {
            const { error: clienteError } = await supabase
                .from('cliente')
                .update({ nome: nomeCliente, telefone: telefoneCliente })
                .eq('cliente_id', clienteId);

            if (clienteError) {
                console.error('Erro ao atualizar cliente:', clienteError);
                return;
            }

            const { error: enderecoError } = await supabase
                .from('endereco')
                .update({ endereco: enderecoCliente })
                .eq('cliente_id', clienteId);

            if (enderecoError) {
                console.error('Erro ao atualizar endereço:', enderecoError);
                return;
            }

            const { error: pedidoError } = await supabase
                .from('pedido')
                .update({
                    tipoPedido: tipoPedidoCliente,
                    quantidade: quantidadePedido,
                    preco: precoPedido,
                    detalhes: detalhesPedido
                })
                .eq('cliente_id', clienteId);

            if (pedidoError) {
                console.error('Erro ao atualizar pedido:', pedidoError);
                return;
            }

            console.log('Cliente, endereço e pedido atualizados com sucesso!');
            this.carregarClientes();
        } catch (error) {
            console.error('Erro ao atualizar cliente, endereço e pedido:', error);
        }
    }

    async excluirCliente(clienteId) {
        try {
            if (confirm('Tem certeza que deseja excluir o cliente?')) {
                const { error } = await supabase
                    .from('cliente')
                    .delete()
                    .eq('cliente_id', clienteId);

                if (error) {
                    console.error('Erro ao excluir cliente:', error);
                } else {
                    alert('Cliente excluído com sucesso!');
                    this.carregarClientes();
                }
            }
        } catch (error) {
            console.error('Erro ao excluir cliente:', error);
        }
    }
}

// Tornar a instância de `cliente` acessível globalmente
window.cliente = new Cliente();

document.addEventListener('DOMContentLoaded', function() {
    window.cliente.carregarClientes();
});

