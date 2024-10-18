import React from "react";

import styles from "../../styles/Home.module.css";



const Poster = () => (
  <section className={styles.home}>
    <div className={styles.title}>BIG SALE</div>
    <div className={styles.product}>
      <div className={styles.text}>
        <div className={styles.subtitle}>the bestseller of 2024</div>
        <h1 className={styles.head}>3 мешка тренболона по цене 1</h1>
        <button className={styles.button}>Shop Now</button>
      </div>
      <div className={styles.image}>
        
      </div>
    </div>
  </section>
);

export default Poster;