const showPage = () => {
    initFormSearch();
    $("#player-search").submit(e => {
        e.preventDefault();
        renderDocumentsWithSearchForm();
    }).submit();
}

const initFormSearch = async () => {
    const positions = await getPositions();
    const selectPosition = $("#search-position");
    positions.forEach(position => {
        selectPosition.append(`<option value="${position.id}">${position.name}</option>`);
    });


}

const renderDocumentsWithSearchForm = async () => {
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
    return;
    let pagination = paginationTemplate(documents.totalPages, documents.number);
    $(".pagination").html(pagination);
    $(".pagination a").click(function(e) {
        e.preventDefault();
        $("#page").val($(this).attr("data-page"));
        renderDocumentsWithSearchForm();
    });
    $("#page").val(0);

    // Bind delete document event
    $(".delete-document").click(function(e) {
        e.preventDefault();
        if (confirm("Bạn thực sự muốn xóa?")) {
            deleteDocument($(this));
        }
    });

    // Bind edit document event
    $(".edit-document").click(function(e) {
        e.preventDefault();
        showEditDocument($(this));
    });
}


const toTablePlayersTemplate = (players) => {
    let rows = "";
    players.forEach(player => {
        rows += `
            <tr>
                <td><img class="avatar" src="${BASE_URL}image/${player.avatar}"></td>
                <td>${player.name}</td>
                <td>${player.dob}</td>
                <td>${player.homeTown}</td>
                <td>${player?.position?.name}</td>
                <td>${player.performance}</td>
                <td>
                    <a href="#" class="edit-document" data-id="${player.id}"><i class="fas fa-edit"></i></a>
                    <a href="#" class="delete-document" data-id="${player.id}"><i class="fas fa-trash-alt"></i></a>
                </td>
            </tr>
        `;
    })
    return (`
       <table class="table table-bordered" >
            <thead>
                <tr>
                    <th>Ảnh</th>
                    <th>Tên</th>
                    <th>Ngày Sinh</th>
                    <th>Quê Quán</th>
                    <th>Vị Trí</th>
                    <th>Phong độ</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                ${rows}
            </tbody>
        </table>
    `)
}