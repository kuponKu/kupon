window.addEventListener("DOMContentLoaded", () => {
  const data = JSON.parse(localStorage.getItem("produkDipilih"));
  if (data) {
    document.getElementById("produkImg").src = data.gambar;
    document.getElementById("produkNama").textContent = data.nama;
    document.getElementById("produkHarga").textContent = data.harga;
    document.getElementById("deskripsiProduk").textContent = data.deskripsi;
  }
});

const metodeSelect = document.getElementById("metode");
const infoContainer = document.getElementById("infoPembayaran");

metodeSelect.addEventListener("change", function () {
  const metode = this.value;
  let html = "";

  if (metode === "dana") {
    html = `
      <div class="rekening-box">
        <img src="dana.png" alt="DANA" class="logo-pembayaran" />
        <div class="rekening-info">
          <p><strong>DANA</strong></p>
          <div class="rekening-line">
            <p id="danaRek">0857-9034-4651</p>
            <button type="button" onclick="salin('danaRek')" class="btn-salin">Salin</button>
          </div>
          <p>a.n. TAUFIQURRAHMAN</p>
        </div>
      </div>
    `;
  } else if (metode === "bank") {
    html = `
      <div class="rekening-box">
        <img src="seabank.png" alt="SeaBank" class="logo-pembayaran" />
        <div class="rekening-info">
          <p><strong>SeaBank</strong></p>
          <div class="rekening-line">
            <p id="bankRek">901681859771</p>
            <button type="button" onclick="salin('bankRek')" class="btn-salin">Salin</button>
          </div>
          <p>a.n. TAUFIQURRAHMAN</p>
        </div>
      </div>
    `;
  }

  infoContainer.innerHTML = html;
  infoContainer.style.display = "block";
});

function salin(id) {
  const teks = document.getElementById(id).innerText;
  navigator.clipboard.writeText(teks).then(() => {
    // tidak pakai alert
  });
}

document.getElementById("formPembayaran").addEventListener("submit", function(e) {
  e.preventDefault();

  const nama = document.getElementById("nama").value.trim();
  const email = document.getElementById("email").value.trim();
  const instagram = document.getElementById("instagram").value.trim();
  const metode = document.getElementById("metode").value;

  if (!nama || !email || !instagram || !metode) {
    return;
  }

  const loading = document.getElementById("loadingMessage");
  const notif = document.getElementById("notifSukses");
  loading.style.display = "block";

  const formData = new FormData();
  formData.append("nama", nama);
  formData.append("email", email);
  formData.append("instagram", instagram);
  formData.append("metode", metode);
  formData.append("produk", document.getElementById("produkNama").textContent);
  formData.append("harga", document.getElementById("produkHarga").textContent);
  formData.append("deskripsi", document.getElementById("deskripsiProduk").textContent);

  fetch("https://script.google.com/macros/s/AKfycbw4IMqTeyZTlVLnz_fJPVtAvZdeCqso5ZS6PYeffjRNe6hpKPDFx_yPb2519qnBvyGL/exec", {
    method: "POST",
    body: formData
  })
  .then(() => {
    loading.style.display = "none";
    notif.classList.add("show");
    setTimeout(() => {
      notif.classList.remove("show");
      window.location.href = "index.html";
    }, 2000);
  })
  .catch(() => {
    loading.style.display = "none";
    notif.classList.add("show");
    setTimeout(() => {
      notif.classList.remove("show");
      window.location.href = "index.html";
    }, 2000);
  });
});

const toggleBtn = document.getElementById("toggleDeskripsi");
const deskripsi = document.getElementById("deskripsiProduk");

toggleBtn.addEventListener("click", () => {
  deskripsi.classList.toggle("expand");
  toggleBtn.textContent = deskripsi.classList.contains("expand") ? "Sembunyikan" : "Selengkapnya";
});
