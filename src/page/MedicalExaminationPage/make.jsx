import { useLocation, useNavigate } from 'react-router-dom';
import { notification } from 'antd';
import styles from './MedicalExaminationPage.module.css';
import {
    getMedicine,
    getExaminationResult,
    getPrescription,
    addNewPrescription,
    deletePrescription,
    deleteExaminationResults,
    addExaminationResults,
    getDisease,
} from '../../service/service';
import React, { useState, useEffect } from 'react';

const MakePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const patientData = location.state;

    const [data_table_medicine, setDataTableMedicine] = useState([]);
    const [diseaseList, setDiseaseList] = useState([]);
    const [symptom, setSymptom] = useState('');
    const [selectedDisease, setSelectedDisease] = useState('');
    const [rows, setRows] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editRow, setEditRow] = useState(null);
    const [selectedMedicine, setSelectedMedicine] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [idExam, setIdExam] = useState(1);
    const [defaultDisease, setDefaultDisease] = useState('');

    const currentDate = new Date();
    const strdate = `${String(currentDate.getDate()).padStart(2, '0')}-${String(
        currentDate.getMonth() + 1
    ).padStart(2, '0')}-${currentDate.getFullYear()}`;

    // Fetch triệu chứng ban đầu
    useEffect(() => {
        if (patientData) {
            const fetchExaminationResult = async () => {
                try {
                    console.log(patientData.id);
                    const response = await getExaminationResult(patientData.id);
                    console.log(response.data.id);
                    if (response) {
                        setSymptom(response.data.symptom || '');
                        setIdExam(response.data.id);
                        setDefaultDisease(response.data.disease || ''); // Lưu tên bệnh từ API
                    }
                } catch (error) {
                    console.error('Lỗi khi gọi API:', error);
                }
            };
            fetchExaminationResult();
        }
    }, [patientData.id]);

    // Thêm patientData.id vào đây

    // Lắng nghe sự thay đổi của idExam
    useEffect(() => {}, [idExam]);

    // Fetch danh sách thuốc từ API
    useEffect(() => {
        const fetchMedicine = async () => {
            try {
                const response = await getMedicine();
                setDataTableMedicine(response.data || []);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách thuốc:', error);
            }
        };
        fetchMedicine();
    }, []);

    // Fetch danh sách bệnh từ API
    useEffect(() => {
        const fetchDiseases = async () => {
            try {
                const response = await getDisease();
                setDiseaseList(response.data || []);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách bệnh:', error);
            }
        };
        fetchDiseases();
    }, []);

    // Fetch danh sách đơn thuốc của bệnh nhân
    useEffect(() => {
        if (patientData) {
            const fetchPrescription = async () => {
                try {
                    const response = await getPrescription(patientData.id);
                    console.log(response.data);
                    if (Array.isArray(response.data)) {
                        const prescriptions = response.data.map(
                            (prescription, index) => ({
                                id: prescription.id,
                                drugName: prescription.nameOfMedicine,
                                quantity: prescription.quantity,
                                unit: prescription.unit,
                                usage: prescription.medicineUsage || 'Không rõ',
                            })
                        );
                        setRows(prescriptions);
                    }
                } catch (error) {
                    console.error('Lỗi khi gọi API:', error);
                }
            };
            fetchPrescription();
        }
    }, [patientData]);

    const openModal = (row = null) => {
        setEditRow(row);
        setSelectedMedicine(row?.drugId || '');
        setQuantity(row?.quantity || 1);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditRow(null);
        setSelectedMedicine('');
        setQuantity(1);
    };

    const handleAddOrEdit = () => {
        const drug = data_table_medicine.find(
            (item) => item.idMedicine === Number(selectedMedicine)
        );

        if (!selectedMedicine || !drug) {
            alert('Vui lòng chọn thuốc hợp lệ!');
            return;
        }
        if (quantity <= 0) {
            alert('Số lượng phải lớn hơn 0!');
            return;
        }

        if (editRow) {
            setRows((prev) =>
                prev.map((row) =>
                    row.id === editRow.id
                        ? {
                              ...row,
                              drugId: drug.idMedicine,
                              drugName: drug.nameOfMedicine,
                              unit: drug.unit,
                              usage: drug.medicineUsage || 'Không rõ',
                              quantity,
                          }
                        : row
                )
            );
        } else {
            const newRow = {
                id: rows.length + 1,
                drugId: drug.idMedicine,
                drugName: drug.nameOfMedicine,
                unit: drug.unit,
                usage: drug.medicineUsage || 'Không rõ',
                quantity,
            };
            setRows((prev) => [...prev, newRow]);
        }

        closeModal();
    };

    const handleRemoveRow = (id) => {
        setRows((prev) => prev.filter((row) => row.id !== id));
    };

    const handleSubmit = async () => {
        if (!symptom || !(selectedDisease || defaultDisease)) {
            notification.error({
                message: 'Lỗi',
                description: 'Vui lòng nhập đầy đủ thông tin bệnh và chuẩn đoán!',
            });
            return;
        }
        console.log(idExam);
        if (idExam !== 0 && idExam !== 1 && idExam != undefined) {
            try {
                await deleteExaminationResults({ id: idExam });
            } catch (error) {
                alert('Lỗi khi xóa kết quả khám bệnh!');
                return;
            }
        }

        let currentPrescriptions = [];
        try {
            const response = await getPrescription(patientData.id);
            currentPrescriptions = response.data || [];
        } catch (error) {
            alert('Lỗi khi lấy danh sách thuốc hiện tại!');
            console.error('Lỗi khi gọi API getPrescription:', error);
            return;
        }

        // Xóa danh sách thuốc cũ
        try {
            for (const prescription of currentPrescriptions) {
                console.log(prescription.id);
                await deletePrescription({ id: prescription.id });
                console.log('a');
            }
        } catch (error) {
            alert('Lỗi khi xóa danh sách thuốc cũ!');
            console.error('Lỗi khi gọi API deletePrescription:', error);
            return;
        }

        // Lưu dữ liệu mới
        const idDisease =
            selectedDisease ||
            diseaseList.find((disease) => disease.name === defaultDisease)?.id;
        try {
            await addExaminationResults({
                patient: { id: patientData.id },
                disease: { id: idDisease },
                symptom,
            });
            for (const row of rows) {
                const idMedicine = data_table_medicine.find(
                    (medicine) => medicine.nameOfMedicine === row.drugName
                );
                await addNewPrescription({
                    medicine: { idMedicine: idMedicine.idMedicine },
                    patient: { id: patientData.id },
                    quantity: row.quantity,
                });
            }

            notification.success({
                message: 'Lưu kết quả khám thành công',
                description: 'Đã lưu kết quả khám bệnh và đơn thuốc!',
            });
            navigate('/examination');
        } catch (error) {
            console.error('Lỗi khi lập phiếu khám bệnh:', error);
            alert('Có lỗi xảy ra khi lập phiếu khám bệnh!');
        }
    };

    return (
        <div className={styles.container_make}>
            <button
                className={`${styles.button_make} ${styles.backButton}`}
                onClick={() => navigate('/examination')}
            >
                Quay lại
            </button>
            <div className={styles.registerContainer}>
                <h1 className={styles.header}>PHIẾU KHÁM BỆNH</h1>
                <div className={styles.formData}>
                    <div className={styles['flex-row']}>
                    <div>
                        <strong>Họ tên: </strong>
                        {patientData.fullname}
                        </div>
                        <div>
                        <strong>Ngày khám:</strong>
                         {strdate}
                        </div>
                    </div>

                    <div className={styles.flexColumn}>
                        <label>
                            <strong>Triệu chứng</strong>
                        </label>
                        <input
                            className={styles.input_make}
                            type='text'
                            value={symptom}
                            onChange={(e) => setSymptom(e.target.value)}
                        />
                        <label>
                            <strong>Chẩn đoán</strong>
                        </label>
                        <select
                            className={styles.input_make}
                            value={selectedDisease || defaultDisease} // Giá trị mặc định là tên bệnh nếu chưa chọn
                            onChange={(e) => setSelectedDisease(e.target.value)} // Chọn ID bệnh khi thay đổi
                        >
                            {/* Hiển thị tên bệnh mặc định */}
                            {defaultDisease && (
                                <option value={defaultDisease} disabled>
                                    {diseaseList.find(
                                        (disease) =>
                                            disease.name === defaultDisease
                                    )?.name || '-- Không xác định --'}
                                </option>
                            )}

                            <option value=''>-- Chọn chẩn đoán --</option>
                            {diseaseList.map((disease) => (
                                <option key={disease.id} value={disease.id}>
                                    {disease.name} {/* Hiển thị tên bệnh */}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            {rows.length > 0 ? (
                <div>
                    <h1 className={styles.header}>ĐƠN THUỐC</h1>
                    <table className={styles.table_make} border='1'>
                        <colgroup>
                            <col style={{ width: '5%' }} />
                            <col style={{ width: '35%' }} />
                            <col style={{ width: '15%' }} />
                            <col style={{ width: '15%' }} />
                            <col style={{ width: '15%' }} />
                            <col style={{ width: '10%' }} />
                        </colgroup>
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Tên thuốc</th>
                                <th>Đơn vị</th>
                                <th>Cách dùng</th>
                                <th>Số lượng</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, index) => (
                                <tr key={row.id}>
                                    <td>{index + 1}</td>
                                    <td>{row.drugName}</td>
                                    <td>{row.unit}</td>
                                    <td>{row.usage}</td>
                                    <td>{row.quantity}</td>
                                    <td>
                                        <button
                                            className={styles.buttonAdd}
                                            onClick={() => openModal(row)}
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            className={styles.buttonDelete}
                                            onClick={() =>
                                                handleRemoveRow(row.id)
                                            }
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                null
            )}
            {modalOpen && (
                <div className={styles.modal}>
                    <h3 className={styles.header}>
                        {editRow ? 'Sửa thuốc' : 'Thêm thuốc'}
                    </h3>
                    <div>
                        <label className={styles.dataField_make}>
                            Chọn thuốc:
                        </label>
                        <select
                            className={styles.input_make}
                            value={selectedMedicine}
                            onChange={(e) =>
                                setSelectedMedicine(e.target.value)
                            }
                        >
                            <option value=''>-- Chọn thuốc --</option>
                            {data_table_medicine.map((medicine) => (
                                <option
                                    key={medicine.idMedicine}
                                    value={medicine.idMedicine}
                                >
                                    {medicine.nameOfMedicine}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className={styles.dataField_make}>
                            Số lượng:
                        </label>
                        <input
                            className={styles.input_make}
                            type='number'
                            min='1'
                            value={quantity}
                            onChange={(e) =>
                                setQuantity(Number(e.target.value))
                            }
                        />
                    </div>
                    <div className={styles.button}>
                        <button
                 
                            onClick={handleAddOrEdit}
                        >
                            {editRow ? 'Cập nhật' : 'Thêm'}
                        </button>
                        <button
                          style={{backgroundColor: 'red'}}
                            onClick={closeModal}
                        >
                            Hủy
                        </button>
                    </div>
                </div>
            )}
            <div className={styles.containerButton}>
            <div className={styles.button}>
                <button
                    className={styles.button_make}
                    onClick={() => openModal()}
                >
                    Thêm thuốc
                </button>
                <button
                    className={`${styles.button_make} ${styles.date}`}
                    onClick={handleSubmit}
                >
                    Lưu kết quả khám
                </button>
            </div>
            </div>
        </div>
    );
};

export default MakePage;
