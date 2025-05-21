import React from "react";
import Header from "../../components/Home/Headers/Header";  
import Footer from "../../components/Home/Footers/Footer";


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