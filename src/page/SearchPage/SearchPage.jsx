import React, { useState, useEffect } from 'react';
import styles from './SearchPage.module.css';
import { searchPatients } from '../../service/service';
import FactSheet from '../../components/FactSheet/FactSheet';
import Modal from '../../components/Modal/Modal';
const SearchPage = () => {
    const [searchParams, setSearchParams] = useState({
        id: '',
        fullname: '',
        date: '',
    });
    const [show, setShow] = useState(false);
    const [patient, setPatient] = useState(null);
    const [results, setResults] = useState([]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setSearchParams({ ...searchParams, [name]: value });
    };
    const handleInfo = (patient) => {
        setPatient(patient);
        setShow(true);
    }
    const handleSearch = async () => {
        try {
            const response = await searchPatients(
                searchParams.id,
                searchParams.fullname,
                searchParams.date
            );
            setResults(response.data);
        } catch (error) {
            console.error('Error searching patients:', error);
        }
    };
    
    const handleClose = () => {
        setShow(false);
    };
    return (
        <div className={styles.container}>
            <h1 className={styles.header}>Tìm kiếm bệnh nhân</h1>
            <div className={styles.searchForm}>
                <div className={styles.inputForm}>
                    <label htmlFor='id'>ID</label>
                    <input
                        type='text'
                        name='id'
                        placeholder='VD: 10000'
                        value={searchParams.id}
                        onChange={handleChange}
                        className={styles.inputField}
                    />
                </div>
                <div className={styles.inputForm}>
                    <label htmlFor='fullname'>Họ và tên</label>
                    <input
                        type='text'
                        name='fullname'
                        placeholder='VD: Nguyen Van A'
                        value={searchParams.fullname}
                        onChange={handleChange}
                        className={styles.inputField}
                    />
                </div>
                <div className={styles.inputForm}>
                    <label htmlFor='fullname'>Ngày khám</label>
                    <input
                        type='date'
                        name='date'
                        placeholder='Ngày khám'
                        value={searchParams.date}
                        onChange={handleChange}
                        className={styles.inputField}
                    />
                </div>

                <button onClick={handleSearch} className={styles.searchButton}>
                    Tìm kiếm
                </button>
            </div>

            {results.length > 0 ? (
                <table className={styles.resultTable}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Họ và tên</th>
                            <th>Năm sinh</th>
                            <th>Ngày khám</th>
                            <th>Địa chỉ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((patient) => (
                            <tr key={patient.id} onClick={()=>handleInfo(patient)}>
                                <td>{patient.id}</td>
                                <td>{patient.fullname}</td>
                                <td>{patient.yearOfBirth}</td>
                                <td>{patient.date}</td>
                                <td>{patient.address}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className={styles.noResult}>Không tìm thấy bệnh nhân.</p>
            )}
           <Modal show={show} onClose={handleClose}>
                <FactSheet patient={patient} />
            </Modal>
        </div>
    );
};

export default SearchPage;
