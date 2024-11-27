import styles from './Menu.module.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
function Menu({show}) {
    const navigate = useNavigate();
    const [isActive, setActive] = useState('');
    const [isExpanded, setExpanded] = useState(''); // Trạng thái chỉ lưu 1 giá trị hoặc null
    const [isOpen, setOpen] = useState(false);
    const handleActive = (select) => {
        if (select === 'report' || select === 'regulasie') {
            if (isExpanded === select) {
                if(isActive ==='list'||isActive ==='search')
                    setExpanded('')
                setOpen(!isOpen);
            } else {
                setExpanded(select);
                setOpen(true);
            }
        } else {
            if (select === 'list' || select === 'search') {
                setExpanded('');
                setOpen(false);
            }
            setActive(select);
        }
    };
    const handleNavigate = (select) => {
        const paths = {
            list: '/examination',
            search: '/search',
            sales: '/report/sales',
            medicine: '/report/medicine',
            pharmacy: '/regulations/pharmacy',
            diseaseList: '/regulations/disease-list',
            other: '/regulations/other',
        };

        navigate(paths[select]);
    };
    return (
        <div className={`${styles.menu} ${show ? styles.menuShow : styles.menuHidden}`}>
            <div
                className={`${styles.menu_item} ${
                    isActive === 'list' ? styles.active : ''
                }`}
                onClick={() =>{ handleActive('list'); handleNavigate('list');}}

            >
                Lập danh sách khám bệnh
            </div>
            <div
                className={`${styles.menu_item} ${
                    isActive === 'search' ? styles.active : ''
                }`}
                onClick={() => {handleActive('search'); handleNavigate('search');}}
            >
                Tra cứu bệnh nhân
            </div>
            <div
                className={`${styles.menu_item} ${
                   (isExpanded === 'report'&& isOpen) ? styles.expand : '' || (isActive === 'sales' ||  isActive === 'medicine' ) ? styles.active: ''
                }`}
                onClick={() => handleActive('report')}
            >
                Lập báo cáo
            </div>
            <div
                className={`${styles.submenu} ${
                    isOpen && isExpanded === 'report' ? styles.show : ''
                }`}
            >
                <div
                    className={`${styles.menu_item} ${
                        isActive === 'sales' ? styles.active : ''
                    }`}
                    onClick={() => {handleActive('sales'); handleNavigate('sales');}}
                >
                    Lập báo cáo doanh thu
                </div>
                <div
                    className={`${styles.menu_item} ${
                        isActive === 'medicine' ? styles.active : ''
                    }`}
                    onClick={() => {handleActive('medicine'); handleNavigate('medicine');}}
                >
                    Lập báo cáo thuốc
                </div>
            </div>

            <div
                className={`${styles.menu_item} ${
                    (isExpanded === 'regulasie' && isOpen)   ? styles.expand : '' || (isActive === 'diseaseList' ||  isActive === 'pharmacy' ||  isActive === 'other') ? styles.active: ''
                }`}
                onClick={() => handleActive('regulasie')}
            >
                Thay đổi quy định
            </div>
            <div
                className={`${styles.submenu} ${
                    isOpen && isExpanded === 'regulasie' ? styles.show : ''
                }`}
            >
                <div
                    className={`${styles.menu_item} ${
                        isActive === 'pharmacy' ? styles.active : ''
                    }`}
                    onClick={() =>{ handleActive('pharmacy'); handleNavigate('pharmacy');}}
                >
                    Thay đổi kho thuốc
                </div>
                <div
                    className={`${styles.menu_item} ${
                        isActive === 'diseaseList' ? styles.active : ''
                    }`}
                    onClick={() => {handleActive('diseaseList'); handleNavigate('diseaseList');}}
                >
                    Thay đổi danh sách bệnh
                </div>
                <div
                    className={`${styles.menu_item} ${
                        isActive === 'other' ? styles.active : ''
                    }`}
                    onClick={() => {handleActive('other'); handleNavigate('other');}}
                >
                    Thay đổi khác
                </div>
            </div>
        </div>
    );
}

export default Menu;
