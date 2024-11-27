import styles from './Header.module.css';
import Menu from '../Menu/Menu';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
function Header() {
    const [show, setShow] = useState(false);
    const navigate = useNavigate();
    const handleNavigate = (select) => {
        if(select === 'home'){
            navigate('/home');
        }
    };
    return (
        <>
            <div className={styles.nav}>
                <ul className={styles.nav_list}>
                    <div className={styles.nav_item} onClick={() => setShow(!show)}>
                        Menu
                    </div>
                    <div className={styles.nav_item} onClick={()=>{setShow(false);handleNavigate('home')}}>Trang chủ</div>
                </ul>
                <ul className={styles.nav_list}>
                    <li>
                        <button className={styles.button}>Đăng xuất</button>
                    </li>
                </ul>
            </div>
            
            <Menu show={show} />
        </>
    );
}

export default Header;
