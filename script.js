// Fungsi untuk menghasilkan daftar URL video
function generateVideoUrls(baseUrl, count, prefix = "Video", extension = "mp4") {
    const urls = [];
    for (let i = 1; i <= count; i++) {
        urls.push(`${baseUrl}/${prefix}${i}.${extension}`);
    }
    return urls;
}

// Base URL video di GitHub
const baseUrl = "https://raw.githubusercontent.com/FLAME-XYZ/Video/main";

// Daftar URL video untuk setiap kategori
const videoCategories = {
    'yuk-nonton': generateVideoUrls(baseUrl, 23),
    'anime': generateVideoUrls(baseUrl, 100, "anime"),
    'film': generateVideoUrls(baseUrl, 100, "film"),
    'dj': generateVideoUrls(baseUrl, 100, "dj"),
    'musik': generateVideoUrls(baseUrl, 100, "musik"),
};

let currentTab = 'yuk-nonton';

// Fungsi untuk memuat video baru
function loadVideo(category) {
    const videoContainer = document.querySelector('.video-container');
    videoContainer.innerHTML = ''; // Kosongkan container

    const videos = videoCategories[category];
    videos.forEach(url => {
        const videoItem = document.createElement('div');
        videoItem.classList.add('video-item');

        const videoElement = document.createElement('video');
        videoElement.src = url;
        videoElement.autoplay = false;
        videoElement.loop = true;
        videoElement.muted = true;
        videoElement.controls = false;
        videoElement.loading = "lazy"; // Optimasi loading

        // Pause/play saat diklik
        videoElement.addEventListener('click', () => {
            videoElement.paused ? videoElement.play() : videoElement.pause();
        });

        videoItem.appendChild(videoElement);
        videoContainer.appendChild(videoItem);
    });

    // Set video pertama agar autoplay
    const firstVideo = videoContainer.querySelector('.video-item video');
    if (firstVideo) {
        firstVideo.autoplay = true;
        firstVideo.play();
    }
}

// Fungsi untuk mengganti tab
function changeTab(category) {
    currentTab = category;
    loadVideo(category);

    // Update tampilan tab aktif
    document.querySelectorAll('.tab-navigation button').forEach(button => {
        button.classList.toggle('active', button.getAttribute('onclick').includes(category));
    });
}

// Fungsi untuk mengaktifkan suara pada semua video
function unmuteAllVideos() {
    document.querySelectorAll('video').forEach(video => {
        video.muted = false;
    });
}

// Fungsi untuk mendeteksi video yang sedang aktif dengan IntersectionObserver
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        const video = entry.target;
        if (entry.isIntersecting) {
            video.play();
        } else {
            video.pause();
            video.currentTime = 0;
        }
    });
}, { threshold: 0.5 });

function observeVideos() {
    document.querySelectorAll('video').forEach(video => {
        observer.observe(video);
    });
}

// Menampilkan konten utama setelah splash screen selesai
window.onload = () => {
    setTimeout(() => {
        document.querySelector('.splash-screen').style.display = 'none';
        document.querySelector('.main-content').style.display = 'block';
        loadVideo(currentTab);
        observeVideos();
    }, 2000);
};
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js")
        .then(() => console.log("Service Worker registered"))
        .catch(error => console.error("Service Worker registration failed:", error));
}
