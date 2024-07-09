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
    showChartSalary($modal, playerId);

}

const showChartSalary = async ($modal, playerId) => {
    // sống chậm lại ....
    await sleep(1500);
    // -----------------------
    let salaryData = await getSalaryData(playerId);
    $modal.find("#salary-chart").empty();

    salaryData = salaryData.sort((a, b) => {
        const weekA = parseInt(a.week.split('-W')[1]);
        const weekB = parseInt(b.week.split('-W')[1]);
        return weekA - weekB;
    });

    var options = {
        series: [{
            name: "Lương",
            data: salaryData.map(salary => {
                return salary.totalSalary;
            })
        }],
        chart: {
            height: 350,
            type: 'line',
            zoom: {
                enabled: false
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth'
        },
        grid: {
            row: {
                colors: ['#f3f3f3', 'transparent'],
                opacity: 0.5
            },
        },
        xaxis: {
            categories: salaryData.map(salary => {
                return salary.week;
            }),
        },
        yaxis: {
            labels: {
                formatter: function (value) {
                return formatVND(value);
            }
        }
}
    };

    var chart = new ApexCharts(document.querySelector("#salary-chart"), options);
    chart.render();
}

const showPlayer = async ($modal, playerId) => {
    // sống chậm lại ....
    await sleep(500);
    // -----------------------

    let player = await getPlayer(playerId);
    let template = playerProfileTemplate(player);
    $modal.find("#profile-content").html(template);

    $modal.find(".change-status-player").change(function () {
        updatePlayerStatus($(this).val(), playerId);
    })

}

const updatePlayerStatus = async (status, playerId) => {
    try {
        let formData = new FormData();
        formData.append("status", status);
        await updatePlayer(playerId, formData);
        showAlert("Thành công", "success", "Cập nhật trạng thái thành công");
        renderPlayersWithSearchForm();
    } catch (error) {
        let message = "";
        for (const key in error.responseJSON) {
            if (error.responseJSON.hasOwnProperty(key)) {
                message += `${key}: ${error.responseJSON[key]}, `;
            }
        }
        showAlert("Lỗi", "error", message);
    }
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
        target.closest(".player-item").fadeOut("slow", function() {
            $(this).remove();
            showAlert("Xóa thành công", "success");
        });
    } catch (error) {
        console.log(error);
        showAlert("Lỗi", "error", "Không thể xóa cầu thủ!");
    }
}


const toTablePlayersTemplate = (players) => {
    let items = "";
    players.forEach(player => {
        let removeBtn = (`
            <a href="players/${player.id}" class="btn btn-outline-danger delete-player  mx-1 btn-sm">
                <i class="fas fa-trash-alt"></i>
            </a>
        `)

        let payBtn = (`
            <a href="#" class="btn btn-outline-info pay-player  mx-1 btn-sm" data-id="${player.id}">
                <i class="fa-solid fa-money-bill"></i>
            </a>
        `)
        items += `
            <div class="col-12 col-md-6 col-lg-3 player-item">
            <div class="card shadow-sm border-0 mb-4 py-4">
                <div class="card-body text-center">
                    <div class="player-status ${player.status}">${playerStatusHuman(player.status)}</div>
                  <img src="${BASE_URL}image/${player.avatar}" alt="avatar" class="rounded-circle img-fluid avatar">
                  <h5 class="mt-3 mb-2">${player.name}</h5>
                  <p class="text-muted mb-1">${player?.position?.name}</p>
                  <p class="text-muted mb-1">${player.dob} | ${player.homeTown}</p>
                  <p class="text-muted mb-4">${player.performance} | ${formatVND(player.salary)}</p>
                  <div class="d-flex justify-content-center">
                    <a href="#" class="btn btn-outline-info edit-player mx-1 btn-sm" data-id="${player.id}">
                        <i class="fas fa-edit"></i>
                    </a>
                    <a href="#" class="btn btn-outline-info show-player mx-1 btn-sm" data-id="${player.id}">
                        <i class="fa-solid fa-eye"></i>
                    </a>                    

                    ${USER.authorities[0].authority === "ROLE_ADMIN"? payBtn : ""}
                    ${USER.authorities[0].authority === "ROLE_ADMIN"? removeBtn : ""}
                  </div>
                </div>
            </div>
            </div>

        `;
    })
    return (`
        <div class="row">
            ${items}
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
        <div id="profile-content" class="mb-5">
            ${loaderTemplate()}
        </div>
        <div class="shadow p-3 rounded">
            <h5>Biểu đồ lương</h5>
            <div id="salary-chart">
                ${loaderTemplate()}
            </div>
        </div>
    `)
}

const playerProfileTemplate = (player) => {
    return (`
        <div class="row align-items-stretch">
            <div class="col-lg-3">
                <div class="shadow p-3 rounded">
                <img src="${BASE_URL}image/${player.avatar}" alt="avatar" class="rounded img-fluid">
                </div>
                
            </div>
            <div class="col-lg-9">
                <div class="shadow p-3 rounded h-100">
                    <div class="d-flex justify-content-between">
                        <h5 class="mb-0">${player.name}</h5>
                        <div class="d-flex align-items-center">
                            <div class="form-check mx-2">
                              <input 
                                ${player.status == "playing" ? "checked" : ""} 
                                class="form-check-input change-status-player" value="playing" type="radio" name="status" id="status-playing">
                              <label class="form-check-label" for="status-playing">
                                Đang đá
                              </label>
                            </div>
                            <div class="form-check mx-2">
                              <input 
                                ${player.status == "injury" ? "checked" : ""} 
                                class="form-check-input change-status-player" value="injury" type="radio" name="status" id="status-injury">
                              <label class="form-check-label" for="status-injury">
                                Chấn thương
                              </label>
                            </div>
                            <div class="form-check mx-2">
                              <input 
                                ${player.status == "retire" ? "checked" : ""} 
                                class="form-check-input change-status-player" value="retire" type="radio" name="status" id="status-retire">
                              <label class="form-check-label" for="status-retire">
                                Giải nghệ
                              </label>
                            </div>                                                        
                        </div>
                    </div>
                    <div class="mt-4">
                        <div class="row">
                          <div class="col-12 col-lg-6">
                            <p>Ngày sinh: <span class="text-muted">${player.dob}</span></p>
                            <p>Quê quán: <span class="text-muted">${player.homeTown}</span></p>
                            <p>Vị trí chơi: <span class="text-muted">${player.position?.name}</span></p>
                            <p>Phong độ: <span class="text-muted">${player.performance}</span></p>
                            <p>Chiều cao: <span class="text-muted">${player.height}</span></p>
                          </div>
                          <div class="col-12 col-lg-6">
                            <p>Cân nặng: <span class="text-muted">${player.weight}</span></p>
                            <p>Chỉ số BMI: <span class="text-muted">${player.height/player.weight}</span></p>
                            <p>Lương cứng: <span class="text-muted">${formatVND(player.salary)}</span></p>
                            <p>Xếp hạng: <span class="text-muted">${player.ranking}</span></p>
                            <p>Hồ sơ năng lực: <span class="text-muted">${player.abilityProfile}</span></p>                          
                          </div>
                        </div>
                    </div>
                </div>
            </div>
      </div>
    `)
}

const playerStatusHuman = (status) => {
    switch (status) {
        case "playing":
            return "Đang đá";
        case "injury":
            return "Chấn thương";
        case "retire":
            return "Giải nghệ";
        default:
            return "";
    }
}