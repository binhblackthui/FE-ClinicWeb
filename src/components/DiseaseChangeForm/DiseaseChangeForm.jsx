import { useState } from 'react';
import { updateDisease, deleteDisease } from '../../service/service';
import styles from './DiseaseChangeForm.module.css';

function DiseaseChangeForm({
    selectedDisease,
    setSelectedDisease,
    setShow,
    data,
    setData,
}) {
    const [error, setError] = useState('');
    const handleChange = (e) => {
        setSelectedDisease({
            ...selectedDisease,
            [e.target.name]: e.target.value,
        });
    };
    const handleBlur = async (e) => {
        if (e.target.value === '') {
            setError('Vui lòng nhập tên bệnh!');
        } else {
            setError('');
        }
    };
    const handleUpdate = async () => {
        if (selectedDisease.name === '') {
            setError('Vui lòng nhập tên bệnh!');
            return;
        }
        try {
            await updateDisease(selectedDisease.id, selectedDisease.name);
            const index = data.findIndex(
                (item) => item.id === selectedDisease.id
            );
            data[index] = selectedDisease;
            setData([...data]);
            alert('Cập nhật thành công!');
        } catch (error) {
            alert('Cập nhật thất bại!');
            console.log(error);
        }
    };
    const handleDelete = async () => {
        try {
            await deleteDisease(selectedDisease.id);
            const index = data.findIndex(
                (item) => item.id === selectedDisease.id
            );
            data.splice(index, 1);
            setData([...data]);
            setSelectedDisease({});
            setShow(false);
            alert('Xóa thành công!');
        } catch (error) {
            alert('Xóa thất bại!');
            console.log(error);
        }
    };
    return (
        <div className={styles.changeContainer}>
            <div className={styles.dataForm}>
                <div className={styles.inputForm}>
                    <label htmlFor='name'>Tên bệnh</label>
                    <input
                        type='text'
                        id='name'
                        name='name'
                        value={selectedDisease.name}
                        onChange={(e) => handleChange(e)}
                        onBlur={(e) => handleBlur(e)}
                        className={styles.inputField}
                    />
                    <span className={styles.error}>{error}</span>
                </div>
                <div className={styles.button}>
                    <button onClick={handleUpdate}>Lưu</button>
                    <button onClick={handleDelete}>Xóa</button>
                </div>
            </div>
        </div>
    );
}

export default DiseaseChangeForm;
