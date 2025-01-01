import React, { useState, useEffect } from 'react';
import styles from './MedicalExaminationPage.module.css';
import { findByDate, addPatient, deletePatientById } from '../../service/service';
import { useNavigate } from 'react-router-dom';
const MedicalExaminationPage = () => {
    const [data_table, setDataTable] = useState([]);
    const [formData, setFormData] = useState({
        fullname: '',
        yearOfBirth: 0,
        address: '',
        sex: '',    
    });
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const standard_today = `${year}-${month}-${day}`;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'yearOfBirth' ? parseInt(value, 10) || '' : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Gửi dữ liệu lên server
            const response = await addPatient(
                formData.fullname,
                formData.sex,
                formData.address,
                formData.yearOfBirth
            );
            console.log('Phản hồi từ server:', response.data);
    
            // Cập nhật danh sách bệnh nhân
            const updatedData = await findByDate(standard_today);
            setDataTable(updatedData.data);
    
            // Reset form
            setFormData({
                fullname: '',
                yearOfBirth: 0,
                address: '',
                sex: '',
            });
        } catch (error) {
            console.error('Lỗi khi thêm bệnh nhân:', error);
        }
    };
    

   
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await findByDate(standard_today);
                if (Array.isArray(response.data)) {
                    setDataTable(response.data);
                } else {
                    console.error('Dữ liệu trả về không phải là mảng');
                }
            } catch (error) {
                console.error('Lỗi khi gọi API:', error.response?.data || error.message);
            }
        };
        fetchData();
    }, [standard_today]);
    const [selectedRows, setSelectedRows] = useState(null); // Dòng được chọn
    const navigate = useNavigate(); // Sử dụng useNavigate

    const handleDelete = async (id) =>{
        try{
            await deletePatientById(id)
            setDataTable((data_table) => data_table.filter((patient) => patient.id !== id));
        }catch(error){
            console.error('Lỗi khi xóa:',error)
        }
    }
    const handleProfileCreation = () => {
        if (!selectedRows) {
            alert('Vui lòng chọn một bệnh nhân trước khi lập hồ sơ!');
            return;
        }
        navigate('/make', { state: selectedRows });  // Truyền thông tin bệnh nhân qua state
    };
    const handlePay = () =>{
        if(!selectedRows){
            alert('Vui lòng chọn một bệnh nhân trước khi thanh toán');
            return;
        }
        navigate('/pay', {state: selectedRows});
    }
    return (
        <div className={styles.container_make}>
            <h2 className={styles.header}>Thêm bệnh nhân</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="fullname" className={styles.dataField_make}>Họ và tên: </label>
                    <input className={styles.input_make}
                        type="text"
                        id="fullname"
                        name="fullname"
                        value={formData.fullname}
                        onChange={handleChange}
                        placeholder="Họ và tên"
                    />
                </div>
                <div>
                    <label htmlFor="yearOfBirth" className={styles.dataField_make}>Năm sinh: </label>
                    <input className={styles.input_make}
                        type="number"
                        id="yearOfBirth"
                        name="yearOfBirth"
                        value={formData.yearOfBirth}
                        onChange={handleChange}
                        placeholder="Năm sinh"
                    />
                </div>
                <div>
                    <label htmlFor="address" className={styles.dataField_make}>Địa chỉ: </label>
                    <input className={styles.input_make}
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Địa chỉ"
                    />
                </div>
                <div>
                    <label className = {styles.dataField_make} >Giới tính:</label>
                    <label>
                        <input
                            className={styles.input_sex}
                            type="radio"
                            name="sex"
                            value="Nam"
                            checked={formData.sex === 'Nam'}
                            onChange={handleChange}
                        />
                        Nam
                    </label>
                    <label>
                        <input
                            className={styles.input_sex}
                            type="radio"
                            name="sex"
                            value="Nữ"
                            checked={formData.sex === 'Nữ'}
                            onChange={handleChange}
                        />
                        Nữ
                    </label>
                </div>
                <button className={styles.button_make} type="submit">Thêm bệnh nhân</button>
            </form>

            <h1 className={styles.header}>Danh sách bệnh nhân</h1>
            <table className = {styles.table_make} border="1" style={{width: "100%"}}>
                <colgroup>
                <col style = {{width: "5%"}}/>
                <col style = {{width: "25%"}}/>
                <col style = {{width: "5%"}}/>
                <col style = {{width: "10%"}}/>
                <col style = {{width: "40%"}}/>
                <col style = {{width: "5%"}}/>
                </colgroup>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Họ và tên</th>
                        <th>Giới tính</th>
                        <th>Năm sinh</th>
                        <th>Địa chỉ</th>
                        <th>Xóa</th>
                    </tr>
                </thead>
                <tbody>
                    {data_table.length > 0 ? (
                        data_table.map((patient) => (
                            <tr
                                key={patient.id}
                                onClick={() => setSelectedRows(patient)}
                                style={{
                                    backgroundColor: selectedRows?.id === patient.id ? "#00FFFF" : "",
                                    cursor: "pointer",
                                }}
                            >
                                <td>{patient.id}</td>
                                <td>{patient.fullname}</td>
                                <td>{patient.sex}</td>
                                <td>{patient.yearOfBirth}</td>
                                <td>{patient.address}</td>
                                <td>
                                    <button onClick={() => handleDelete(patient.id)}>Xóa</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" style={{ textAlign: 'center' }}>
                                Không có dữ liệu bệnh nhân.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div style={{display: 'flex', gap: '20px'}}>
            <button className= {styles.button_make} onClick={handleProfileCreation} style={{ marginTop: "20px" }}>
                Lập Hồ Sơ
            </button>
            </div>

        </div>
    );
};

export default MedicalExaminationPage;
