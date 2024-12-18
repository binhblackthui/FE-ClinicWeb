import { useLocation, useNavigate } from "react-router-dom";
import styles from "./MedicalExaminationPage.module.css";
import { getMedicine, getExaminationResult, getPrescription } from "../../service/service";
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
  const [selectedMedicine, setSelectedMedicine] = useState({});

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
        const response = await getMedicine();
        if (Array.isArray(response.data)) {
          setDataTableMedicine(response.data);
          console.log(response.data)
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
  const handleSelectDrug = (id, selectedDrugId) => {
    const selectedDrug = data_table_medicine.find(drug => drug.idMedicine === selectedDrugId);
  
    if (selectedDrug) {
      setSelectedMedicine((prev) => ({
        ...prev,
        [id]: {
          id: selectedDrug.idMedicine, // Lưu id của thuốc
          name: selectedDrug.nameOfMedicine,
          unit: selectedDrug.unit, // Đơn vị
          usage: selectedDrug.medicineUsage, // Cách dùng
        },
      }));
    }
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
      <button onClick={() => navigate("/examination")}>Quay lại</button>
      <h1 className={styles.header}>Lập phiếu khám bệnh</h1>
      <table>
        <tr>
          <td>
            <label className={styles.makeExamination}>
              <strong>Họ tên:</strong> {patientData.fullname}
            </label>
          </td>
          <td>
            <label>
              <strong>Ngày khám: </strong>
            </label>
            <input
              type="date"
              name="dateexamination"
              placeholder="ngày khám"
              style={{ marginLeft: "0px" }}
            />
          </td>
        </tr>
  
        <tr>
          <td>
            <label>
              <strong>Triệu chứng: </strong>
            </label>
            <input
              type="text"
              name="symptoms"
              placeholder="Triệu chứng"
              defaultValue={examinationResult.symptom} // Gán giá trị từ API
            />
          </td>
          <td>
            <label>
              <strong>Chuẩn đoán : </strong>
            </label>
            <input
              type="text"
              name="diagnosis"
              placeholder="Chẩn đoán"
              defaultValue={examinationResult.disease} // Gán giá trị từ API
            />
          </td>
        </tr>
      </table>
  
      <div>
        <h2>Danh sách thuốc</h2>
        <table border="1" style={{ width: "100%", textAlign: "left" }}>
          <thead>
            <tr>
              <th>#</th>
              <th>Chọn thuốc</th>
              <th>Đơn vị</th>
              <th>Cách dùng</th>
              <th>Xóa</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>
                <select
                    value={selectedMedicine[row.id]?.id || ""}  // Đảm bảo giá trị 'value' được cập nhật đúng
                    onChange={(e) => handleSelectDrug(row.id, e.target.value)}  // Cập nhật giá trị thuốc khi chọn
                    >
                    <option value="">-- Chọn thuốc --</option>
                    {data_table_medicine.map((drug) => (
                        <option key={drug.idMedicine} value={drug.idMedicine}>
                        {drug.nameOfMedicine}
                        </option>
                    ))}
                    </select>
                  
                </td>
                <td>{selectedMedicine[row.id]?.unit || ""}</td>
                <td>{selectedMedicine[row.id]?.usage || ""}</td>
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
