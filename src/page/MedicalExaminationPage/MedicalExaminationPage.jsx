import React, { useState, useEffect } from 'react';
import styles from './MedicalExaminationPage.module.css';
import { searchPatients } from '../../service/service';
import FactSheet from '../../components/FactSheet/FactSheet';
import Modal from '../../components/Modal/Modal';
import Form from './EnterData'
import FormExamble from './EnterData';
const MedicalExaminationPage = () => {
    return (
        <div className={styles.container}>
        <h1 className={styles.header}>Danh sách bệnh nhân</h1>
        <FormExamble/>
        </div>
    );
};

export default MedicalExaminationPage;