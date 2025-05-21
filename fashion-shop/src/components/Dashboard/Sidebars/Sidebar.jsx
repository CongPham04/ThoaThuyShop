
// export default Sidebar;
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBox, faUsers,faList, faCreditCard, faChartLine, 
  faBullhorn, faHistory, faLifeRing, faCog, faTachometerAlt 
} from '@fortawesome/free-solid-svg-icons';
import styles from './Sidebar.module.css';
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/img/logo/LogoNew.png'

const Sidebar = () => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = React.useState('Dashboard');

  const menuItems = [
    { name: 'Overview', icon: faTachometerAlt },
    { name: 'Customer', icon: faUsers },
    { name: 'Category', icon: faList },
    { name: 'Product', icon: faBox },
    // { name: 'Transaction', icon: faCreditCard },
    // { name: 'Statistics', icon: faChartLine },
    // { name: 'Campaign', icon: faBullhorn },
    // { name: 'Log Activity', icon: faHistory },
    // { name: 'SUPPORT', icon: faLifeRing, isSection: true },
    // { name: 'Setting', icon: faCog },
    // { name: 'Help', icon: faLifeRing }
  ];

  const handleItemClick = (itemName) => {
    if (itemName === 'Overview') {
      navigate('/dashboard');
    } else {
      navigate(`/${itemName.toLowerCase()}`);
    }
    setActiveItem(itemName);
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <h2 className={styles.logo}><a href="/dashboard"><img src={logo} alt="Thoa Thuỷ Shop" /></a></h2>
      </div>
      
      <nav className={styles.nav}>
        <ul className={styles.menu}>
          {menuItems.map((item) => (
            <li 
              key={item.name}
              className={`${styles.menuItem} ${activeItem === item.name ? styles.active : ''} ${item.isSection ? styles.section : ''}`}
              onClick={() => !item.isSection && handleItemClick(item.name)}
            >
              <FontAwesomeIcon icon={item.icon} className={styles.icon} />
              <span className={styles.menuText}>{item.name}</span>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;