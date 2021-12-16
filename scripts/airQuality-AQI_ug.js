/* ================================== */
/*          AQI → μg converter        */
/* ================================== */

// link to calculator: https://www.airnow.gov/aqi/aqi-calculator/ 
// direct link to script file: https://www.airnow.gov/sites/default/files/custom-js/aqi-conc.js 

function InvLinear(AQIhigh, AQIlow, Conchigh, Conclow, a) {
    var AQIhigh;
    var AQIlow;
    var Conchigh;
    var Conclow;
    var a;
    var c;
    c = ((a - AQIlow) / (AQIhigh - AQIlow)) * (Conchigh - Conclow) + Conclow;
    return c;
}

function ConcPM25(a) {
    if (a >= 0 && a <= 50) {
        ConcCalc = InvLinear(50, 0, 12, 0, a);
    } else if (a > 50 && a <= 100) {
        ConcCalc = InvLinear(100, 51, 35.4, 12.1, a);
    } else if (a > 100 && a <= 150) {
        ConcCalc = InvLinear(150, 101, 55.4, 35.5, a);
    } else if (a > 150 && a <= 200) {
        ConcCalc = InvLinear(200, 151, 150.4, 55.5, a);
    } else if (a > 200 && a <= 300) {
        ConcCalc = InvLinear(300, 201, 250.4, 150.5, a);
    } else if (a > 300 && a <= 400) {
        ConcCalc = InvLinear(400, 301, 350.4, 250.5, a);
    } else if (a > 400 && a <= 500) {
        ConcCalc = InvLinear(500, 401, 500.4, 350.5, a);
    } else {
        ConcCalc = "PM25message";
    }
    return Math.round(ConcCalc,2);
}

function ConcPM10(a) {
    if (a >= 0 && a <= 50) {
        ConcCalc = InvLinear(50, 0, 54, 0, a);
    } else if (a > 50 && a <= 100) {
        ConcCalc = InvLinear(100, 51, 154, 55, a);
    } else if (a > 100 && a <= 150) {
        ConcCalc = InvLinear(150, 101, 254, 155, a);
    } else if (a > 150 && a <= 200) {
        ConcCalc = InvLinear(200, 151, 354, 255, a);
    } else if (a > 200 && a <= 300) {
        ConcCalc = InvLinear(300, 201, 424, 355, a);
    } else if (a > 300 && a <= 400) {
        ConcCalc = InvLinear(400, 301, 504, 425, a);
    } else if (a > 400 && a <= 500) {
        ConcCalc = InvLinear(500, 401, 604, 505, a);
    } else {
        ConcCalc = "PM10message";
    }
    return Math.round(ConcCalc,2);
}

function ConcCO(a) {
    if (a >= 0 && a <= 50) {
        ConcCalc = InvLinear(50, 0, 4.4, 0, a);
    } else if (a > 50 && a <= 100) {
        ConcCalc = InvLinear(100, 51, 9.4, 4.5, a);
    } else if (a > 100 && a <= 150) {
        ConcCalc = InvLinear(150, 101, 12.4, 9.5, a);
    } else if (a > 150 && a <= 200) {
        ConcCalc = InvLinear(200, 151, 15.4, 12.5, a);
    } else if (a > 200 && a <= 300) {
        ConcCalc = InvLinear(300, 201, 30.4, 15.5, a);
    } else if (a > 300 && a <= 400) {
        ConcCalc = InvLinear(400, 301, 40.4, 30.5, a);
    } else if (a > 400 && a <= 500) {
        ConcCalc = InvLinear(500, 401, 50.4, 40.5, a);
    } else {
        ConcCalc = "Out of Range";
    }
    return ConcCalc;
}

function ConcSO21hr(a) {
    if (a >= 0 && a <= 50) {
        ConcCalc = InvLinear(50, 0, 35, 0, a);
    } else if (a > 50 && a <= 100) {
        ConcCalc = InvLinear(100, 51, 75, 36, a);
    } else if (a > 100 && a <= 150) {
        ConcCalc = InvLinear(150, 101, 185, 76, a);
    } else if (a > 150 && a <= 200) {
        ConcCalc = InvLinear(200, 151, 304, 186, a);
    } else {
        ConcCalc = "Out of Range";
    }
    return ConcCalc;
}

function ConcSO224hr(a) {
    if (a >= 201 && a <= 300) {
        ConcCalc = InvLinear(300, 201, 604, 305, a);
    } else if (a > 300 && a <= 400) {
        ConcCalc = InvLinear(400, 301, 804, 605, a);
    } else if (a > 400 && a <= 500) {
        ConcCalc = InvLinear(500, 401, 1004, 805, a);
    } else {
        ConcCalc = "Out of Range";
    }
    return ConcCalc;
}

function ConcOzone8hr(a) {
    if (a >= 0 && a <= 50) {
        ConcCalc = InvLinear(50, 0, 54, 0, a);
    } else if (a > 50 && a <= 100) {
        ConcCalc = InvLinear(100, 51, 70, 55, a);
    } else if (a > 100 && a <= 150) {
        ConcCalc = InvLinear(150, 101, 85, 71, a);
    } else if (a > 150 && a <= 200) {
        ConcCalc = InvLinear(200, 151, 105, 86, a);
    } else if (a > 200 && a <= 300) {
        ConcCalc = InvLinear(300, 201, 200, 106, a);
    } else {
        ConcCalc = "O3message";
    }
    return ConcCalc;
}

function ConcOzone1hr(a) {
    if (a > 100 && a <= 150) {
        ConcCalc = InvLinear(150, 101, 164, 125, a);
    } else if (a > 150 && a <= 200) {
        ConcCalc = InvLinear(200, 151, 204, 165, a);
    } else if (a > 200 && a <= 300) {
        ConcCalc = InvLinear(300, 201, 404, 205, a);
    } else if (a > 300 && a <= 400) {
        ConcCalc = InvLinear(400, 301, 504, 405, a);
    } else if (a > 400 && a <= 500) {
        ConcCalc = InvLinear(500, 401, 604, 505, a);
    } else {
        ConcCalc = "Out of Range";
    }
    return ConcCalc;
}

function ConcNO2(a) {
    if (a >= 0 && a <= 50) {
        ConcCalc = InvLinear(50, 0, 53, 0, a);
    } else if (a > 50 && a <= 100) {
        ConcCalc = InvLinear(100, 51, 100, 54, a);
    } else if (a > 100 && a <= 150) {
        ConcCalc = InvLinear(150, 101, 360, 101, a);
    } else if (a > 150 && a <= 200) {
        ConcCalc = InvLinear(200, 151, 649, 361, a);
    } else if (a > 200 && a <= 300) {
        ConcCalc = InvLinear(300, 201, 1244, 650, a);
    } else if (a > 300 && a <= 400) {
        ConcCalc = InvLinear(400, 301, 1644, 1245, a);
    } else if (a > 400 && a <= 500) {
        ConcCalc = InvLinear(500, 401, 2044, 1645, a);
    } else {
        ConcCalc = "Out of Range";
    }
    return ConcCalc;
}

function AQICategory(AQIndex) {
    var AQI = parseFloat(AQIndex)
    var AQICategory;
    if (AQI <= 50) {
        AQICategory = "Good";
    } else if (AQI > 50 && AQI <= 100) {
        AQICategory = "Moderate";
    } else if (AQI > 100 && AQI <= 150) {
        AQICategory = "Unhealthy for Sensitive Groups";
    } else if (AQI > 150 && AQI <= 200) {
        AQICategory = "Unhealthy";
    } else if (AQI > 200 && AQI <= 300) {
        AQICategory = "Very Unhealthy";
    } else if (AQI > 300 && AQI <= 400) {
        AQICategory = "Hazardous";
    } else if (AQI > 400 && AQI <= 500) {
        AQICategory = "Hazardous";
    } else {
        AQICategory = "Out of Range";
    }
    return AQICategory;
}
//316

function ClearColorA() {

    document.form1.outputbox2.style.backgroundColor = "white";

}

function PollutantUnit(form1) {
    //var form

    document.form1.messageunit.style.textAlign = "center";
    document.form1.outputbox2.style.backgroundColor = "white";

    document.form1.inputbox.value = "";
    document.form1.outputbox1.value = "";
    document.form1.outputbox2.value = "";
    document.form1.TextSensitive.value = "";
    document.form1.HealthEffects.value = "";
    document.form1.Cautionary.value = "";

    if (document.form1.pollutant.selectedIndex == '1' || document.form1.pollutant.selectedIndex == '2') {
        document.form1.messageunit.value = "ug/m3";
    } else if (document.form1.pollutant.selectedIndex == '3') {
        document.form1.messageunit.value = "ppm";
    } else if (document.form1.pollutant.selectedIndex == '4' || document.form1.pollutant.selectedIndex == '5' || document.form1.pollutant.selectedIndex == '6' || form1.pollutant.selectedIndex == '7' || form1.pollutant.selectedIndex == '8') {
        document.form1.messageunit.value = "ppb";
    }
    return true;
}

function AQICalc(form1) {
    var b;
    var c;

    document.form1.inputbox.style.textAlign = "center";
    document.form1.inputbox.style.backgroundColor = "white";

    if (document.form1.pollutant.selectedIndex == '0') {
        alert("You have not selected a pollutant.")
    }
    if (document.form1.pollutant.selectedIndex == '1') {
        b = Math.round(document.form1.inputbox.value);
        if (b < 0 || b > 500) {
            b = "PM25message";
        } else {
            c = Math.floor(10 * ConcPM25(b)) / 10;
        }
    } else if (document.form1.pollutant.selectedIndex == '2') {
        b = (document.form1.inputbox.value);
        if (b < 0 || b > 500) {
            b = "PM10message";
        } else {
            c = Math.floor(ConcPM10(b));
        }
    } else if (document.form1.pollutant.selectedIndex == '3') {
        b = Math.round(document.form1.inputbox.value);
        if (b < 0 || b > 500) {
            b = "Out of Range";
        } else {
            c = Math.floor(10 * ConcCO(b)) / 10;
        }
    } else if (document.form1.pollutant.selectedIndex == '4') {
        b = Math.round(document.form1.inputbox.value);

        if (b < 0 || b > 500) {
            b = "Out of Range";

        } else if (b > 200 && b <= 500) {
            b = "SO21hrmessage";
        } else {
            c = Math.floor(ConcSO21hr(b));
        }
    } else if (document.form1.pollutant.selectedIndex == '5') {
        b = Math.round(document.form1.inputbox.value);
        if (b < 0 || b > 500) {
            b = "Out of Range";
        } else if (b >= 0 && b <= 200) {
            b = "SO224hrmessage";
        } else {
            c = Math.floor(ConcSO224hr(b));
        }
    } else if (document.form1.pollutant.selectedIndex == '6') {
        b = Math.round(document.form1.inputbox.value);
        if (b < 0 || b > 500) {
            b = "Out of Range";

        } else if (b > 300 && b <= 500) {
            b = "O3message";
        } else {
            c = Math.floor(ConcOzone8hr(b));
        }
    } else if (document.form1.pollutant.selectedIndex == '7') {
        b = Math.round(document.form1.inputbox.value);
        if (b < 0 || b > 500) {
            b = "Out of Range";
        } else if (b >= 0 && b <= 100) {
            b = "O31hrmessage";
        } else {
            c = Math.floor(ConcOzone1hr(b));
        }
    } else if (document.form1.pollutant.selectedIndex == '8') {
        b = Math.round(document.form1.inputbox.value);
        if (b < 0 || b > 500) {
            b = "Out of Range";
        } else {
            c = Math.floor(ConcNO2(b));
        }
    }
    if (b == "Out of Range") {
        var myWindowOofR = window.open("", "", "width=450,height=75,left=450,menubar=no,top=200");
        myWindowOofR.document.write("<p>Note: Values above 500 are considered Beyond the AQI. Follow recommendations for the Hazardous category </p>");

        function closeWin() {
            myWindowOofR.close();
        }
        document.form1.inputbox.value = "";
        document.form1.outputbox1.value = "";
        document.form1.outputbox2.value = "";
        document.form1.TextSensitive.value = "";


        document.form1.HealthEffects.value = "";
        document.form1.Cautionary.value = "";
    } else if (b == "SO21hrmessage") {
        var myWindowSO1 = window.open("", "", "width=450,height=75,left=450,menubar=no,top=200,top=200");
        myWindowSO1.document.write("<p>AQI values of 201 or greater are calculated with 24-hour SO2 concentrations.</p>");
        document.form1.inputbox.value = "";
        document.form1.outputbox1.value = "";
        document.form1.outputbox2.value = "";
        document.form1.TextSensitive.value = "";
        document.form1.HealthEffects.value = "";
        document.form1.Cautionary.value = "";
    } else if (b == "SO224hrmessage") {
        var myWindowSO24 = window.open("", "", "width=450,height=75,left=450,menubar=no,top=200");
        myWindowSO24.document.write("<p>AQI values less than 201 are calculated with 1-hour SO2 concentrations.</p>");

        document.form1.inputbox.value = "";
        document.form1.outputbox1.value = "";
        document.form1.outputbox2.value = "";
        document.form1.TextSensitive.value = "";
        document.form1.HealthEffects.value = "";
        document.form1.Cautionary.value = "";
    } else if (b == "O31hrmessage") {
        var myWindowO3 = window.open("", "", "width=450,height=75,left=450,menubar=no,top=200");
        myWindowO3.document.write("<p>1-hour ozone values do not define lower AQI values (<= 100).  AQI values of 100 or lower are calculated with 8-hour ozone concentrations</p>");
        document.form1.inputbox.value = "";
        document.form1.outputbox1.value = "";
        document.form1.outputbox2.value = "";
        document.form1.TextSensitive.value = "";
        document.form1.HealthEffects.value = "";
        document.form1.Cautionary.value = "";
    } else if (b == "O3message") {
        var myWindowO3 = window.open("", "", "width=450,height=75,left=450,menubar=no,top=200");
        myWindowO3.document.write("<p>8-hour ozone values do not define higher AQI values (>=301).</p>  <p>AQI values of 301 or greater are calculated with 1-hour ozone concentrations.</p>");
        document.form1.inputbox.value = "";
        document.form1.outputbox1.value = "";
        document.form1.outputbox2.value = "";
        document.form1.TextSensitive.value = "";
        document.form1.HealthEffects.value = "";
        document.form1.Cautionary.value = "";
    } else if (b == "PM25message") {
        var myWindowPM = window.open("", "", "width=450,height=75,left=450,menubar=no,top=200");
        myWindowPM.document.write("<p>Note: Values above 500 are considered Beyond the AQI.</p><p>Additional information on reducing exposure to extremely high levels of particle pollution is available <a href='https://airnow.gov/index.cfm?action=aqibasics.pmhilevels'target='_blank'>here</a>.</p>");
        document.form1.inputbox.value = "";
        document.form1.outputbox1.value = "";
        document.form1.outputbox2.value = "";
        document.form1.TextSensitive.value = "";
        document.form1.HealthEffects.value = "";
        document.form1.Cautionary.value = "";
    } else if (b == "PM10message") {
        var myWindowPM = window.open("", "", "width=450,height=75,left=450,menubar=no,top=200");
        myWindowPM.document.write("<p>Note: Values above 500 are considered Beyond the AQI. Follow recommendations for the Hazardous category.</p>");
        document.form1.inputbox.value = "";
        document.form1.outputbox1.value = "";
        document.form1.outputbox2.value = "";
        document.form1.TextSensitive.value = "";
        document.form1.HealthEffects.value = "";
        document.form1.Cautionary.value = "";
    } else {
        document.form1.outputbox1.value = c;
        document.form1.outputbox2.value = AQICategory(b);
    }
    document.form1.outputbox1.style.textAlign = "center";
    document.form1.outputbox2.style.textAlign = "center";
    document.form1.TextSensitive.style.textAlign = "center";
    document.form1.HealthEffects.style.textAlign = "center";
    document.form1.Cautionary.style.textAlign = "center";

    if (document.form1.outputbox2.value == 'Good') {
        document.form1.outputbox2.style.backgroundColor = "#00e000";
        document.form1.outputbox2.style.color = "black";
        document.form1.HealthEffects.value = "None";
        document.form1.Cautionary.value = "None";
        if (document.form1.pollutant.selectedIndex == '1') {
            document.form1.TextSensitive.value = "People with respiratory or heart disease, the elderly and children are the groups most at risk.";
        } else if (document.form1.pollutant.selectedIndex == '2') {
            document.form1.TextSensitive.value = "People with respiratory disease are the group most at risk.";
        } else if (document.form1.pollutant.selectedIndex == '3') {
            document.form1.TextSensitive.value = "People with heart disease are the group most at risk.";
        } else if (document.form1.pollutant.selectedIndex == '4' || form1.pollutant.selectedIndex == '5') {
            document.form1.TextSensitive.value = "People with asthma are the group most at risk.";
        } else if (document.form1.pollutant.selectedIndex == '6' || form1.pollutant.selectedIndex == '7') {
            document.form1.TextSensitive.value = "Children and people with asthma are the groups most at risk.";
        } else if (document.form1.pollutant.selectedIndex == '8') {
            document.form1.TextSensitive.value = "People with asthma or other respiratory diseases, the elderly, and children are the groups most at risk.";
        }
    } else if (document.form1.outputbox2.value == 'Moderate') {
        document.form1.outputbox2.style.backgroundColor = "#ffff00";
        document.form1.outputbox2.style.color = "black";
        if (document.form1.pollutant.selectedIndex == '1') {
            document.form1.TextSensitive.value = "People with respiratory or heart disease, the elderly and children are the groups most at risk.";
            document.form1.HealthEffects.value = "Unusually sensitive people should consider reducing prolonged or heavy exertion.";
            document.form1.Cautionary.value = "Unusually sensitive people should consider reducing prolonged or heavy exertion.";
        } else if (document.form1.pollutant.selectedIndex == '2') {
            document.form1.TextSensitive.value = "People with respiratory disease are the group most at risk.";
            document.form1.HealthEffects.value = "Unusually sensitive people should consider reducing prolonged or heavy exertion.";
            document.form1.Cautionary.value = "Unusually sensitive people should consider reducing prolonged or heavy exertion.";
        } else if (document.form1.pollutant.selectedIndex == '3') {
            document.form1.TextSensitive.value = "People with heart disease are the group most at risk.";
            document.form1.HealthEffects.value = "None";
            document.form1.Cautionary.value = "None";
        } else if (document.form1.pollutant.selectedIndex == '4' || form1.pollutant.selectedIndex == '5') {
            document.form1.TextSensitive.value = "People with asthma are the group most at risk.";
            document.form1.HealthEffects.value = "None";
            document.form1.Cautionary.value = "None";
        } else if (document.form1.pollutant.selectedIndex == '6' || form1.pollutant.selectedIndex == '7') {
            document.form1.TextSensitive.value = "Children and people with asthma are the groups most at risk.";
            if (document.form1.pollutant.selectedIndex == '6') {
                document.form1.HealthEffects.value = "Unusually sensitive individuals may experience respiratory symptoms.";
                document.form1.Cautionary.value = "Unusually sensitive people should consider limiting prolonged outdoor exertion.";
            }
        } else if (document.form1.pollutant.selectedIndex == '8') {
            document.form1.TextSensitive.value = "People with asthma or other respiratory diseases, the elderly, and children are the groups most at risk.";
            document.form1.HealthEffects.value = "Unusually sensitive individuals may experience respiratory symptoms.";
            document.form1.Cautionary.value = "Unusually sensitive people should consider reducing prolonged or heavy outdoor exertion.";
        }
    } else if (document.form1.outputbox2.value == 'Unhealthy for Sensitive Groups') {
        document.form1.outputbox2.style.backgroundColor = "#ff7600";
        document.form1.outputbox2.style.color = "black";
        if (document.form1.pollutant.selectedIndex == '1') {
            document.form1.TextSensitive.value = "People with respiratory or heart disease, the elderly and children are the groups most at risk.";
            document.form1.HealthEffects.value = "Increasing likelihood of respiratory symptoms in sensitive individuals, aggravation of heart or lung disease and premature mortality in persons with cardiopulmonary disease and the elderly.";
            document.form1.Cautionary.value = "People with respiratory or heart disease, the elderly and children should limit prolonged exertion.";
        } else if (document.form1.pollutant.selectedIndex == '2') {
            document.form1.TextSensitive.value = "People with respiratory disease are the group most at risk.";
            document.form1.HealthEffects.value = "Increasing likelihood of respiratory symptoms and aggravation of lung disease, such as asthma.";
            document.form1.Cautionary.value = "People with respiratory disease, such as asthma, should limit outdoor exertion.";
        } else if (document.form1.pollutant.selectedIndex == '3') {
            document.form1.TextSensitive.value = "People with heart disease are the group most at risk.";
            document.form1.HealthEffects.value = "Increasing likelihood of reduced exercise tolerance due to increased cardiovascular symptoms, such as chest pain, in people with cardiovascular disease.";
            document.form1.Cautionary.value = "People with cardiovascular disease, such as angina, should limit heavy exertion and avoid sources of CO, such as heavy traffic.";
        } else if (document.form1.pollutant.selectedIndex == '4' || form1.pollutant.selectedIndex == '5') {
            document.form1.TextSensitive.value = "People with asthma are the group most at risk.";
            document.form1.HealthEffects.value = "Increasing likelihood of respiratory symptoms, such as chest tightness and breathing discomfort, in people with asthma.";
            document.form1.Cautionary.value = "People with asthma should consider limiting outdoor exertion.";
        } else if (document.form1.pollutant.selectedIndex == '6' || form1.pollutant.selectedIndex == '7') {
            document.form1.HealthEffects.value = "Increasing likelihood of respiratory symptoms and breathing discomfort in active children and adults and people with respiratory disease, such as asthma.";
            document.form1.TextSensitive.value = "Children and people with asthma are the groups most at risk.";
            if (document.form1.pollutant.selectedIndex == '6') {
                document.form1.Cautionary.value = "Active children and adults, and people with respiratory disease, such as asthma, should limit prolonged outdoor exertion.";
            } else if (document.form1.pollutant.selectedIndex == '7') {
                document.form1.Cautionary.value = "Active children and adults, and people with respiratory disease, such as asthma, should limit heavy outdoor exertion.";
            }
        } else if (document.form1.pollutant.selectedIndex == '8') {
            document.form1.TextSensitive.value = "People with asthma or other respiratory diseases, the elderly, and children are the groups most at risk.";
            document.form1.HealthEffects.value = "Increasing likelihood of respiratory symptoms and breathing discomfort in active children, the elderly, and people with lung disease, such as asthma.";
            document.form1.Cautionary.value = "Active children, the elderly, and people with lung disease, such as asthma, should reduce prolonged or heavy outdoor exertion.";
        }
    } else if (document.form1.outputbox2.value == 'Unhealthy') {
        document.form1.outputbox2.style.backgroundColor = "#ff0000";
        document.form1.outputbox2.style.color = "black";
        if (document.form1.pollutant.selectedIndex == '1') {
            document.form1.TextSensitive.value = "People with respiratory or heart disease, the elderly and children are the groups most at risk.";
            document.form1.HealthEffects.value = "Increased aggravation of heart or lung disease and premature mortality in persons with cardiopulmonary disease and the elderly; increased respiratory effects in general population.";
            document.form1.Cautionary.value = "People with respiratory or heart disease, the elderly and children should avoid prolonged exertion; everyone else should limit prolonged exertion.";
        } else if (document.form1.pollutant.selectedIndex == '2') {
            document.form1.TextSensitive.value = "People with respiratory disease are the group most at risk.";
            document.form1.HealthEffects.value = "Increased respiratory symptoms and aggravation of lung disease, such as asthma; possible respiratory effects in general population.";
            document.form1.Cautionary.value = "People with respiratory or heart disease, the elderly and children should avoid prolonged exertion; everyone else should limit prolonged exertion.";
        } else if (document.form1.pollutant.selectedIndex == '3') {
            document.form1.TextSensitive.value = "People with heart disease are the group most at risk.";
            document.form1.HealthEffects.value = "Reduced exercise tolerance due to increased cardiovascular symptoms, such as chest pain, in people with cardiovascular disease.";
            document.form1.Cautionary.value = "People with cardiovascular disease, such as angina, should limit moderate exertion and avoid sources of CO, such as heavy traffic.";
        } else if (document.form1.pollutant.selectedIndex == '4' || form1.pollutant.selectedIndex == '5') {
            document.form1.TextSensitive.value = "People with asthma are the group most at risk.";
            document.form1.HealthEffects.value = "Increased respiratory symptoms, such as chest tightness and wheezing in people with asthma; possible aggravation of heart or lung disease.";
            document.form1.Cautionary.value = "Children, asthmatics, and people with heart or lung disease should limit outdoor exertion.";
        } else if (document.form1.pollutant.selectedIndex == '6' || form1.pollutant.selectedIndex == '7') {
            document.form1.TextSensitive.value = "Children and people with asthma are the groups most at risk.";
            document.form1.HealthEffects.value = "Greater likelihood of respiratory symptoms and breathing difficulty in active children and adults and people with respiratory disease, such as asthma; possible respiratory effects in general population.";
            if (document.form1.pollutant.selectedIndex == '6') {
                document.form1.Cautionary.value = "Active children and adults, and people with respiratory disease, such as asthma, should avoid prolonged outdoor exertion; everyone else, especially children, should limit prolonged outdoor exertion.";
            } else if (document.form1.pollutant.selectedIndex == '7') {
                document.form1.Cautionary.value = "Active children and adults, and people with respiratory disease, such as asthma, should avoid heavy outdoor exertion; everyone else, especially children, should limit heavy outdoor exertion.";
            }
        } else if (document.form1.pollutant.selectedIndex == '8') {
            document.form1.TextSensitive.value = "People with asthma or other respiratory diseases, the elderly, and children are the groups most at risk.";
            document.form1.HealthEffects.value = "Greater likelihood of respiratory symptoms in active children, the elderly, and people with lung disease, such as asthma; possible respiratory effects in general population.";
            document.form1.Cautionary.value = "Active children, the elderly, and people with lung disease, such as asthma, should avoid prolonged or heavy outdoor exertion; everyone else, expecially children, should reduce prolonged or heavy outdoor exertion.";
        }
    } else if (document.form1.outputbox2.value == 'Very Unhealthy') {
        document.form1.outputbox2.style.backgroundColor = "#990049";
        document.form1.outputbox2.style.color = "#ffffff";
        if (document.form1.pollutant.selectedIndex == '1') {
            document.form1.TextSensitive.value = "People with respiratory or heart disease, the elderly and children are the groups most at risk.";
            document.form1.HealthEffects.value = "Significant aggravation of heart or lung disease and premature mortality in persons with cardiopulmonary disease and the elderly; significant increase in respiratory effects in general population.";
            document.form1.Cautionary.value = "People with respiratory or heart disease, the elderly and children should avoid any outdoor activity; everyone else should avoid prolonged exertion.";
        } else if (document.form1.pollutant.selectedIndex == '2') {
            document.form1.TextSensitive.value = "People with respiratory disease are the group most at risk.";
            document.form1.HealthEffects.value = "Significant increase in respiratory symptoms and aggravation of lung disease, such as asthma; increasing likelihood of respiratory effects in general population.";
            document.form1.Cautionary.value = "People with respiratory disease, such as asthma, should avoid any outdoor activity; everyone else, especially the elderly and children, should limit outdoor exertion.";
        } else if (document.form1.pollutant.selectedIndex == '3') {
            document.form1.TextSensitive.value = "People with heart disease are the group most at risk.";
            document.form1.HealthEffects.value = "Significant aggravation of cardiovascular symptoms, such as chest pain, in people with cardiovascular disease.";
            document.form1.Cautionary.value = "People with cardiovascular disease, such as angina, should avoid exertion and sources of CO, such as heavy traffic.";
        } else if (document.form1.pollutant.selectedIndex == '4' || form1.pollutant.selectedIndex == '5') {
            document.form1.TextSensitive.value = "People with asthma are the group most at risk.";
            document.form1.HealthEffects.value = "Significant increase in respiratory symptoms, such as wheezing and shortness of breath, in people with asthma; aggravation of heart or lung disease.";
            document.form1.Cautionary.value = "Children, asthmatics, and people with heart or lung disease should avoid outdoor exertion; everyone else should limit outdoor exertion.";
        } else if (document.form1.pollutant.selectedIndex == '6' || document.form1.pollutant.selectedIndex == '7') {
            document.form1.TextSensitive.value = "Children and people with asthma are the groups most at risk.";
            document.form1.HealthEffects.value = "Increasingly severe symptoms and impaired breathing likely in active children and adults and people with respiratory disease, such as asthma; increasing likelihood of respiratory effects in general population.";
            document.form1.Cautionary.value = "Active children and adults, and people with respiratory disease, such as asthma, should avoid all outdoor exertion; everyone else, especially children, should limit outdoor exertion.";
        } else if (document.form1.pollutant.selectedIndex == '8') {
            document.form1.TextSensitive.value = "People with asthma or other respiratory diseases, the elderly, and children are the groups most at risk.";
            document.form1.HealthEffects.value = "Increasingly severe symptoms and impaired breathing likely in active children, the elderly, and people with lung disease, such as asthma; increasing likelihood of respiratory effects in general population.";
            document.form1.Cautionary.value = "Active children, the elderly, and people with lung disease, such as asthma, should avoid all outdoor exertion; everyone else, especially children, should avoid prolonged or heavy outdoor exertion.";
        }
    } else if (document.form1.outputbox2.value == 'Hazardous') {
        document.form1.outputbox2.style.backgroundColor = "#7E0023";
        document.form1.outputbox2.style.color = "#ffffff";
        if (document.form1.pollutant.selectedIndex == '1') {
            document.form1.TextSensitive.value = "People with respiratory or heart disease, the elderly and children are the groups most at risk.";
            document.form1.HealthEffects.value = "Serious aggravation of heart or lung disease and premature mortality in persons with cardiopulmonary disease and the elderly; serious risk of respiratory effects in general population.";
            document.form1.Cautionary.value = "Everyone should avoid any outdoor exertion; people with respiratory or heart disease, the elderly and children should remain indoors.";
        } else if (document.form1.pollutant.selectedIndex == '2') {
            document.form1.TextSensitive.value = "People with respiratory disease are the group most at risk.";
            document.form1.HealthEffects.value = "Serious risk of respiratory symptoms and aggravation of lung disease, such as asthma; respiratory effects likely in general population.";
            document.form1.Cautionary.value = "Everyone should avoid any outdoor exertion; people with respiratory disease, such as asthma, should remain indoors.";
        } else if (document.form1.pollutant.selectedIndex == '3') {
            document.form1.TextSensitive.value = "People with heart disease are the group most at risk.";
            document.form1.HealthEffects.value = "Serious aggravation of cardiovascular symptoms, such as chest pain, in people with cardiovascular disease; impairment of strenuous activities in general population.";
            document.form1.Cautionary.value = "People with cardiovascular disease, such as angina, should avoid exertion and sources of CO, such as heavy traffic; everyone else should limit heavy exertion.";
        } else if (document.form1.pollutant.selectedIndex == '4' || form1.pollutant.selectedIndex == '5') {
            document.form1.TextSensitive.value = "People with asthma are the group most at risk.";
            document.form1.HealthEffects.value = "Severe respiratory symptoms, such as wheezing and shortness of breath, in people with asthma; increased aggravation of heart or lung disease; possible respiratory effects in general population.";
            document.form1.Cautionary.value = "Children, asthmatics, and people with heart or lung disease should remain indoors; everyone else should avoid outdoor exertion.";
        } else if (document.form1.pollutant.selectedIndex == '6' || document.form1.pollutant.selectedIndex == '7') {
            document.form1.TextSensitive.value = "Children and people with asthma are the groups most at risk.";
            document.form1.HealthEffects.value = "Severe respiratory effects and impaired breathing likely in active children and adults and people with respiratory disease, such as asthma; increasingly severe respiratory effects likely in general population.";
            document.form1.Cautionary.value = "Everyone should avoid all outdoor exertion.";
        } else if (document.form1.pollutant.selectedIndex == '8') {
            document.form1.TextSensitive.value = "People with asthma or other respiratory diseases, the elderly, and children are the groups most at risk.";
            document.form1.HealthEffects.value = "Severe respiratory effects and impaired breathing likely in active children, the elderly, and people with lung disease, such as asthma; increasingly severe respiratory effects likely in general population.";
            document.form1.Cautionary.value = "Children, the elderly, and people with lung disease, such as asthma, should remain indoors; everyone else, especially children, should avoid outdoor exertion.";
        }
    } else {
        document.form1.outputbox2.style.backgroundColor = "#ffffff";
        document.form1.outputbox2.style.color = "black";
        document.form1.TextSensitive.value = "";
        document.form1.HealthEffects.value = "";
        document.form1.Cautionary.value = "";
    }

    return true;
}