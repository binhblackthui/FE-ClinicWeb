import styles from './MedicineRegisterForm.module.css';
import { useState } from 'react';
import { createMedicine } from '../../service/service';
import { formatCurrency, parseCurrency,upperFirstLetter, isInt} from '../../helper/stringUtils';

function MedicineRegisterForm({ data, setData }) {
    const [medicine, setMedicine] = useState({
        nameOfMedicine: '',
        unit: 'Viên',
        price: '0',
        medicineUsage: '',
    });
    const [error, setError] = useState({
        nameOfMedicine: '',
        price: '',
        medicineUsage: '',
    });
    const validateMedicine = (name) => {
        if (name === 'nameOfMedicine') return 'Vui lòng nhập tên thuốc!';
        if (name === 'price') return 'Vui lòng nhập giá hợp lệ!';
        if (name === 'medicineUsage') return 'Vui lòng nhập cách dùng!';
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (!value || (name === 'price' && isNaN(parseCurrency(value)))) {
            setError({
                ...error,
                [name]: validateMedicine(name),
            });
        } else {
            setError({
                ...error,
                [name]: '',
            });
        }
        setMedicine({
            ...medicine,
            [name]: name === 'price' ? parseCurrency(value || 0) : value,
        });
    };
    
    const handleRegister = async () => {
        const errors = {};
        if (!medicine.nameOfMedicine) {
            errors.nameOfMedicine = validateMedicine('nameOfMedicine');
        }
        if (isNaN(medicine.price)) {
            errors.price = validateMedicine('price');
        }
        if (!medicine.medicineUsage) {
            errors.medicineUsage = validateMedicine('medicineUsage');
        }
        setError(errors);
        if (Object.values(errors).some(err => err !== '')) {
            return;
        }

        try {
            const res = await createMedicine(
                upperFirstLetter(medicine.nameOfMedicine),
                medicine.unit,
                medicine.price,
                medicine.medicineUsage
            );

            if (res.status === 200) {
                alert('Đăng ký thành công');
                setData([...data, res.data]);
            } else {
                alert('Đăng ký thất bại');
            }
            setMedicine({
                nameOfMedicine: '',
                unit: 'Viên',
                price: '',
                medicineUsage: '',
            });
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className={styles.registerContainer}>
            <h1 className={styles.header}>ĐĂNG KÍ THUỐC</h1>
            <div className={styles.form}>
                <div className={styles.inputForm}>
                    <label htmlFor='name'>Tên thuốc</label>
                    <input
                        type='text'
                        id='name'
                        name='nameOfMedicine'
                        value={medicine.nameOfMedicine}
                        onChange={handleChange}
                        placeholder='Vd: Paracetamol'
                        className={styles.inputField}
                    />
                    <span className={styles.error}>{error.nameOfMedicine}</span>
                </div>
                <div className={styles.inputForm}>
                    <label htmlFor='unit'>Đơn vị</label>
                    <select
                        name='unit'
                        id='unit'
                        className={styles.inputField}
                        value={medicine.unit}
                        onChange={handleChange}
                    >
                        <option value='viên'>Viên</option>
                        <option value='chai'>Chai</option>
                    </select>
                </div>
                <div className={styles.inputForm}>
                    <label htmlFor='price'>Giá</label>
                    <input
                        type='text'
                        id='price'
                        name='price'
                        value={formatCurrency(parseInt(medicine.price) || 0)}
                        onChange={handleChange}
                        placeholder='Vd: 10000'
                        className={styles.inputField}
                    />
                    <span className={styles.error}>{error.price}</span>
                </div>

                <div className={styles.inputForm}>
                    <label htmlFor='Use'>Cách dùng</label>
                    <input
                        type='text'
                        id='Use'
                        name='medicineUsage'
                        value={medicine.medicineUsage}
                        onChange={handleChange}
                        placeholder='Vd: 1 viên/ ngày'
                        className={styles.inputField}
                    />
                    <span className={styles.error}>{error.medicineUsage}</span>
                </div>
                <button onClick={handleRegister}>Đăng ký</button>
            </div>
        </div>
    );
}

export default MedicineRegisterForm;
