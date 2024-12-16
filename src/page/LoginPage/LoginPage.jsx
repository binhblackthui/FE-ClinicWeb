import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/AuthContext/AuthContext';
import styles from './LoginPage.module.css';
import { loginAccount}  from '../../service/service';
function LoginPage() {
    const { login } = useAuth();
    const [account, setAccount] = useState({
        username: '',
        password: '',
    });
    const [error, setError] = useState({
        username: '',
        password: '',
    });
    const navigate = useNavigate();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setAccount({
            ...account,
            [name]: value,
        });
    };
    const handleBlur = (e) => {
        if (!e.target.value) {
            setError({
                ...error,
                [e.target.name]: 'Vui lòng nhập thông tin!',
            });
        } else {
            setError({
                ...error,
                [e.target.name]: '',
            });
        }
    };
    const handleLogin = async () => {
        if (Object.values(error).some((err) => err !== '')) {
            return;
        }
        try {
            const response = await loginAccount(account.username, account.password);
            if (response.status === 200) {
                alert('Đăng nhập thành công');
            }
            login(response.data.token);
            navigate('/');
        } catch (error) {
            console.log(error);
            alert('Đăng nhập thất bại');
        }
    };
    return (
        <div className={styles.container}>
            <div className={styles.loginForm}>
                <h1 className={styles.header}>ĐĂNG NHẬP</h1>
                <div className={styles.dataForm}>
                    <div className={styles.inputForm}>
                        <label>Tên đăng nhập</label>
                        <input
                            type='text'
                            id='username'
                            name='username'
                            value={account.username}
                            onChange={(e) => handleChange(e)}
                            onBlur={(e) => handleBlur(e)}
                            className={styles.inputField}
                        />
                        <span className={styles.error}>{error.username}</span>
                    </div>
                    <div className={styles.inputForm}>
                        <label>Mật khẩu</label>
                        <input
                            type='password'
                            id='password'
                            name='password'
                            value={account.password}
                            onChange={(e) => handleChange(e)}
                            onBlur={(e) => handleBlur(e)}
                            className={styles.inputField}
                        />
                        <span className={styles.error}>{error.password}</span>
                    </div>
                    <button
                        className={styles.button}
                        onClick={handleLogin}
                    >
                        Đăng nhập
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;