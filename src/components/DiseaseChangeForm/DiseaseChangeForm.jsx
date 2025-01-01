import { useState } from 'react';
import { notification } from 'antd';
import { updateDisease, deleteDisease } from '../../service/service';
import styles from './DiseaseChangeForm.module.css';
import { useAuth } from '../AuthContext/AuthContext';
import { postIntrospection } from '../../service/service';
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
    const { logout } = useAuth();
    const handleBlur = (e) => {
        console.log(data.some(disease => disease.name.toLowerCase() === e.target.value.toLowerCase()));
        if (e.target.value === '') {
            setError('Vui lòng nhập tên bệnh!');
        }else if(data.some(disease => disease.name.toLowerCase() === e.target.value.toLowerCase())){
            setError('Tên bệnh đã tồn tại!');
        }
        else {
            setError('');
        }
    };
    const handleUpdate = async () => {
        if (error) {
            return;
        }
  
        try{
            const valid = await postIntrospection();
            if (!valid.data.valid) {
                logout();
                notification.error({
                    message: 'Phiên làm việc hết hạn',
                    description: 'Vui lòng đăng nhập lại',
                });
            }
        }catch(error){
            logout();
            notification.error({
                message: 'Lỗi hệ thống',
                description: 'Vui lòng thử lại sau',
            });
            console.error(error);
        }

        try {
            await updateDisease(selectedDisease.id, selectedDisease.name);
            const index = data.findIndex(
                (item) => item.id === selectedDisease.id
            );
            data[index] = selectedDisease;
            setData([...data]);
            notification.success({
                message: 'Cập nhật thành công',
                description: 'Thông tin bệnh đã được cập nhật',
            });
        } catch (error) {
            notification.error({
                message: 'Cập nhật thất bại',
                description: 'Vui lòng thử lại sau',
            });
            console.log(error);
        }
    };
    const handleDelete = async () => {
        try{
            const valid = await postIntrospection();
            if (!valid.data.valid) {
                logout();
                notification.error({
                    message: 'Phiên làm việc hết hạn',
                    description: 'Vui lòng đăng nhập lại',
                });
            }
        }
        catch(error){
            logout();
            notification.error({
                message: 'Lỗi hệ thống',
                description: 'Vui lòng thử lại sau',
            });
            console.error(error);
        }
        try {
            await deleteDisease(selectedDisease.id);
            const index = data.findIndex(
                (item) => item.id === selectedDisease.id
            );
            data.splice(index, 1);
            setData([...data]);
            setSelectedDisease({});
            setShow(false);
            notification.success({
                message: 'Xóa thành công',
                description: 'Bệnh đã được xóa',
            });
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
