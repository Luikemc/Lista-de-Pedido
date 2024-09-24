import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Inicialização do Supabase
const supabaseUrl = 'https://bikfafcfvfavjtizaavl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpa2ZhZmNmdmZhdmp0aXphYXZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY4Njk4NzEsImV4cCI6MjA0MjQ0NTg3MX0.KTruo6Sot6ma-I2RwG_5eg-076yzw7J75QZeEfSwESI';
const supabase = createClient(supabaseUrl, supabaseKey);

class Editar {
    // Função para buscar o cliente e preencher o formulário
    async carregarClienteParaEdicao(clienteId) {
        const { data: clienteData, error } = await supabase
            .from('cliente')
            .select('cliente_id, nome, telefone, endereco:endereco (endereco), pedidos:pedido (tipoPedido, quantidade, preco, detalhes)')
            .eq('cliente_id', clienteId)
            .single();

        if (error) {
            console.error('Erro ao carregar cliente para edição:', error);
            return;
        }

        // Preencher o formulário com os dados do cliente
        document.getElementById('nome').value = clienteData.nome;
        document.getElementById('telefone').value = clienteData.telefone;
        
        const enderecoData = clienteData.endereco; // isso deve ser um array ou objeto dependendo da estrutura
        if (enderecoData && enderecoData.length > 0) {
            document.getElementById('endereco').value = enderecoData[0].endereco; // ajuste se necessário
        } else {
            document.getElementById('endereco').value = ''; // caso não tenha endereço
        }

        const pedido = clienteData.pedidos[0];
        if (pedido) {
            document.getElementById('pedido').value = pedido.tipoPedido;
            document.getElementById('quantidade').value = pedido.quantidade;
            document.getElementById('preco').value = pedido.preco;
            document.getElementById('detalhes').value = pedido.detalhes;
        }

        console.log('Preparando edição');
        this.adicionarBotaoAtualizar(); // Adiciona o botão de atualização
    }

    // Função para atualizar os dados do cliente
    async atualizar(clienteId) {
        const cliente = {
            nome: document.getElementById('nome').value,
            telefone: document.getElementById('telefone').value,
            endereco: document.getElementById('endereco').value,
            pedidos: [
                {
                    tipoPedido: document.getElementById('pedido').value,
                    quantidade: document.getElementById('quantidade').value,
                    preco: document.getElementById('preco').value,
                    detalhes: document.getElementById('detalhes').value,
                }
            ],
        };

        // Atualiza as informações do cliente
        const { data: clienteData, error: clienteError } = await supabase
            .from('cliente')
            .update({
                nome: cliente.nome,
                telefone: cliente.telefone,
            })
            .eq('cliente_id', clienteId);

        // Verifica se ocorreu um erro na atualização do cliente
        if (clienteError) {
            console.error('Erro ao atualizar cliente:', clienteError.message);
            alert('Erro ao atualizar cliente');
            return;
        }

        const { data: enderecoData, error: enderecoError } = await supabase
        .from('endereco')
        .update({
            endereco: endereco.endereco,
        })
        .eq('cliente_id', clienteId);

    // Verifica se ocorreu um erro na atualização do cliente
    if (enderecoError) {
        console.error('Erro ao atualizar cliente:', enderecoError.message);
        alert('Erro ao atualizar cliente');
        return;
    }

        // Atualiza os pedidos, se necessário
        const { data: pedidoData, error: pedidoError } = await supabase
            .from('pedido')
            .update({
                tipoPedido: cliente.pedidos[0].tipoPedido,
                quantidade: cliente.pedidos[0].quantidade,
                preco: cliente.pedidos[0].preco,
                detalhes: cliente.pedidos[0].detalhes,
            })
            .eq('cliente_id', clienteId); // Ajuste a condição conforme necessário para identificar o pedido correto

        // Verifica se ocorreu um erro na atualização dos pedidos
        if (pedidoError) {
            console.error('Erro ao atualizar pedidos:', pedidoError.message);
            alert('Erro ao atualizar pedidos');
            return;
        }

        // Se a atualização foi bem-sucedida
        console.log('Cliente e pedidos atualizados com sucesso', clienteData, pedidoData, enderecoData);
        this.limpar();
    }

    // Função para adicionar um novo botão de atualização
    adicionarBotaoAtualizar() {
        const btnContainer = document.getElementById('btnNovo');
        // Limpa botões existentes antes de adicionar
        btnContainer.innerHTML = '';

        const btn = document.createElement('button');
        btn.innerText = 'Atualizar';
        btn.onclick = () => {
            const clienteId = this.getClienteIdFromURL();
            this.atualizar(clienteId);
        };
        btnContainer.appendChild(btn);
    }

    // Função para pegar o `clienteId` da URL
    getClienteIdFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get('clienteId');
    }

    // Função para limpar os campos do formulário
    limpar() {
        document.getElementById('nome').value = "";
        document.getElementById('telefone').value = "";
        document.getElementById('endereco').value = "";
        document.getElementById('pedido').value = "";
        document.getElementById('quantidade').value = "";
        document.getElementById('preco').value = "";
        document.getElementById('detalhes').value = "";
        console.log('Campos limpos!');

        window.location.href = `clientes.html`;
    }
}

// Tornar a instância de Editar acessível globalmente
window.editar = new Editar();

// Evento de envio do formulário
document.addEventListener("DOMContentLoaded", function() {
    const clienteId = window.editar.getClienteIdFromURL();

    // Se houver um clienteId, carregar os dados para edição
    if (clienteId) {
        window.editar.carregarClienteParaEdicao(clienteId);
    }
});
