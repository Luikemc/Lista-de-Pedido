import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Inicialização do Supabase
const supabaseUrl = 'https://bikfafcfvfavjtizaavl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpa2ZhZmNmdmZhdmp0aXphYXZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY4Njk4NzEsImV4cCI6MjA0MjQ0NTg3MX0.KTruo6Sot6ma-I2RwG_5eg-076yzw7J75QZeEfSwESI';
const supabase = createClient(supabaseUrl, supabaseKey);

class Login {
    async autenticar(username, password) {
        const { data, error } = await supabase
            .from('login')
            .select('id, username, password')
            .eq('username', username)
            .single();

        if (error || !data) {
            console.error('Erro ao buscar usuário:', error);
            alert('Usuário não encontrado');
            return;
        }

        // Comparar a senha diretamente (não seguro)
        if (password === data.password) {
            // Redirecionar para index.html
            window.location.href = 'index.html';
        } else {
            alert('Senha incorreta');
        }
    }
}

const login = new Login();

document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('lg_username').value;
    const password = document.getElementById('lg_password').value;
    login.autenticar(username, password);
});
