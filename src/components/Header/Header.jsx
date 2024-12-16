import styles from './Header.module.css';
import Menu from '../Menu/Menu';
import menuIcon from '../../assets/icons/svgs/menuIcon.svg';
import homeIcon from '../../assets/icons/svgs/homeIcon.svg';
import { useState } from 'react';
import { useAuth } from '../AuthContext/AuthContext';
import { Outlet, useNavigate } from 'react-router-dom';
function Header() {
    const { logout } = useAuth();
    const [show, setShow] = useState(false);
    const [reset, setReset] = useState(false);
    const navigate = useNavigate();
    const handleNavigate = (select) => {
        setReset(true);
        if(select === 'home'){
            navigate('/');
            setShow(false);
        }
    };
    const handleLogout = () => {
        logout();
        navigate('/login');
    }
    return (
        <>


            <div  className={styles.nav}>
                <ul className={styles.nav_list}>
                    <div className={styles.nav_item} onClick={() => {setShow(!show); setReset(false)}}>
                        <img src={menuIcon} alt='menu' />
                    </div>
                    <div className={styles.nav_item} onClick={()=>handleNavigate('home')}>
                        <img src={homeIcon} alt='home' />
                        </div>
                </ul>
                <ul className={styles.nav_list}>
                    <li>
                        <button onClick={handleLogout} className={styles.button}>Đăng xuất</button>
                    </li>
                </ul>
            </div>
            
            <Menu show={show} reset={reset} />
            <Outlet/>
        </>
    );
}

export default Header;
