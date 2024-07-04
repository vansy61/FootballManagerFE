const showMenu = (roles) => {
    $("#menu").append(`
        <nav class="navbar navbar-expand-lg bg-white shadow-sm">
          <div class="container-fluid">
            <a class="navbar-brand" href="#">SC FOOTBALL FC</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainMenu" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="mainMenu">
              <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                  <a class="nav-link" href="../index.html">Trang Chủ</a>
                </li>
                
                <li class="nav-item">
                  <a class="nav-link" href="../pages/player.html">Quản Lý Cầu Thủ</a>
                </li>
                
                <li class="nav-item">
                  <a class="nav-link" href="../pages/coach.html">Quản Lý Huấn Luyện Viên</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
    `)
}