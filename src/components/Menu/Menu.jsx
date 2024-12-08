import styles from './Menu.module.css';
import React from 'react';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import clsx from 'clsx';

function Menu({ show }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [menu, setMenu] = useState({
        active: '',
        expanded: '',
        open: false,
    });

    const menuItems = useMemo(() => [
        { key: 'list', label: 'Lập danh sách khám bệnh', path: '/examination' },
        { key: 'search', label: 'Tra cứu bệnh nhân', path: '/search' },
        {
            key: 'report',
            label: 'Lập báo cáo',
            children: [
                { key: 'sales', label: 'Lập báo cáo doanh thu', path: '/report/sales' },
                { key: 'medicine', label: 'Lập báo cáo thuốc', path: '/report/medicines' },
            ],
        },
        {
            key: 'regulasie',
            label: 'Thay đổi quy định',
            children: [
                { key: 'pharmacy', label: 'Thay đổi kho thuốc', path: '/regulations/pharmacy' },
                { key: 'diseaseList', label: 'Thay đổi danh sách bệnh', path: '/regulations/disease-list' },
                { key: 'other', label: 'Thay đổi khác', path: '/regulations/other' },
            ],
        },
    ], []);

    useEffect(() => {
        const activeMenu = menuItems
            .filter(item =>
                !item.children
                    ? item.path === location.pathname
                    : item.children.some(child => child.path === location.pathname)
            )
            .map(item =>
                !item.children
                    ? item.key
                    : item.children.find(child => child.path === location.pathname)?.key
            )[0];

        setMenu({
            active: activeMenu || '',
            expanded: '',
            open: false,
        });
    }, []);

    const handleActive = useCallback((select) => {
        if (select === 'report' || select === 'regulasie') {
            if (menu.expanded === select) {
                setMenu(prevMenu => ({
                    ...prevMenu,
                    expanded: '',
                    open: !prevMenu.open,
                }));
            } else {
                setMenu(prevMenu => ({
                    ...prevMenu,
                    expanded: select,
                    open: true,
                }));
            }
        } else {
            (select === 'list'||select==='search')?
            setMenu({
                active: select,
                expanded: '',
                open: false,
            }):setMenu({
                ...menu,
                active: select,
                open:true
            });
        }
    }, [menu.expanded]);

    const handleNavigate = useCallback((select) => {
        const paths = {
            list: '/examination',
            search: '/search',
            sales: '/report/sales',
            medicine: '/report/medicines',
            pharmacy: '/regulations/pharmacy',
            diseaseList: '/regulations/disease-list',
            other: '/regulations/other',
        };
        navigate(paths[select]);
    }, [navigate]);

    return (
        <div
            className={clsx(
                styles.menu,
                show ? styles.menuShow : styles.menuHidden
            )}
        >
            {menuItems.map((item) => (
                <React.Fragment key={item.key}>
                    <div
                        className={clsx(
                            styles.menu_item,
                            !item.children && menu.active === item.key && styles.active,
                            item.children && menu.expanded === item.key && menu.open && styles.expand,
                            item.children && item.children.some(child => child.key === menu.active) && styles.active
                        )}
                        onClick={() => {
                            handleActive(item.key);
                            if (!item.children) {
                                handleNavigate(item.key);
                            }
                        }}
                    >
                        {item.label}
                    </div>
                    {item.children && (
                        <div
                            className={clsx(
                                styles.submenu,
                                menu.open && menu.expanded === item.key && styles.show
                            )}
                        >
                            {item.children.map((itemChildren) => (
                                <div
                                    key={itemChildren.key}
                                    className={clsx(
                                        styles.menu_item,
                                        menu.active === itemChildren.key && styles.active
                                    )}
                                    onClick={() => {
                                        handleActive(itemChildren.key);
                                        handleNavigate(itemChildren.key);
                                    }}
                                >
                                    {itemChildren.label}
                                </div>
                            ))}
                        </div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
}

export default Menu;
