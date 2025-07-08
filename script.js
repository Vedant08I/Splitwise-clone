let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

function saveExpenses() {
  localStorage.setItem('expenses', JSON.stringify(expenses));
}

function renderExpenses() {
  const container = document.getElementById('expenses');
  container.innerHTML = '';

  expenses.forEach((exp, index) => {
    const div = document.createElement('div');
    div.className = 'expense';
    div.innerHTML = `
      <strong>${exp.description} - ₹${exp.amount}</strong><br>
      Paid by <em>${exp.paidBy}</em>, split with ${exp.splitWith.join(', ')}<br>
      <button onclick="deleteExpense(${index})">Delete</button>
    `;
    container.appendChild(div);
  });
}

function deleteExpense(index) {
  expenses.splice(index, 1);
  saveExpenses();
  renderExpenses();
  renderBalances();
}

function renderBalances() {
  const balances = {};
  expenses.forEach(exp => {
    const perPerson = exp.amount / exp.splitWith.length;

    exp.splitWith.forEach(person => {
      if (person === exp.paidBy) return;
      
      balances[person] = (balances[person] || 0) - perPerson;
      balances[exp.paidBy] = (balances[exp.paidBy] || 0) + perPerson;
    });
  });

  const balanceContainer = document.getElementById('balances');
  balanceContainer.innerHTML = '';

  for (let person in balances) {
    const p = document.createElement('p');
    const amount = balances[person].toFixed(2);
    if (amount > 0) {
      p.textContent = `${person} gets ₹${amount}`;
    } else if (amount < 0) {
      p.textContent = `${person} owes ₹${Math.abs(amount)}`;
    }
    balanceContainer.appendChild(p);
  }
}

document.getElementById('expense-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const desc = document.getElementById('desc').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const paidBy = document.getElementById('paidBy').value.trim();
  const splitWith = document.getElementById('splitWith').value
    .split(',')
    .map(name => name.trim())
    .filter(name => name.length > 0);

  if (!desc || !amount || !paidBy || splitWith.length === 0) {
    alert("Please fill all fields correctly");
    return;
  }

  expenses.push({ description: desc, amount, paidBy, splitWith });
  saveExpenses();
  renderExpenses();
  renderBalances();
  this.reset();
});

// Initial render
renderExpenses();
renderBalances();
