const USER = {
    roles: []
}

const checkLogin = () => {
    return true;
}



// first run
const run = () => {
    if(!checkLogin()) {
        redirectTo("login.html");
        return;
    }

    showMenu(USER.roles);
    showPage();
}

run();