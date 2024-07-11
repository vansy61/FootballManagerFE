const showPage = () => {
    $("#content").html(`
        <div id="profile-content" class="mb-5 bg-white shadow-sm rounded p-3">
            ${loaderTemplate()}
        </div>
        <div class="shadow-sm bg-white p-3 rounded">
            <h5>Biểu đồ lương</h5>
            <div id="salary-chart">
                Phần phân quyền này đang được cập nhật.
            </div>
        </div>
    `);


    showProfile();

}

const showProfile = async () => {
    // sống chậm lại ....
    await sleep(500);
    // -----------------------

    let player = await getPlayer(USER.id);
    let template = playerProfileTemplate(player);
    $("#profile-content").html(template);

}

const playerProfileTemplate = (player) => {
    return (`
        <div class="row align-items-stretch">
            <div class="col-lg-3">
                <div class="shadow p-3 rounded">
                <img src="${BASE_URL}image/${player.avatar}" alt="avatar" class="rounded img-fluid">
                </div>
                
            </div>
            <div class="col-lg-9">
                <div class="shadow p-3 rounded h-100">
                    <div class="d-flex">
                        <h5 class="mb-0">${player.name}</h5>
                    </div>
                    <div class="mt-4">
                        <div class="row">
                          <div class="col-12 col-lg-6">
                            <p>Ngày sinh: <span class="text-muted">${player.dob}</span></p>
                            <p>Quê quán: <span class="text-muted">${player.homeTown}</span></p>
                            <p>Vị trí chơi: <span class="text-muted">${player.position?.name}</span></p>
                            <p>Phong độ: <span class="text-muted">${player.performance}</span></p>
                            <p>Chiều cao: <span class="text-muted">${player.height}</span></p>
                          </div>
                          <div class="col-12 col-lg-6">
                            <p>Cân nặng: <span class="text-muted">${player.weight}</span></p>
                            <p>Chỉ số BMI: <span class="text-muted">${player.height/player.weight}</span></p>
                            <p>Lương cứng: <span class="text-muted">${formatVND(player.salary)}</span></p>
                            <p>Xếp hạng: <span class="text-muted">${player.ranking}</span></p>
                            <p>Hồ sơ năng lực: <span class="text-muted"><a href="#">${player.abilityProfile}</a></span></p>                          
                          </div>
                        </div>
                    </div>
                </div>
            </div>
      </div>
    `)
}
