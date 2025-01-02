import { useEffect, useState } from 'react';
import { notification } from 'antd';
import styles from './OtherRegulationsPage.module.css';
import { getConfigration, updateConfigration, findByDate } from '../../../service/service';
import { parseCurrency,formatCurrency, isInt} from '../../../helper/stringUtils';
import { postIntrospection } from '../../../service/service';
import { useAuth } from '../../../components/AuthContext/AuthContext';

function OtherRegulationsPage() {
    const [config, setConfig] = useState({
         maxPatient: '',
            examinationPrice: '',
    });
    const [error, setError] = useState({
        maxPatient: '',
        examinationPrice: '',
    });
    const { logout } = useAuth();
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const standard_today = `${year}-${month}-${day}`;
    const [quantityPatient, setQuantityPatient] = useState(0);

    useEffect(() => {
        const checkSession = async () => {
            console.log('check session');
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
        };
        const fetchData = async () => {
            try {
                const response = await getConfigration();
                const patients = await findByDate(standard_today);
                setQuantityPatient(patients.data.length);
                setConfig(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        checkSession();
        fetchData();
    }, []);
    const validateConfig = (name) => {
        if (name === 'maxPatient') return 'Vui lòng nhập số bệnh nhân!';
        if (name === 'examinationPrice') return 'Vui lòng nhập giá khám!';
    };
   
    const handleChange = (e) => {
        if(e.target.name ==='maxPatient'&&(!isInt(e.target.value )||e.target.value<=0))
        {
            setError({...error, [e.target.name]: validateConfig(e.target.name) });
        }
        else{
            setError({...error, [e.target.name]: '' });
        }
        setConfig({
            ...config,
            [e.target.name]: e.target.name ==='examinationPrice'?  parseCurrency(e.target.value||0):e.target.value
        });
    };
    const handleBlur = (e) => {
        console.log(e.target.value);
        if (e.target.value === ''||isNaN(parseCurrency(e.target.value))||parseCurrency(e.target.value)<=0) {
            setError({...error, [e.target.name]: validateConfig(e.target.name) });
        } else {
            setError({...error, [e.target.name]: '' });
        }
    };
    const handleUpdate = async () => {
        if (error.maxPatient !== '' || error.examinationPrice !== '') {
            return;
        }
        if((config.maxPatient<quantityPatient))
        {
            notification.error({
                message: 'Cập nhật thất bại',
                description: 'Số bệnh nhân tối đa phải lớn hơn số bệnh nhân hiện tại',
            });
            return;
        }
        console.log(config);
        try {
            await updateConfigration(
                config.maxPatient,
                config.examinationPrice
            );
            notification.success({
                message: 'Cập nhật thành công',
                description: 'Các quy định đã được cập nhật',
            });
        } catch (error) {
            notification.error({
                message: 'Cập nhật thất bại',
                description: 'Vui lòng thử lại sau',
            });
            console.log(error);
        }
    };
    return (
        <div className={styles.Body}>
            <div className={styles.container}>
                <h1 className={styles.header}>QUY ĐỊNH KHÁC</h1>
                <div className={styles.dataForm}>
                    <div className={styles.inputForm}>
                        <label htmlFor='maxPatient'>Số bệnh nhân tối đa</label>
                        <input
                            type='text'
                            id='maxPatient'
                            name='maxPatient'
                            value={config.maxPatient}
                            onChange={(e) => handleChange(e)}
                            onBlur={(e) => handleBlur(e)}
                            className={styles.inputField}
                        />
                        <span className={styles.error}>{error.maxPatient}</span>
                    </div>
                    <div className={styles.inputForm}>
                        <label>Giá khám</label>
                        <input
                            type='text'
                            id='examinationPrice'
                            name='examinationPrice'
                            value={formatCurrency(config.examinationPrice || 0)}
                            onChange={(e) => handleChange(e)}
                            onBlur={(e) => handleBlur(e)}
                            className={styles.inputField}
                        />
                        <span className={styles.error}>
                            {error.examinationPrice}
                        </span>
                    </div>
                    <button onClick={handleUpdate} className={styles.button}>Cập nhật</button>
                </div>
            </div>
        </div>
    );
}

export default OtherRegulationsPage;
