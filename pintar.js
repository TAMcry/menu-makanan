// Ambil pesanan & data pendaftar dari localStorage
const cart = JSON.parse(localStorage.getItem("cart")) || [];
const user = JSON.parse(localStorage.getItem("user") || "null");

const rupiah = (n) => "Rp" + n.toLocaleString("id-ID");
const totalHarga = () => cart.reduce((s, i) => s + i.price * i.qty, 0);

function renderCart() {
  const table = document.getElementById("cartTable");
  table.innerHTML = "<tr><th>Menu</th><th>Jumlah</th><th>Harga</th></tr>";
  cart.forEach((item) => {
    const tr = document.createElement("tr");
    [item.name, item.qty, rupiah(item.price * item.qty)].forEach((val) => {
      const td = document.createElement("td");
      td.textContent = val; 
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });
  document.getElementById("total").innerText = "Total: " + rupiah(totalHarga());
}


function buatKode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const arr = new Uint32Array(6);
  crypto.getRandomValues(arr);
  return "PAY-" + Array.from(arr, (n) => chars[n % chars.length]).join("");
}

function emailValid(v) {
  return /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(v) && !/\.\./.test(v);
}


function checkout() {
  if (cart.length === 0) {
    alert("Belum ada pesanan!");
    return;
  }

  const emailInput = document.getElementById("payEmail");
  const errEl = document.getElementById("err-payEmail");
  const email = emailInput.value.trim().toLowerCase();

  if (!emailValid(email)) {
    errEl.textContent = "Masukkan email yang valid (contoh: nama@gmail.com).";
    emailInput.classList.add("invalid");
    emailInput.focus();
    return;
  }
  errEl.textContent = "";
  emailInput.classList.remove("invalid");

  document.getElementById("kodeText").textContent = buatKode();
  document.getElementById("hasil").classList.remove("hidden");

  const notice = document.getElementById("emailNotice");
  if (notice) {
    notice.className = "notice ok";
    notice.textContent = "Tunjukkan kode ini ke kasir untuk pembayaran.";
  }
  const btnMailto = document.getElementById("btnMailto");
  if (btnMailto) btnMailto.style.display = "none";

  document.getElementById("btnKode").textContent = "Buat Ulang Kode Bayar";
}


const payEmail = document.getElementById("payEmail");
if (payEmail && user && user.email) payEmail.value = user.email;
renderCart();
