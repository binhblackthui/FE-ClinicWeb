import axios from "axios";
export const createPatient = (id, name, sex, address, yearOfBirth,date)=> {
    return axios.post("/api/patient",{id, name, sex, address,yearOfBirth,date})
}
export const findByDate = (date) => {
    return axios.get("/api/patients", {
        params: {
            date: date, // Gửi date dưới dạng query parameter
        },
    });
};
export const addPatient = (fullname, sex, address, yearOfBirth) =>{
    return axios.post("/api/patients", {fullname, sex, address, yearOfBirth})
}
export const deletePatientById = (id) => {
    return axios.delete(`/api/patients/${id}`);
};
export const addExaminationResults = (examinationResults) => {
    return axios.post("/api/examinationResults", examinationResults);
};
export const findAll =() =>{
    return axios.get("/api/medicine")
}
export const getExaminationResult = (id) => {
    return axios.get(`/api/examinationResults/${id}`);
};
export const getPrescription = (id) => {
    return axios.get(`/prescriptions/${id}`); // Sử dụng baseURL đã cấu hình
  };
export const getPatients = ()=>{
    return axios.get("/api/patients");
}
export const getInvoice = (id) =>{
    return axios.get(`api/invoice/${id}`);
}

export const searchPatients=(id,fullname,date)=>{
    return axios.get("/api/patients/search?id="+id+"&fullname="+fullname+"&date="+date)
}