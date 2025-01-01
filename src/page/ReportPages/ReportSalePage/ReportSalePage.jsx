import styles from './ReportSalePage.module.css';
import { useState } from 'react';
import { getRevenue } from '../../../service/service.js';
import { formatCurrency, formatDate } from '../../../helper/stringUtils.js';
import { useAuth } from '../../../components/AuthContext/AuthContext';
import { useEffect } from 'react';
import { postIntrospection } from '../../../service/service';
import { notification } from 'antd';
function ReportSalePage() {
    const [month, setMonth] = useState('');
    const [error, setError] = useState('');
    const [sumSale, setSumSale] = useState({
        numberOfPatient: 0,
        revenue: 0,
    });
    const [bestSale, setBestSale] = useState({});
    const [resultReport, setResultReport] = useState([]);
    const {logout}  = useAuth();
    useEffect(() => {
        const checkSession = async () => {
            console.log('check session');
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
    }, []);

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
            const date = new Date(year, monthNum - 1, day + 1); // monthNum - 1 vì tháng bắt đầu từ 0
            days.push(date.toISOString().split('T')[0]); // Lấy ngày theo định dạng YYYY-MM-DD
        }
        return days;
    };

    const getBestSale = (reportData) => {
        return reportData.reduce((bestSale, currentSale) => {
            return currentSale.revenue > bestSale.revenue
                ? currentSale
                : bestSale;
        }, reportData[0]);
    };
    const getSumSale = (reportData) => {
        return reportData.reduce(
            (sumSale, currentSale) => {
                sumSale.numberOfPatient += currentSale.numberOfPatient;
                sumSale.revenue += currentSale.revenue;
                return sumSale;
            },
            { numberOfPatient: 0, revenue: 0 }
        );
    };

    const handleCreateReport = async () => {
        const validationError = validateMonth(month);
        if (validationError) {
            setError(validationError);
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
        const days = getDaysInMonth(month);
    
        try {
            const results = await Promise.all(
                days.map((day) =>
                    getRevenue(day).catch((err) => {
                        console.error('Error fetching revenue for', day, err);
                        return {
                            data: {
                                date: day,
                                numberOfPatient: 0,
                                revenue: 0,
                                rate: 'N/A',
                            },
                        };
                    })
                )
            );
            const reportData = results.map((res) => res.data);
            setBestSale(getBestSale(reportData));
            setSumSale(getSumSale(reportData));
            setResultReport(reportData);
        } catch (error) {
            console.error('Error generating report:', error);
        }

        //
        //console.log(bestSale);
    };

    return (
        <>
            <div className={styles.container}>
                <h1 className={styles.header}>BÁO CÁO DOANH THU</h1>
                <div className={styles.dateForm}>
                    <div className={styles.inputForm}>
                        <input
                            type='month'
                            id='month'
                            name='month'
                            value={month}
                            onBlur={() => setError(validateMonth(month))} // Kiểm tra lỗi khi rời khỏi input
                            onChange={(e) => setMonth(e.target.value)} // Cập nhật state khi thay đổi
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
                {resultReport.length > 0 && !error ? (
                    <>
                        <table className={styles.finalTable}>
                            <thead>
                                <tr>
                                    <td colSpan='2' scope='colgroup'>
                                        <h1>Bảng tổng kết</h1>
                                    </td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th>Tổng số bệnh nhân</th>
                                    <td>{sumSale.numberOfPatient}</td>
                                </tr>
                                <tr>
                                    <th>Doanh thu</th>
                                    <td>{formatCurrency(sumSale.revenue)}</td>
                                </tr>
                                <tr>
                                    <th>Ngày doanh thu cao nhất</th>
                                    <td>{formatDate(bestSale.date)}</td>
                                </tr>
                            </tbody>
                        </table>
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
                                        <td>
                                            {formatCurrency(revenue.revenue)}{' '}
                                        </td>
                                        <td>{revenue.rate}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                ) : (
                    <p className={styles.error}>{error}</p>
                )}
            </div>
        </>
    );
}

export default ReportSalePage;
