const showPage = () => {
    $("#content").html(`
        <div id="profile-content" class="mb-5 bg-white shadow-sm rounded p-3">
            ${loaderTemplate()}
        </div>
        <div class="shadow-sm bg-white p-3 rounded">
            <h5>Biểu đồ lương</h5>
            <div id="salary-chart">
                ${loaderTemplate()}
            </div>
        </div>
    `)

}