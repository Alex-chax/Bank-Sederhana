
// Ambil data user dari localStorage
function getUsers() {
  return JSON.parse(localStorage.getItem('users')) || {};
}

function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

// Sign up
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const users = getUsers();

    if (users[username]) {
      alert('Username sudah terdaftar!');
    } else {
      users[username] = { password, saldo: 0, transaksi: [] };
      saveUsers(users);
      alert('Akun berhasil dibuat!');
      window.location.href = 'index.html';
    }
  });
}

// Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const users = getUsers();

    if (users[username] && users[username].password === password) {
      localStorage.setItem('currentUser', username);
      window.location.href = 'dashboard.html';
    } else {
      alert('Username atau password salah!');
    }
  });
}

// Dashboard
function loadDashboard() {
  const currentUser = localStorage.getItem('currentUser');
  const users = getUsers();

  if (!currentUser || !users[currentUser]) {
    window.location.href = 'index.html';
    return;
  }

  document.getElementById('userDisplay').textContent = currentUser;
  document.getElementById('saldoDisplay').textContent = users[currentUser].saldo;
}

function setorTunai() {
  const jumlah = parseInt(prompt('Masukkan jumlah setor tunai:'), 10);
  if (isNaN(jumlah) || jumlah <= 0) return alert('Jumlah tidak valid.');

  const users = getUsers();
  const currentUser = localStorage.getItem('currentUser');
  users[currentUser].saldo += jumlah;
  users[currentUser].transaksi.push(`Setor: +${jumlah}`);
  saveUsers(users);
  alert('Setor tunai berhasil.');
  location.reload();
}

function tarikTunai() {
  const jumlah = parseInt(prompt('Masukkan jumlah tarik tunai:'), 10);
  if (isNaN(jumlah) || jumlah <= 0) return alert('Jumlah tidak valid.');

  const users = getUsers();
  const currentUser = localStorage.getItem('currentUser');

  if (jumlah > users[currentUser].saldo) return alert('Saldo tidak mencukupi.');

  users[currentUser].saldo -= jumlah;
  users[currentUser].transaksi.push(`Tarik: -${jumlah}`);
  saveUsers(users);
  alert('Tarik tunai berhasil.');
  location.reload();
}

function transfer() {
  const tujuan = prompt('Masukkan username tujuan:');
  const jumlah = parseInt(prompt('Masukkan jumlah transfer:'), 10);

  const users = getUsers();
  const currentUser = localStorage.getItem('currentUser');

  if (!users[tujuan]) return alert('User tujuan tidak ditemukan.');
  if (tujuan === currentUser) return alert('Tidak bisa transfer ke diri sendiri.');
  if (isNaN(jumlah) || jumlah <= 0) return alert('Jumlah tidak valid.');
  if (jumlah > users[currentUser].saldo) return alert('Saldo tidak mencukupi.');

  users[currentUser].saldo -= jumlah;
  users[tujuan].saldo += jumlah;

  users[currentUser].transaksi.push(`Transfer ke ${tujuan}: -${jumlah}`);
  users[tujuan].transaksi.push(`Transfer dari ${currentUser}: +${jumlah}`);

  saveUsers(users);
  alert('Transfer berhasil.');
  location.reload();
}

function cekSaldo() {
  const currentUser = localStorage.getItem('currentUser');
  const users = getUsers();
  alert(`Saldo anda: ${users[currentUser].saldo}`);
}

// Rekening koran
function loadRekeningKoran() {
  const currentUser = localStorage.getItem('currentUser');
  const users = getUsers();
  const transaksi = users[currentUser]?.transaksi || [];
  const list = document.getElementById('transactionList');
  transaksi.forEach(trx => {
    const li = document.createElement('li');
    li.textContent = trx;
    list.appendChild(li);
  });
}

// Logout
function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = 'index.html';
}

// Load dashboard saat halaman dibuka
if (document.body.contains(document.getElementById('userDisplay'))) {
  loadDashboard();
}

// Load rekening koran saat halaman dibuka
if (document.body.contains(document.getElementById('transactionList'))) {
  loadRekeningKoran();
}
