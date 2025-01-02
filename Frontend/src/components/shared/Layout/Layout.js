import React from "react";
import Header from "./Header";
import Sidebar from "./Menus/Sidebar";
import "../../../styles/layout.css";

const Layout = ({ children }) => {
  return (
    <>
     <div className="layout">
      <header className="layout-header">
        <Header />
      </header>
      <div className="layout-body">
        <aside className="layout-sidebar">
          <Sidebar />
        </aside>
        <main className="layout-content">{children}</main>
      </div>
    </div>
    </>
  );
};

export default Layout;
