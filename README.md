# 🔐 StringGen - Secure Random String Generator

Aplikasi web modern untuk menghasilkan string acak yang aman secara kriptografis dengan berbagai opsi kustomisasi. Dibangun dengan Vue 3 dan Vite untuk performa optimal.

![StringGen Screenshot](https://via.placeholder.com/800x400/1E1E1E/5048e5?text=StringGen+Screenshot)

## ✨ Fitur Utama

- 🎲 **Random String Generation** - Menggunakan Web Crypto API untuk keamanan maksimal
- 📏 **Panjang Fleksibel** - Atur panjang string dari 6 hingga 64 karakter
- 🔤 **Opsi Character Set**
  - Huruf besar (A-Z)
  - Huruf kecil (a-z)
  - Angka (0-9)
  - Simbol (!@#$%^&*...)
- 💪 **Entropy Strength Indicator** - Visualisasi kekuatan string yang dihasilkan
- 📋 **Copy to Clipboard** - Satu klik untuk menyalin hasil
- 📜 **History Tracking** - Simpan hingga 50 string terakhir (localStorage)
- 🌓 **Dark/Light Mode** - Toggle tema sesuai preferensi
- 📱 **Responsive Design** - Tampilan optimal di semua perangkat
- ⚡ **Fast & Lightweight** - Build size kecil dengan Vite

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ atau 20+
- npm atau yarn

### Instalasi & Development

```bash
# Clone repository
git clone <repository-url>
cd vue-string-generator

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

### Build untuk Production

```bash
# Build aplikasi
npm run build

# Preview production build
npm run preview
```

Build output akan tersimpan di folder `dist/`

## 🐳 Docker Deployment

### Build Docker Image

```bash
# Build image
docker build -t vue-string-generator .

# Atau dengan tag versi
docker build -t vue-string-generator:1.0.0 .
```

### Run Container

```bash
# Run container
docker run -d -p 3000:3000 --name stringgen vue-string-generator

# Akses aplikasi di http://localhost:3000
```

### Docker Compose (Opsional)

Buat file `docker-compose.yml`:

```yaml
version: '3.8'

services:
  stringgen:
    build: .
    ports:
      - "3000:3000"
    restart: unless-stopped
    container_name: vue-string-generator
```

Jalankan dengan:

```bash
docker-compose up -d
```

### Stop & Remove Container

```bash
# Stop container
docker stop stringgen

# Remove container
docker rm stringgen

# Remove image
docker rmi vue-string-generator
```

## 📖 Cara Penggunaan

### 1. Generate String

- Klik tombol **GENERATE** untuk membuat string acak baru
- String akan otomatis dibuat saat aplikasi pertama kali dibuka

### 2. Atur Panjang String

- Gunakan slider **Length** untuk mengatur panjang (6-64 karakter)
- Nilai panjang ditampilkan di sebelah kanan slider

### 3. Pilih Character Set

Toggle opsi berikut sesuai kebutuhan:
- **Uppercase** - Huruf besar (A-Z)
- **Lowercase** - Huruf kecil (a-z)
- **Numbers** - Angka (0-9)
- **Symbols** - Karakter simbol

> **Catatan**: Minimal satu opsi harus aktif

### 4. Copy ke Clipboard

- Klik icon **copy** di sebelah kanan string yang dihasilkan
- Notifikasi "Copied!" akan muncul
- String siap di-paste ke aplikasi lain

### 5. Lihat History

- Panel kanan menampilkan history 50 string terakhir
- Klik string di history untuk copy
- Klik **Clear All** untuk menghapus semua history
- Klik **Copy All** untuk copy semua string sekaligus

### 6. Toggle Dark Mode

- Klik icon **moon/sun** di header
- Preferensi tema tersimpan di localStorage

### 7. Entropy Strength

Indikator di bawah string menunjukkan kekuatan:
- 🔴 **Weak** - Entropy < 50 bits
- 🟠 **Medium** - Entropy 50-80 bits
- 🟢 **Very Strong** - Entropy > 80 bits

## 📁 Struktur Project

```
vue-string-generator/
├── public/              # Static assets
├── src/
│   ├── components/      # Vue components
│   │   ├── StringGenerator.vue  # Main generator component
│   │   └── HistorySidebar.vue   # History panel component
│   ├── App.vue         # Root component
│   ├── main.js         # Entry point
│   └── style.css       # Global styles
├── index.html          # HTML template
├── vite.config.js      # Vite configuration
├── package.json        # Dependencies
├── Dockerfile          # Docker configuration
└── .dockerignore       # Docker ignore rules
```

## 🛠️ Technology Stack

- **Framework**: [Vue 3](https://vuejs.org/) (Composition API)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: CSS Variables + Custom CSS
- **Security**: Web Crypto API (`crypto.getRandomValues()`)
- **Fonts**: 
  - Inter (UI)
  - JetBrains Mono (Monospace)
  - Material Symbols (Icons)
- **Deployment**: Docker + Nginx Alpine

## 🔒 Keamanan

Aplikasi ini menggunakan **Web Crypto API** (`window.crypto.getRandomValues()`) yang merupakan cryptographically secure random number generator (CSPRNG). Ini memastikan string yang dihasilkan benar-benar acak dan aman untuk digunakan sebagai:

- Password
- API Keys
- Tokens
- Session IDs
- Dan kebutuhan keamanan lainnya

> ⚠️ **Penting**: Aplikasi ini berjalan sepenuhnya di browser (client-side). Tidak ada data yang dikirim ke server.

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

## 📝 License

MIT License - Bebas digunakan untuk project pribadi maupun komersial.

## 👨‍💻 Development

### Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/)
- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) extension

### Customize Configuration

Lihat [Vite Configuration Reference](https://vitejs.dev/config/)

## 🤝 Contributing

Contributions, issues, dan feature requests sangat diterima!

## 📧 Contact

Jika ada pertanyaan atau saran, silakan buat issue di repository ini.

---

**Dibuat dengan ❤️ menggunakan Vue 3 + Vite**
