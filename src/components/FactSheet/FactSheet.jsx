import { useEffect, useState } from 'react';
import styles from './FactSheet.module.css';
import { getExaminationResult, getPrescription } from '../../service/service';

function FactSheet({ patient }) {
    const [isExaminationResult, setExaminationResult] = useState({});
    const [listMedicine, setMedicine] = useState([]);

    useEffect(() => {
        const fetchExaminationResult = async () => {
            try {
                const response = await getExaminationResult(patient.id);
                setExaminationResult(response.data);
            } catch (error) {
                console.error('Error getting examination result:', error);
            }
        };

        fetchExaminationResult();
    }, [patient.id]);
    useEffect(() => {
        const fetchMedicine = async () => {
            if (!patient.id) return; // Kiểm tra id trước
            try {
                const response = await getPrescription(patient.id);
                setMedicine(response.data);
            } catch (error) {
                console.error('Error getting prescription:', error);
            }
        };
        fetchMedicine();
    }, [patient.id]);
    return (
        <div className={styles.container}>
            <h1 className={styles.header}>Phiếu kết quả</h1>
            <div className={styles.info}>
                <dir className={styles.infoItem}>
                    <p>ID: {patient.id}</p>
                    <p>Họ và tên: {patient.fullname}</p>
                    <p>Giới tính: {patient.sex}</p>
                    <p>Năm sinh: {patient.yearOfBirth}</p>
                    <p>Địa chỉ: {patient.address}</p>
                </dir>
                <div className={styles.infoItem}>
                    <p>Ngày khám: {patient.date} </p>
                    <p>Triệu chứng: {isExaminationResult.symptom}</p>
                    <p>Chuẩn đoán: {isExaminationResult.disease}</p>
                </div>
            </div>
            <h1 className={styles.header}>Phiếu thuốc</h1>
            <table className={styles.resultTable}>
                <thead>
                    <tr>
                        <th className={styles.id}>STT</th>
                        <th className={styles.nameMedicine}>Tên thuốc</th>
                        <th className={styles.unit}>Đơn vị</th>
                        <th className={styles.quantity}>Số lượng</th>
                        <th className={styles.dosage}>Liều dùng</th>
                    </tr>
                </thead>
                <tbody>
                    {listMedicine.map((medicine, index) => (
                        <tr key={index}>
                            <td className={styles.id}>{index + 1}</td>
                            <td className={styles.nameMedicine}>
                                {medicine.nameOfMedicine}
                            </td>
                            <td className={styles.unit}>{medicine.unit}</td>
                            <td className={styles.quantity}>
                                {medicine.quantity}
                            </td>
                            <td className={styles.dosage}>{medicine.medicineUsage}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default FactSheet;
