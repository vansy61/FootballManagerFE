$("#login").click(function () {
    login();
})

const postLogin = () => {
    return $.ajax({
        url: `${BASE_API_URL}auth/login`,
        method: "POST",
        headers: {
            "contentType": "application/json; charset=utf-8",
            "dataType": "JSON",
            "Content-Type": "application/json"
        },
        data: JSON.stringify({
            "email": $("#email").val(),
            "password": $("#password").val()
        })
    })
}

const login = async () => {
    try {
        const res = await postLogin();
        localStorage.setItem('userData', JSON.stringify(res));

        Swal.fire({
            title: "Đăng nhập thành công",
            icon: "success",
            html: "<p class='mb-5'>Hệ thống sẽ tự động chuyển trang sau <span id='count-down'>5</span> giây</p>",
            showCloseButton: false,
            showCancelButton: false,
            showConfirmButton: false
        });

        setInterval(() => {
            $("#count-down").text(parseInt($("#count-down").text()) - 1);
        }, 1000)

        await sleep(5000);
        if(res.authorities[0].authority === "ROLE_COACH" || res.authorities[0].authority === "ROLE_ADMIN") {
            redirectTo("player.html");
        }else {
            redirectTo("profile.html");
        }
    }catch (error) {
        showAlert("Đăng nhập thất bại", "error", "Vui lòng kiểm tra email và mật khẩu.")
    }
}