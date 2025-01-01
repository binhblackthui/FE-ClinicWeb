import React, { useState, useEffect } from 'react';

import styles from './SearchPage.module.css';
import { searchPatients } from '../../service/service';
import FactSheet from '../../components/FactSheet/FactSheet';
import Modal from '../../components/Modal/Modal';
import { formatDate, upperFirstLetterEachWord } from '../../helper/stringUtils';
import { useAuth } from '../../components/AuthContext/AuthContext';
import { notification } from 'antd';
import { postIntrospection } from '../../service/service';
const SearchPage = () => {
    const [searchParams, setSearchParams] = useState({
        id: '',
        fullname: '',
        date: '',
    });
    const [show, setShow] = useState(false);
    const [patient, setPatient] = useState(null);
    const [results, setResults] = useState([]);
    const {logout} = useAuth();
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
        checkSession();    
    },[]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setSearchParams({ ...searchParams, [name]: value });
    };
    const handleInfo = (patient)  => {
        setPatient(patient);
        setShow(true);
    }
    const handleSearch = async () => {
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
        }
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
                    <label htmlFor='date'>Ngày khám</label>
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
                            <th className={styles.index} >STT</th>
                            <th className={styles.name}>Họ và tên</th>
                            <th className={styles.birth}>Năm sinh</th>
                            <th className={styles.date}>Ngày khám</th>
                            <th className={styles.address}>Địa chỉ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((patient) => (
                            <tr key={patient.id} onClick={()=>handleInfo(patient)}>
                                <td className={styles.index}>{results.indexOf(patient) + 1}</td>
                                <td className={styles.name}>{upperFirstLetterEachWord(patient.fullname)}</td>
                                <td className={styles.birth}>{patient.yearOfBirth}</td>
                                <td className={styles.date}>{formatDate(patient.date)}</td>
                                <td className={styles.address}>{patient.address}</td>
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
