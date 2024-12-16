import React, { useState } from 'react';
import styles from './ReportMedicinePage.module.css';
import { getSalesMedicine } from '../../../service/service.js';
function ReportMedicinePage() {
    const [month, setMonth] = useState('');
    const [error, setError] = useState('');
    const [report, setReport] = useState([]);
    const validateMonth = (month) => {
        if (!month) return 'Vui lòng chọn tháng!';
        if (month >= new Date().toISOString().slice(0, 7))
            return 'Vui lòng chọn tháng khác!';
        return '';
    };
    const cutMonth = (month) => {
        const monthNum = month.split('-')[1];
        const year = month.split('-')[0];
        return { monthNum, year };
    };
    const handleChange = (e) => {
        setMonth(e);
        setError('');
    };
    const handleCreateReport = async () => {
        const validationError = validateMonth(month);
        if (validationError) {
            setError(validationError);
            return;
        }
        const { monthNum, year } = cutMonth(month);

        try {
            const response = await getSalesMedicine(monthNum, year);
            setReport(response.data);
        } catch (e) {
            setError('Đã có lỗi xảy ra');
            confirm.log(e);
        }
    };

    return (
        <>
            <div className={styles.container}>
                <h1 className={styles.header}>BÁO CÁO DOANH SỐ THUỐC</h1>
                <div className={styles.dateForm}>
                    <div className={styles.inputForm}>
                        <input
                            type='month'
                            value={month}
                            onChange={(e) => handleChange(e.target.value)} // Cập nhật state khi thay đổi
                            className={styles.inputField}
                        />
                    </div>
                    <button
                        className={styles.searchButton}
                        onClick={handleCreateReport} // Gắn sự kiện vào nút
                    >
                        Tạo
                    </button>
                </div>

                {report.length > 0 && !error ? (
                    <table className={styles.resultTable}>
                        <thead>
                            <tr>
                                <th className={styles.index}>STT</th>
                                <th className={styles.name}>Tên thuốc</th>
                                <th className={styles.unit}>Đơn vị</th>
                                <th className={styles.quantity}>Số lượng bán</th>
                                <th  className={styles.numberOfUse}>Số lần dùng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {report.map((item, index) => (
                                <tr key={index}>
                                    <td className={styles.index}>{index + 1}</td>
                                    <td className={styles.name}>{item.name}</td>
                                    <td className={styles.unit}>{item.unit}</td>
                                    <td className={styles.quantity}>{item.quantity}</td>
                                    <td className={styles.numberOfUse}>{item.numberOfUse}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className={styles.error}>{error}</p>
                )}
            </div>
        </>
    );
}

export default ReportMedicinePage;
