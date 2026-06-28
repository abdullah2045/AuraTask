# 🍃 AuraTask - Persistent To-Do Tracker

AuraTask adalah aplikasi manajemen tugas harian (*To-Do List*) yang mengusung desain estetik dan minimalis. Proyek ini dikembangkan untuk memenuhi **Tugas Arsitektur Software**, berfokus pada implementasi penyimpanan data lokal yang persisten.

## 🎯 Tujuan Proyek (Capaian Level 2)
Aplikasi ini membuktikan berjalannya konsep **CRUD (Create, Read, Update, Delete)** di sisi klien tanpa memerlukan database server. Jika aplikasi ditutup paksa (*force close*) atau perangkat dimatikan, data tugas tidak akan hilang.

## ✨ Fitur Utama (Sesuai Syarat Tugas)
1. **Create:** Pengguna dapat menambahkan fokus tugas baru.
2. **Read (Persisten):** Data secara otomatis dimuat ulang dari memori internal perangkat saat aplikasi dibuka kembali.
3. **Update:** Menyelesaikan tugas (menandai *checkbox* / teks dicoret).
4. **Delete:** Menghapus tugas dengan verifikasi *Alert Dialog* lintas platform (berfungsi di Web, Android, dan iOS).
5. **Clear All (Bonus):** Menghapus seluruh data dari memori penyimpanan fisik secara instan.
6. **Search & Analytics:** Dilengkapi fitur pencarian *real-time* dan kalkulasi persentase tugas yang selesai.

## 🛠️ Teknologi yang Digunakan
- **Framework:** React Native (Expo)
- **Local Storage:** `@react-native-async-storage/async-storage`
- **UI Design:** React Native StyleSheet (Soft Sage Green Theme)

## 📸 Skenario Pembuktian (*Screenshots*)
- [x] daftar item (<img width="720" height="1600" alt="Item" src="https://github.com/user-attachments/assets/255246ca-f37a-453c-b70c-b5230ec70a53" />)
- [x] fitur Level 2 (<img width="720" height="1600" alt="AtributLvel2" src="https://github.com/user-attachments/assets/60611a59-2706-40b3-a82e-9923379fb14a" />)
- [x] bukti persistensi: sebelum & sesudah tutup-buka app (<img width="720" height="1600" alt="Persintensis" src="https://github.com/user-attachments/assets/7f9fe21d-e0da-4c14-b8e3-03bf78fb668f" />
)
