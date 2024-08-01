//Creates HTML for Review and Report
const sPrem = '<img src="assets/img/premium-32.png" class="smallIcon" />';
const sPrev = '<img src="assets/img/preview-32.png" class="smallIcon" />';
let sReview;
let sReport;
let iWarning = 0;

function generateReport(data) {
    sReview = sReviewTemplate;
    sReport = sReportTemplate;

    let isTrue = (currentValue) => currentValue == true;
    ////////const pLoading = document.getElementById("loading");
    let iFail = 0;
    iWarning = 0;
    const sIconW = '<span style="color:orange">&#9888;</span>';
    const sIconR = '<span style="color:red">&#10006;</span>';
    let sLabel = "";
    let sFlowDisplayName = data.name;
    if (!data.exceptionHandleScope) {
        iFail++;
    }
    if (!data.exceptionScope) {
        iFail++;
    }
    if (!data.mainScope) {
        iFail++;
    }
    if (data.composes == 1) {
        iWarning = iWarning + data.composes;
    } else if (data.composes > 2) {
        iFail++;
    }

    const sRef =
        "<p>Com:" +
        oConfigReference.complexity +
        " | Rat:" +
        oConfigReference.ratings +
        " | Nam:" +
        oConfigReference.naming +
        " | Sco:" +
        oConfigReference.score +
        "</p>";

    if (pLoading.innerHTML != "" && pLoading.innerHTML != null) {
        sFlowDisplayName = pLoading.innerHTML
        .replace("_img src=_assets_img_old flow grey fill.svg__&nbsp;", "")
        .replace('<img src="assets/img/old flow grey fill.svg">', "");
        //
    }

    const bVariablePass =
        [data.varNameUse, data.varNaming].every(isTrue) || data.variables == 0;

    sReview = sReview.replace("{references}", sRef);
    sReview = sReview.replace("{flowName}", sFlowDisplayName);
    sReview = sReview.replace("{flowId}", data.id);
    sReview = sReview.replace("{owner}", data.owner);
    sReview = sReview.replace("{variable}", bVariablePass);
    sReview = sReview.replace(
        "{exception}",
        data.exceptionScope && data.exceptionTerminate && data.exceptionLink
    );
    sReview = sReview.replace("{main}", data.mainScope);
    sReview = sReview.replace("{composes}", data.composes);
    sReview = sReview.replace("{date}", getToday());
    sReview = sReview.replace("{complexity}", data.complexity);
    let sPremIcon = "";
    if (data.premium) {
        sPremIcon = sPrem;
    }
    sReview = sReview.replace("{premium}", sPremIcon);

    sReport = sReport.replace("{flowName}", sFlowDisplayName);
    sReport = sReport.replace("{flowId}", data.id);
    sReport = sReport.replace("{owner}", data.owner);
    sReport = sReport.replace("{date}", getToday());

    if (data.complexity > oRatings.complexityRe) {
        sReview = sReview.replace(
        'id="complexity" style="text-align: center; background-color:green;',
        'id="complexity" style="text-align: center; background-color:red;'
        );
        iWarning++;
    } else if (data.complexity > oRatings.complexityAm) {
        sReview = sReview.replace(
        'id="complexity" style="text-align: center; background-color:green;',
        'id="complexity" style="text-align: center; background-color:orange;'
        );
        iFail++;
    }
    sReview = sReview.replace("{actions}", data.steps);

    if (data.steps > oRatings.actionRe) {
        sReview = sReview.replace(
        'id="actions" style="text-align: center; background-color:green;',
        'id="actions" style="text-align: center; background-color:red;'
        );
        iWarning++;
    } else if (data.steps > oRatings.actionsAm) {
        sReview = sReview.replace(
        'id="actions" style="text-align: center; background-color:green;',
        'id="actions" style="text-align: center; background-color:orange;'
        );
        iFail++;
    }
    sReview = sReview.replace("{variables}", data.variables);

    if (data.variables > oRatings.variablesRe) {
        sReview = sReview.replace(
        'id="variables" style="text-align: center; background-color:green;',
        'id="variables" style="text-align: center; background-color:red;'
        );
        iWarning++;
    } else if (data.variables > oRatings.variablesAm) {
        sReview = sReview.replace(
        'id="variables" style="text-align: center; background-color:green;',
        'id="variables" style="text-align: center; background-color:orange;'
        );
        iFail++;
    }
    sReview = sReview.replace("{exceptions}", data.exception);

    if (data.exception <= oRatings.exceptionsRe) {
        sReview = sReview.replace(
        'id="exceptions" style="text-align: center; background-color:green;',
        'id="exceptions" style="text-align: center; background-color:red;'
        );
        iWarning++;
    } else if (data.exception < oRatings.exceptions) {
        sReview = sReview.replace(
        'id="exceptions" style="text-align: center; background-color:green;',
        'id="exceptions" style="text-align: center; background-color:orange;'
        );
        iFail++;
    }

    let variablesTable =
        '<table class="mui-table mui-table--bordered" id="variablesTable" ><thead><tr><th>Name</th><th>Type</th><th>Value</th><th>Used</th><th>Named</th><th>Constant</th></tr></thead><tbody>';
    data.variableArray.forEach((item) => {
        sLabel = "";
        if (!item.local) {
        iWarning++;
        sLabel = sIconW;
        }
        if (!item.used) {
        iFail++;
        sLabel = sIconR;
        }
        if (!item.named) {
        iFail++;
        sLabel = sIconR;
        }
        variablesTable =
        variablesTable +
        "<tr><td>" +
        sLabel +
        " " +
        item.name +
        "</td><td>" +
        item.type +
        "</td><td><div contentEditable='true' style='overflow-y:auto; resize:both; background-color:white;'><pre>" +
        inputFormat(item.value) +
        "</pre></div></td><td>" +
        item.used +
        "</td><td>" +
        item.named +
        "</td><td>" +
        item.local +
        "</td></tr>";
    });
    variablesTable = variablesTable + "</tbody></table>";
    sReview = sReview.replace("{variablesTable}", variablesTable);
    sReport = sReport.replace("{variablesTable}", variablesTable);

    let exceptionsTable =
        '<table class="mui-table mui-table--bordered"><thead><tr><th>Action</th><th>Name</th><th>Runafter</th></tr></thead><tbody>';
    data.exceptionArray.forEach((item) => {
        sLabel = "";
        if (!item.runAfter.includes("TimedOut")) {
        iFail++;
        sLabel = sIconR;
        }
        exceptionsTable =
        exceptionsTable +
        "<tr><td>" +
        sLabel +
        " " +
        item.step +
        "</td><td>" +
        item.name +
        "</td><td>" +
        item.runAfter +
        "</td></tr>";
    });
    exceptionsTable = exceptionsTable + "</tbody></table>";
    sReview = sReview.replace("{exceptionsTable}", exceptionsTable);
    sReport = sReport.replace("{exceptionsTable}", exceptionsTable);

    let actionsTable =
        '<table class="mui-table mui-table--bordered" id="actionTable"><thead><tr><th style="max-width:24%">Name</th><th style="max-width:24%">Type</th><th style="max-width:24%">Run After</th><th style="max-width:24%">Notes</th><th>Nested</th><th>Id</th></tr></thead><tbody>';
    for (i = 0; i < data.actionArray.length; i++) {
        actionsTable =
        actionsTable +
        "<tr><td id='" +
        data.actionArray[i].hashId +
        "'><a href='#" +
        data.actionArray[i].hashId +
        "-IN'>" +
        data.actionArray[i].name +
        "</a></td><td>" +
        apiLink(
            data.actionArray[i].type,
            data.actionArray[i].step,
            data.actionArray[i].hashId
        ) +
        "</td><td>" +
        data.actionArray[i].runAfter +
        "</td><td><div contentEditable='true' style='max-height=100px; overflow-y:auto; resize:vertical;'><pre>" +
        data.actionArray[i].notes.replaceAll("<", "-").replaceAll("£$", "") +
        "</pre></div></td><td>" +
        data.actionArray[i].nested +
        "</td><td>" +
        data.actionArray[i].index +
        "</td></tr>";
    }

    actionsTable = actionsTable + "</tbody></table>";

    sReview = sReview.replace("{actionsTable}", actionsTable);
    sReport = sReport.replace("{actionsTable}", actionsTable);

    let inputTable =
        '<table class="mui-table mui-table--bordered" id="inputTable"><thead><tr><th style="width:24%">Name</th><th style="width:14%">Type</th><th style="width:6%">Env</th><th>Inputs</th></tr></thead><tbody>';
    data.actionArray.forEach(
        (item) =>
        (inputTable =
            inputTable +
            "<tr><td id='" +
            item.hashId +
            "-IN'><a href='#" +
            item.hashId +
            "'>" +
            item.name +
            "</a></td><td>" +
            item.step +
            "</td><td>" +
            item.environmentB +
            "</td><td><div contentEditable='true' style='max-height=100px; overflow-y:auto; resize:vertical;'><pre>" +
            inputFormat(item.detail) +
            "</pre></div></td></tr>")
    );

    inputTable = inputTable + "</tbody></table>";

    sReview = sReview.replace("{inputTable}", inputTable);
    sReport = sReport.replace("{inputTable}", inputTable); 

    let connectionsTable =
        '<table class="mui-table mui-table--bordered"><thead><tr><th>Name</th><th>Id</th><th>Count</th></tr></thead><tbody>';
    data.connectionArray.forEach(
        (item) =>
        (connectionsTable =
            connectionsTable +
            "<tr><td>" +
            item.conName +
            '</td><td style="max-width:200px">' +
            item.appId +
            "</td><td>" +
            item.count +
            "</td></tr>")
    );
    connectionsTable = connectionsTable + "</tbody></table>";
    sReview = sReview.replace("{connectionsTable}", connectionsTable);
    sReport = sReport.replace("{connectionsTable}", connectionsTable);

    let apiTable =
        '<table class="mui-table mui-table--bordered" id="apiTable"><thead><tr><th>Name</th><th>Type</th><th>Connector</th><th>Filter</th><th>Pagination</th><th>Retry</th></tr></thead><tbody>';

    data.apiActionArray.forEach((item) => {
        sLabel = "";
        if (item.filter == "" && item.step == "GetItems") {
        iWarning++;
        sLabel = sIconW;
        }
        if (
        item.pagination == "" &&
        (item.step == "GetItems" || item.step.includes("ListMyTasks"))
        ) {
        iWarning++;
        sLabel = sIconW;
        }
        if (item.retry == "" && item.step == "PatchItem") {
        iWarning++;
        sLabel = sIconW;
        }
        if (item.tier != "Standard") {
        if (sLabel != "") {
            sLabel = sLabel + " ";
        }
        if (item.tier == "Premium") {
            sLabel = sLabel + sPrem;
        }
        }

        apiTable =
        apiTable +
        "<tr><td id='" +
        item.hashId +
        "-API'><a href='#" +
        item.hashId +
        "'>" +
        sLabel +
        " " +
        item.name +
        "</td><td>" +
        item.step +
        '</td><td style="max-width:200px">' +
        item.connector +
        '</td><td style="max-width:200px; max-height:100px; overflow-y:auto;">' +
        item.filter +
        "</td><td>" +
        item.pagination +
        '</td><td style="max-width:200px; max-height:100px; overflow-y:auto;">' +
        item.retry +
        "</td></tr>";
    });

    apiTable = apiTable + "</tbody></table>";
    sReview = sReview.replace("{apiTable}", apiTable);
    sReport = sReport.replace("{apiTable}", apiTable);

    const iRating = rating(data);
    let sBar =
        '<div style="background-color:#EEEEEE"><div style="width:' +
        iRating +
        '%; background-color:{barColour}; color:white; text-align:center">' +
        iRating +
        "</div></div>";
    if (iRating < 75) {
        sBar = sBar.replace("{barColour}", "red");
    } else if (iRating < 90) {
        sBar = sBar.replace("{barColour}", "orange");
    } else {
        sBar = sBar.replace("{barColour}", "green");
    }

    sBar =
        sBar +
        '<table class="mui-table mui-table--bordered"><thead><tr><th></th><th></th></tr></thead><tbody><tr><td><h2>Warnings</h2></td><td><h2>' +
        iWarning +
        "</h2></td></tr><tr><td><h2>Failures</h2></td><td><h2>" +
        iFail +
        "</h2></td></tr></tbody></table>";
    sReview = sReview.replace("{ratingBar}", sBar);
    let sTrigger =
        "<div style='padding-left:10px'<b>Type: " +
        data.trigger +
        "</b><br><p><b>Data: </b>" +
        data.triggerData +
        "</b><br><p><b>Parameters: </b>" +
        data.triggerParam.replaceAll("£$", "") +
        "</p><p><b>Configuration:</b> " +
        data.triggerConfig.replaceAll("£$", "") +
        "</p><b>Inputs:</b> " +
        data.triggerInputs.replaceAll("£$", "") +
        "</p><p><b>Recurrence: </b>" +
        data.triggerRecur +
        "</p><p><b>Expressions:</b> " +
        data.triggerExpress +
        "</p></div>";

    sReview = sReview.replace("{trigger}", sTrigger);
    sReport = sReport.replace("{trigger}", sTrigger);

    const notesElm = document.getElementById("actionNotes");
    let sAct = "";

    let aAct = data.actionArray.filter(
        (item) => item.notes != "" && item.notes != null
    );

    aAct.forEach((object) => {
        sAct = sAct + object.name + ": " + object.notes + "\n";
    });

    sReview = sReview.replace("{connectorsTable}", "");
    sReport = sReport.replace("{connectorsTable}", "");

    sReport = sReport.replaceAll(sIconW, "");
    sReport = sReport.replaceAll(sIconR, "");
}

function checkRatings(oObject) {
    if (!Object.hasOwn(oObject, "complexityAm")) {
        return false;
    }
    if (!Object.hasOwn(oObject, "complexityRe")) {
        return false;
    }
    if (!Object.hasOwn(oObject, "actionsAm")) {
        return false;
    }
    if (!Object.hasOwn(oObject, "actionsRe")) {
        return false;
    }
    if (!Object.hasOwn(oObject, "variablesAm")) {
        return false;
    }
    if (!Object.hasOwn(oObject, "variablesRe")) {
        return false;
    }
    if (!Object.hasOwn(oObject, "exceptionsAm")) {
        return false;
    }
    if (!Object.hasOwn(oObject, "exceptionsRe")) {
        return false;
    }

    return true;
}
function rating(data) {
    let iScore = 0;

    if (data.exceptionScope && data.exceptionTerminate && data.exceptionLink) {
        iScore =
        iScore + aScoring.find((item) => item.Name == "exceptionScope").Score;
    }

    if (data.mainScope) {
        iScore = iScore + aScoring.find((item) => item.Name == "mainScope").Score;
    }

    if (data.varNaming) {
        iScore = iScore + aScoring.find((item) => item.Name == "varNaming").Score;
    }

    if (data.varNameUse) {
        iScore = iScore + aScoring.find((item) => item.Name == "varUsed").Score;
    }

    if (data.varNameConsts) {
        iScore = iScore + aScoring.find((item) => item.Name == "varConstant").Score;
    }

    let iCompose =
        aScoring.find((item) => item.Name == "composes").Score -
        data.composes *
        aScoring.find((item) => item.Name == "composesDeduction").Score;
    if (iCompose < 0) {
        iCompose = 0;
    }
    iScore = iScore + iCompose;

    let iVariable =
        aScoring.find((item) => item.Name == "variables").Score -
        data.variables *
        aScoring.find((item) => item.Name == "variablesDeduction").Score;
    if (iVariable < 0) {
        iVariable = 0;
    }
    iScore = iScore + iVariable;

    let iConnectorRef;
    if (
        data.connectionRefs >
        aScoring.find((item) => item.Name == "connectionsMin").Score
    ) {
        iConnectorRef =
        aScoring.find((item) => item.Name == "connections").Score -
        (data.connectionRefs -
            aScoring.find((item) => item.Name == "connectionsMin").Score) *
            aScoring.find((item) => item.Name == "connectionsDeduction").Score;
    } else {
        iConnectorRef = aScoring.find((item) => item.Name == "connections").Score;
    }
    if (iConnectorRef < 0) {
        iConnectorRef = 0;
    }
    iScore = iScore + iConnectorRef;

    let iComplexity = aScoring.find(
        (item) => item.Name == "complexityGreen"
    ).Score;
    if (data.complexity > oRatings.complexityRe) {
        iComplexity = aScoring.find((item) => item.Name == "complexityRed").Score;
    } else if (data.complexity > oRatings.complexityAm) {
        iComplexity = aScoring.find((item) => item.Name == "complexityAmber").Score;
    }
    iScore = iScore + iComplexity;

    let iActions = aScoring.find((item) => item.Name == "actionsGreen").Score;
    if (data.steps > oRatings.actionRe) {
        iActions = aScoring.find((item) => item.Name == "actionsAmber").Score;
    } else if (data.steps > oRatings.actionsAm) {
        iActions = aScoring.find((item) => item.Name == "actionsAmber").Score;
    }
    iScore = iScore + iActions;

    return iScore;
}

function getToday() {
    let date = new Date();
    return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join("/");
}

function apiLink(type, step, hashId) {
    if (type == "OpenApiConnection") {
        return "<a href='#" + hashId + "-API'>" + step + "</a>";
    } else {
        return step;
    }
}

function inputFormat(input) {
    if (input == undefined || input == null) {
        return "";
    }
    let oJson = input.replaceAll("<", "&lt;").replaceAll("£$", "");
    oJson = oJson.replace(/\\n/g, "\n");
    oJson = oJson.replace(/\\r/g, "");
    oJson = oJson.replace(/\\t/g, "");
    return oJson.replaceAll("{", "{ \n").replaceAll("}", "} \n");
}