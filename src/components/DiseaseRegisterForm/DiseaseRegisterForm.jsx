import { useState } from 'react';
import styles from './DiseaseRegisterForm.module.css';
import { createDisease } from '../../service/service';
function DiseaseRegisterForm({data, setData}) {
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const handleChange = (e) => {
        if(e.target.value)
        {
            setError('');
        }
        setName(e.target.value);
    };
    const handleBlur = (e) => {
        if (!e.target.value) {
            setError('Vui lòng nhập tên bệnh!');
        }
        else if(data.some(disease => disease.name.toLowerCase() === e.target.value.toLowerCase())){
            setError('Tên bệnh đã tồn tại!');
        }
         else {
            setError('');
        }
    };
    const handleRegister = async () => {
        if (error) {
            return;
        }
        if (!name) {
            setError('Vui lòng nhập tên bệnh!');
            return;
        }
        try{
            const response = await createDisease(name);
            if(response.status === 200){
                setData([...data, response.data]);
                setName('');
                alert('Đăng kí bệnh thành công');
            }
        }
        catch(error)
        {
            console.log(error);
            alert('Đăng kí bệnh thất bại');
        }   
    }
    return (
        <>
            <div className={styles.registerContainer}>
                <h1 className={styles.header}>ĐĂNG KÍ BỆNH</h1>
                <div className={styles.dataForm}>
                    <div className= {styles.inputForm}>
                        <label>Tên bệnh</label>
                        <input
                            type='text'
                            id='name'
                            name='name'
                            value={name}
                            onChange={(e) => handleChange(e)}
                            onBlur={(e) => handleBlur(e)}
                            className={styles.inputField}
                        />
                        <span className={styles.error}>{error}</span>
                    </div>
                    <button onClick={handleRegister} className={styles.button}>Đăng ký</button>
                </div>
            </div>
        </>
    );
}

export default DiseaseRegisterForm;
