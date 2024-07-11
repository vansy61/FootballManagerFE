function showPage() {
    showPageCoach()
}

function showPageCoach() {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/api/coach",
        success: function (data) {
            let itemHtml = "";
            $.each(data.content, function (index, el) {
                itemHtml += (`
                    <div class="col-12 col-md-6 col-lg-3 player-item">
                    <div class="card shadow-sm border-0 mb-4">
                        <div class="card-body text-center">
                            <img src="../image/ava3.webp" alt="avatar" class="rounded-circle img-fluid avatar">
                          <h5 class="mt-3 mb-2">${el.name}</h5>
                          <p class="text-muted mb-1">${el.dob} </p>
                          <p class="text-muted mb-1">${el.homeTown}</p>
                          <div class="d-flex justify-content-center">
                            <a data-id="${el.id}" class="btn btn-outline-info mx-1 btn-sm edit"><i class="fas fa-edit"></i></a>
                          
                            <a data-id="${el.id}" class="btn btn-outline-info mx-1 btn-sm detail">
                                <i class="fa-solid fa-eye"></i>
                            </a>
                            
                            <a data-id="${el.id}" class="btn btn-outline-info mx-1 btn-sm salary"><i class="fa-solid fa-money-bill"></i></a>
                            <a data-id="${el.id}" class="btn btn-outline-danger mx-1 btn-sm delete"><i class="fas fa-trash-alt"></i></a>
                            
                          </div>
                        </div>
                    </div>
                    </div>

                `);

            })

            $("#list-coach").html(itemHtml);
            $(".detail").click(function () {
                let id = $(this).data().id;
                showDetail(id)
            });

            $(".delete").click(function (e) {
                e.preventDefault();
                let id = $(this).data().id;
                if (confirm("Bạn thực sự muốn xóa?")) {
                    deleteCoach(id);
                }

            });
            $(".edit").click(function (e) {
                e.preventDefault();
                let id = $(this).data().id;
                showFormEdit(id);
            });
            $(".salary").click(function (e) {
                e.preventDefault();
                let id = $(this).data().id;
                showFormSalary(id);
            });
        }
    })
}

function showDetail(id) {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/api/coach/" + id,
        success: function (dataDetail) {
            let itemHtml1 = (`<div class="row align-items-stretch">
            <div class="col-12">
                <div class="shadow-sm p-3 rounded h-100">
                    <div class="d-flex justify-content-between">
                        <h5 class="mb-0">${dataDetail.name}</h5>
                    </div>
                    <div class="mt-4">
                        <div class="row">
                          <div class="col-12 col-lg-6">
                            <p>Ngày sinh: <span class="text-muted">${dataDetail.dob}</span></p>
                            <p>Quê quán: <span class="text-muted">${dataDetail.homeTown}</span></p>
                            <p>Email:  <span class="text-muted">${dataDetail.user.email}</span></p>        
                          </div>
                          <div class="col-12 col-lg-6">
                            <p>Lương cứng: <span class="text-muted">${formatVND(dataDetail.salary)}</span></p>
                            <p>Kỹ năng: <span class="text-muted">${dataDetail.abilityProfile}</span></p>                          
                          </div>
                        </div>
                    </div>
                    
                </div>
            </div>
      </div>`);
            let itemChart = (`<div class="shadow-sm p-3 rounded h-100 mt-3"><div id="chart"></div></div>`);
            const $modal = addModal("Chi tiết huấn luyện viên", true);
            $modal.find(".modal-body").html(itemHtml1).append(itemChart);
            var options = {
                chart: {
                    type: "bar"
                },
                series: [
                    {
                        name: "sales",
                        data: [30, 40, 45, 50, 49, 60, 70, 91, 125]
                    }
                ],
                xaxis: {
                    categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
                }
            };

            var chart = new ApexCharts(document.querySelector("#chart"), options);

            chart.render();

        }
    })
}

function deleteCoach(id) {
    $.ajax({
        type: "delete",
        url: "http://localhost:8080/api/coach/" + id,
        success: function () {
            showAlert("Xóa thành công", "success");
            showPageCoach();
        }

    })
}

function showFormAdd() {
    let formCreate = `
    <form id="form" novalidate="novalidate">
        <div class="form-group row">
            <label for="name" class="col-sm-2 col-form-label">Name</label>
            <div class="col-sm-10 mb-4">
                <input type="text" class="form-control" id="name" placeholder="Abc">
            </div>
        </div>
        <div class="form-group row mb-4">
            <label for="dob" class="col-sm-2 col-form-label ">Ngày sinh</label>
            <div class="col-sm-10">
                <input type="text" class="form-control" id="dob" placeholder="Năm/tháng/ngày">
            </div>
        </div>
        <div class="form-group row ">
            <label for="salary" class="col-sm-2 col-form-label">Lương</label>
            <div class="col-sm-10 mb-4">
                <input type="text" class="form-control" id="salary" placeholder="0.00000">
            </div>
        </div>
        <div class="form-group row">
            <label for="homeTown" class="col-sm-2 col-form-label">Quê quán</label>
            <div class="col-sm-10 mb-4">
                <input type="text" class="form-control" id="homeTown" placeholder="Đà nẵng">
            </div>
        </div>
        <div class="form-group row mb-3 ">
            <label for="abilityProfile" class="col-sm-2 col-form-label">Hồ sơ năng lực</label>
            <div class="col-sm-10">
                <input type="text" class="form-control" id="abilityProfile" placeholder="good">
            </div>
        </div>
        <div class="form-group row">
            <label for="email" class="col-sm-2 col-form-label mb-4">Email</label>
            <div class="col-sm-10">
                <input type="text" class="form-control" id="email" placeholder="Abc@gmail.com">
            </div>
        </div>
        <div class="form-group row mb-3">
            <label for="password" class="col-sm-2 col-form-label">Mật khẩu</label>
            <div class="col-sm-10">
                <input type="password" class="form-control" id="password" placeholder="Mật khẩu có chiều dài 6-8 ký tự">
            </div>
        </div>
    </form>
            `
    const $modal = addModal("Thêm mới huấn luyện viên", true);
    $modal.find(".modal-body").html(formCreate);

    $modal.find(".m-submit").click(function (e) {
        e.preventDefault();
        createCoach($modal)
    })
}

function createCoach($modal) {
    let name = $('#name').val();
    let dob = $('#dob').val();
    let salary = $('#salary').val();
    let homeTown = $('#homeTown').val();
    let abilityProfile = $('#abilityProfile').val();
    let email = $('#email').val();
    let password = $('#password').val();
    let newCoach = {
        name: name,
        dob: dob,
        salary: salary,
        homeTown: homeTown,
        abilityProfile: abilityProfile,
        email: email,
        password: password
    }

    $.ajax({
        type: "post",
        data: JSON.stringify(newCoach),
        url: "http://localhost:8080/api/coach",
        success: function () {
            $('.form-content').html('');
            showAlert("Thêm thành công", "success");
            showPageCoach();
            $modal.data().modal.hide();
        },
        error: function () {
            showAlert("Thêm thất bại", "error");
        }
    })
}

function showFormEdit(id) {
    $.ajax({
        type: "get",
        url: "http://localhost:8080/api/coach/" + id,
        success: function (data) {
            let formUpdate = (`
    <form id="form" novalidate="novalidate">
        <div class="form-group row mb-3">
            <label for="name" class="col-sm-2 col-form-label">Name</label>
            <div class="col-sm-10">
                <input type="text" class="form-control" id="name" value="${data.name}">
            </div>
        </div>
        <div class="form-group row mb-3">
            <label for="dob" class="col-sm-2 col-form-label">Ngày sinh</label>
            <div class="col-sm-10">
                <input type="text" class="form-control" id="dob" value="${data.dob}">
            </div>
        </div>
        <div class="form-group row mb-3">
            <label for="salary" class="col-sm-2 col-form-label">Lương</label>
            <div class="col-sm-10">
                <input type="text" class="form-control" id="salary" value="${data.salary}">
            </div>
        </div>
        <div class="form-group row mb-3">
            <label for="homeTown" class="col-sm-2 col-form-label">Quê quán</label>
            <div class="col-sm-10">
                <input type="text" class="form-control" id="homeTown" value="${data.homeTown}">
            </div>
        </div>
        <div class="form-group row">
            <label for="abilityProfile" class="col-sm-2 col-form-label">Hồ sơ năng lực</label>
            <div class="col-sm-10">
                <input type="text" class="form-control" id="abilityProfile" value="${data.abilityProfile}">
            </div>
        </div>
    </form>
            `)

            const $modal = addModal("Thêm mới huấn luyện viên", true);
            $modal.find(".modal-body").html(formUpdate);

            $modal.find(".m-submit").click(function (e) {
                e.preventDefault();
                updateCoach(id, $modal);
            })
        }
    })
}

function updateCoach(id, $modal) {
    let name = $('#name').val();
    let dob = $('#dob').val();
    let salary = $('#salary').val();
    let homeTown = $('#homeTown').val();
    let abilityProfile = $('#abilityProfile').val();
    let updateCoach = {
        name: name,
        dob: dob,
        salary: salary,
        homeTown: homeTown,
        abilityProfile: abilityProfile,
    }

    $.ajax({
        type: "put",
        data: JSON.stringify(updateCoach),
        url: "http://localhost:8080/api/coach/" + id,
        success: function () {
            showAlert("Sửa thành công", "success");
            showPageCoach(id);
            $modal.data().modal.hide();
        },
        error: function () {
            showAlert("Sửa thất bại", "error");
        }
    })
}

function showFormSalary(id) {
    $.ajax({
        type: "get",
        url: "http://localhost:8080/api/coach/" + id,
        success: function (data) {
            let formSalary = (`
    <form id="form" novalidate="novalidate">
        <div class="form-group row mb-2">
            <label for="week" class="col-sm-2 col-form-label">Tuần</label>
            <div class="col-sm-10">
                <input type="week" class="form-control" id="week">
            </div>
        </div>
        <div class="form-group row">
            <label for="bonus" class="col-sm-2 col-form-label">Thưởng nóng</label>
            <div class="col-sm-10">
                <input type="text" class="form-control" id="bonus" placeholder="Nhập thưởng nếu có">
            </div>
        </div>
    </form>
            `)


            const $modal = addModal("Thêm lương huấn luyện viên", true);
            $modal.find(".modal-body").html(formSalary);

            $modal.find(".m-submit").click(function (e) {
                e.preventDefault();
                addBonus(id, $modal);
            })

        }
    })
}

function addBonus(id, $modal) {
    let bonus = $('#bonus').val();
    let week = $('#week').val()
    let newBonus = {
        bonus: bonus,
        week: week
    }
    $.ajax({
        type: "post",
        data: JSON.stringify(newBonus),
        url: "http://localhost:8080/api/coach/money/" + id,
        success: function () {
            showAlert("Thêm lương thành công", "success");
            showPageCoach(id);
            $modal.data().modal.hide();
        },
        error: function () {
            showAlert("Thêm lương thất bại", "error");

        }
    })
}


