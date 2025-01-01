import { getMedicine } from '../../../service/service';
import styles from './PharmacyPage.module.css';
import { useEffect, useState } from 'react';
import Modal from '../../../components/Modal/Modal';
import MedicineRegisterForm from '../../../components/MedicineRegisterForm/MedicineRegisterForm';
import PharmacyInfoTable from '../../../components/PharmacyInfoTable/PharmacyInfoTable';
import MedicineChangeForm from '../../../components/MedicineChangeForm/MedicineChangeForm';
import { postIntrospection } from '../../../service/service';
import { notification } from 'antd';
import { useAuth } from '../../../components/AuthContext/AuthContext';
import { useNavigate } from 'react-router-dom';
function PharmacyPage() {
    const [data, setData] = useState([]);
    const [selectedMedicine, setSelectedMedicine] = useState({});
    const [show, setShow] = useState(false);
    
    // đóng modal
    const handleClose = () => setShow(false);
    // thay đổi giá trị của input
  
    // call api lấy danh sách thuốc
    useEffect(() => {
        const checkSession = async () => {
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
        const fetchMedicines = async () => {
            try {
                const res = await getMedicine();
                setData(res.data);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách thuốc:', error);
            }
        };
        checkSession();
        fetchMedicines();
    }, []);

    // call api đăng ký thuốc

    // chọn thuốc
    

    // call api cập nhật thuốc
    

    // call api xóa thuốc
    






    return (
        <>
            <div>
                <MedicineRegisterForm data={data} setData={setData}  />
            </div>
            {data.length > 0 ? (
                <PharmacyInfoTable data={data} setSelectedMedicine={setSelectedMedicine} setShow={setShow}/>
            ) : null}
            <Modal show={show} onClose={handleClose}>
               <MedicineChangeForm selectedMedicine={selectedMedicine} setSelectedMedicine={setSelectedMedicine}  data={data} setData={setData} setShow={setShow} />
            </Modal>
        </>
    );
}

export default PharmacyPage;
