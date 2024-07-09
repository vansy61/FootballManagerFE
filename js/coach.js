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
                <th>Lương tuần</th>
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
                <td>${dataDetail.salary}</td>
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
             <h2>Add new coach</h2>
             <form id="form" novalidate="novalidate">
        <table border="1" style="margin-top: 10px">
            <tr>
                <td><label for="name"> name</label></td>
                <td><input type="text" id="name" placeholder="Abc" /></td>
            </tr>
            <tr>
                <td><label for="dob">Ngày sinh</label></td>
                <td><input type="text" id="dob"  placeholder="Năm/tháng/ngày"/></td>
            </tr>
            <tr>
                <td><label for="salary">Lương</label></td>
                <td><input type="text" id="salary" placeholder="0.00000"/></td>
            </tr>
            <tr>
                <td><label for="homeTown">Quê quán</label></td>
                <td><input type="text" id="homeTown" placeholder="Đà nẵng"/></td>
            </tr>
            <tr>
                <td><label for="abilityProfile">Hồ sơ năng lực</label></td>
                <td><input type="text" id="abilityProfile" placeholder="good"/></td>
            </tr>
            <tr>
                <td><label for="email">email</label></td>
                <td><input type="text" id="email" placeholder="Abc@gmail.com" /></td>
            </tr>
            <tr>
                <td><label for="password">Mật khẩu</label></td>
                <td><input type="password" id="password" placeholder="Mật khẩu có chiều dài 6-8 ký tự"/></td>
            </tr>
          
        </table>

        <input type="submit" value="Save" class="btn btn-outline-danger " id="create-coach"/>
    </form>
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
        }
    })
}

function showFormEdit(id) {
    $.ajax({
        type: "get",
        url: "http://localhost:8080/api/coach/" + id,
        success: function (data) {
            let formUpdate = `
             <h2>Cập nhật thông tin huấn luyện viên</h2>
             <form id="form" novalidate="novalidate">
           <table border="1" style="margin-top: 10px">
            <tr>
                <td><label for="name"> name</label></td>
                <td><input type="text" id="name" value="${data.name}" /></td>
            </tr>
            <tr>
                <td><label for="dob">Ngày sinh</label></td>
                <td><input type="text" id="dob"  value="${data.dob}"/></td>
            </tr>
            <tr>
                <td><label for="salary">Lương</label></td>
                <td><input type="text" id="salary" value="${data.salary}"/></td>
            </tr>
            <tr>
                <td><label for="homeTown">Quê quán</label></td>
                <td><input type="text" id="homeTown" value="${data.homeTown}"/></td>
            </tr>
            <tr>
                <td><label for="abilityProfile">Hồ sơ năng lực</label></td>
                <td><input type="text" id="abilityProfile" value="${data.abilityProfile}"/></td>
            </tr>
            <tr>
                <td><label for="email">email</label></td>
                <td><input type="text" id="email" placeholder="Abc@gmail.com" value="${data.email}" /></td>
            </tr>
            <tr>
                <td><label for="password">Mật khẩu</label></td>
                <td><input type="password" id="password" value="${data.password}"/></td>
            </tr>
        </table>
        <input data-id="${data.id}" type="submit" value="Save" class="btn btn-outline-danger " id="update-coach"/>
    </form>
            `
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

        }
    })
}

function showFormSalary(id) {
    $.ajax({
        type: "get",
        url: "http://localhost:8080/api/coach/" + id,
        success: function (data) {
            let formSalary =`
           <h2>Lương của huấn luyện viên</h2>
             <form id="form" novalidate="novalidate">
           <table border="1" style="margin-top: 10px">
            <tr>
                <td><label for="salary">lương cứng</label></td>
                <td><input type="text" id="salary" value="${data.salary}" /></td>
            </tr>
            <tr>
                <td><label for="bonus">thưởng nóng</label></td>
                <td><input type="text" id="bonus"  placeholder="Nhập thưởng nóng nếu có"/></td>
            </tr>
           
            </table>
            <input data-id="${data.id}" type="submit" value="Save" class="btn btn-outline-danger " id="update-salary"/>
            `
            const Modal = new bootstrap.Modal($("#exampleModal").get(0));
            Modal.show();
            $('.form-content').html(formSalary);
            $()
        }
    })
}