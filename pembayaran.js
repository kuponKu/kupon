window.addEventListener("DOMContentLoaded", () => {
  const data = JSON.parse(localStorage.getItem("produkDipilih"));
  if (data) {
    document.getElementById("produkImg").src = data.gambar;
    document.getElementById("produkNama").textContent = data.nama;
    document.getElementById("produkHarga").textContent = data.harga;
    document.getElementById("deskripsiProduk").textContent = data.deskripsi;
    document.getElementById("jumlahKupon").textContent = data.jumlah || 1;
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
  navigator.clipboard.writeText(teks);
}

document.getElementById("formPembayaran").addEventListener("submit", function (e) {
  e.preventDefault();

  const nama = document.getElementById("nama").value.trim();
  const email = document.getElementById("email").value.trim();
  const instagram = document.getElementById("instagram").value.trim();
  const metode = document.getElementById("metode").value;
  const buktiFile = document.getElementById("bukti").files[0];

  if (!nama || !email || !instagram || !metode || !buktiFile) {
    alert("Lengkapi semua data dan upload bukti pembayaran!");
    return;
  }

  const loading = document.getElementById("loadingMessage");
  const notif = document.getElementById("notifSukses");
  loading.style.display = "block";

  const produkData = JSON.parse(localStorage.getItem("produkDipilih"));

  const reader = new FileReader();
  reader.onload = function () {
    const buktiBase64 = reader.result.split(",")[1]; // hapus prefix data:image/jpeg;base64,

    const formData = new FormData();
    formData.append("nama", nama);
    formData.append("email", email);
    formData.append("instagram", instagram);
    formData.append("metode", metode);
    formData.append("produk", produkData.nama);
    formData.append("harga", produkData.harga);
    formData.append("deskripsi", produkData.deskripsi);
    formData.append("jumlah", produkData.jumlah);
    formData.append("bukti", buktiBase64);

    fetch("https://script.google.com/macros/s/AKfycbxBfw3OVHV6ZpWWNY5eRtCmVp-qBrcpLI_V-2LRtsSOFdtNUmbx86KJfQK8p-roHixl/exec", {
      method: "POST",
      body: formData
    })
      .then(res => res.json())
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
  };

  reader.readAsDataURL(buktiFile);
});

const toggleBtn = document.getElementById("toggleDeskripsi");
const deskripsi = document.getElementById("deskripsiProduk");

toggleBtn.addEventListener("click", () => {
  deskripsi.classList.toggle("expand");
  toggleBtn.textContent = deskripsi.classList.contains("expand") ? "Sembunyikan" : "Selengkapnya";
});