function showPage() {
    showPageCoach()
}
// $(document).ready(function () {
//     loadCoach(0);
//
//     $(document).on('click', '.page-link', function (e) {
//         e.preventDefault();
//         var page = $(this).data('page');
//         loadCoach(page);
//     });


// function showPageCoach() {
//     $.ajax({
//         type: "GET",
//         url: "http://localhost:8080/api/coach/devide?page=",
//         success: function (data) {
//             let itemHtml = "";
//             $.each(data.content, function (index, el) {
//                 itemHtml += (`
//             <div class="col-12 col-md-6 col-lg-3 player-item">
//             <div class="card shadow-sm border-0 mb-4">
//                 <div class="card-body text-center">
//                   <h5 class="mt-3 mb-2">${el.name}</h5>
//                   <p class="text-muted mb-1">${el.dob} </p>
//                   <p class="text-muted mb-1">${el.homeTown}</p>
//                   <div class="d-flex justify-content-center">
//                     <a data-id="${el.id}" class="btn btn-outline-primary detail">chi tiết</a>
//
//                   </div>
//                 </div>
//             </div>
//             </div>
//
//                 `);
//             })
//
//             $("#list-coach").html(itemHtml);
//             let pagination = '';
//             for (var i = 0; i < data.totalPages; i++) {
//                 pagination += '<li class="page-item ' + (i === data.number ? 'active' : '') + '">';
//                 pagination += '<a class="page-link" href="#" data-page="' + i + '">' + (i + 1) + '</a>';
//                 pagination += '</li>';
//             }
//             $('#pagination').html(pagination);
//             $(".detail").click(function () {
//                 let id = $(this).data().id;
//                 showDetail(id)
//             });
//         }
//     })
// }
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
                  <h5 class="mt-3 mb-2">${el.name}</h5>
                  <p class="text-muted mb-1">${el.dob} </p>
                  <p class="text-muted mb-1">${el.homeTown}</p>
                  <div class="d-flex justify-content-center">
                    <a data-id="${el.id}" class="btn btn-outline-primary detail">chi tiết</a>
                  </div>
                </div>
            </div>
            </div>

                `);
            $("#list-coach").html(itemHtml);
            $(".detail").click(function () {
                let id = $(this).data().id;
                showDetail(id)
            });
        })
        }
    })
}

function showDetail(id) {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/api/coach/" + id,
        success: function (dataDetail) {
            let itemHtml1 = (`<div class="row align-items-stretch">
            <div class="col-lg-3">
                <div class="shadow p-3 rounded">
                <img src="../image/NguyenMinhPhuong.jpg" height="100" width="100" class="rounded img-fluid">
                </div>
                
            </div>
            <div class="col-lg-9">
                <div class="shadow p-3 rounded h-100">
                    <div class="d-flex justify-content-between">
                        <h5 class="mb-0">${dataDetail.name}</h5>
                    </div>
                    <div class="mt-4">
                        <div class="row">
                          <div class="col-12 col-lg-6">
                            <p>Ngày sinh: <span class="text-muted">${dataDetail.dob}</span></p>
                            <p>Quê quán: <span class="text-muted">${dataDetail.homeTown}</span></p>
                            <p>Liên hệ :  <span class="text-muted">${dataDetail.user.email}</span></p>        
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
            let itemChart = (`<div id="chart"></div>`);
            let itemhtml3 = (`
                <a data-id="${dataDetail.id}" class="btn btn-outline-danger edit">Sửa</a>
                <a data-id="${dataDetail.id}" class="btn btn-outline-danger delete">Xóa</a>
                <a data-id="${dataDetail.id}" class="btn btn-outline-danger salary">Lương</a>
                <a class="btn btn-outline-danger back">Trở lại</a>
            `);

            const Modal = new bootstrap.Modal($("#exampleModal").get(0));
            Modal.show();
            $(".modal-footer").html(itemhtml3);
            $("#exampleModal .modal-body").append(itemChart);
            $(".form-content").html(itemHtml1);
            $(".back").click(function (e) {
                e.preventDefault();
                Modal.hide();
            });
            $(".delete").click(function (e) {
                e.preventDefault();
                let id = $(this).data().id;
                deleteCoach(id,Modal);

            });
            $(".edit").click(function (e) {
                e.preventDefault();
                let id = $(this).data().id;
                showFormEdit(id);
            });
            $(".salary").click(function (e) {
                e.preventDefault();
                Modal.hide();
                let id = $(this).data().id;
                showFormSalary(id);
            });


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

function deleteCoach(id,Modal) {
    $.ajax({
        type: "delete",
        url: "http://localhost:8080/api/coach/" + id,
        success: function () {
            Modal.hide();
            alert("Xóa thành công");
            showPageCoach();
        }

    })
}

function showFormAdd() {
    let formCreate = `
<div class="container mt-5">
    <h2 class="mb-4">Thêm mới huấn luận viên</h2>
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
        <div class="form-group row ">
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
        <div class="form-group row">
            <div class="col-sm-10 offset-sm-2">
                <input type="submit" value="Save" class="btn btn-outline-danger" id="create-coach">
            </div>
        </div>
    </form>
</div>

            `
    const Modal = new bootstrap.Modal($("#exampleModal").get(0));
    Modal.show();
    $(".form-content").html(formCreate);
    $("#create-coach").click(function (e) {
        e.preventDefault();
        createCoach(Modal)
    })
}

function createCoach(Modal) {
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
            alert("Thêm thành công");
            // $(".form-content").remove();
            Modal.hide();
            showPageCoach();
        },
        error: function () {
            alert("Thêm thất bại")
        }
    })
}

function showFormEdit(id) {
    $.ajax({
        type: "get",
        url: "http://localhost:8080/api/coach/" + id,
        success: function (data) {
            let formUpdate =(`
            <div class="container mt-5">
    <h2 class="mb-4">Cập nhật thông tin huấn luyện viên</h2>
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
        
        <div class="form-group row ">
            <div class="col-sm-10 offset-sm-2 ">
                <input data-id="${data.id}" type="submit" value="Save" class="btn btn-outline-danger" id="update-coach">
            </div>
        </div>
    </form>
</div>
            `)

            const Modal = new bootstrap.Modal($("#exampleModal").get(0));
            Modal.show();
            $(".form-content").html(formUpdate);
            $("#update-coach").click(function (e) {
                e.preventDefault();
                updateCoach(id);
            })
        }
    })
}

function updateCoach() {
    let id = $('#update-coach').data().id;
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
            $('.form-content').html('');
            alert("Sửa thành công")
            showDetail(id);

        },
        error: function () {
            alert("Sửa thất bại")
        }
    })
}

function showFormSalary(id) {
    $.ajax({
        type: "get",
        url: "http://localhost:8080/api/coach/" + id,
        success: function (data) {
            let formSalary =(`
            <div class="container mt-5">
    <h2 class="mb-4">Lương của huấn luyện viên</h2>
    <form id="form" novalidate="novalidate">
        <div class="form-group row">
            <label for="week" class="col-sm-2 col-form-label">Tuần</label>
            <div class="col-sm-10">
                <input type="text" class="form-control" id="week" placeholder="yy-mm-dd">
            </div>
        </div>
        <div class="form-group row">
            <label for="bonus" class="col-sm-2 col-form-label">Thưởng nóng</label>
            <div class="col-sm-10">
                <input type="text" class="form-control" id="bonus" placeholder="Nhập thưởng nếu có">
            </div>
        </div>
        <div class="form-group row">
            <div class="col-sm-10 offset-sm-2">
                <input data-id="${data.id}" type="submit" value="Save" class="btn btn-outline-danger" id="update-salary">
            </div>
        </div>
    </form>
</div>
            `)

            const Modal = new bootstrap.Modal($("#exampleModal").get(0));
            Modal.show();
            $('.form-content').html(formSalary);
            $('#update-salary').click(function (e) {
                e.preventDefault();
                addBonus(Modal);

            })
        }
    })
}

function addBonus(Modal) {
    let id = $('#update-salary').data().id;
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
            Modal.hide();
            alert("Thành công");
            showDetail();
        },
        error: function () {
            alert("Sửa thất bại")
        }
    })
}

const validateCoach = () => {
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


