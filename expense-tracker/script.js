const balance = document.getElementById('balance');
const moneyPlus = document.getElementById('money-plus');
const moneyMinus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

// const dummyTransactions = [
//     { id: 1, text: 'Flower', amount: -20 },
//     { id: 2, text: 'Salary', amount: 3000 },
//     { id: 3, text: 'Book', amount: -10 },
//     { id: 4, text: 'Camera', amount: 150 }
// ];

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));

let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [] ;

let tID = 0;

function addTransaction(e) {
    e.preventDefault();
    if (text.value.trim() === '' || amount.value.trim() === '') {
        form.classList.add('error');
    } else {
        form.classList.remove('error');
        const t = { id: generateID(), text: text.value.trim(), amount: +amount.value.trim() };
        transactions.push(t);
        addTransactionDOM(t);
        updateValues();
        updateLocalStorage();
        text.value = '';
        amount.value = '';
    }
}

// Generate random id for transactions
function generateID() {
    return Math.floor(Math.random() * 100000000);
}

// Add transactions to DOM list
function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? '-' : '+';
    const item = document.createElement('li');
    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
    item.innerHTML = `
        ${transaction.text}<span>${sign}${Math.abs(transaction.amount)}</span><button onclick="removeTransactionById(${transaction.id})" class="delete-btn">x</button>
    `;

    list.appendChild(item);
}

// Update balance, income and expense
function updateValues() {
    const amounts = transactions.map(t => t.amount);
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

    const income = amounts
                    .filter(item => item > 0)
                    .reduce((acc, item) => (acc += item), 0)
                    .toFixed(2);

    const expense = amounts
                    .filter(item => item < 0)
                    .reduce((acc, item) => (acc += item), 0)
                    .toFixed(2);
    moneyPlus.innerText = `€${income}`;
    moneyMinus.innerText = `€${expense}`;
    balance.innerText = `€${total}`;
}

function removeTransactionById(id) {
    transactions = transactions.filter(t => t.id !== id);
    init();
}

function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function init() {
    list.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateValues();
}

init();

// Event Listeners
form.addEventListener('submit', addTransaction);




