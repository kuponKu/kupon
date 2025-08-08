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
        <img href="dana.png" alt="DANA" class="logo-pembayaran" />
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
        <img href="seabank.png" alt="SeaBank" class="logo-pembayaran" />
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
    alert("Nomor rekening disalin!");
  });
}

document.getElementById("formPembayaran").addEventListener("submit", function(e) {
  e.preventDefault();

  const nama = document.getElementById("nama").value.trim();
  const email = document.getElementById("email").value.trim();
  const instagram = document.getElementById("instagram").value.trim();
  const metode = document.getElementById("metode").value;
  const buktiFile = document.getElementById("bukti").files[0];

  if (!nama || !email || !instagram) {
    alert("Silakan lengkapi data nama, email, dan Instagram.");
    return;
  }
  if (!metode) {
    alert("Silakan pilih metode pembayaran.");
    return;
  }
  if (!buktiFile || !buktiFile.type.startsWith('image/')) {
    alert("Upload bukti pembayaran berupa gambar.");
    return;
  }

  const loading = document.getElementById("loadingMessage");
  const notif = document.getElementById("notifSukses");
  loading.style.display = "block";

  const reader = new FileReader();
  reader.onload = function() {
    // reader.result -> "data:image/png;base64,......"
    const base64Bukti = reader.result;

    const payload = {
      nama,
      email,
      instagram,
      metode,
      produk: document.getElementById("produkNama").textContent,
      harga: document.getElementById("produkHarga").textContent,
      deskripsi: document.getElementById("deskripsiProduk").textContent,
      bukti: base64Bukti
    };

    fetch('https://script.google.com/macros/s/AKfycbw4IMqTeyZTlVLnz_fJPVtAvZdeCqso5ZS6PYeffjRNe6hpKPDFx_yPb2519qnBvyGL/exec', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(res => {
      loading.style.display = "none";
      if (res && res.status === "sukses") {
        notif.classList.add("show");
        setTimeout(() => {
          notif.classList.remove("show");
          window.location.href = "index.html";
        }, 2000);
      } else {
        console.error("Response error:", res);
        alert("Gagal mengirim data: " + (res && res.error ? res.error : JSON.stringify(res)));
      }
    })
    .catch(err => {
      console.error("Fetch error:", err);
      loading.style.display = "none";
      alert("Gagal mengirim data).");
    });
  };

  reader.onerror = function(err) {
    loading.style.display = "none";
    console.error("FileReader error:", err);
    alert("Gagal membaca file bukti.");
  };

  reader.readAsDataURL(buktiFile);
});

const toggleBtn = document.getElementById("toggleDeskripsi");
const deskripsi = document.getElementById("deskripsiProduk");

toggleBtn.addEventListener("click", () => {
  deskripsi.classList.toggle("expand");
  toggleBtn.textContent = deskripsi.classList.contains("expand") ? "Sembunyikan" : "Selengkapnya";
});
