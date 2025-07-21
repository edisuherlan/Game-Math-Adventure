# Game-Math-Adventure

Game Mobile Sederhana Bertema Matematika  
Dibuat oleh: Edi Suherlan (audhighasu.com)

---

## Sistem Requirement

- **Node.js** minimal versi 16.x
- **npm** minimal versi 8.x
- **Expo CLI** (global):  
  Install dengan:  
  ```
  npm install -g expo-cli
  ```
- **Android/iOS Emulator** atau **Expo Go** di HP untuk menjalankan aplikasi

---

## Cara Instalasi & Menjalankan

1. **Clone repository**
   ```
   git clone https://github.com/edisuherlan/Game-Math-Adventure.git
   cd Game-Math-Adventure
   ```

2. **Install dependencies**
   ```
   npm install
   ```

3. **Jalankan aplikasi**
   ```
   npm start
   ```
   atau
   ```
   expo start
   ```

4. **Scan QR Code**
   - Gunakan aplikasi **Expo Go** di HP Android/iOS untuk scan QR code yang muncul di terminal/browser.
   - Atau, jalankan di emulator Android/iOS.

---

## Fitur

- Splash screen dengan logo dan nama pembuat
- Home screen dengan logo besar, tombol navigasi, dan kontrol musik floating
- Game matematika dengan level dan skor
- Penyimpanan skor dan progress lokal
- Kontrol musik floating yang bisa dipindah/digeser

---

## Catatan

- Jika ada file besar (misal: mp3), pastikan tidak menghapus/memindahkan file dari folder `src/assets/`.
- Untuk build APK/AAB, gunakan perintah:
  ```
  expo build:android
  ```
  atau (Expo SDK terbaru):
  ```
  eas build -p android
  ```

---

## Lisensi

Aplikasi ini dibuat oleh [Edi Suherlan](https://audhighasu.com).  
Silakan gunakan untuk pembelajaran dan pengembangan pribadi.

## Screenshoot

![1](https://github.com/user-attachments/assets/e9c95b41-aa2c-4381-9a61-016ca2f5abd5)


