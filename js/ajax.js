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



$(document).on("keypress",".submit-on-enter",function(e) {
    if(e.which === 13) {
        $(this.form).submit();
    }
})

$(document).on("change", ".submit-on-change", function(e) {
    $(this.form).submit();
})


