import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Inicialização do Supabase
const supabaseUrl = 'https://bikfafcfvfavjtizaavl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpa2ZhZmNmdmZhdmp0aXphYXZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY4Njk4NzEsImV4cCI6MjA0MjQ0NTg3MX0.KTruo6Sot6ma-I2RwG_5eg-076yzw7J75QZeEfSwESI';
const supabase = createClient(supabaseUrl, supabaseKey);

// Definição da classe Informacoes
class Informacoes {

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
    }

    // Função para cadastrar cliente, endereço e pedido
    async cadastrarCliente() {
        // Coletando as informações do formulário
        const nomeCliente = document.getElementById('nome').value;
        const telefoneCliente = document.getElementById('telefone').value;
        const enderecoCliente = document.getElementById('endereco').value;

        // Coletando dados do pedido
        const tipoPedidoCliente = document.getElementById('pedido').value;
        const quantidadePedido = document.getElementById('quantidade').value;
        const precoPedido = document.getElementById('preco').value;
        const detalhesPedido = document.getElementById('detalhes').value;

        try {
            // Inserir o cliente e obter cliente_id
            const { data: clienteData, error: clienteError, status: clienteStatus } = await supabase
                .from('cliente')
                .insert([{ nome: nomeCliente, telefone: telefoneCliente }])
                .select();

            if (clienteError) {
                console.error('Erro ao cadastrar cliente:', clienteError);
                console.log('Status da requisição de cliente:', clienteStatus);
                return;
            }

            // Verificar se clienteData contém dados
            if (clienteData && clienteData.length > 0) {
                const clienteId = clienteData[0].cliente_id; // Obtém o cliente_id
                console.log('Cliente cadastrado com sucesso. Cliente ID:', clienteId);

                // Inserir o endereço e obter endereco_id
                const { data: enderecoData, error: enderecoError, status: enderecoStatus } = await supabase
                    .from('endereco')
                    .insert([{ cliente_id: clienteId, endereco: enderecoCliente }])
                    .select();

                if (enderecoError) {
                    console.error('Erro ao cadastrar endereço:', enderecoError);
                    console.log('Status da requisição de endereço:', enderecoStatus);
                    return;
                }

                if (enderecoData && enderecoData.length > 0) {
                    const enderecoId = enderecoData[0].endereco_id; // Obtém o endereco_id
                    console.log('Endereço cadastrado com sucesso. Endereço ID:', enderecoId);

                    // Inserir o pedido com cliente_id e endereco_id
                    const { error: pedidoError } = await supabase
                        .from('pedido')
                        .insert([
                            {
                                cliente_id: clienteId,
                                endereco_id: enderecoId,
                                tipoPedido: tipoPedidoCliente,
                                preco: precoPedido,
                                quantidade: quantidadePedido,
                                detalhes: detalhesPedido
                            }
                        ]);

                    if (pedidoError) {
                        console.error('Erro ao cadastrar pedido:', pedidoError);
                        return;
                    }

                    console.log('Pedido cadastrado com sucesso!');

                    // Chamar a função limpar após o pedido ser cadastrado com sucesso
                    this.limpar();
                } else {
                    console.error('Erro: Nenhum dado de endereço foi retornado.');
                }
            } else {
                console.error('Erro: Nenhum dado de cliente foi retornado.');
            }
        } catch (error) {
            console.error('Erro inesperado:', error);
        }
    }
}

// Tornar a instância de Informacoes acessível globalmente
window.informacoes = new Informacoes();

// Evento de envio do formulário
document.addEventListener("DOMContentLoaded", function() {
    document.querySelector('form').addEventListener('submit', function (e) {
        e.preventDefault();  // Prevenir o comportamento padrão do envio
        window.informacoes.cadastrarCliente();  // Chamar a função para cadastrar o cliente e limpar
    });
});