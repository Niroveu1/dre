const razonetes = {};
let lastEntry = null;

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

    if (lancamento === 'credito') {
        razonetes[tipo].credito += valor;
    } else {
        razonetes[tipo].debito += valor;
    }

    // Armazena o último lançamento para desfazer
    lastEntry = { tipo, lancamento, valor };

    // Atualiza a interface
    atualizarRazonetes();
    atualizarBalancetes();
    
    // Limpa o campo valor
    document.getElementById('valor').value = '';
});

// Função para desfazer o último lançamento
document.getElementById('undoButton').addEventListener('click', function() {
    if (lastEntry) {
        const { tipo, lancamento, valor } = lastEntry;

        // Remove o último lançamento
        const index = razonetes[tipo].lancamentos.findIndex(l => l.tipo === lancamento && l.valor === valor);
        if (index !== -1) {
            razonetes[tipo].lancamentos.splice(index, 1);
            if (lancamento === 'credito') {
                razonetes[tipo].credito -= valor;
            } else {
                razonetes[tipo].debito -= valor;
            }
        }
        lastEntry = null; // Limpa o último lançamento

        // Atualiza a interface
        atualizarRazonetes();
        atualizarBalancetes();
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

    let totalSaldo = 0;
    let totalCredito = 0;
    let totalDebito = 0;

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

        // Acumula os totais somente para valores visíveis na tabela
        if (saldo > 0) {
            totalSaldo += saldo;
            totalCredito += credito >= debito ? saldo : 0;
            totalDebito += debito > credito ? saldo : 0;
        }
    }

    // Atualiza os totais na tabela
    document.getElementById('totalSaldo').textContent = totalSaldo.toFixed(2);
    document.getElementById('totalCredito').textContent = totalCredito.toFixed(2);
    document.getElementById('totalDebito').textContent = totalDebito.toFixed(2);
}
