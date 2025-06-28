import React from "react";
import MainLayout from "../../layouts/Users/MainLayout";
import styles from "./UnderConstruction.module.css";

const UnderConstruction = () => {
  return (
    <MainLayout>
      <main className={styles.main}>
        <section className={styles.constructionArea}>
          <div className={styles.constructionContainer}>
            <h1>Ối!</h1>
            <h2>Đang Xây Dựng!!</h2>
            <p>Hiện tại chúng tôi đang bảo trì trang web. Chúng tôi sẽ sớm quay lại. Cảm ơn sự kiên nhẫn của bạn.</p>
          </div>
        </section>
      </main>
    </MainLayout>
  );
};

export default UnderConstruction;