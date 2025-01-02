import { useState } from 'react';
import { notification } from 'antd';
import styles from './MedicineChangeForm.module.css';
import {
    formatCurrency,
    parseCurrency,
    upperFirstLetter,
} from '../../helper/stringUtils';
import { updateMedicine, deleteMedicine } from '../../service/service';
import { postIntrospection } from '../../service/service';
import { useAuth } from '../AuthContext/AuthContext';

function MedicineChangeForm({
    selectedMedicine,
    setSelectedMedicine,
    data,
    setData,
    setShow,
}) {
    const [error, setError] = useState({
        nameOfMedicine: '',
        price: '',
        medicineUsage: '',
    });
    const { logout } = useAuth();
    const validateMedicine = (name) => {
        if (name === 'nameOfMedicine') return 'Vui lòng nhập tên thuốc!';
        if (name === 'price') return 'Vui lòng nhập giá hợp lệ!';
        if (name === 'medicineUsage') return 'Vui lòng nhập cách dùng!';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (
            !value ||
            (name === 'price' &&
                (isNaN(parseCurrency(value)) || parseCurrency(value) < 1000))
        ) {
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
        if (name === 'price') {
            setSelectedMedicine({
                ...selectedMedicine,
                [name]: parseCurrency(value),
            });
        } else {
            setSelectedMedicine({ ...selectedMedicine, [name]: value });
        }
    };
    const handleUpdate = async () => {
        if (Object.values(error).some((err) => err !== '')) {
            return;
        }
        if (
            data.some(
                (med) =>
                    med.nameOfMedicine.toLowerCase() ===
                    selectedMedicine.nameOfMedicine.toLowerCase()
            )
        ) {
            setError({ ...error, nameOfMedicine: 'Tên thuốc đã tồn tại!' });
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
            const res = await updateMedicine(
                selectedMedicine.idMedicine,
                upperFirstLetter(selectedMedicine.nameOfMedicine),
                selectedMedicine.unit,
                selectedMedicine.price,
                selectedMedicine.medicineUsage
            );
            if (res.status === 200) {
                notification.success({
                    message: 'Cập nhật thành công',
                    description: 'Thông tin thuốc đã được cập nhật',
                });
                const index = data.findIndex(
                    (item) => item.idMedicine === selectedMedicine.idMedicine
                );
                data[index] = selectedMedicine;
                setData([...data]);
            } else {
                notification.error({
                    message: 'Cập nhật thất bại',
                    description: 'Vui lòng thử lại sau',
                });
            }
        } catch (error) {
            alert('Cập nhật thất bại');
            console.log(error);
        }
    };
    const handleDelete = async () => {
        try {
            const res = await deleteMedicine(selectedMedicine.idMedicine);
            if (res.status === 200) {
                notification.success({
                    message: 'Xóa thành công',
                    description: 'Thông tin thuốc đã được xóa',
                });
                const index = data.findIndex(
                    (item) => item.idMedicine === selectedMedicine.idMedicine
                );
                data.splice(index, 1);
                setData([...data]);
                setShow(false);
            } else {
                alert('Xóa thất bại');
            }
        } catch (error) {
            notification.error({
                message: 'Xóa thất bại',
                description: 'Vui lòng thử lại sau',
            });
            console.log(error);
        }
    };
    return (
        <div className={styles.changeContainer}>
            <h1 className={styles.header}>THÔNG TIN THUỐC</h1>
            <div className={styles.form}>
                <div className={styles.inputForm}>
                    <label htmlFor='name'>Tên thuốc</label>
                    <input
                        type='text'
                        id='name'
                        name='nameOfMedicine'
                        value={selectedMedicine.nameOfMedicine}
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
                        value={selectedMedicine.unit}
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
                        value={formatCurrency(selectedMedicine.price || 0)}
                        onChange={handleChange}
                        placeholder='Vd: 10000'
                        className={styles.inputField}
                    />
                    <span className={styles.error}>{error.price}</span>
                </div>

                <div className={styles.inputForm}>
                    <label htmlFor='Use'>Cách dùng</label>
                    
                    <select name='medicineUsage' id='Use'
                        value={selectedMedicine.medicineUsage}
                        onChange={handleChange} className={styles.inputField}
                    >
                        <option value='Cách dùng 1'>Cách dùng 1</option>
                        <option value='Cách dùng 2'>Cách dùng 2</option>
                        <option value='Cách dùng 3'>Cách dùng 3</option>
                        <option value='Cách dùng 4'>Cách dùng 4</option>
                    </select>
                    <span className={styles.error}>{error.medicineUsage}</span>
                </div>
                <div className={styles.button}>
                    <button onClick={handleUpdate}>Lưu</button>
                    <button onClick={handleDelete}>Xóa</button>
                </div>
            </div>
        </div>
    );
}
export default MedicineChangeForm;
