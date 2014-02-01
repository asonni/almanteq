$(document).ready(function(){
    $.days={},
    $.dataSource=[];
   var dataSource = [
        { year: 1950, europe: 546, americas: 332, africa: 227, australia : 100 },
        { year: 1960, europe: 605, americas: 417, africa: 283 , australia : 200},
        { year: 1970, europe: 656, americas: 513, africa: 361, australia : 300 },
        { year: 1980, europe: 694, americas: 614, africa: 471, australia : 400 },
        { year: 1990, europe: 721, americas: 721, africa: 623, australia : 500 },
        { year: 2000, europe: 730, americas: 836, africa: 797, australia : 600 },
        { year: 2010, europe: 728, americas: 935, africa: 982, australia : 700 },
        { year: 2020, europe: 721, americas: 1027, africa: 1189, australia : 800 },
        { year: 2030, europe: 704, americas: 1110, africa: 1416, australia : 900 },
        { year: 2040, europe: 680, americas: 1178, africa: 1665, australia : 1100 },
        { year: 2050, europe: 650, americas: 1231, africa: 1937, australia : 1200 }
    ];

    /*$("#chartContainer").dxChart({
        dataSource: dataSource,
        commonSeriesSettings: {
            argumentField: "year"
        },
        series: [
            { valueField: "europe", name: "Europe" },
            { valueField: "americas", name: "Americas" },
            { valueField: "africa", name: "Africa" },
            { valueField: "australia", name: "Australia" }
        ],
        argumentAxis:{
            grid:{
                visible: true
            }
        },
        tooltip:{
            enabled: true
        },
        title: "Historic, Current and Future Population",
        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center"
        },
        commonPaneSettings: {
            border:{
                visible: true,
                right: false
            }       
        }
    });*/

    function getUser(){
        $.get('/getUser').success(function(user){
            $.draw({"name":user}, "user-template", "#user-target");
        });
    }

    function getUserRep(){
        $.get('/action/getUserRep').success(function(reps){
            for(var key in reps[0]){
                if($.days[reps[0][key].day]){
                    $.days[reps[0][key].day][reps[0][key].id]=reps[0][key].count;
                } else {
                    $.days[reps[0][key].day] ={day : reps[0][key].day};
                    $.days[reps[0][key].day][reps[0][key].id]=reps[0][key].count;
                }
            }
            for (key in $.days){
                $.dataSource.push($.days[key]);
            }
            console.log($.dataSource);
            console.log(reps[1]);


            $("#chartContainer").dxChart({
                dataSource: $.dataSource,
                commonSeriesSettings: {
                    argumentField: "day"
                },
                series: reps[1],
                argumentAxis:{
                    grid:{
                        visible: true
                    }
                },
                tooltip:{
                    enabled: true
                },
                title: "Historic, Current and Future Population",
                legend: {
                    verticalAlignment: "bottom",
                    horizontalAlignment: "center"
                },
                commonPaneSettings: {
                    border:{
                        visible: true,
                        right: false
                    }       
                }
            });
        });
    }

    getUser();
    getUserRep();
});