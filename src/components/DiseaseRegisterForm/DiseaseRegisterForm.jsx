import { useState } from 'react';
import { notification } from 'antd';
import styles from './DiseaseRegisterForm.module.css';
import { createDisease } from '../../service/service';
import { postIntrospection } from '../../service/service';
import { useAuth } from '../AuthContext/AuthContext';
function DiseaseRegisterForm({ data, setData }) {
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const handleChange = (e) => {
        if (e.target.value) {
            setError('');
        }
        setName(e.target.value);
    };
    const { logout } = useAuth();
    const handleBlur = (e) => {
        if (!e.target.value) {
            setError('Vui lòng nhập tên bệnh!');
        } else if (
            data.some(
                (disease) =>
                    disease.name.toLowerCase() === e.target.value.toLowerCase()
            )
        ) {
            setError('Tên bệnh đã tồn tại!');
        } else {
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
        try {
            const valid = await postIntrospection();
            if (!valid.data.valid) {
                logout();
                notification.error({
                    message: 'Phiên làm việc hết hạn',
                    description: 'Vui lòng đăng nhập lại',
                });
            }
        } catch (error) {
            logout();
            notification.error({
                message: 'Lỗi hệ thống',
                description: 'Vui lòng thử lại sau',
            });
            console.error(error);
        }
        try {
            const response = await createDisease(name);
            if (response.status === 200) {
                setData([...data, response.data]);
                setName('');
                notification.success({
                    message: 'Đăng kí bệnh thành công',
                    description: 'Bệnh đã được thêm vào danh sách',
                });
            }
        } catch (error) {
            console.log(error);
            notification.error({
                message: 'Đăng kí bệnh thất bại',
                description: 'Vui lòng thử lại sau',
            });
        }
    };
    return (
        <>
            <div className={styles.registerContainer}>
                <h1 className={styles.header}>ĐĂNG KÍ BỆNH</h1>
                <div className={styles.dataForm}>
                    <div className={styles.inputForm}>
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
                    <button onClick={handleRegister} className={styles.button}>
                        Đăng ký
                    </button>
                </div>
            </div>
        </>
    );
}

export default DiseaseRegisterForm;
