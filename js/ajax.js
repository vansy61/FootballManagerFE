const getPositions = () => {
    return $.ajax({
        url: BASE_API_URL + "positions",
        type: "GET"
    });
}


const getPlayers = (search) => {
    return $.ajax({
        url: BASE_API_URL + "players?" + search,
        type: "GET"
    });
}

const getPlayer = (playerId) => {
    return $.ajax({
        url: BASE_API_URL + "players/" + playerId,
        type: "GET"
    });
}

const getSalaryData = (playerId) => {
    return $.ajax({
        url: BASE_API_URL + "players/" + playerId + "/pays",
        type: "GET"
    });
}


const deletePlayerById = (url) => {
    return $.ajax({
        url: BASE_API_URL + url,
        type: "DELETE"
    });
}

const createPlayer = (data) => {
    return $.ajax({
        url: BASE_API_URL + "players",
        type: "POST",
        data: data,
        processData: false,
        contentType: false
    });
}


const updatePlayer = (id, data) => {
    return $.ajax({
        url: BASE_API_URL + "players/" + id,
        type: "PUT",
        data: data,
        processData: false,
        contentType: false
    });
}


const createPayPlayer = (id, data) => {
    return $.ajax({
        url: BASE_API_URL + "players/" + id + "/pays",
        type: "POST",
        data: JSON.stringify(data)
    });
}


$(document).on("keypress",".submit-on-enter",function(e) {
    if(e.which === 13) {
        $(this.form).submit();
    }
})


let SEARCH_TIMEOUT = null;
$(document).on("keyup",".submit-on-input",function(e) {
    clearTimeout(SEARCH_TIMEOUT);
    const form = $(this.form);

    SEARCH_TIMEOUT = setTimeout(() => {
        form.submit();
    }, 500);
})

$(document).on("change", ".submit-on-change", function(e) {
    $(this.form).submit();
})


