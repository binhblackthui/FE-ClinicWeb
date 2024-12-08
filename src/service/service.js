import axios from "axios";
export const getExaminationResult = (id) => {
    return axios.get("/api/examinationResults/"+id)
};
export const getPrescription = (id) => {
    return axios.get("/api/prescriptions/"+id)
};
export const searchPatients=(id,fullname,date)=>{
    return axios.get("/api/patients/search?id="+id+"&fullname="+fullname+"&date="+date)
};
export const getRevenue = (day) => {
    return axios.get("/api/report/revenue?date="+day)
};
export const getSalesMedicine = (month,year) => {
    return axios.get("/api/report/medicine?month="+month+"&year="+year)
};
export const getMedicine = () => { 
    return axios.get("/api/medicine");
};
export const createMedicine = (name, unit, price, use) => {  
    return axios.post("/api/medicine", {
        nameOfMedicine: name,
        price: price,
        unit: unit,
        medicineUsage: use
    });
};

export const updateMedicine = (id, name, unit, price, use) => {
    return axios.patch("/api/medicine/"+id, {
        nameOfMedicine: name,
        price: price,
        unit: unit,
        medicineUsage: use
    });
};
export const deleteMedicine = (id) => {
    return axios.delete("/api/medicine/"+id);
}

export const getDisease = () => {
    return axios.get("/api/disease");
};

export const createDisease = (name) => {
    return axios.post("/api/disease", {
        name: name
    });
}

export const updateDisease = (id, name) => {
    return axios.patch("/api/disease/"+id, {
        name: name
    });
}

export const deleteDisease = (id) => {
    console.log(id);
    return axios.delete("/api/disease/"+id);
}   

export const getConfigration = () => {
    return axios.get("/api/configuration");
};
export const updateConfigration = (maxPatient,price) => {
    return axios.put("/api/configuration", {
        maxPatient: maxPatient,
        examinationPrice: price
    });
}
