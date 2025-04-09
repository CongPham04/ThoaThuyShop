import React from "react";


const AuthLayout = ({children}) => {
    return(
        <div className="app">
            <main className="content">{children}</main>
        </div>
    );
};
export default AuthLayout; 