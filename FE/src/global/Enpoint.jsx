import { CONFIG } from "./Config";

export const Endpoint = {
    dashboard: `${CONFIG.API_URL}/dashboard`,
    siswa: {
        getAll: `${CONFIG.API_URL}/siswa`,
        getById: (id) => `${CONFIG.API_URL}/siswa/${id}`,
        create: `${CONFIG.API_URL}/siswa`,
        update: (id) => `${CONFIG.API_URL}/siswa/${id}`,
        delete: (id) => `${CONFIG.API_URL}/siswa/${id}`,
    },
    guru: {
        getAll: `${CONFIG.API_URL}/guru`,
        getById: (id) => `${CONFIG.API_URL}/guru/${id}`,
        create: `${CONFIG.API_URL}/guru`,
        update: (id) => `${CONFIG.API_URL}/guru/${id}`,
        delete: (id) => `${CONFIG.API_URL}/guru/${id}`,
    },
    kelas: {
        getAll: `${CONFIG.API_URL}/kelas`,
        getById: (id) => `${CONFIG.API_URL}/kelas/${id}`,
        create: `${CONFIG.API_URL}/kelas`,
        update: (id) => `${CONFIG.API_URL}/kelas/${id}`,
        delete: (id) => `${CONFIG.API_URL}/kelas/${id}`,
    },
    mataPelajaran: {
        getAll: `${CONFIG.API_URL}/mataPelajaran`,
        getById: (id) => `${CONFIG.API_URL}/mataPelajaran/${id}`,
        create: `${CONFIG.API_URL}/mataPelajaran`,
        update: (id) => `${CONFIG.API_URL}/mataPelajaran/${id}`,
        delete: (id) => `${CONFIG.API_URL}/mataPelajaran/${id}`,
    },
    transaksiKeuangan: {
        getAll: `${CONFIG.API_URL}/transaksiKeuangan`,
        getById: (id) => `${CONFIG.API_URL}/transaksiKeuangan/${id}`,
        create: `${CONFIG.API_URL}/transaksiKeuangan`,
        update: (id) => `${CONFIG.API_URL}/transaksiKeuangan/${id}`,
        delete: (id) => `${CONFIG.API_URL}/transaksiKeuangan/${id}`,
    },
    kehadiran: {
        getAll: `${CONFIG.API_URL}/kehadiran`,
        getById: (id) => `${CONFIG.API_URL}/kehadiran/${id}`,
        create: `${CONFIG.API_URL}/kehadiran`,
        update: (id) => `${CONFIG.API_URL}/kehadiran/${id}`,
        delete: (id) => `${CONFIG.API_URL}/kehadiran/${id}`,
    },
    pengguna: {
        getAll: `${CONFIG.API_URL}/pengguna`,
        getById: (id) => `${CONFIG.API_URL}/pengguna/${id}`,
        create: `${CONFIG.API_URL}/pengguna`,
        login: `${CONFIG.API_URL}/pengguna/login`,
        update: (id) => `${CONFIG.API_URL}/pengguna/${id}`,
        delete: (id) => `${CONFIG.API_URL}/pengguna/${id}`,
    },
};