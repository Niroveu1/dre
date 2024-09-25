const razonetes = {};
const historicoLancamentos = [];

document.getElementById('razoneteForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const tipo = document.getElementById('tipo').value;
    const lancamento = document.getElementById('lancamento').value;
    const valor = parseFloat(document.getElementById('valor').value);

    // Inicializa o razonete se não existir
    if (!razonetes[tipo]) {
        razonetes[tipo] = { lancamentos: [], credito: 0, debito: 0 };
    }

    // Adiciona o valor ao array de lançamentos e ao crédito ou débito
    razonetes[tipo].lancamentos.push({ tipo: lancamento, valor: valor });
    historicoLancamentos.push({ tipo, lancamento, valor }); // Armazena no histórico

    if (lancamento === 'credito') {
        razonetes[tipo].credito += valor;
    } else {
        razonetes[tipo].debito += valor;
    }

    // Atualiza a interface
    atualizarRazonetes();
    atualizarBalancetes();
    
    // Limpa o campo valor
    document.getElementById('valor').value = '';

    // Mostra o botão de voltar
    document.getElementById('voltarBtn').style.display = 'block';
});

document.getElementById('voltarBtn').addEventListener('click', function() {
    if (historicoLancamentos.length > 0) {
        const { tipo, lancamento, valor } = historicoLancamentos.pop(); // Remove o último lançamento

        // Atualiza o razonete com a reversão
        if (razonetes[tipo]) {
            if (lancamento === 'credito') {
                razonetes[tipo].credito -= valor;
            } else {
                razonetes[tipo].debito -= valor;
            }

            // Remove o último lançamento do array
            razonetes[tipo].lancamentos.pop();
        }

        // Atualiza a interface
        atualizarRazonetes();
        atualizarBalancetes();
    }

    // Esconde o botão de voltar se não houver mais lançamentos
    if (historicoLancamentos.length === 0) {
        this.style.display = 'none';
    }
});

function atualizarRazonetes() {
    const container = document.getElementById('razonetesContainer');
    container.innerHTML = ''; // Limpa o container

    for (const tipo in razonetes) {
        const credito = razonetes[tipo].credito;
        const debito = razonetes[tipo].debito;
        const saldo = Math.abs(credito - debito);
        const tipoSaldo = credito >= debito ? `C ${saldo}` : `D ${saldo}`;

        const razoneteCard = document.createElement('div');
        razoneteCard.className = 'razoneteCard';
        razoneteCard.innerHTML = `
            <h3>${tipo}</h3>
            <p>Créditos:</p>
            <ul>${razonetes[tipo].lancamentos.filter(l => l.tipo === 'credito').map(l => `<li>${l.valor.toFixed(2)}</li>`).join('')}</ul>
            <p>Débitos:</p>
            <ul>${razonetes[tipo].lancamentos.filter(l => l.tipo === 'debito').map(l => `<li>${l.valor.toFixed(2)}</li>`).join('')}</ul>
            <p>Saldo: ${tipoSaldo}</p>
        `;

        container.appendChild(razoneteCard);
    }
}

function atualizarBalancetes() {
    const balancetesBody = document.getElementById('balancetesBody');
    balancetesBody.innerHTML = ''; // Limpa o corpo da tabela

    for (const tipo in razonetes) {
        const credito = razonetes[tipo].credito;
        const debito = razonetes[tipo].debito;
        const saldo = credito >= debito ? credito - debito : debito - credito;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${tipo}</td>
            <td>${saldo.toFixed(2)}</td>
            <td>${credito >= debito ? saldo.toFixed(2) : '0.00'}</td> <!-- Saldo de Crédito -->
            <td>${debito > credito ? saldo.toFixed(2) : '0.00'}</td> <!-- Saldo de Débito -->
        `;
        balancetesBody.appendChild(row);
    }
}
