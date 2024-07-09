let USER;

const checkLogin = () => {
    if (localStorage.getItem('userData')) {
        USER = JSON.parse(localStorage.getItem('userData'));
        return true;
    } else {
        return false;
    }
}



// first run
const run = () => {
    if(!checkLogin()) {
        redirectTo("login.html");
        return;
    }
    $.ajaxSetup({
        dataType: "JSON",
        contentType: "application/json; charset=utf-8",
        headers: {
            "Authorization": "Bearer " + USER.token
        }
    });

    showMenu();
    showPage();



    $("#logout").click(() => {
        localStorage.removeItem('userData');
        redirectTo("../index.html");
    })
}

run();