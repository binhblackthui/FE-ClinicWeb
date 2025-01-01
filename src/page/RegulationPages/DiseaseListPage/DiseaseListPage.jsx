import { useEffect, useState } from 'react';
import { getDisease } from '../../../service/service';
import DiseaseInfoTable from '../../../components/DiseaseInfoTable/DiseaseInfoTable';
import DiseaseChangeForm from '../../../components/DiseaseChangeForm/DiseaseChangeForm';
import DiseaseRegisterForm from '../../../components/DiseaseRegisterForm/DiseaseRegisterForm';
import Modal from '../../../components/Modal/Modal';
import { postIntrospection } from '../../../service/service';
import { notification } from 'antd';
import { useAuth } from '../../../components/AuthContext/AuthContext';


function DiseaseListPage() {
    const [data, setData] = useState([]);
    const [selectedDisease, setSelectedDisease] = useState({});
    const [show, setShow] = useState(false);
    const onClose = () => {
        setShow(false);
    };
    const { logout } = useAuth();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getDisease();
                setData(response.data);
            } catch (error) {
                console.log(error);
            }
        };
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
            }
            catch (error) {
                logout();
                notification.error({
                    message: 'Lỗi hệ thống',
                    description: 'Vui lòng thử lại sau',
                });
                console.error(error);
            }
        }
        checkSession();
        fetchData();
    }, []);
    return (
        <>
            <DiseaseRegisterForm setData={setData} data={data} />
            {(data.length > 0) ?(
                <DiseaseInfoTable
                    data={data}
                    selectedDisease={selectedDisease}
                    setSelectedDisease={setSelectedDisease}
                    setShow={setShow}
                />): null
            }
            <Modal show={show} onClose={onClose}>
                <DiseaseChangeForm
                    selectedDisease={selectedDisease}
                    setSelectedDisease={setSelectedDisease}
                    setShow={setShow}
                    data={data}
                    setData={setData}
                />
            </Modal>
        </>
    );
}

export default DiseaseListPage;
