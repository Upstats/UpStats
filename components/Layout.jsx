import React from "react";
import Head from "next/head";

const Layout = (props) => {
  const logout = () => {
    window.localStorage.removeItem("token");
    window.location = "/login";
  };
  return (
    <>
      <Head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Dashboard | Site Name</title>

        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />

        <link rel="stylesheet" href="/assets/css/dashboard.css" />
        <link rel="stylesheet" href="/assets/vendor/tailwind.min.css" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/boxicons@latest/css/boxicons.min.css"
        />
      </Head>
      <>
        <header className="header">
          <div className="header_container">
            {/* Website Logo mentioned in Envs */}
            <img src="/assets/img/logo.jpg" className="header_img" />
            <a href="#" className="header_logo">
              UP STATS
            </a>
            <div className="header_toggle">
              <i className="bx bx-menu" id="header-toggle" />
            </div>
          </div>
        </header>
        {/* Nav */}
        <div className="nav" id="navbar">
          <nav className="nav_container">
            <div>
              <div>
                <a href="#" className="nav_link nav_logo font-extrabold">
                  <span className="nav_logo-name">UP Stats</span>
                </a>
                <div className="nav_list">
                  <div className="nav_items">
                    <h3 className="nav_mainmenu">Dashboard</h3>
                    <a href="/admin" className="nav_link active">
                      <i className="bx bx-home nav_icon" />
                      <span className="nav_name">Manage Status</span>
                    </a>
                    <a href="/admin/manage-admins" className="nav_link">
                      <i className="bx bx-user nav_icon" />
                      <span className="nav_name">Manage Admins</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            {/* Log Out */}
            <div onClick={logout} className="nav_link nav_logout pb-10">
              <i className="bx bx-log-out nav_icon" />
              <span className="nav_name">Log Out</span>
            </div>
          </nav>
        </div>
        <main className="pt-12">{props.children}</main>
      </>
      <script src="/assets/js/main.js"></script>
    </>
  );
};

export default Layout;
