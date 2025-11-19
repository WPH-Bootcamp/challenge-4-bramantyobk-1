/**
 * Class StudentManager
 * Mengelola koleksi siswa dan operasi-operasi terkait
 *
 * TODO: Implementasikan class StudentManager dengan:
 * - Constructor untuk inisialisasi array students
 * - Method addStudent(student) untuk menambah siswa
 * - Method removeStudent(id) untuk menghapus siswa
 * - Method findStudent(id) untuk mencari siswa
 * - Method updateStudent(id, data) untuk update data siswa
 * - Method getAllStudents() untuk mendapatkan semua siswa
 * - Method getTopStudents(n) untuk mendapatkan top n siswa
 * - Method displayAllStudents() untuk menampilkan semua siswa
 */

import fs from "fs";
import Student from "./Student.js";

class StudentManager {
	// TODO: Implementasikan constructor
	// Properti yang dibutuhkan:
	// - students: Array untuk menyimpan semua siswa

	constructor() {
		// Implementasi constructor di sini
		this.students = [];
	}

	/**
	 * Menambah siswa baru ke dalam sistem
	 * @param {Student} student - Object Student yang akan ditambahkan
	 * @returns {boolean} true jika berhasil, false jika ID sudah ada
	 * TODO: Validasi bahwa ID belum digunakan
	 */
	addStudent(student) {
		// Implementasi method di sini
		if (!student || typeof student.getId !== "function") return false;
		const id = String(student.getId()).trim();
		if (this.findStudent(id)) return false;
		this.students.push(student);
		return true;
	}

	/**
	 * Menghapus siswa berdasarkan ID
	 * @param {string} id - ID siswa yang akan dihapus
	 * @returns {boolean} true jika berhasil, false jika tidak ditemukan
	 * TODO: Cari dan hapus siswa dari array
	 */
	removeStudent(id) {
		// Implementasi method di sini
		const key = String(id).trim();
		const index = this.students.findIndex(
			(stdId) => String(stdId.getId?.()) === key
		);
		if (index === -1) return false;
		this.students.splice(index, 1);
		return true;
	}

	/**
	 * Mencari siswa berdasarkan ID
	 * @param {string} id - ID siswa yang dicari
	 * @returns {Student|null} Object Student jika ditemukan, null jika tidak
	 * TODO: Gunakan method array untuk mencari siswa
	 */
	findStudent(id) {
		// Implementasi method di sini
		const key = String(id).trim();
		return (
			this.students.find((stdId) => String(stdId.getId?.()) === key) || null
		);
	}

	/**
	 * Update data siswa
	 * @param {string} id - ID siswa yang akan diupdate
	 * @param {object} data - Data baru (name, class, dll)
	 * @returns {boolean} true jika berhasil, false jika tidak ditemukan
	 * TODO: Cari siswa dan update propertinya
	 */
	updateStudent(id, data) {
		// Implementasi method di sini
		const studentId = this.findStudent(id);
		if (!studentId) return false;
		if (typeof data.name === "string" && data.name.trim())
			studentId.setName?.(data.name.trim());
		if (typeof data.class === "string" && data.class.trim())
			studentId.setClass?.(data.class.trim());
		return true;
	}

	/**
	 * Mendapatkan semua siswa
	 * @returns {Array} Array berisi semua siswa
	 */
	getAllStudents() {
		// Implementasi method di sini
		return this.students;
	}

	/**
	 * Mendapatkan top n siswa berdasarkan rata-rata nilai
	 * @param {number} n - Jumlah siswa yang ingin didapatkan
	 * @returns {Array} Array berisi top n siswa
	 * TODO: Sort siswa berdasarkan rata-rata (descending) dan ambil n teratas
	 */
	getTopStudents(n) {
		// Implementasi method di sini
		const countStudent = Number(n);
		if (!Number.isFinite(countStudent) || countStudent <= 0) return [];
		return this.students
			.slice()
			.sort((a, b) => (b.getAverage?.() ?? 0) - (a.getAverage?.() ?? 0))
			.slice(0, countStudent);
	}

	/**
	 * Menampilkan informasi semua siswa
	 * TODO: Loop semua siswa dan panggil displayInfo() untuk masing-masing
	 */
	displayAllStudents() {
		// Implementasi method di sini
		if (this.students.length === 0) {
			console.log("Tidak ada data siswa.");
			return;
		}
		this.students.forEach((student) => {
			console.log("------------------------");
			student.displayInfo?.();
		});
		console.log("------------------------");
	}

	/**
	 * BONUS: Mendapatkan siswa berdasarkan kelas
	 * @param {string} className - Nama kelas
	 * @returns {Array} Array siswa dalam kelas tersebut
	 */
	getStudentsByClass(className) {
		// Implementasi method di sini (BONUS)
		const checkClass = typeof className === "string" ? className.trim() : "";
		if (!checkClass) return [];
		return this.students.filter(
			(student) => String(student.getClass?.()).trim() === checkClass
		);
	}

	/**
	 * BONUS: Mendapatkan statistik kelas
	 * @param {string} className - Nama kelas
	 * @returns {object} Object berisi statistik (jumlah siswa, rata-rata kelas, dll)
	 */
	getClassStatistics(className) {
		// Implementasi method di sini (BONUS)
		const studentList = this.getStudentsByClass(className);
		const count = studentList.length;
		const avgs = studentList.map((s) => s.getAverage?.() ?? 0);
		const total = avgs.reduce((a, b) => a + b, 0);
		const classAverage = count ? total / count : 0;
		const top = count
			? studentList
					.slice()
					.sort((a, b) => (b.getAverage?.() ?? 0) - (a.getAverage?.() ?? 0))[0]
			: null;
		return { count, classAverage, topStudent: top };
	}

	async saveToFile(filePath) {
		if (typeof filePath !== "string" || !filePath.trim()) return false;
		const payload = this.students.map((student) => ({
			id: student.getId?.(),
			name: student.getName?.(),
			class: student.getClass?.(),
			grades: student.getGrades?.(),
		}));
		await fs.promises.writeFile(
			filePath,
			JSON.stringify(payload, null, 2),
			"utf-8"
		);
		return true;
	}

	async loadFromFile(filePath) {
		if (typeof filePath !== "string" || !filePath.trim()) return false;
		if (!fs.existsSync(filePath)) {
			await this.saveToFile(filePath);
		}
		const raw = await fs.promises.readFile(filePath, "utf-8");
		let arr;
		try {
			arr = JSON.parse(raw);
		} catch {
			return false;
		}
		this.students = [];
		for (const obj of Array.isArray(arr) ? arr : []) {
			try {
				const st = new Student(obj.id, obj.name, obj.class);
				const grades = obj.grades || {};
				for (const [subj, score] of Object.entries(grades)) {
					st.addGrade(subj, score);
				}
				this.students.push(st);
			} catch {}
		}
		return true;
	}
}

export default StudentManager;
