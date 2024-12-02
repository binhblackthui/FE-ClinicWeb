import axios from "axios";
export const createPatient = (id, name, sex, address, yearOfBirth,date)=> {
    return axios.post("/api/patient",{id, name, sex, address,yearOfBirth,date})

}
export const getPatients = ()=>{
    return axios.get("/api/patients");
}

export const getExaminationResult = (id) => {
    return axios.get("/api/examinationResults/"+id)
}
export const getPrescription = (id) => {
    return axios.get("/api/prescriptions/"+id)
}
export const searchPatients=(id,fullname,date)=>{
    return axios.get("/api/patients/search?id="+id+"&fullname="+fullname+"&date="+date)
}
export const getRevenue = (day) => {
    return axios.get("/api/report/revenue?date="+day)
}