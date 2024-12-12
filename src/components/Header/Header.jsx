import styles from './Header.module.css';
import Menu from '../Menu/Menu';
import menuIcon from '../../assets/icons/svgs/menuIcon.svg';
import homeIcon from '../../assets/icons/svgs/homeIcon.svg';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
function Header() {
    const [show, setShow] = useState(false);
    const [reset, setReset] = useState(false);
    const navigate = useNavigate();
    const handleNavigate = (select) => {
        setReset(true);
        if(select === 'home'){
            navigate('/home');
            setShow(false);
        }
    };
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
                        <button className={styles.button}>Đăng xuất</button>
                    </li>
                </ul>
            </div>
            
            <Menu show={show} reset={reset} />
        </>
    );
}

export default Header;
