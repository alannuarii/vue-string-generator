# Perbaikan Error Build Jenkins

## Masalah yang Ditemukan:
1. ❌ Syntax error: `npm ci --only=production=false` (syntax yang salah)
2. ❌ File `package-lock.json` tidak tersedia karena di-exclude di `.dockerignore`

## Solusi yang Diterapkan:

### 1. Dockerfile
- ✅ Mengubah `npm ci --only=production=false` menjadi `npm ci`
- ✅ `npm ci` secara default sudah menginstall semua dependencies (termasuk devDependencies)
- ✅ `npm ci` lebih cepat dan reliable dibanding `npm install` untuk CI/CD

### 2. .dockerignore
- ✅ Meng-comment `package-lock.json` agar file tersebut ikut masuk ke Docker build
- ✅ File `package-lock.json` diperlukan oleh `npm ci` untuk instalasi yang konsisten

## Catatan Penting:
- `npm ci` membutuhkan file `package-lock.json` untuk berfungsi
- `npm ci` lebih cocok untuk CI/CD karena:
  - Lebih cepat (tidak perlu resolve dependencies)
  - Lebih konsisten (menggunakan exact versions dari lock file)
  - Lebih aman (akan error jika package.json dan lock file tidak sinkron)

## Langkah Selanjutnya:
1. Commit perubahan pada file:
   - Dockerfile
   - .dockerignore
2. Push ke repository GitHub
3. Jalankan build ulang di Jenkins

Build seharusnya berhasil sekarang! ✅
