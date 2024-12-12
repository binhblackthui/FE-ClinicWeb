import { formatCurrency, upperFirstLetter } from './../../helper/stringUtils';
import styles from './PharmacyInfoTable.module.css';
import { useState,useEffect } from 'react';
function PharmacyInfoTable({ data, setSelectedMedicine, setShow }) {
    const [medicine, setMedicine] = useState('');
    const [newData, setNewData] = useState(data);
    const hangdlSelectMedicine = (item) => {
        setSelectedMedicine(item);
        setShow(true);
    };
    useEffect(() => {
        setNewData(data);
    }  ,[data]);
    const findMedicine = (data, medicine) => {
        if (medicine === '') {
            return data;
        }
        return data.filter((item) =>
            item.nameOfMedicine.toLowerCase().includes(medicine.toLowerCase())
        );
    };

    const handleChange = (e) => {
        setMedicine(e.target.value);
        setNewData(findMedicine(data, e.target.value));
    };

    return (
        <div className={styles.tableContainer}>
            <h1 className={styles.header}>Kho thuốc</h1>
            <div className={styles.dataForm}>
                <div className={styles.inputForm}>
                    <input
                        type='text'
                        name='name'
                        value={medicine}
                        placeholder='Tìm kiếm tên thuốc'
                        onChange={(e) => handleChange(e)}
                        className={styles.inputField}
                    />
                </div>
            </div>
            {newData.length > 0 ? (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.index}>STT</th>
                            <th className={styles.name}>Tên thuốc</th>
                            <th className={styles.unit}>Đơn vị</th>
                            <th className={styles.price}>Giá</th>
                            <th className={styles.usage}>Cách dùng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {newData.map((item, index) => (
                            <tr
                                key={index}
                                onClick={() => hangdlSelectMedicine(item)}
                            >
                                <td className={styles.index}>{index + 1}</td>
                                <td className={styles.name}>
                                    {upperFirstLetter(item.nameOfMedicine)}
                                </td>
                                <td className={styles.unit}>{item.unit}</td>
                                <td className={styles.price}>
                                    {formatCurrency(item.price)}
                                </td>
                                <td className={styles.usage}>
                                    {item.medicineUsage}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className={styles.announcement}>Không tìm thấy dữ liệu</div>
            )}
        </div>
    );
}

export default PharmacyInfoTable;
