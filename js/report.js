const showPage = () => {
    countPlayers();
    showChartSalaryAllPlayer()
}


const countPlayers = async () => {
    $("#count-playing, #count-injury, #count-retire").html(loaderTemplate());
    // sống chậm lại ....
    await sleep(1000);
    // -----------------------

    const [playing, injury, retire] = await Promise.all([
        getPlayers("status=playing"),
        getPlayers("status=injury"),
        getPlayers("status=retire")
    ]);

    $("#count-playing").text(playing.totalElements);
    $("#count-injury").text(injury.totalElements);
    $("#count-retire").text(retire.totalElements);
}

const showChartSalaryAllPlayer = async () => {
    $("#salary-chart-all").html(loaderTemplate());
    // sống chậm lại....
    await sleep(1500);
    // -----------------------
    let reports = await getReportPlayerSalary();
    reports = reports.sort((a, b) => {
        const weekA = parseInt(a.week.split('-W')[1]);
        const weekB = parseInt(b.week.split('-W')[1]);
        return weekA - weekB;
    });
    $("#salary-chart-all").empty();


    var options = {
        series: [{
            name: "Lương",
            data: reports.map(salary => {
                return salary.salary;
            })
        }],
        chart: {
            type: 'bar',
            height: 350
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                endingShape: 'rounded'
            },
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        xaxis: {
            categories: reports.map(salary => {
                return salary.week;
            }),
        },
        yaxis: {
            labels: {
                formatter: function (value) {
                    return formatVND(value);
                }
            }
        }
    };

    var chart = new ApexCharts(document.querySelector("#salary-chart-all"), options);
    chart.render();


}