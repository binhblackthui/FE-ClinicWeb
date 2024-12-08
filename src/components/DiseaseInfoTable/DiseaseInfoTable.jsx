import { useState, useEffect } from 'react';
import styles from './DiseaseInfoTable.module.css';
function DiseaseInfoTable({
    data,
    setSelectedDisease,
    setShow,
}) {
    const [newData, setNewData] = useState(data);
    const [nameOfDisease, setNameOfDisease] = useState('');
    useEffect(() => {
        setNewData(data);
    }, [data]);
    const findMedicine = (nameOfDisease, data) => {
        if (nameOfDisease === '') {
            return data;
        }
        return data.filter((item) =>
            item.name.toLowerCase().includes(nameOfDisease.toLowerCase())
        );
    };
    const handleChange = (e) => {
        setNameOfDisease(e.target.value);
        setNewData(findMedicine(e.target.value, data));
    };
    return (
        <>
            <div className={styles.tableContainer}>
                <h1 className={styles.header}>BỆNH</h1>
                <div className={styles.dataForm}>
                    <div className={styles.inputForm}>
                        <input
                            type='text'
                            name='name'
                            value={nameOfDisease}
                            placeholder='Tìm kiếm bệnh'
                            onChange={(e) => handleChange(e)}
                            className={styles.inputField}
                        />
                    </div>
                </div>
                { newData.length>0 ?
                    (<table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.index}>STT</th>
                                <th className={styles.name}>Tên bệnh</th>
                            </tr>
                        </thead>
                        <tbody>
                            {newData.map((item, index) => (
                                <tr
                                    key={index}
                                    onClick={() => {
                                        setSelectedDisease(item);
                                        setShow(true);
                                    }}
                                >
                                    <td className={styles.index}>
                                        {index + 1}
                                    </td>
                                    <td className={styles.name}>{item.name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>):
                    ( <div className={styles.announcement}>Không tìm thấy dữ liệu</div>)
                }
            </div>
        </>
    );
}

export default DiseaseInfoTable;
