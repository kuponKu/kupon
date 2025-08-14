document.addEventListener("DOMContentLoaded", function () {      
  console.log("Halaman Beranda berhasil dimuat");      
    
  const modal = document.getElementById("productModal");      
  const closeBtn = document.querySelector(".close");      
  const modalImage = document.getElementById("modalImage");      
  const modalTitle = document.getElementById("modalTitle");      
  const modalPrice = document.getElementById("modalPrice");      
  const modalDeskripsi = document.getElementById("modalDeskripsi");      
  const toggleBtn = document.getElementById("toggleDeskripsi");      
  const beliBtn = document.querySelector(".btn-beli");      
    
  // Badge notifikasi    
  const notifBadge = document.getElementById("notifBadge");    
    
  function updateNotifBadge(jumlah) {    
    if (jumlah > 0) {    
      notifBadge.textContent = jumlah;    
      notifBadge.style.display = "inline-block";    
      notifBadge.classList.add("pulse"); // aktifkan animasi    
    } else {    
      notifBadge.style.display = "none";    
      notifBadge.classList.remove("pulse"); // matikan animasi    
    }    
  }    
    
  // Ambil status baca dari localStorage    
  const readNotifIds = JSON.parse(localStorage.getItem("readNotifIds") || "[]");    
    
  // 🔹 Dengarkan event perubahan storage (real-time)    
  window.addEventListener("storage", (event) => {    
    if (event.key === "notifUpdate") {    
      console.log("📢 Notifikasi dibaca, update badge...");    
      updateNotifBadge(0);    
    }    
  });    
    
  function convertDriveUrl(url) {      
    if (!url) return "";      
    const match = url.match(/[-\w]{25,}/);      
    return match ? `https://drive.google.com/uc?id=${match[0]}` : url;      
  }      
    
  function tampilkanProduk(data) {      
    const container = document.querySelector('.produk-grid');      
    container.innerHTML = "";      
    data.forEach(item => {      
      const card = document.createElement("div");      
      card.className = "produk-card";      
      card.innerHTML = `      
        <img src="${convertDriveUrl(item.GambarURL)}" alt="${item.Nama}">      
        <h3>${item.Nama}</h3>      
        <p>Rp ${item.Harga}</p>      
      `;      
      card.addEventListener("click", () => {      
        modalImage.src = convertDriveUrl(item.GambarURL);      
        modalTitle.textContent = item.Nama;      
        modalPrice.textContent = `Rp ${item.Harga}`;      
        modalDeskripsi.innerHTML = item.Deskripsi.replace(/\n/g, '<br>'); // format rapi dari sheet
        modal.style.display = "block";      
      });      
      container.appendChild(card);      
    });      
  }      
    
  fetch("https://script.google.com/macros/s/AKfycbxBfw3OVHV6ZpWWNY5eRtCmVp-qBrcpLI_V-2LRtsSOFdtNUmbx86KJfQK8p-roHixl/exec")      
    .then(res => res.json())      
    .then(data => tampilkanProduk(data))      
    .catch(err => console.error("Gagal mengambil data:", err));      
    
  closeBtn.onclick = () => modal.style.display = "none";      
  window.onclick = e => { if (e.target == modal) modal.style.display = "none"; };      
  toggleBtn.addEventListener("click", () => {      
    modalDeskripsi.classList.toggle("deskripsi-penuh");      
    toggleBtn.textContent = modalDeskripsi.classList.contains("deskripsi-penuh") ? "Sembunyikan" : "Selengkapnya";      
  });      
  beliBtn.addEventListener("click", () => window.location.href = "pembayaran.html");      
    
  const jumlahProdukInput = document.getElementById("jumlahProduk");      
  document.getElementById("tambahProduk").onclick = () => jumlahProdukInput.value = parseInt(jumlahProdukInput.value) + 1;      
  document.getElementById("kurangProduk").onclick = () => {      
    if (parseInt(jumlahProdukInput.value) > 1) jumlahProdukInput.value = parseInt(jumlahProdukInput.value) - 1;      
  };      
  document.getElementById("beliSekarangBtn").onclick = () => {      
    const hargaProduk = parseInt(modalPrice.textContent.replace(/[^\d]/g, ""));      
    const jumlah = parseInt(jumlahProdukInput.value);      
    const totalHarga = hargaProduk * jumlah;      
    localStorage.setItem("produkDipilih", JSON.stringify({      
      gambar: modalImage.src,      
      nama: modalTitle.textContent,      
      harga: "Rp " + totalHarga.toLocaleString("id-ID"),      
      deskripsi: modalDeskripsi.textContent,      
      jumlah      
    }));      
    window.location.href = "pembayaran.html";      
  };      
    
  //  Ambil notifikasi & update badge    
  fetch('https://script.google.com/macros/s/AKfycby3TWVi1HDn_Q43kc8IKxu8UmJVy4ZSPmnnD0g8EZ4UyeqS-cIG7fUoJAurXWWiabKYdw/exec?action=getNotifikasi')      
    .then(res => res.json())      
    .then(data => {      
      let marqueeTexts = [];      
      let bannerSlides = document.querySelector('#bannerSlider .slides');      
      let bannerWrapper = document.querySelector('.banner-slider');      
      let dotsContainer = document.querySelector('#bannerSlider .slider-nav');      
      let marqueeWrapper = document.querySelector('.notif-marquee');      
    
      if (!data || data.length === 0) {      
        bannerWrapper.style.display = 'none';      
        marqueeWrapper.style.display = 'none';      
        updateNotifBadge(0);    
        return;      
      }      
    
      let hasBanner = false;      
      let hasMarquee = false;      
    
      const unread = data.filter(item => !readNotifIds.includes(item.id)).length;    
      updateNotifBadge(unread);    
    
      data.forEach(item => {      
        let tanggal = item.tanggal || "";      
        let tipe = item.tipe?.trim().toUpperCase() || "";      
        let deskripsi = item.deskripsi?.trim() || "";      
        let gambar = item.gambar?.trim() || "";      
        let link = item.link?.trim() || "";      
    
        if (tanggal && tipe && deskripsi) {      
          marqueeTexts.push(`[${tanggal}] ${tipe}: ${deskripsi}`);      
          hasMarquee = true;      
        }      
    
        if (gambar) {      
          let slide = document.createElement('div');      
          slide.classList.add('slide');      
          let imgTag = `<img src="${gambar}" alt="${tipe}">`;      
          slide.innerHTML = link ? `<a href="${link}" target="_blank">${imgTag}</a>` : imgTag;      
          bannerSlides.appendChild(slide);      
          hasBanner = true;      
        }      
      });      
    
      if (hasMarquee) {      
        document.getElementById('notifText').innerHTML = marqueeTexts      
          .map(t => `<span class="marquee-item">${t}</span>`)      
          .join('<span class="marquee-separator">•</span>');      
      } else {      
        marqueeWrapper.style.display = 'none';      
      }      
    
      if (hasBanner) {      
        dotsContainer.innerHTML = "";      
        const totalSlides = bannerSlides.children.length;      
        for (let i = 0; i < totalSlides; i++) {      
          const dot = document.createElement('span');      
          dot.classList.add('dot');      
          dot.dataset.index = i;      
          if (i === 0) dot.classList.add('active');      
          dotsContainer.appendChild(dot);      
        }      
        initSlider();      
      } else {      
        bannerWrapper.style.display = 'none';      
      }      
    })      
    .catch(err => {      
      console.error("Gagal memuat notifikasi:", err);      
      document.querySelector('.banner-slider').style.display = 'none';      
      document.querySelector('.notif-marquee').style.display = 'none';      
      updateNotifBadge(0);    
    });      
    
  function initSlider() {      
    const slider = document.querySelector('#bannerSlider .slides');      
    let dots = document.querySelectorAll('#bannerSlider .dot');      
    let index = 0, startX = 0, moveX = 0, isDragging = false, autoSlide;      
    
    function showSlide(i) {      
      index = (i + dots.length) % dots.length;      
      slider.style.transform = `translateX(${-index * 100}%)`;      
      dots.forEach(dot => dot.classList.remove('active'));      
      if (dots[index]) dots[index].classList.add('active');      
    }      
    
    dots.forEach(dot => {      
      dot.addEventListener('click', () => {      
        showSlide(parseInt(dot.dataset.index));      
        resetAutoSlide();      
      });      
    });      
    
    function startAutoSlide() {      
      autoSlide = setInterval(() => showSlide(index + 1), 4000);      
    }      
    
    function resetAutoSlide() {      
      clearInterval(autoSlide);      
      startAutoSlide();      
    }      
    
    slider.addEventListener('touchstart', e => {      
      startX = e.touches[0].clientX;      
      isDragging = true;      
      slider.style.transition = 'none';      
      clearInterval(autoSlide);      
    });      
    
    slider.addEventListener('touchmove', e => {      
      if (!isDragging) return;      
      moveX = e.touches[0].clientX - startX;      
      slider.style.transform = `translateX(${-index * 100 + (moveX / slider.clientWidth) * 100}%)`;      
    });      
    
    slider.addEventListener('touchend', () => {      
      isDragging = false;      
      slider.style.transition = 'transform 0.4s ease-in-out';      
      if (Math.abs(moveX) > 50) {      
        if (moveX > 0) showSlide(index - 1);      
        else showSlide(index + 1);      
      } else {      
        showSlide(index);      
      }      
      moveX = 0;      
      resetAutoSlide();      
    });      
    
    showSlide(0);      
    startAutoSlide();      
  }      
});
