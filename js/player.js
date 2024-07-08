const showPage = () => {
    initFormSearch();
    $("#player-search").submit(e => {
        e.preventDefault();
        renderPlayersWithSearchForm();
    }).submit();

    // Bind new document event
    $("#new-player").click(function(e) {
        e.preventDefault();
        showNewPlayer();
    });
}

const showNewPlayer = async () => {
    const $modal = addModal("Thêm mới cầu thủ", true);

    // sống chậm lại ....
    await sleep(500);
    // -----------------------

    let positions = await getPositions();
    let template = formPlayerTemplate(positions, true);
    $modal.find(".modal-body").html(template);

    // Bind submit button
    $modal.find(".m-submit").click(function(e) {
        e.preventDefault();
        submitNewPlayer($modal);
    });
}

const submitNewPlayer = async ($modal) => {
    if (!validatePlayer()) {
        return;
    }

    let formData = new FormData($("#form-player").get(0));

    try {
        await createPlayer(formData);
        $modal.data().modal.hide();
        showAlert("Thành công", "success", "Thêm mới thành công");
        renderPlayersWithSearchForm();
    } catch (error) {
        $modal.find(".m-submit").prop("disabled", false);
        let message = "";
        for (const key in error.responseJSON) {
            if (error.responseJSON.hasOwnProperty(key)) {
                message += `${key}: ${error.responseJSON[key]}, `;
            }
        }
        showAlert("Lỗi", "error", message);
    }

}

const validatePlayer = () => {
    $(".invalid-feedback").remove();
    $(".is-invalid").removeClass("is-invalid");
    let status = true;

    const validateField = (field, condition, message) => {
        if (condition) {
            field.addClass("is-invalid");
            field.after(`<div class='invalid-feedback'>${message}</div>`);
            status = false;
        }
    };

    validateField(
        $("#email"),
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($("#email").val()),
        "Email không hợp lệ"
    );
    validateField(
        $("#password"),
        $("#password").val().length < 6 || $("#password").val().length > 8,
        "Vui lòng nhập tên"
    );

    return status;
}

const initFormSearch = async () => {
    const positions = await getPositions();
    const selectPosition = $("#search-position");
    positions.forEach(position => {
        selectPosition.append(`<option value="${position.id}">${position.name}</option>`);
    });


}

const renderPlayersWithSearchForm = async () => {
    let formData = $('#player-search').serialize();
    let $playerArea = $("#list-players");
    $playerArea.html(loaderTemplate());

    // sống chậm lại ....
    await sleep(500);
    // -----------------------

    const players = await getPlayers(formData);


    if (players.content.length === 0) {
        $playerArea.html(`<h5 class="text-center">Không có kết quả nào</h5>`);
        return;
    }

    let tablePlayersTemplate = toTablePlayersTemplate(players.content);
    $playerArea.html(tablePlayersTemplate);

    let pagination = createPagination(players.totalPages, players.number);
    $(".pagination").html(pagination);
    $(".pagination a").click(function(e) {
        e.preventDefault();
        $("#page").val($(this).attr("data-page"));
        renderPlayersWithSearchForm();
    });
    $("#page").val(0);

    // Bind delete document event
    $(".delete-player").click(function(e) {
        e.preventDefault();
        if (confirm("Bạn thực sự muốn xóa?")) {
            deletePlayer($(this));
        }
    });

    // Bind edit document event
    $(".edit-player").click(function(e) {
        e.preventDefault();
        showEditPlayer($(this).attr("data-id"));
    });

    // Bind pay document event
    $(".pay-player").click(function(e) {
        e.preventDefault();
        showPayPlayer($(this).attr("data-id"));
    });

    // Bind pay document event
    $(".show-player").click(function(e) {
        e.preventDefault();
        showPlayerProfile($(this).attr("data-id"));
    });
}

const showPlayerProfile = async (playerId) => {
    const $modal = addModal("Thông tin cầu thủ", true, "modal-xl");


    let template = playerTemplate();
    $modal.find(".modal-body").html(template);

    showPlayer($modal, playerId);

}

const showPlayer = async ($modal, playerId) => {
    // sống chậm lại ....
    await sleep(500);
    // -----------------------

    let player = await getPlayer(playerId);
    let template = playerProfileTemplate(player);



}

const showPayPlayer = async (playerId) => {
    const $modal = addModal("Thêm lương cầu thủ", true);

    // sống chậm lại ....
    await sleep(500);
    // -----------------------

    let player = await getPlayer(playerId);
    let template = payPlayerTemplate();
    $modal.find(".modal-body").html(template);

    // Bind pay button
    $modal.find(".m-submit").click(function(e) {
        e.preventDefault();
        payPlayer($modal, playerId);
    });
}

const payPlayer = async ($modal, playerId) => {
    let payData = {
        week: $("#week").val(),
        abilitySalary: $("#abilitySalary").val(),
        hourPlay: $("#hourPlay").val(),
        bonus: $("#bonus").val()
    }

    try {
        await createPayPlayer(playerId, payData);
        $modal.data().modal.hide();
        showAlert("Thành công", "success", "Thêm lương thành công");
    } catch (error) {
        $modal.find(".m-submit").prop("disabled", false);
        let message = "";
        for (const key in error.responseJSON) {
            if (error.responseJSON.hasOwnProperty(key)) {
                message += `${key}: ${error.responseJSON[key]}, `;
            }
        }
        showAlert("Lỗi", "error", message);
    }
}

const showEditPlayer = async (playerId) => {
    const $modal = addModal("Chỉnh sửa cầu thủ", true);

    // sống chậm lại ....
    await sleep(500);
    // -----------------------

    const [positions, player] = await Promise.all([getPositions(), getPlayer(playerId)]);
    let template = formPlayerTemplate(positions);
    $modal.find(".modal-body").html(template);

    // show current value => refactor
    $("#name").val(player.name);
    $("#dob").val(player.dob);
    $("#position").val(player.positionId);
    $("#salary").val(player.salary);
    $("#height").val(player.height);
    $("#weight").val(player.weight);
    $("#ranking").val(player.ranking);
    $("#homeTown").val(player.homeTown);
    $("#abilityProfile").val(player.abilityProfile);
    $("#performance").val(player.performance);
    $("#status").val(player.status);


    // Bind submit button
    $modal.find(".m-submit").click(function(e) {
        e.preventDefault();
        submitUpdatePlayer($modal, playerId);
    });
}

const submitUpdatePlayer = async ($modal, playerId) => {

    let formData = new FormData($("#form-player").get(0));

    try {
        await updatePlayer(playerId, formData);
        $modal.data().modal.hide();
        showAlert("Thành công", "success", "Cập nhật thành công");
        renderPlayersWithSearchForm();
    } catch (error) {
        $modal.find(".m-submit").prop("disabled", false);
        let message = "";
        for (const key in error.responseJSON) {
            if (error.responseJSON.hasOwnProperty(key)) {
                message += `${key}: ${error.responseJSON[key]}, `;
            }
        }
        showAlert("Lỗi", "error", message);
    }

}

const deletePlayer = async (target) => {
    try {
        await deletePlayerById(target.attr("href"));
        target.closest("tr").fadeOut("slow", function() {
            $(this).remove();
            showAlert("Xóa thành công", "success");
        });
    } catch (error) {
        console.log(error);
        showAlert("Lỗi", "error", "Không thể xóa tài liệu");
    }
}


const toTablePlayersTemplate = (players) => {
    let rows = "";
    players.forEach(player => {
        rows += `
            <tr>
                <td><img class="avatar" src="${BASE_URL}image/${player.avatar}"></td>
                <td>${player.name}</td>
                <td>${player.dob}</td>
                <td>${player.homeTown}</td>
                <td>${player?.position?.name}</td>
                <td>${player.performance}</td>
                <td>${formatVND(player.salary)}</td>
                <td>
                    <a href="#" class="btn btn-outline-info edit-player" data-id="${player.id}">
                        <i class="fas fa-edit"></i>
                    </a>
                    <a href="#" class="btn btn-outline-info show-player" data-id="${player.id}">
                        <i class="fa-solid fa-eye"></i>
                    </a>                    
                    <a href="#" class="btn btn-outline-info pay-player" data-id="${player.id}">
                        <i class="fa-solid fa-money-bill"></i>
                    </a>
                    <a href="players/${player.id}" class="btn btn-outline-danger delete-player">
                        <i class="fas fa-trash-alt"></i>
                    </a>
                </td>
            </tr>
        `;
    })
    return (`
        <div class="table-responsive">
       <table class="table table-bordered" >
            <thead>
                <tr>
                    <th>Ảnh</th>
                    <th>Tên</th>
                    <th>Ngày Sinh</th>
                    <th>Quê Quán</th>
                    <th>Vị Trí</th>
                    <th>Phong độ</th>
                    <th>Mức Lương</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                ${rows}
            </tbody>
        </table>
        </div>
    `)
}



const formPlayerTemplate = (positions, withUserForm = false) => {
    let positionOptions = positions.map(type => {
        return `<option value="${type.id}">${type.name}</option>`;
    })
    return(`
        <form id="form-player">
            ${withUserForm ? userFormTemplate() : ""}
            <div class="shadow-sm border p-2 rounded mb-3">
                <h6 class="mb-2">Thông tin cầu thủ</h6>
                <div class="row">
                    <div class="col-6">
                        <div class="mb-3">
                            <label class="form-label">Tên</label>
                            <input type="text" class="form-control" id="name" name="name">       
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Ngày sinh</label>
                            <input type="date" class="form-control" id="dob" name="dob">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Quê quán</label>
                            <input type="text" class="form-control" id="homeTown" name="homeTown">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Chiều cao</label>
                            <input type="number" class="form-control" id="height" name="height">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Cân nặng</label>
                            <input type="number" class="form-control" id="weight" name="weight">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Phong độ</label>
                            <input type="text" class="form-control" id="performance" name="performance">
                        </div>                        
                        <div class="mb-3">
                            <label class="form-label">Trạng thái</label>
                            <select id="status" class="form-select" name="status">
                                <option value="playing">Đang đá</option>
                                <option value="injury">Chấn thương</option>
                                <option value="retire">Giải nghệ</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="mb-3">
                            <label class="form-label">Vị Trí</label>
                            <select id="positionId" class="form-select" name="positionId">
                                ${positionOptions.join("")}
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Lương cứng</label>
                            <input type="number" class="form-control" id="salary" name="salary">
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Xếp hạng</label>
                            <input type="text" class="form-control" id="ranking" name="ranking">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Hồ sơ năng lực</label>
                            <input type="text" class="form-control" id="abilityProfile" name="abilityProfile">
                        </div>  
                        <div class="mb-3">
                            <label class="form-label">Ảnh đại diện</label>
                            <input type="file" class="form-control" id="avatar" name="avatar">
                        </div>                                             
                    </div>
                </div>
            
            </div>

        </form>
    `)
}


const userFormTemplate = () => {
    return (`
        <div class="shadow-sm border p-2 rounded mb-3">
            <h6 class="mb-2">Thông tin đăng nhập</h6>
            <div class="row">
                <div class="col-6">
                    <div class="mb-3">
                        <label class="form-label">Email</label>
                        <input type="email" class="form-control" id="email" name="userEmail">       
                    </div>
                </div>
                <div class="col-6">
                    <div class="mb-3">
                        <label class="form-label">Mật khẩu</label>
                        <input type="password" class="form-control" id="password" name="userPassword">       
                    </div>                    
                </div>
            </div>
        </div>
    `)
}

const payPlayerTemplate = () => {
    return (`
        <div class="shadow-sm border p-2 rounded mb-3">
            <div class="row">
                <div class="col-6">
                    <div class="mb-3">
                        <label class="form-label">Tuần</label>
                        <input type="week" class="form-control" id="week">       
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Số giờ đá</label>
                        <input type="number" class="form-control" id="hourPlay" name="hourPlay">       
                    </div>  
                </div>
                <div class="col-6">
                    <div class="mb-3">
                        <label class="form-label">Lương năng lực</label>
                        <input type="number" class="form-control" id="abilitySalary" name="abilitySalary">       
                    </div> 
                    <div class="mb-3">
                        <label class="form-label">Thưởng</label>
                        <input type="number" class="form-control" id="bonus" name="bonus">       
                    </div>                   
                </div>
            </div>
        </div>
    `)
}

const playerTemplate = () => {
    return (`
        <div class="shadow-sm border p-2 rounded mb-3">
            <div id="profile-content">
                ${loaderTemplate()}
            </div>
        </div>
        <div class="shadow-sm border p-2 rounded mb-3">
            <h5>Biểu đồ lương</h5>
            <div id="salary-chart">
                ${loaderTemplate()}
            </div>
        </div>
        <div class="shadow-sm border p-2 rounded mb-3">
            <h5>Lịch sử lương</h5>
            <div id="salary-info">
                ${loaderTemplate()}
            </div>
        </div>
    `)
}

const playerProfileTemplate = (player) => {
    return (`
        <div class="row">
        <div class="col-lg-4">
          <div class="card mb-4">
            <div class="card-body text-center">
              <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp" alt="avatar" class="rounded-circle img-fluid" style="width: 150px;">
              <h5 class="my-3">John Smith</h5>
              <p class="text-muted mb-1">Full Stack Developer</p>
              <p class="text-muted mb-4">Bay Area, San Francisco, CA</p>
              <div class="d-flex justify-content-center mb-2">
                <button type="button" data-mdb-button-init="" data-mdb-ripple-init="" class="btn btn-primary" data-mdb-button-initialized="true">Follow</button>
                <button type="button" data-mdb-button-init="" data-mdb-ripple-init="" class="btn btn-outline-primary ms-1" data-mdb-button-initialized="true">Message</button>
              </div>
            </div>
          </div>
          <div class="card mb-4 mb-lg-0">
            <div class="card-body p-0">
              <ul class="list-group list-group-flush rounded-3">
                <li class="list-group-item d-flex justify-content-between align-items-center p-3">
                  <i class="fas fa-globe fa-lg text-warning"></i>
                  <p class="mb-0">https://mdbootstrap.com</p>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center p-3">
                  <i class="fab fa-github fa-lg text-body"></i>
                  <p class="mb-0">mdbootstrap</p>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center p-3">
                  <i class="fab fa-twitter fa-lg" style="color: #55acee;"></i>
                  <p class="mb-0">@mdbootstrap</p>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center p-3">
                  <i class="fab fa-instagram fa-lg" style="color: #ac2bac;"></i>
                  <p class="mb-0">mdbootstrap</p>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center p-3">
                  <i class="fab fa-facebook-f fa-lg" style="color: #3b5998;"></i>
                  <p class="mb-0">mdbootstrap</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="col-lg-8">
          <div class="card mb-4">
            <div class="card-body">
              <div class="row">
                <div class="col-sm-3">
                  <p class="mb-0">Full Name</p>
                </div>
                <div class="col-sm-9">
                  <p class="text-muted mb-0">Johnatan Smith</p>
                </div>
              </div>
              <hr>
              <div class="row">
                <div class="col-sm-3">
                  <p class="mb-0">Email</p>
                </div>
                <div class="col-sm-9">
                  <p class="text-muted mb-0">example@example.com</p>
                </div>
              </div>
              <hr>
              <div class="row">
                <div class="col-sm-3">
                  <p class="mb-0">Phone</p>
                </div>
                <div class="col-sm-9">
                  <p class="text-muted mb-0">(097) 234-5678</p>
                </div>
              </div>
              <hr>
              <div class="row">
                <div class="col-sm-3">
                  <p class="mb-0">Mobile</p>
                </div>
                <div class="col-sm-9">
                  <p class="text-muted mb-0">(098) 765-4321</p>
                </div>
              </div>
              <hr>
              <div class="row">
                <div class="col-sm-3">
                  <p class="mb-0">Address</p>
                </div>
                <div class="col-sm-9">
                  <p class="text-muted mb-0">Bay Area, San Francisco, CA</p>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <div class="card mb-4 mb-md-0">
                <div class="card-body">
                  <p class="mb-4"><span class="text-primary font-italic me-1">assigment</span> Project Status</p>
                  <p class="mb-1" style="font-size: .77rem;">Web Design</p>
                  <div class="progress rounded" style="height: 5px;">
                    <div class="progress-bar" role="progressbar" style="width: 80%" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100"></div>
                  </div>
                  <p class="mt-4 mb-1" style="font-size: .77rem;">Website Markup</p>
                  <div class="progress rounded" style="height: 5px;">
                    <div class="progress-bar" role="progressbar" style="width: 72%" aria-valuenow="72" aria-valuemin="0" aria-valuemax="100"></div>
                  </div>
                  <p class="mt-4 mb-1" style="font-size: .77rem;">One Page</p>
                  <div class="progress rounded" style="height: 5px;">
                    <div class="progress-bar" role="progressbar" style="width: 89%" aria-valuenow="89" aria-valuemin="0" aria-valuemax="100"></div>
                  </div>
                  <p class="mt-4 mb-1" style="font-size: .77rem;">Mobile Template</p>
                  <div class="progress rounded" style="height: 5px;">
                    <div class="progress-bar" role="progressbar" style="width: 55%" aria-valuenow="55" aria-valuemin="0" aria-valuemax="100"></div>
                  </div>
                  <p class="mt-4 mb-1" style="font-size: .77rem;">Backend API</p>
                  <div class="progress rounded mb-2" style="height: 5px;">
                    <div class="progress-bar" role="progressbar" style="width: 66%" aria-valuenow="66" aria-valuemin="0" aria-valuemax="100"></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="card mb-4 mb-md-0">
                <div class="card-body">
                  <p class="mb-4"><span class="text-primary font-italic me-1">assigment</span> Project Status</p>
                  <p class="mb-1" style="font-size: .77rem;">Web Design</p>
                  <div class="progress rounded" style="height: 5px;">
                    <div class="progress-bar" role="progressbar" style="width: 80%" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100"></div>
                  </div>
                  <p class="mt-4 mb-1" style="font-size: .77rem;">Website Markup</p>
                  <div class="progress rounded" style="height: 5px;">
                    <div class="progress-bar" role="progressbar" style="width: 72%" aria-valuenow="72" aria-valuemin="0" aria-valuemax="100"></div>
                  </div>
                  <p class="mt-4 mb-1" style="font-size: .77rem;">One Page</p>
                  <div class="progress rounded" style="height: 5px;">
                    <div class="progress-bar" role="progressbar" style="width: 89%" aria-valuenow="89" aria-valuemin="0" aria-valuemax="100"></div>
                  </div>
                  <p class="mt-4 mb-1" style="font-size: .77rem;">Mobile Template</p>
                  <div class="progress rounded" style="height: 5px;">
                    <div class="progress-bar" role="progressbar" style="width: 55%" aria-valuenow="55" aria-valuemin="0" aria-valuemax="100"></div>
                  </div>
                  <p class="mt-4 mb-1" style="font-size: .77rem;">Backend API</p>
                  <div class="progress rounded mb-2" style="height: 5px;">
                    <div class="progress-bar" role="progressbar" style="width: 66%" aria-valuenow="66" aria-valuemin="0" aria-valuemax="100"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `)
}