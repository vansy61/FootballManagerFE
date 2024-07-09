function showPage() {
    showPageCoach()
}

function showPageCoach() {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/api/coach",
        success: function (data) {
            let itemHead = `
            <tr>
                        <th>Stt</th>
                        <th>Tên</th>
                        <th>Năm sinh</th>
                        <th>Quê quán</th>
                        <th></th>
                        <th></th>
                    </tr>
            `

            let itemHtml = "";
            $.each(data.content, function (index, el) {
                itemHtml += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${el.name}</td>
                    <td>${el.dob}</td>
                    <td>${el.homeTown}</td>
                    <td>
                    <a data-id="${el.id}" class="btn btn-outline-primary detail">chi tiết</a>
                    </td>
                </tr>
                `;
            })
            $(".table-head").html(itemHead);
            $(".table-body").html(itemHtml)
            $(".detail").click(function () {
                let id = $(this).data().id;
                showDetail(id)
            });
        }
    })
}


function showDetail(id) {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/api/coach/" + id,
        success: function (dataDetail) {
            let itemHead = `
            <tr>
                <th>Tên</th>
                <th>Ngày sinh</th>
                <th>Quê quán</th>
                <th>Lương cứng</th>
                <th>Hồ sơ năng lực</th>
                <th>Biểu đồ theo tuần</th>
            </tr>
            `
            let itemHtml1 = `
     
            <tr>
                <td>${dataDetail.name}</td>
                <td>${dataDetail.dob}</td>
                <td>${dataDetail.homeTown}</td>
                <td>${dataDetail.salary}</td>
                <td>${dataDetail.abilityProfile}</td>
                <td></td>
                <td>
               
                <a data-id="${dataDetail.id}" class="btn btn-outline-danger edit">Sửa</a>
                <a data-id="${dataDetail.id}" class="btn btn-outline-danger delete">Xóa</a>
                <a data-id="${dataDetail.id}" class="btn btn-outline-danger salary">Lương</a>
                 <button class="btn btn-outline-danger back">Trở lại</button>
                </td>
            </tr>

                `;

            $(".table-head").html(itemHead);
            $(".table-body").html(itemHtml1);
            $(".back").click(function (e) {
                e.preventDefault();
                showPageCoach();
            });
            $(".delete").click(function (e) {
                e.preventDefault();
                let id = $(this).data().id;
                deleteCoach(id);

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

function deleteCoach(id) {
    $.ajax({
        type: "delete",
        url: "http://localhost:8080/api/coach/" + id,
        success: function () {
            showPageCoach();
            alert("Xóa thành công");
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
        <div class="form-group row">
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

<!--             <h2>Add new coach</h2>-->
<!--             <form id="form" novalidate="novalidate">-->
<!--        <table border="1" style="margin-top: 10px">-->
<!--            <tr>-->
<!--                <td><label for="name"> name</label></td>-->
<!--                <td><input type="text" id="name" placeholder="Abc" /></td>-->
<!--            </tr>-->
<!--            <tr>-->
<!--                <td><label for="dob">Ngày sinh</label></td>-->
<!--                <td><input type="text" id="dob"  placeholder="Năm/tháng/ngày"/></td>-->
<!--            </tr>-->
<!--            <tr>-->
<!--                <td><label for="salary">Lương</label></td>-->
<!--                <td><input type="text" id="salary" placeholder="0.00000"/></td>-->
<!--            </tr>-->
<!--            <tr>-->
<!--                <td><label for="homeTown">Quê quán</label></td>-->
<!--                <td><input type="text" id="homeTown" placeholder="Đà nẵng"/></td>-->
<!--            </tr>-->
<!--            <tr>-->
<!--                <td><label for="abilityProfile">Hồ sơ năng lực</label></td>-->
<!--                <td><input type="text" id="abilityProfile" placeholder="good"/></td>-->
<!--            </tr>-->
<!--            <tr>-->
<!--                <td><label for="email">email</label></td>-->
<!--                <td><input type="text" id="email" placeholder="Abc@gmail.com" /></td>-->
<!--            </tr>-->
<!--            <tr>-->
<!--                <td><label for="password">Mật khẩu</label></td>-->
<!--                <td><input type="password" id="password" placeholder="Mật khẩu có chiều dài 6-8 ký tự"/></td>-->
<!--            </tr>-->
<!--          -->
<!--        </table>-->

<!--        <input type="submit" value="Save" class="btn btn-outline-danger " id="create-coach"/>-->
<!--    </form>-->
            `
    const Modal = new bootstrap.Modal($("#exampleModal").get(0));
    Modal.show();
    $(".form-content").html(formCreate);
    $("#create-coach").click(function (e) {
        e.preventDefault();
        createCoach()
    })
}

function createCoach() {
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
            alert("Thêm thành công")
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
            let formUpdate =`
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
        <div class="form-group row mb-3">
            <label for="email" class="col-sm-2 col-form-label">Email</label>
            <div class="col-sm-10">
                <input type="text" class="form-control" id="email" placeholder="Abc@gmail.com" value="${data.email}">
            </div>
        </div>
        <div class="form-group row mb-3">
            <label for="password" class="col-sm-2 col-form-label">Mật khẩu</label>
            <div class="col-sm-10">
                <input type="password" class="form-control" id="password" value="${data.password}">
            </div>
        </div>
        <div class="form-group row ">
            <div class="col-sm-10 offset-sm-2 ">
                <input data-id="${data.id}" type="submit" value="Save" class="btn btn-outline-danger" id="update-coach">
            </div>
        </div>
    </form>
</div>
            `
    //         let formUpdate = `
    //          <h2>Cập nhật thông tin huấn luyện viên</h2>
    //          <form id="form" novalidate="novalidate">
    //        <table border="1" style="margin-top: 10px">
    //         <tr>
    //             <td><label for="name"> name</label></td>
    //             <td><input type="text" id="name" value="${data.name}" /></td>
    //         </tr>
    //         <tr>
    //             <td><label for="dob">Ngày sinh</label></td>
    //             <td><input type="text" id="dob"  value="${data.dob}"/></td>
    //         </tr>
    //         <tr>
    //             <td><label for="salary">Lương</label></td>
    //             <td><input type="text" id="salary" value="${data.salary}"/></td>
    //         </tr>
    //         <tr>
    //             <td><label for="homeTown">Quê quán</label></td>
    //             <td><input type="text" id="homeTown" value="${data.homeTown}"/></td>
    //         </tr>
    //         <tr>
    //             <td><label for="abilityProfile">Hồ sơ năng lực</label></td>
    //             <td><input type="text" id="abilityProfile" value="${data.abilityProfile}"/></td>
    //         </tr>
    //         <tr>
    //             <td><label for="email">email</label></td>
    //             <td><input type="text" id="email" placeholder="Abc@gmail.com" value="${data.email}" /></td>
    //         </tr>
    //         <tr>
    //             <td><label for="password">Mật khẩu</label></td>
    //             <td><input type="password" id="password" value="${data.password}"/></td>
    //         </tr>
    //     </table>
    //     <input data-id="${data.id}" type="submit" value="Save" class="btn btn-outline-danger " id="update-coach"/>
    // </form>
    //         `
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
            showPageCoach();

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
            let formSalary =`
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
            `
           //  let formSalary = `
           // <h2>Lương của huấn luyện viên</h2>
           //   <form id="form" novalidate="novalidate">
           // <table border="1" style="margin-top: 10px">
           // <tr>
           //      <td><label for="week">Tuần</label></td>
           //      <td><input type="text" id="week"  placeholder="yy-mm-dd"/></td>
           //  </tr>
           //  <tr>
           //      <td><label for="bonus">thưởng nóng</label></td>
           //      <td><input type="text" id="bonus"  placeholder="Nhập thưởng nếu có"/></td>
           //  </tr>
           //  </table>
           //  <input data-id="${data.id}" type="submit" value="Save" class="btn btn-outline-danger " id="update-salary"/>
           //  </form>
           //  `
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