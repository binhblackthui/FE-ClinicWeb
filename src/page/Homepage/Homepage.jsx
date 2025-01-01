import React, { useEffect } from 'react';

import styles from './Homepage.module.css';
import { useAuth } from '../../components/AuthContext/AuthContext';
import { postIntrospection } from '../../service/service';
import { notification } from 'antd';
function Homepage() {
    const { logout } = useAuth();
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
    }, []);
    return (
        <div className={styles.Body}>
            <div className={styles.Home}>
                <div className={styles.overlay}>
                    <h1 className={styles.overlay_h1}>PHÒNG MẠCH TƯ NHÂN</h1>
                </div>
            </div>
        </div>
    );
}

export default Homepage;
