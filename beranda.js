document.addEventListener('DOMContentLoaded', function () {
  console.log("Halaman Beranda berhasil dimuat");

  const produkCards = document.querySelectorAll('.produk-card');

  produkCards.forEach(card => {
    card.addEventListener('click', function () {
      const namaProduk = card.querySelector('h3').innerText;
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("productModal");
  const closeBtn = document.querySelector(".close");

  const modalImage = document.getElementById("modalImage");
  const modalTitle = document.getElementById("modalTitle");
  const modalPrice = document.getElementById("modalPrice");
  const modalDeskripsi = document.getElementById("modalDeskripsi");
  const toggleBtn = document.getElementById("toggleDeskripsi");
  const beliBtn = document.querySelector(".btn-beli");

  // Fungsi Tampilkan Produk
  function tampilkanProduk(data) {
    const container = document.querySelector('.produk-grid');
    container.innerHTML = "";

    data.forEach(item => {
      const card = document.createElement("div");
      card.className = "produk-card";
      card.setAttribute("data-deskripsi", item.Deskripsi);

      card.innerHTML = `
        <img src="${item.GambarURL}" alt="${item.Nama}">
        <h3>${item.Nama}</h3>
        <p>Rp ${item.Harga}</p>
      `;

      // Tambahkan event klik ke setiap kartu
      card.addEventListener("click", () => {
        modalImage.src = item.GambarURL;
        modalTitle.textContent = item.Nama;
        modalPrice.textContent = `Rp ${item.Harga}`;
        modalDeskripsi.textContent = item.Deskripsi;

        const produk = {
          gambar: item.GambarURL,
          nama: item.Nama,
          harga: `Rp ${item.Harga}`,
          deskripsi: item.Deskripsi
        };
        localStorage.setItem("produkDipilih", JSON.stringify(produk));

        modal.style.display = "block";
      });

      container.appendChild(card);
    });
  }

  // Fetch dari Google Apps Script
  fetch("https://script.google.com/macros/s/AKfycbw4IMqTeyZTlVLnz_fJPVtAvZdeCqso5ZS6PYeffjRNe6hpKPDFx_yPb2519qnBvyGL/exec")
    .then(res => res.json())
    .then(data => tampilkanProduk(data))
    .catch(err => console.error("Gagal mengambil data:", err));

  closeBtn.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  toggleBtn.addEventListener("click", function () {
    modalDeskripsi.classList.toggle("deskripsi-penuh");
    toggleBtn.textContent = modalDeskripsi.classList.contains("deskripsi-penuh")
      ? "Sembunyikan"
      : "Selengkapnya";
  });

  // Beli Sekarang
  beliBtn.addEventListener("click", () => {
    window.location.href = "pembayaran.html";
  });
});