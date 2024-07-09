const showMenu = () => {
    const authorities = USER.authorities[0].authority;

    const menuItems = [
        {role: "ROLE_ADMIN", link: "../pages/player.html", text: "Quản Lý Cầu Thủ"},
        {role: "ROLE_ADMIN", link: "../pages/coach.html", text: "Quản Lý Huấn Luyện Viên"},
        {role: "ROLE_ADMIN", link: "../pages/report.html", text: "Báo Cáo"},
        {role: "ROLE_PLAYER", link: "../pages/profile.html", text: "Trang Cá Nhân"},
        {role: "ROLE_COACH", link: "../pages/player.html", text: "Quản Lý Cầu Thủ"},
        {role: "ROLE_COACH", link: "../pages/profile.html", text: "Trang Cá Nhân"}
    ];

    const menu = `
        <nav class="navbar navbar-expand-lg bg-white shadow-sm">
          <div class="container-fluid">
            <a class="navbar-brand" href="#">SC FOOTBALL FC</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainMenu" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="mainMenu">
              <ul class="navbar-nav me-auto mb-2 mb-lg-0" id="menus">
                <li class="nav-item">
                  <a class="nav-link" href="../index.html">Trang Chủ</a>
                </li>
              </ul>
              <div class="d-flex align-items-center">
                 <span>Xin chào ${USER.username}</span>
                 <button class="btn btn-link text-decoration-none" type="button" id="logout">
                    <span class="me-2">Đăng Xuất</span>
                    <i class="fa-solid fa-right-from-bracket"></i>
                 </button>
              </div>
            </div>
          </div>
        </nav>
    `;

    $("#menu").append(menu);

    menuItems.forEach(item => {
        if (authorities === item.role) {
            $("#menus").append(`
                <li class="nav-item">
                    <a class="nav-link" href="${item.link}">${item.text}</a>
                </li>
            `);
        }
    });
}
