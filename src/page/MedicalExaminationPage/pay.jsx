import React, { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import styles from "./MedicalExaminationPage.module.css";
import { getInvoice } from "../../service/service";

const PayPage = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Đổi từ negative thành navigate
  const patientData = location.state;
  const [Invoice, setIvoice] = useState({
    exPrice: 0,
    medicinePrice: 0,
    total: 0,
  });
  const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const standard_today = `${year}-${month}-${day}`;

  useEffect(() => {
    const fetchInvoice = async () => {
        console.log(patientData.id)
      if (patientData && patientData.id) {  // Kiểm tra patientData
        try {
          const response = await getInvoice(patientData.id);
          setIvoice(response.data);
          console.log(response);
        } catch (error) {
          console.error("Lỗi khi lấy hóa đơn:", error);
        }
      }
    };
    fetchInvoice();
  }, [patientData]);

  if (!patientData) {
    return <Navigate to="/examination" />; // Chuyển hướng nếu không có patientData
  }

  return (
    <div className={styles.container}>
      <button onClick={() => navigate("/examination")}>Quay lại</button>
      <h1 className={styles.header}>Hóa Đơn Thanh Toán</h1>
      <table border="1" className={styles.table} >
        <tr>
            <td>
                <strong>Họ tên: </strong>
                {patientData.fullname}
            </td>
            <td>
                <strong> Ngày khám: </strong>
                {standard_today}
            </td>
        </tr>
        <tr>
            <td>
                <strong>Tiền khám: </strong>
                {Invoice.exPrice}
            </td>
            <td>
                <strong>Tiền thuốc: </strong>
                {Invoice.medicinePrice}
            </td>
        </tr>
        <tr>
            <td colSpan={2}>
                <strong>Tổng tiền: </strong>
                {Invoice.total}
            </td>
        </tr>
        </table>
    </div>
  );
};

export default PayPage;
