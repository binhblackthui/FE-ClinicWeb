import { useLocation, useNavigate } from "react-router-dom";
import styles from "./MedicalExaminationPage.module.css";
import { findAll, getExaminationResult, getPrescription } from "../../service/service";
import React, { useState, useEffect } from "react";

const MakePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const patientData = location.state; // Lấy thông tin bệnh nhân
  const [data_table_medicine, setDataTableMedicine] = useState([]);
  const [examinationResult, setExaminationResult] = useState({
    fullName: "",
    date: "",
    symptom: "",
    disease: "",
  });

  // Kiểm tra nếu patientData có sẵn trước khi gọi API
  useEffect(() => {
    if (patientData) {
      const fetchExaminationResult = async () => {
        try {
          const response = await getExaminationResult(patientData.id);
          setExaminationResult(response.data);
        } catch (error) {
          console.error("Lỗi khi gọi API:", error);
        }
      };
      fetchExaminationResult();
    }
  }, [patientData]); // Chỉ gọi khi patientData thay đổi

  // Lấy danh sách thuốc
  useEffect(() => {
    const fetchPrescription = async () => {
      if (patientData) {
        try {
          const response = await getPrescription(patientData.id);
          // Xử lý dữ liệu nếu cần
        } catch (error) {
          console.error("Lỗi khi lấy đơn thuốc:", error);
        }
      }
    };
    fetchPrescription();
  }, [patientData]); // Chỉ gọi khi patientData thay đổi

  // Lấy danh sách thuốc để hiển thị
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await findAll();
        if (Array.isArray(response.data)) {
          setDataTableMedicine(response.data);
        } else {
          console.error("Dữ liệu trả về không phải là mảng");
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách thuốc:", error);
      }
    };
    fetchData();
  }, []); // Chỉ gọi một lần khi component được mount

  const [rows, setRows] = useState([{ id: 1, drug: "" }]);

  const handleAddRow = () => {
    setRows([...rows, { id: rows.length + 1, drug: "" }]);
  };

  const handleRemoveRow = (id) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleSelectDrug = (id, selectedDrug) => {
    setRows(
      rows.map((row) =>
        row.id === id ? { ...row, drug: selectedDrug } : row
      )
    );
  };

  if (!patientData) {
    return (
      <div>
        <h1>Không có thông tin hồ sơ!</h1>
        <button onClick={() => navigate("/examination")}>Quay lại</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Lập phiếu khám bệnh</h1>
      <div style={{ display: "flex", alignItems: "center", gap: "50px" }}>
        <label className={styles.makeExamination}>
          <strong>Họ tên:</strong> {patientData.fullname}
        </label>
        <div style={{ display: "flex", alignItems: "center" }}>
          <label className={styles.makeExamination} style={{ marginRight: "0px" }}>
            <strong>Ngày khám: </strong>{" "}
          </label>
          <input
            type="date"
            className={styles.makeExamination}
            name="dateexamination"
            placeholder="ngày khám"
            style={{ marginLeft: "0px" }}
          />
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <label className={styles.makeExamination} style={{ margin: "0px", width: "150px" }}>
            <strong>Triệu chứng: </strong>{" "}
          </label>
          <input
            type="text"
            className={styles.makeExamination}
            name="symptoms"
            placeholder="Triệu chứng"
            style={{ marginLeft: "0px" }}
            value={examinationResult.symptom} // Gán giá trị từ API
          />
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <label className={styles.makeExamination} style={{ margin: "1px", width: "150px" }}>
            <strong>Chuẩn đoán : </strong>{" "}
          </label>
          <input
            type="text"
            className={styles.makeExamination}
            name="diagnosis"
            placeholder="Chẩn đoán"
            style={{ marginLeft: "0px" }}
            value={examinationResult.disease} // Gán giá trị từ API
          />
        </div>
      </div>

      <button onClick={() => navigate("/examination")}>Quay lại</button>

      <div>
        <h2>Danh sách thuốc</h2>
        <table border="1" style={{ width: "100%", textAlign: "left" }}>
          <thead>
            <tr>
              <th>#</th>
              <th>Chọn thuốc</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>
                  <select
                    value={row.drug}
                    onChange={(e) => handleSelectDrug(row.id, e.target.value)}
                  >
                    <option value="">-- Chọn thuốc --</option>
                    {data_table_medicine.map((drug) => (
                      <option key={drug.idMedicine} value={drug.nameOfMedicine}>
                        {drug.nameOfMedicine}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <button onClick={() => handleRemoveRow(row.id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={handleAddRow}>Thêm dòng</button>
      </div>
    </div>
  );
};

export default MakePage;
