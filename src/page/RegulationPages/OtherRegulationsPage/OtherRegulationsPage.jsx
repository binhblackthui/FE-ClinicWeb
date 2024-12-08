import { useEffect, useState } from 'react';
import styles from './OtherRegulationsPage.module.css';
import { getConfigration, updateConfigration } from '../../../service/service';
import { parseCurrency,formatCurrency, isInt} from '../../../helper/stringUtils';
function OtherRegulationsPage() {
    const [config, setConfig] = useState({
         maxPatient: '',
            examinationPrice: '',
    });
    const [error, setError] = useState({
        maxPatient: '',
        examinationPrice: '',
    });
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getConfigration();
                setConfig(response.data);
            } catch (error) {
                console.log(error);
            }
        };
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
        console.log(config);
        try {
            await updateConfigration(
                config.maxPatient,
                config.examinationPrice
            );
            alert('Cập nhật thành công!');
        } catch (error) {
            alert('Cập nhật thất bại!');
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
                    <button onClick={handleUpdate}>Cập nhật</button>
                </div>
            </div>
        </div>
    );
}

export default OtherRegulationsPage;
