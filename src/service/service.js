import axios from "axios";


// Hàm lấy token từ localStorage (hoặc nơi bạn lưu trữ token)
const getAuthToken = () => {
    return localStorage.getItem('token');  // Hoặc từ nơi bạn lưu trữ token
};


export const loginAccount= (username,password)=>{
    return axios.post("/api/token",{
        username:username,
        password:password
    });
}

export const postIntrospection = (token) => {
    return axios.post("/api/introspect", {
        token: token,
        authenticated: true 
    });
}
// Các API request với token trong header


export const findByDate = (date) => {
    return axios.get("/api/patients?date="+date,{
        headers:{
            'Authorization':`Bearer ${getAuthToken()}`
        }
    });
};
export const addPatient = (fullname, sex, address, yearOfBirth) =>{
    return axios.post("/api/patients", {
        fullname: fullname,
        sex: sex, 
        address: address, 
        yearOfBirth: yearOfBirth},{
        headers:{
            'Authorization':`Bearer ${getAuthToken()}`
        }
    })
}
export const deletePatientById = (id) => {
    return axios.delete(`/api/patients/${id}`,
    {
        headers:{
            'Authorization':`Bearer ${getAuthToken()}`
        }
    });
};
export const addExaminationResults = (examinationResults) => {
    return axios.post("/api/examinationResults", examinationResults,{
        headers:{
            'Authorization':`Bearer ${getAuthToken()}`
        }
    });
};



export const getPatients = ()=>{
    return axios.get("/api/patients",{
        headers:{
            'Authorization':`Bearer ${getAuthToken()}`
        }
    });
}
export const getInvoice = (id) =>{
    return axios.get(`api/invoice/${id}`,{
        headers:{
            'Authorization':`Bearer ${getAuthToken()}`
        }
    });
}








export const getExaminationResult = (id) => {
    return axios.get("/api/examinationResults/" + id, {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`  // Thêm token vào header
        }
    });
};

export const getPrescription = (id) => {
    return axios.get("/api/prescriptions/" + id, {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`  // Thêm token vào header
        }
    });
};

export const searchPatients = (id, fullname, date) => {
    return axios.get("/api/patients/search?id=" + id + "&fullname=" + fullname + "&date=" + date, {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`  // Thêm token vào header
        }
    });
};

export const getRevenue = (day) => {
    return axios.get("/api/report/revenue?date=" + day, {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`  // Thêm token vào header
        }
    });
};

export const getSalesMedicine = (month, year) => {
    return axios.get("/api/report/medicine?month=" + month + "&year=" + year, {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`  // Thêm token vào header
        }
    });
};

export const getMedicine = () => {
    return axios.get("/api/medicine", {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`  // Thêm token vào header
        }
    });
};

export const createMedicine = (name, unit, price, use) => {
    return axios.post("/api/medicine", {
        nameOfMedicine: name,
        price: price,
        unit: unit,
        medicineUsage: use
    }, {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`  // Thêm token vào header
        }
    });
};

export const updateMedicine = (id, name, unit, price, use) => {
    return axios.patch("/api/medicine/" + id, {
        nameOfMedicine: name,
        price: price,
        unit: unit,
        medicineUsage: use
    }, {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`  // Thêm token vào header
        }
    });
};

export const deleteMedicine = (id) => {
    return axios.delete("/api/medicine/" + id, {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`  // Thêm token vào header
        }
    });
};

export const getDisease = () => {
    return axios.get("/api/disease", {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`  // Thêm token vào header
        }
    });
};

export const createDisease = (name) => {
    return axios.post("/api/disease", {
        name: name
    }, {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`  // Thêm token vào header
        }
    });
};

export const updateDisease = (id, name) => {
    return axios.patch("/api/disease/" + id, {
        name: name
    }, {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`  // Thêm token vào header
        }
    });
};

export const deleteDisease = (id) => {
    return axios.delete("/api/disease/" + id, {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`  // Thêm token vào header
        }
    });
};

export const getConfigration = () => {
    return axios.get("/api/configuration", {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`  // Thêm token vào header
        }
    });
};

export const updateConfigration = (maxPatient, price) => {
    return axios.put("/api/configuration", {
        maxPatient: maxPatient,
        examinationPrice: price
    }, {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`  // Thêm token vào header
        }
    });
};
