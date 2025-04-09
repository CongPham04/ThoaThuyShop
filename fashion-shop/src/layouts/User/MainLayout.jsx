import React from "react";
import Header from "../components/Header/Header";  
import Footer from "../components/Footer/Footer";

const MainLayout = ({children}) => {
    return(
        <div className="app">
        <Header />
        <main className="content">{children}</main>
        <Footer />
      </div>
    );
};
export default MainLayout; 