
const form = document.getElementById("signupForm");
const fields = {
  name: document.getElementById("name"),
  email: document.getElementById("email"),
  phone: document.getElementById("phone"),
};
const statusEl = document.getElementById("formStatus");


const rules = {
  name(v) {
    v = v.trim();
    if (!v) return "Nama wajib diisi.";
    if (v.length < 3) return "Nama minimal 3 karakter.";
    if (v.length > 50) return "Nama maksimal 50 karakter.";
    if (!/^[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ .'-]*$/.test(v))
      return "Nama hanya boleh berisi huruf, spasi, titik, apostrof, atau strip.";
    return "";
  },
  email(v) {
    v = v.trim();
    if (!v) return "Email wajib diisi.";
    if (/\s/.test(v)) return "Email tidak boleh mengandung spasi.";
    if (!/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(v) || /\.\./.test(v))
      return "Format email tidak valid (contoh: nama@gmail.com).";
    return "";
  },
  phone(v) {
    const d = v.replace(/[\s-]/g, "");
    if (!d) return "No. HP wajib diisi.";
    if (!/^[0-9+]+$/.test(d)) return "No. HP hanya boleh berisi angka.";
    // 08xx / 628xx / +628xx, total 10-13 digit
    if (!/^(\+62|62|0)8[1-9][0-9]{7,10}$/.test(d))
      return "Gunakan nomor HP Indonesia, contoh: 081234567890.";
    return "";
  },
};

function validateField(key, showEmpty = true) {
  const input = fields[key];
  const errEl = document.getElementById("err-" + key);
  const msg = rules[key](input.value);
  const touchedEmpty = input.value.trim() === "" && !showEmpty;

  if (touchedEmpty) {
    errEl.textContent = "";
    input.classList.remove("valid", "invalid");
    return false;
  }
  errEl.textContent = msg;
  input.classList.toggle("invalid", !!msg);
  input.classList.toggle("valid", !msg);
  return !msg;
}


Object.keys(fields).forEach((key) => {
  fields[key].addEventListener("input", () => validateField(key, false));
  fields[key].addEventListener("blur", () => validateField(key, true));
});


fields.phone.addEventListener("input", () => {
  fields.phone.value = fields.phone.value.replace(/[^0-9+\s-]/g, "");
});


function normalizePhone(v) {
  let d = v.replace(/[\s-]/g, "");
  if (d.startsWith("+62")) d = "0" + d.slice(3);
  else if (d.startsWith("62")) d = "0" + d.slice(2);
  return d;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const results = Object.keys(fields).map((k) => validateField(k, true));
  if (!results.every(Boolean)) {
    statusEl.textContent = "Periksa kembali data yang berwarna merah.";
    statusEl.className = "form-status bad";
    const firstBad = Object.keys(fields).find((k) => fields[k].classList.contains("invalid"));
    if (firstBad) fields[firstBad].focus();
    return;
  }

  const user = {
    name: fields.name.value.trim().replace(/\s+/g, " "),
    email: fields.email.value.trim().toLowerCase(),
    phone: normalizePhone(fields.phone.value),
  };
  localStorage.setItem("user", JSON.stringify(user));

  statusEl.textContent = "Pendaftaran berhasil! Mengalihkan ke menu...";
  statusEl.className = "form-status ok";
  document.getElementById("btnDaftar").disabled = true;
  setTimeout(() => (window.location.href = "tavmpan.html"), 900);
});
