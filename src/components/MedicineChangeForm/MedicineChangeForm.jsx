import { useState } from 'react';
import styles from './MedicineChangeForm.module.css';
import { formatCurrency, parseCurrency,upperFirstLetter } from '../../helper/stringUtils';
import { updateMedicine, deleteMedicine} from '../../service/service';
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
        const errors = {};
        if (!selectedMedicine.nameOfMedicine) {
            errors.nameOfMedicine = validateMedicine('nameOfMedicine');
        }
        if (isNaN(selectedMedicine.price)) {
            errors.price = validateMedicine('price');
        }
        if (!selectedMedicine.medicineUsage) {
            errors.medicineUsage = validateMedicine('medicineUsage');
        }
        setError(errors);
        if (Object.values(errors).some(err => err !== '')) {
            return;
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
                alert('Cập nhật thành công');
                const index = data.findIndex(
                    (item) => item.idMedicine === selectedMedicine.idMedicine
                );
                data[index] = selectedMedicine;
                setData([...data]);
            } else {
                alert('Cập nhật thất bại');
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
                alert('Xóa thành công');
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
            alert('Xóa thất bại');
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
                    <input
                        type='text'
                        id='Use'
                        name='medicineUsage'
                        value={selectedMedicine.medicineUsage}
                        onChange={handleChange}
                        placeholder='Vd: 1 viên/ ngày'
                        className={styles.inputField}
                    />
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
