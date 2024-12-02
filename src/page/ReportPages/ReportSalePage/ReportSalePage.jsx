import styles from './ReportSalePage.module.css';
import { useState } from 'react';
import { getRevenue } from '../../../service/service.js';
function ReportSalePage() {
    const [month, setMonth] = useState('');
    const [error, setError] = useState('');
    
    const [resultReport, setResultReport] = useState([]);
    const validateMonth = (month) => {
        if (!month) return 'Vui lòng chọn tháng!';
        if (month >= new Date().toISOString().slice(0, 7))
            return 'Vui lòng chọn tháng khác!';
        return '';
    };

    const getDaysInMonth = (month) => {
        // Kiểm tra nếu month không hợp lệ
        if (!month) return [];


        const [year, monthNum] = month.split('-'); // Tách năm và tháng từ giá trị "YYYY-MM"
        const daysInMonth = new Date(year, monthNum, 0).getDate(); // Lấy số ngày trong thánh
        const days = [];
        for (let day = 1; day <= daysInMonth; day++) {
            // Chỉ lặp đến số ngày thực tế
            const date = new Date(year, monthNum - 1, day+1); // monthNum - 1 vì tháng bắt đầu từ 0
            days.push(date.toISOString().split('T')[0]); // Lấy ngày theo định dạng YYYY-MM-DD
        }
        return days;
    };



    const handleCreateReport = async () => {
        const validationError = validateMonth(month);
        if (validationError) {
            setError(validationError);
            return;
        }

        const days = getDaysInMonth(month);

        try {
            const results = await Promise.all(
                days.map((day) => getRevenue(day).catch((err) => {
                    console.error('Error fetching revenue for', day, err);
                    return { data: { date: day, numberOfPatient: 0, revenue: 0, rate: 'N/A' } };
                }))
            );
            const reportData = results.map((res) => res.data);
            setResultReport(reportData);
        } catch (error) {
            console.error('Error generating report:', error);
        }
    };
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN').format(value)+' VND';
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0'); // Lấy ngày và thêm số 0 nếu cần
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };
    
    return (
        <>
            <div className={styles.container}>
                <h1 className={styles.header}>BÁO CÁO DOANH THU</h1>
                <div className={styles.dateForm}>
                    <div className={styles.inputForm}>
                        <div>
                            <input
                                type='month'
                                id='month'
                                name='month'
                                value={month}
                                onBlur={() => setError(validateMonth(month))} // Kiểm tra lỗi khi rời khỏi input
                                onChange={(e) => setMonth(e.target.value)} // Cập nhật state khi thay đổi
                                className={styles.inputField}
                            />
                            <button
                                className={styles.searchButton}
                                onClick={handleCreateReport} // Gắn sự kiện vào nút
                            >
                                Tạo
                            </button>
                        </div>
                        {error && <p className={styles.error}>{error}</p>}
                    </div>
                </div>
                {resultReport.length > 0 ? (
                    <table className={styles.resultTable}>
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Ngày khám</th>
                                <th>Số bệnh nhân</th>
                                <th>Doanh thu</th>
                                <th>Tỷ lệ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resultReport.map((revenue, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{formatDate(revenue.date)}</td>
                                    <td>{revenue.numberOfPatient}</td>
                                    <td>{formatCurrency(revenue.revenue)} </td>
                                    <td>{revenue.rate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ):
                (<div>Tháng không có doanh thu</div>)}
            </div>
        </>
    );
}

export default ReportSalePage;
