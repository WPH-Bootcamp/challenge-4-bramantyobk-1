/**
 * Main Application - CLI Interface
 * File ini adalah entry point aplikasi
 *
 * TODO: Implementasikan CLI interface yang interaktif dengan menu:
 * 1. Tambah Siswa Baru
 * 2. Lihat Semua Siswa
 * 3. Cari Siswa (by ID)
 * 4. Update Data Siswa
 * 5. Hapus Siswa
 * 6. Tambah Nilai Siswa
 * 7. Lihat Top 3 Siswa
 * 8. Keluar
 */

import readlineSync from "readline-sync";
import Student from "./src/Student.js";
import StudentManager from "./src/StudentManager.js";

// Inisialisasi StudentManager
const manager = new StudentManager();
const dataFile = "./students.json";
(async () => await manager.loadFromFile?.(dataFile))();

/**
 * Menampilkan menu utama
 */
function displayMenu() {
	console.log("\n=================================");
	console.log("SISTEM MANAJEMEN NILAI SISWA");
	console.log("=================================");
	console.log("1. Tambah Siswa Baru");
	console.log("2. Lihat Semua Siswa");
	console.log("3. Cari Siswa");
	console.log("4. Update Data Siswa");
	console.log("5. Hapus Siswa");
	console.log("6. Tambah Nilai Siswa");
	console.log("7. Lihat Top 3 Siswa");
	console.log("8. Keluar");
	console.log("=================================");
}

/**
 * Handler untuk menambah siswa baru
 * TODO: Implementasikan function ini
 * - Minta input: ID, Nama, Kelas
 * - Buat object Student baru
 * - Tambahkan ke manager
 * - Tampilkan pesan sukses/gagal
 */
function addNewStudent() {
	// Implementasi di sini
	console.log("\n--- Tambah Siswa Baru ---");
	// TODO: Lengkapi implementasi
	const id = readlineSync.question("ID: ").trim();
	const name = readlineSync.question("Nama: ").trim();
	const studentClass = readlineSync.question("Kelas: ").trim();
	try {
		const student = new Student(id, name, studentClass);
		const ok = manager.addStudent(student);
		if (ok) {
			console.log("Siswa berhasil ditambahkan.");
			manager.saveToFile?.(dataFile);
		} else {
			console.log("Gagal menambahkan: ID sudah digunakan.");
		}
	} catch (e) {
		console.log(`Gagal menambahkan: ${e.message}`);
	}
}

/**
 * Handler untuk melihat semua siswa
 * TODO: Implementasikan function ini
 * - Panggil method displayAllStudents dari manager
 * - Jika tidak ada siswa, tampilkan pesan
 */
function viewAllStudents() {
	// Implementasi di sini
	console.log("\n--- Daftar Semua Siswa ---");
	// TODO: Lengkapi implementasi
	manager.displayAllStudents();
}

/**
 * Handler untuk mencari siswa berdasarkan ID
 * TODO: Implementasikan function ini
 * - Minta input ID
 * - Cari siswa menggunakan manager
 * - Tampilkan info siswa jika ditemukan
 */
function searchStudent() {
	// Implementasi di sini
	console.log("\n--- Cari Siswa ---");
	// TODO: Lengkapi implementasi
	const id = readlineSync.question("Masukkan ID: ").trim();
	const s = manager.findStudent(id);
	if (s) {
		s.displayInfo();
	} else {
		console.log("Siswa tidak ditemukan.");
	}
}

/**
 * Handler untuk update data siswa
 * TODO: Implementasikan function ini
 * - Minta input ID siswa
 * - Tampilkan data saat ini
 * - Minta input data baru (nama, kelas)
 * - Update menggunakan manager
 */
function updateStudent() {
	// Implementasi di sini
	console.log("\n--- Update Data Siswa ---");
	// TODO: Lengkapi implementasi
	const id = readlineSync.question("Masukkan ID: ").trim();
	const s = manager.findStudent(id);
	if (!s) {
		console.log("Siswa tidak ditemukan.");
		return;
	}
	s.displayInfo();
	const newName = readlineSync.question("Nama baru (kosong = tetap): ").trim();
	const newClass = readlineSync
		.question("Kelas baru (kosong = tetap): ")
		.trim();
	const data = {};
	if (newName) data.name = newName;
	if (newClass) data.class = newClass;
	const ok = manager.updateStudent(id, data);
	if (ok) {
		console.log("Data siswa berhasil diupdate.");
		s.displayInfo();
		manager.saveToFile?.(dataFile);
	} else {
		console.log("Gagal update data siswa.");
	}
}

/**
 * Handler untuk menghapus siswa
 * TODO: Implementasikan function ini
 * - Minta input ID siswa
 * - Konfirmasi penghapusan
 * - Hapus menggunakan manager
 */
function deleteStudent() {
	// Implementasi di sini
	console.log("\n--- Hapus Siswa ---");
	// TODO: Lengkapi implementasi
	const id = readlineSync.question("Masukkan ID: ").trim();
	const confirm = readlineSync
		.question("Yakin hapus? (y/n): ")
		.trim()
		.toLowerCase();
	if (confirm !== "y") {
		console.log("Pembatalan penghapusan.");
		return;
	}
	const ok = manager.removeStudent(id);
	if (ok) {
		console.log("Siswa berhasil dihapus.");
		manager.saveToFile?.(dataFile);
	} else {
		console.log("Siswa tidak ditemukan.");
	}
}

/**
 * Handler untuk menambah nilai siswa
 * TODO: Implementasikan function ini
 * - Minta input ID siswa
 * - Tampilkan data siswa
 * - Minta input mata pelajaran dan nilai
 * - Tambahkan nilai menggunakan method addGrade
 */
function addGradeToStudent() {
	// Implementasi di sini
	console.log("\n--- Tambah Nilai Siswa ---");
	// TODO: Lengkapi implementasi
	const id = readlineSync.question("Masukkan ID: ").trim();
	const s = manager.findStudent(id);
	if (!s) {
		console.log("Siswa tidak ditemukan.");
		return;
	}
	s.displayInfo();
	const subject = readlineSync.question("Mata pelajaran: ").trim();
	const scoreInput = readlineSync.question("Nilai (0-100): ").trim();
	const score = Number(scoreInput);
	try {
		s.addGrade(subject, score);
		console.log("Nilai berhasil ditambahkan.");
		s.displayInfo();
		manager.saveToFile?.(dataFile);
	} catch (e) {
		console.log(`Gagal menambahkan nilai: ${e.message}`);
	}
}

/**
 * Handler untuk melihat top students
 * TODO: Implementasikan function ini
 * - Panggil getTopStudents(3) dari manager
 * - Tampilkan informasi siswa
 */
function viewTopStudents() {
	// Implementasi di sini
	console.log("\n--- Top 3 Siswa ---");
	// TODO: Lengkapi implementasi
	const top = manager.getTopStudents(3);
	if (!top || top.length === 0) {
		console.log("Tidak ada data siswa.");
		return;
	}
	top.forEach((s) => {
		console.log("------------------------");
		s.displayInfo();
	});
	console.log("------------------------");
}

/**
 * Main program loop
 * TODO: Implementasikan main loop
 * - Tampilkan menu
 * - Baca input pilihan
 * - Panggil handler yang sesuai
 * - Ulangi sampai user pilih keluar
 */
function main() {
	console.log("Selamat datang di Sistem Manajemen Nilai Siswa!");

	// TODO: Implementasikan loop utama program
	let running = true;

	while (running) {
		// Tampilkan menu
		// Baca pilihan user
		// Jalankan action sesuai pilihan
		// TODO: Lengkapi implementasi
		// Hint: gunakan switch-case untuk handle berbagai pilihan
		displayMenu();
		const choice = readlineSync.question("Pilih menu (1-8): ").trim();
		switch (choice) {
			case "1":
				addNewStudent();
				break;
			case "2":
				viewAllStudents();
				break;
			case "3":
				searchStudent();
				break;
			case "4":
				updateStudent();
				break;
			case "5":
				deleteStudent();
				break;
			case "6":
				addGradeToStudent();
				break;
			case "7":
				viewTopStudents();
				break;
			case "8":
				running = false;
				break;
			default:
				console.log("Pilihan tidak valid. Silakan coba lagi.");
		}
	}

	console.log("\nTerima kasih telah menggunakan aplikasi ini!");
}

// Jalankan aplikasi
main();
