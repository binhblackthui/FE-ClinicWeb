    import React ,{useState} from 'react';
    import styles from './MedicalExaminationPage.module.css';
    import { addPatient } from '../../service/service';

    const FormExamble = () =>{
        const [formData, setFormData] = useState({
            fullname: '',
            YearOfBirth: 0,
            Location: '',
            Sex: '',
        });
        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData({
                ...formData,
                [name]: name === 'YearOfBirth' ? parseInt(value, 10) || '' : value
            });
        };
        const handleSubmit = async (e) => {
            e.preventDefault();
            console.log(formData)
            console.log('Dữ liệu gửi:', formData); // Log dữ liệu
            console.log('Kiểu dữ liệu YearOfBirth:', typeof formData.YearOfBirth);
            try {
                await addPatient(
                    formData.fullname,
                    formData.Sex,
                    formData.Location,
                    formData.YearOfBirth
                );
        
            } catch (error) {
                console.error('Error searching patients:', error);
            }
        };


        
        return (
            <div>
                <h2>Thêm bệnh nhân</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                    <label htmlFor="fullname" className={styles.dataField}>Họ và tên:  </label>
                    <input type="text" id="fullname" name='fullname' onChange={handleChange} value={formData.fullname} placeholder="Họ và tên" ></input>
                    </div>
                    <div>
                    <label htmlFor= 'YearOfBirth' className={styles.dataField}> Năm sinh: </label>
                    <input type = 'number' id = 'YearOfBirth' name ='YearOfBirth' onChange={handleChange} value={formData.YearOfBirth} placeholder='Năm sinh'></input>
                    </div>
                    <div>
                    <label htmlFor= 'Location' className={styles.dataField} >Địa chỉ: </label>
                    <input type = 'text' id = 'Location' name='Location' onChange={handleChange} value={formData.Location} placeholder='Địa chỉ'></input>
                    </div>
                    
                    <div>
                    <label>Giới tính:</label>
                    <label>
                    <input 
                        className={styles.input_sex}
                        type="radio"
                        name="Sex"
                        value="Nam"
                        checked={formData.Sex === 'Nam'}
                        onChange={handleChange}
                    />
                    Nam
                    </label>
                    <label>
                    <input
                        className={styles.input_sex}
                        type="radio"
                        name="Sex"
                        value="Nữ"
                        checked={formData.Sex === 'Nữ'}
                        onChange={handleChange}
                    />
                    Nữ
                    </label>
                    </div>
                    <button type ="submit"> Thêm </button>
                </form>
            </div>
        )
    };

    export default FormExamble;
