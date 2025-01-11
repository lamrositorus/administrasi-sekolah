import { Endpoint } from "./Enpoint";

export class API_Source {
    /* users */
    static async login(username, password) {
        try {
            const response = await fetch(Endpoint.pengguna.login, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }), // Mengirimkan username dan password
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }
            
            const data = await response.json();
            console.log("Login successful:", data);
            const userId = data.payload.data.userid;
            localStorage.setItem('userId', userId);
            return data.payload.data; // Mengembalikan data dari payload
        } catch (error) {
            console.error("Login error:", error);
            throw error; // Melemparkan error agar bisa ditangani di tempat lain
        }
    }
    static async signup(username, password, role){
        try{
            const response = await fetch(Endpoint.pengguna.create, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password, role }), // Mengirimkan username dan password
            });
            if (!response.ok) {
                throw new Error('Signup failed');
            }
            const data = await response.json();
            console.log("Signup successful:", data);
            return data.payload.data; // Mengembalikan data dari payload
        }
        catch(error){
            console.error("Signup error:", error);
            throw error; // Melemparkan error agar bisa ditangani di tempat lain
        }        
    }
    static async getById(id) {
        try {
            const response = await fetch(Endpoint.pengguna.getById(id), {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            console.log("Data fetched successfully:", data);
            return data.payload.data; // Mengembalikan data dari payload
        }catch(error){
                console.error("Fetch data error:", error);
                throw error; // Melemparkan error agar bisa ditangani di tempat lain
            }
    }
    static async updateProfile(id, username, password, role) {
        try {
            const response = await fetch(Endpoint.pengguna.update(id), {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password, role }), // Mengirimkan username dan password
            });
            if (!response.ok) {
                throw new Error('Update failed');
            }
            const data = await response.json();
            console.log("Update successful:", data);
            return data.payload.data; // Mengembalikan data dari payload
        } catch (error) {
            console.error("Update error:", error);
            throw error; // Melemparkan error agar bisa ditangani di tempat lain
        }
    }
    static async delete(id) {
        try {
            const response = await fetch(Endpoint.pengguna.delete(id), {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            if (!response.ok) {
                throw new Error('Delete failed');
            }
            const data = await response.json();
            console.log("Delete successful:", data);
            return data.payload.data; // Mengembalikan data dari payload
        } catch (error) {
            console.error("Delete error:", error);
            throw error; // Melemparkan error agar bisa ditangani di tempat lain
        }
    }
    
    static async Dashboard() {
        try {
            const response = await fetch(Endpoint.dashboard, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch dashboard data');
            }

            const data = await response.json();
            console.log("Dashboard Data:", data);
            return data.payload.data; // Mengembalikan data dari payload
        } catch (error) {
            console.error("Dashboard fetch error:", error);
            throw error; // Melemparkan error agar bisa ditangani di tempat lain
        }
    }

    /* students */
    static async getStudents() {
        try {
            const response = await fetch(Endpoint.siswa.getAll, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            })
            if (!response.ok) {
                throw new Error('Failed to fetch students');
            }
            const data = await response.json();
            console.log("Students fetched successfully:", data);
            return data.payload.data; // Mengembalikan data dari payload
        } catch (error) {
            console.error("Fetch students error:", error);
            throw error; // Melemparkan error agar bisa ditangani di tempat lain
        }
    }
    static async getStudentById(id) {
        try {
            const response = await fetch(Endpoint.siswa.getById(id), {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            })
            if (!response.ok) {
                throw new Error('Failed to fetch student');
            }
            const data = await response.json();
            console.log("Student fetched successfully:", data);
            return data.payload.data; // Mengembalikan data dari payload
        } catch (error) {
            console.error("Fetch student error:", error);
            throw error; // Melemparkan error agar bisa ditangani di tempat lain
        }
    }
    static async updateStudent(id, name, age, classid) {
        try {
            const response = await fetch(Endpoint.siswa.update(id), {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, age, classid }), // Mengirimkan username dan password
            });
            if (!response.ok) {
                throw new Error('Update failed');
            }
            const data = await response.json();
            console.log("Update successful:", data);
            return data.payload.data; // Mengembalikan data dari payload
        } catch (error) {
            console.error("Update error:", error);
            throw error; // Melemparkan error agar bisa ditangani di tempat lain
        }
    }
            

}