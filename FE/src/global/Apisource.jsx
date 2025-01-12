import { Endpoint } from './Enpoint';

export class API_Source {
  /* users */
  static async login(username, password) {
    try {
      const response = await fetch(Endpoint.pengguna.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }), // Mengirimkan username dan password
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      console.log('Login successful:', data);
      const userId = data.payload.data.userid;
      localStorage.setItem('userId', userId);
      return data.payload.data; // Mengembalikan data dari payload
    } catch (error) {
      console.error('Login error:', error);
      throw error; // Melemparkan error agar bisa ditangani di tempat lain
    }
  }
  static async signup(username, password, role) {
    try {
      const response = await fetch(Endpoint.pengguna.create, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, role }), // Mengirimkan username dan password
      });
      console.log('body: ', JSON.stringify({ username, password, role }));
      if (!response.ok) {
        throw new Error('Signup failed');
      }
      const data = await response.json();
      console.log('Signup successful:', data);
      return data.payload.data; // Mengembalikan data dari payload
    } catch (error) {
      console.error('Signup error:', error);
      throw error; // Melemparkan error agar bisa ditangani di tempat lain
    }
  }
  static async getById(id) {
    try {
      const response = await fetch(Endpoint.pengguna.getById(id), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      console.log('Data fetched successfully:', data);
      return data.payload.data; // Mengembalikan data dari payload
    } catch (error) {
      console.error('Fetch data error:', error);
      throw error; // Melemparkan error agar bisa ditangani di tempat lain
    }
  }
  static async updateProfile(id, username, password, role) {
    try {
      const response = await fetch(Endpoint.pengguna.update(id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, role }), // Mengirimkan username dan password
      });
      if (!response.ok) {
        throw new Error('Update failed');
      }
      const data = await response.json();
      console.log('Update successful:', data);
      return data.payload.data; // Mengembalikan data dari payload
    } catch (error) {
      console.error('Update error:', error);
      throw error; // Melemparkan error agar bisa ditangani di tempat lain
    }
  }
  static async delete(id) {
    try {
      const response = await fetch(Endpoint.pengguna.delete(id), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Delete failed');
      }
      const data = await response.json();
      console.log('Delete successful:', data);
      return data.payload.data; // Mengembalikan data dari payload
    } catch (error) {
      console.error('Delete error:', error);
      throw error; // Melemparkan error agar bisa ditangani di tempat lain
    }
  }

  static async Dashboard() {
    try {
      const response = await fetch(Endpoint.dashboard, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const data = await response.json();
      console.log('Dashboard Data:', data);
      return data.payload.data; // Mengembalikan data dari payload
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      throw error; // Melemparkan error agar bisa ditangani di tempat lain
    }
  }

  /* students */
  static async getStudents() {
    try {
      const response = await fetch(Endpoint.siswa.getAll, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }
      const data = await response.json();
      console.log('Students fetched successfully:', data);
      return data.payload.data; // Mengembalikan data dari payload
    } catch (error) {
      console.error('Fetch students error:', error);
      throw error; // Melemparkan error agar bisa ditangani di tempat lain
    }
  }
  static async postStudent(name, age, classid) {
    try {
      const response = await fetch(Endpoint.siswa.create, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, age, classid }),
      });
      if (!response.ok) {
        throw new Error('Failed to create student');
      }
      const data = await response.json();
      console.log('Student created successfully:', data);
      return data.payload.data; // Mengembalikan data dari payload
    } catch (error) {
      console.error('Create student error:', error);
      throw error; // Melemparkan error agar bisa ditangani di tempat lain
    }
  }
  static async getStudentById(id) {
    try {
      const response = await fetch(Endpoint.siswa.getById(id), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch student');
      }
      const data = await response.json();
      console.log('Student fetched successfully:', data);
      return data.payload.data; // Mengembalikan data dari payload
    } catch (error) {
      console.error('Fetch student error:', error);
      throw error; // Melemparkan error agar bisa ditangani di tempat lain
    }
  }
  static async updateStudent(id, name, age, classid) {
    try {
      const response = await fetch(Endpoint.siswa.update(id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, age, classid }), // Mengirimkan username dan password
      });
      if (!response.ok) {
        throw new Error('Update failed');
      }
      const data = await response.json();
      console.log('Update successful:', data);
      return data.payload.data; // Mengembalikan data dari payload
    } catch (error) {
      console.error('Update error:', error);
      throw error; // Melemparkan error agar bisa ditangani di tempat lain
    }
  }
  static async deleteStudent(id) {
    try {
      const response = await fetch(Endpoint.siswa.delete(id), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Delete failed');
      }
      const data = await response.json();
      console.log('Delete successful:', data);
      return data.payload.data; // Mengembalikan data dari payload
    } catch (error) {
      console.error('Delete error:', error);
      throw error; // Melemparkan error agar bisa ditangani di tempat lain
    }
  }

  /* teachers */
  static async getTeachers() {
    try {
      const response = await fetch(Endpoint.guru.getAll, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch teachers');
      }
      const data = await response.json();

      return data.payload.data.data; // Mengembalikan data dari payload
    } catch (error) {
      console.error('Fetch teachers error:', error);
      throw error; // Melemparkan error agar bisa ditangani di tempat lain
    }
  }
  static async postTeacher(name, subjectid) {
    try {
      const response = await fetch(Endpoint.guru.create, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, subjectid }), // Mengirimkan username dan password
      });
      if (!response.ok) {
        throw new Error('Post failed');
      }
      const data = await response.json();
      console.log('Post successful:', data);
      return data.payload.data; // Mengembalikan data dari payload
    } catch (error) {
      console.error('Post error:', error);
      throw error; // Melemparkan error agar bisa ditangani di tempat lain
    }
  }
  static async getTeacherById(id) {
    try {
      const response = await fetch(Endpoint.guru.getById(id), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch teacher');
      }
      const data = await response.json();
      console.log('Teacher fetched successfully:', data);
      return data.payload.data.data; // Mengembalikan data dari payload
    } catch (error) {
      console.error('Fetch teacher error:', error);
      throw error; // Melemparkan error agar bisa ditangani di tempat lain
    }
  }
  static async updateTeacher(id, name, subjectid) {
    try {
      const response = await fetch(Endpoint.guru.update(id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, subjectid }), // Mengirimkan username dan password
      });
      if (!response.ok) {
        throw new Error('Update failed');
      }
      const data = await response.json();
      console.log('Update successful:', data);
      return data.payload.data; // Mengembalikan data dari payload
    } catch (error) {
      console.error('Update error:', error);
      throw error; // Melemparkan error agar bisa ditangani di tempat lain
    }
  }
  static async deleteTeacher(id) {
    try {
      const response = await fetch(Endpoint.guru.delete(id), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Delete failed');
      }
      const data = await response.json();
      console.log('Delete successful:', data);
      return data.payload.data; // Mengembalikan data dari payload
    } catch (error) {
      console.error('Delete error:', error);
      throw error; // Melemparkan error agar bisa ditangani di tempat lain
    }
  }

  /* classes */
  static async getClasses() {
    try {
      const response = await fetch(Endpoint.kelas.getAll, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch classes');
      }
      const data = await response.json();

      return data.payload.data.data; // Mengembalikan data dari payload
    } catch (error) {
      console.error('Fetch classes error:', error);
      throw error; // Melemparkan error agar bisa ditangani di tempat lain
    }
  }

  static async getClassesById(id) {
    try {
      const response = await fetch(Endpoint.kelas.getById(id), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch class');
      }
      const data = await response.json();
      console.log('Class fetched successfully:', data);
      return data.payload.data.data; // Mengembalikan data dari payload
    } catch (error) {
      console.error('Fetch class error:', error);
      throw error; // Melemparkan error agar bisa ditangani di tempat lain
    }
  }

  static async createClass(classname) {
    try {
      const response = await fetch(Endpoint.kelas.create, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ classname }), // Mengirimkan username dan password
      });
      if (!response.ok) {
        throw new Error('Post failed');
      }
      const data = await response.json();
      console.log('Post successful:', data);
      return data.payload.data; // Mengembalikan data dari payload
    } catch (error) {
      console.error('Post error:', error);
      throw error; // Melemparkan error agar bisa ditangani di tempat lain
    }
  }
  static async deleteClass(id) {
    try {
      const response = await fetch(Endpoint.kelas.delete(id), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Delete failed');
      }
      const data = await response.json();
      console.log('Delete successful:', data);
      return data.payload.data; // Mengembalikan data dari payload
    } catch (error) {
      console.error('Delete error:', error);
      throw error; // Melemparkan error agar bisa ditangani di tempat lain
    }
  }
  static async updateClass(id, classname) {
    try {
      const response = await fetch(Endpoint.kelas.update(id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ classname }), // Mengirimkan username dan password
      });
      if (!response.ok) {
        throw new Error('Update failed');
      }
      const data = await response.json();
      console.log('Update successful:', data);
      return data.payload.data; // Mengembalikan data dari payload
    } catch (error) {
      console.error('Update error:', error);
      throw error; // Melemparkan error agar bisa ditangani di tempat lain
    }
  }

  /* subjects */
  static async getSubjects() {
    try {
      const response = await fetch(Endpoint.mataPelajaran.getAll, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch subjects');
      }
      const data = await response.json();
      console.log('Subjects fetched successfully:', data);
      return data.payload.data; // Mengembalikan data dari payload
    } catch (error) {
      console.error('Fetch subjects error:', error);
      throw error; // Melemparkan error agar bisa ditangani di tempat lain
    }
  }
  static async postSubject(subjectname) {
    try {
      const response = await fetch(Endpoint.mataPelajaran.create, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subjectname }), // Mengirimkan username dan password
      });

      if (!response.ok) {
        throw new Error('Post failed');
      }
      const data = await response.json();
      console.log('Post successful:', data);
      return data.payload.data; // Mengembalikan data dari payload
    } catch (error) {
      console.error('Post error:', error);
      throw error; // Melemparkan error agar bisa ditangani di tempat lain
    }
  }
  static async getSubjectById(id) {
    try {
      const response = await fetch(Endpoint.mataPelajaran.getById(id), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch subject');
      }
      const data = await response.json();
      console.log('Subject fetched successfully:', data);
      return data.payload.data; // Mengembalikan data dari payload
    } catch (error) {
      console.error('Fetch subject error:', error);
      throw error; // Melemparkan error agar bisa ditangani di tempat lain
    }
  }
  static async deleteSubject(id) {
    try {
      const response = await fetch(Endpoint.mataPelajaran.delete(id), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Delete failed');
      }
      const data = await response.json();
      console.log('Delete successful:', data);
      return data.payload.data; // Mengembalikan data dari payload
    } catch (error) {
      console.error('Delete error:', error);
      throw error; // Melemparkan error agar bisa ditangani di tempat lain
    }
  }
  static async updateSubject(id, subjectname) {
    try {
      const response = await fetch(Endpoint.mataPelajaran.update(id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subjectname }), // Mengirimkan username dan password
      });
      if (!response.ok) {
        throw new Error('Update failed');
      }
      const data = await response.json();
      console.log('Update successful:', data);
      return data.payload.data; // Mengembalikan data dari payload
    } catch (error) {
      console.error('Update error:', error);
      throw error; // Melemparkan error agar bisa ditangani di tempat lain
    }
  }

  /* transactions */
  static async getTransactions() {
    try {
      const response = await fetch(Endpoint.transaksiKeuangan.getAll, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      const data = await response.json();
      console.log('Transactions fetched successfully:', data);
      return data.payload.data; // Mengembalikan data dari payload
    } catch (error) {
      console.error('Fetch transactions error:', error);
      throw error; // Melemparkan error agar bisa ditangani di tempat lain
    }
  }
  static async postTransaction(studentid, amount, transactiondate) {
    try {
      const response = await fetch(Endpoint.transaksiKeuangan.create, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentid, amount, transactiondate }), // Mengirimkan username dan password
      });
      if (!response.ok) {
        throw new Error('Post failed');
      }
      const data = await response.json();
      console.log('Post successful:', data);
      return data.payload.data; // Mengembalikan data dari payload
    } catch (error) {
      console.error('Post error:', error);
      throw error; // Melemparkan error agar bisa ditangani di tempat lain
    }
  }
  static async getTransactionById(id) {
    try {
      const response = await fetch(Endpoint.transaksiKeuangan.getById(id), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch transaction');
      }
      const data = await response.json();
      console.log('Transaction fetched successfully:', data);
      return data.payload.data; // Mengembalikan data dari payload
    } catch (error) {
      console.error('Fetch transaction error:', error);
      throw error; // Melemparkan error agar bisa ditangani di tempat lain
    }
  }
  static async deleteTransaction(id) {
    try {
      const response = await fetch(Endpoint.transaksiKeuangan.delete(id), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Delete failed');
      }
      const data = await response.json();
      console.log('Delete successful:', data);
      return data.payload.data; // Mengembalikan data dari payload
    } catch (error) {
      console.error('Delete error:', error);
      throw error; // Melemparkan error agar bisa ditangani di tempat lain
    }
  }
  static async updateTransaction(id, studentid, amount, transactiondate) {
    try {
      const response = await fetch(Endpoint.transaksiKeuangan.update(id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentid, amount, transactiondate }), // Mengirimkan username dan password
      });
      if (!response.ok) {
        throw new Error('Update failed');
      }
      const data = await response.json();
      console.log('Update successful:', data);
      return data.payload.data; // Mengembalikan data dari payload
    } catch (error) {
      console.error('Update error:', error);
      throw error; // Melemparkan error agar bisa ditangani di tempat lain
    }
  }

  /* attendances */
  static async getAttendances() {
    try {
      const response = await fetch(Endpoint.kehadiran.getAll, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch attendances');
      }
      const data = await response.json();
      console.log('Attendances fetched successfully:', data);
      return data.payload.data; // Mengembalikan data dari payload
    } catch (error) {
      console.error('Fetch attendances error:', error);
      throw error; // Melemparkan error agar bisa ditangani di tempat lain
    }
  }
  static async postAttendance(studentid, classid, date, status) {
    try {
      const response = await fetch(Endpoint.kehadiran.create, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentid, classid, date, status }),
      });
      console.log('body', JSON.stringify({ studentid, classid, date, status }));
      if (!response.ok) {
        throw new Error('Post failed');
      }
      const data = await response.json();
      console.log('Post successful:', data);
      return data.payload.data; // Mengembalikan data dari payload
    } catch (error) {
      console.error('Post error:', error);
      throw error; // Melemparkan error agar bisa ditangani di tempat lain
    }
  }
  static async getAttendanceById(id) {
    try {
      const response = await fetch(Endpoint.kehadiran.getById(id), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch attendance');
      }
      const data = await response.json();
      console.log('Attendance fetched successfully:', data);
      return data.payload.data.data; // Mengembalikan data dari payload
    } catch (error) {
      console.error('Fetch attendance error:', error);
      throw error; // Melemparkan error agar bisa ditangani di tempat lain
    }
  }
  static async deleteAttendance(id) {
    try {
      const response = await fetch(Endpoint.kehadiran.delete(id), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Delete failed');
      }
      const data = await response.json();
      console.log('Delete successful:', data);
      return data.payload.data.data; // Mengembalikan data dari payload
    } catch (error) {
      console.error('Delete error:', error);
      throw error; // Melemparkan error agar bisa ditangani di tempat lain
    }
  }
  static async updateAttendance(id, studentid, classid, date, status) {
    try {
      const response = await fetch(Endpoint.kehadiran.update(id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentid, classid, date, status }), // Mengirimkan username dan password
      });
      if (!response.ok) {
        throw new Error('Update failed');
      }
      const data = await response.json();
      console.log('Update successful:', data);
      return data.payload.data.data; // Mengembalikan data dari payload
    } catch (error) {
      console.error('Update error:', error);
      throw error; // Melemparkan error agar bisa ditangani di tempat lain
    }
  }
}
