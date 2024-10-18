import React from 'react';
import { Link } from 'react-router-dom';


import styles from "../../styles/Footer.module.css";
import { ROUTES } from '../../utils/routes';


import LOGO from '../../images/logo.svg'


const Footer = () => {
    return (
        <section className={styles.footer}>
             <div className={styles.logo}>
                <Link to ={ROUTES.HOME}>
                    <img src={LOGO} alt="Sport"/>
                </Link>
            </div>

            <div className={styles.rights}>
                Developed by{" "}
                <a href="https://vk.com/n0v1k0vvv" target="_blank" rel="noreferrer">
                    Novikov
                </a>
            </div>

            <div className={styles.socials}>
                <a href="https://instagram.com" target="_blank" rel="noreferrer">
                    <svg className="icon">
                        <use xlinkHref={`${process.env.PUBLIC_URL}/sprite.svg#instagram`} />
                    </svg>
                </a>

                <a href="https://facebook.com" target="_blank" rel="noreferrer">
                    <svg className="icon">
                        <use xlinkHref={`${process.env.PUBLIC_URL}/sprite.svg#facebook`} />
                    </svg>
                </a>

                <a href="https://youtube.com" target="_blank" rel="noreferrer">
                    <svg className="icon">
                        <use xlinkHref={`${process.env.PUBLIC_URL}/sprite.svg#youtube`} />
                    </svg>
                </a>
            </div>
        </section>
    );
}

export default Footer;