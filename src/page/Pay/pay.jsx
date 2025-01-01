import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Thêm useNavigate
import { getExamed, getInvoice } from "../../service/service";
import styles from "./pay.module.css";

const PayPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [invoice, setInvoice] = useState(null); // Thông tin phiếu thanh toán
  const [showModal, setShowModal] = useState(false); // Hiển thị modal

  const navigate = useNavigate(); // Hook để điều hướng

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchExamedPatients = async () => {
      const todayDate = getTodayDate();
      try {
        const response = await getExamed(todayDate);
        setPatients(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError("Không thể tải danh sách bệnh nhân.");
      } finally {
        setLoading(false);
      }
    };

    fetchExamedPatients();
  }, []);

  useEffect(() => {
    document.title = "Danh sách bệnh nhân cần thanh toán";
  }, []);

  const handlePayment = async () => {
    if (!selectedPatient) {
      alert("Vui lòng chọn một bệnh nhân!");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await getInvoice(selectedPatient.id);
      setInvoice(response.data);
      setShowModal(true); // Hiển thị modal khi có hóa đơn
    } catch (err) {
      setError("Không thể lấy thông tin phiếu thanh toán.");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setInvoice(null);
  };

  const handleRowClick = (patient) => {
    setSelectedPatient(patient); // Đặt bệnh nhân được chọn
  };

  const handleGoBack = () => {
    navigate(-1); // Quay lại trang trước
  };

  if (loading && patients.length === 0) {
    return <div>Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  if (patients.length === 0) {
    return <div>Chưa có bệnh nhân nào cần thanh toán</div>;
  }

  return (
    <div className={styles.container_make}>
      <button
  onClick={handleGoBack}
  style={{
    position: "absolute",
    top: "10px",
    left: "10px", // Đặt ở góc trên bên trái
    backgroundColor: "#2196F3", // Màu xanh dương
    color: "white",
    border: "none",
    padding: "10px 20px",
    cursor: "pointer",
    borderRadius: "5px", // Bo góc
    fontSize: "16px", // Tăng kích thước chữ một chút
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)", // Thêm bóng để nổi bật
  }}
>
  Trở lại
</button>


      <h1 style={{ textAlign: "center" }}>Danh sách bệnh nhân đã khám trong hôm nay</h1>

      <table className={styles.payTable}>
        <thead>
          <tr>
            <th className={styles.index}>Stt</th>
            <th className={styles.name}>Họ và tên</th>
            <th className={styles.sex}>Giới tính</th>
            <th className={styles.birth}>Năm sinh</th>
            <th className={styles.date}>Ngày khám</th>
            <th className={styles.address}>Địa chỉ</th>
            
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr
              key={patient.id}
              className={selectedPatient?.id === patient.id ? styles.selectedRow : ""}
              onClick={() => handleRowClick(patient)}
              style={{ cursor: "pointer" }}
            >
              <td>{patients.indexOf(patient)+1}</td>
              <td>{patient.fullname}</td>
              <td>{patient.sex}</td>
              <td>{patient.yearOfBirth}</td>
              <td>{patient.date}</td>
              <td>{patient.address}</td>
              
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={handlePayment}
        style={{
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          padding: "10px 20px",
          cursor: "pointer",
          marginTop: "20px",
        }}
      >
        Thanh toán
      </button>

      {showModal && invoice && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Phiếu Thanh Toán</h2>
            <p><strong>Tên bệnh nhân:</strong> {selectedPatient.fullname}</p>
            <p><strong>Tiền khám:</strong> {invoice.exPrice.toLocaleString()} VND</p>
            <p><strong>Tiền thuốc:</strong> {invoice.medicinePrice.toLocaleString()} VND</p>
            <p><strong>Tổng tiền:</strong> {invoice.total.toLocaleString()} VND</p>
            <button className={styles.closeButton} onClick={closeModal}>
              Thanh toán xong
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayPage;
