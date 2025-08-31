document.addEventListener('DOMContentLoaded', () => {
    // Seletores do DOM
    const modal = document.getElementById('transaction-modal');
    const addTransactionBtn = document.getElementById('add-transaction-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const transactionForm = document.getElementById('transaction-form');
    const transactionList = document.getElementById('transaction-list');
    const categoryWrapper = document.getElementById('category-wrapper');
    const typeToggles = document.querySelectorAll('input[name="type"]');
    const categoryChartCanvas = document.getElementById('category-chart');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');

    // --- Estado da Aplicação ---
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    let categoryChart = null;

    // --- Funções ---

    function saveTransactions() {
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }

    function renderTransactions() {
        transactionList.innerHTML = '';
        if (transactions.length === 0) {
            transactionList.innerHTML = '<li>Nenhuma transação registrada.</li>';
            return;
        }
        transactions.forEach(transaction => {
            const li = document.createElement('li');
            li.className = transaction.type;
            const amount = parseFloat(transaction.amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            const sign = transaction.type === 'income' ? '+' : '-';
            let categoryHTML = transaction.type === 'expense' && transaction.category ? `<small>${transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)}</small>` : '';
            li.innerHTML = `<div class="transaction-details"><span>${transaction.description}</span>${categoryHTML}</div><span class="amount">${sign} ${amount}</span>`;
            transactionList.appendChild(li);
        });
    }

    function renderChart() {
        const expenseData = transactions.filter(t => t.type === 'expense').reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + parseFloat(t.amount);
            return acc;
        }, {});
        const labels = Object.keys(expenseData).map(k => k.charAt(0).toUpperCase() + k.slice(1));
        const data = Object.values(expenseData);

        if (categoryChart) categoryChart.destroy();
        if (data.length === 0) return;

        categoryChart = new Chart(categoryChartCanvas, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Gastos por Categoria',
                    data: data,
                    backgroundColor: ['#e74c3c', '#3498db', '#9b59b6', '#f1c40f', '#2ecc71', '#e67e22'],
                    borderColor: getComputedStyle(document.documentElement).getPropertyValue('--bg-color').trim(),
                    borderWidth: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim()
                        }
                    }
                }
            }
        });
    }

    function addTransaction(e) {
        e.preventDefault();
        const description = document.getElementById('description').value;
        const amount = document.getElementById('amount').value;
        const date = document.getElementById('date').value;
        const type = document.querySelector('input[name="type"]:checked').value;
        const category = document.getElementById('category').value;

        if (description.trim() === '' || amount.trim() === '') {
            alert('Por favor, preencha a descrição e o valor.');
            return;
        }

        const newTransaction = {
            id: Date.now(), description, amount, date, type,
            ...(type === 'expense' && { category })
        };

        transactions.push(newTransaction);
        saveTransactions();
        renderTransactions();
        renderChart();
        transactionForm.reset();
        toggleCategoryVisibility();
        closeModal();
    }

    function toggleCategoryVisibility() {
        const selectedType = document.querySelector('input[name="type"]:checked').value;
        categoryWrapper.style.display = selectedType === 'expense' ? 'block' : 'none';
    }

    function showModal() {
        toggleCategoryVisibility();
        modal.style.display = 'block';
    }

    function closeModal() {
        modal.style.display = 'none';
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        themeToggleBtn.textContent = theme === 'dark' ? '☀️' : '☾';
        // Re-renderiza o gráfico para atualizar as cores da legenda, etc.
        if (categoryChart) {
            renderChart();
        }
    }

    function toggleTheme() {
        const currentTheme = localStorage.getItem('theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(newTheme);
    }

    // --- Event Listeners ---
    addTransactionBtn.addEventListener('click', showModal);
    closeModalBtn.addEventListener('click', closeModal);
    transactionForm.addEventListener('submit', addTransaction);
    typeToggles.forEach(toggle => toggle.addEventListener('change', toggleCategoryVisibility));
    themeToggleBtn.addEventListener('click', toggleTheme);
    window.addEventListener('click', (e) => {
        if (e.target == modal) closeModal();
    });

    // --- Inicialização ---
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
    renderTransactions();
    renderChart();
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => console.log('Service Worker registrado com sucesso:', registration))
                .catch(error => console.log('Falha ao registrar Service Worker:', error));
        });
    }
});
