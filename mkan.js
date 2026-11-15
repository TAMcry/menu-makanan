
const MENU = [
  { name: "Mie goreng sikit ae",       price: 100000000,  img: "mie.jpg" },
  { name: "Ayam tapi manggil sayang",  price: 1000000000, img: "Ayam rica rica.jpg" },
  { name: "Makroni iblis",             price: 399000000,  img: "Makroni Goreng Basah.jpg" },
  { name: "Sate gosong",               price: 10000000,   img: "Resep Sate Ayam Manis dari @debbie_ariesthea.jpg" },
  { name: "Makanan pembuka",           price: 199000000,  img: "ribet.jpg" },
  { name: "Best Matcha Bubble Tea",    price: 25000,      img: "Best Matcha Bubble Tea.jpg" },
  { name: "Classic Espresso Shot",     price: 20000,      img: "Classic Espresso Shot.jpg" },
  { name: "Lemon tea",                 price: 15000,      img: "Lemon tea.jpg" },
];

const rupiah = (n) => "Rp" + n.toLocaleString("id-ID");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(name, price) {
  const item = cart.find((i) => i.name === name);
  if (item) item.qty++;
  else cart.push({ name, price, qty: 1 });
  saveCart();
  updateTotal();
}

function removeFromCart(name) {
  const item = cart.find((i) => i.name === name);
  if (!item) return;
  item.qty--;
  if (item.qty <= 0) cart = cart.filter((i) => i.name !== name);
  saveCart();
  updateTotal();
}

function updateTotal() {
  let total = 0;
  cart.forEach((i) => (total += i.price * i.qty));
  document.getElementById("total").innerText = "Total: " + rupiah(total);


  document.querySelectorAll(".item").forEach((card) => {
    const name = card.dataset.name;
    const found = cart.find((i) => i.name === name);
    const qty = card.querySelector(".qty");
    qty.textContent = found ? found.qty : 0;
    qty.style.display = found ? "inline-block" : "none";
    card.querySelector(".kurang").disabled = !found;
  });
}

function goToPayment() {
  if (cart.length === 0) {
    alert("Pilih menu dulu sebelum membayar.");
    return;
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  window.location.href = "pancen.html";
}

function renderMenu() {
  const wrap = document.getElementById("items");
  MENU.forEach((m, idx) => {
    const card = document.createElement("div");
    card.className = "item";
    card.style.animationDelay = idx * 0.06 + "s";

    const img = document.createElement("img");
    img.src = "../assets/" + encodeURI(m.img);
    img.alt = m.name;
    img.loading = "lazy";

    const info = document.createElement("div");
    info.className = "info";
    const nama = document.createElement("p");
    nama.className = "nama";
    nama.textContent = m.name;
    const harga = document.createElement("p");
    harga.className = "harga";
    harga.textContent = rupiah(m.price);
    info.append(nama, harga);

    card.dataset.name = m.name;

    const aksi = document.createElement("div");
    aksi.className = "aksi";

    const btnKurang = document.createElement("button");
    btnKurang.className = "kurang";
    btnKurang.type = "button";
    btnKurang.textContent = "－";
    btnKurang.setAttribute("aria-label", "Kurangi " + m.name);
    btnKurang.addEventListener("click", () => removeFromCart(m.name));

    const btnTambah = document.createElement("button");
    btnTambah.className = "tambah";
    btnTambah.type = "button";
    btnTambah.innerHTML = '＋ Add <span class="qty" style="display:none">0</span>';
    btnTambah.addEventListener("click", () => addToCart(m.name, m.price));

    aksi.append(btnKurang, btnTambah);
    card.append(img, info, aksi);
    wrap.appendChild(card);
  });
}


renderMenu();
updateTotal();
