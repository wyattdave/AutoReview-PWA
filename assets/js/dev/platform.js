//// Code dependent on if Site of Extension
let iReset=localStorage.getItem("reset");
if (iReset != undefined && !bResetStorage) {
    if (iReset < iResetStorage) {
        bResetStorage = true;
        chrome.storage.sync.clear();
        pLoading.innerHTML =
        "Config Reset to defaults, please re-upload if required";
        pLoading.style.color = "red";
        console.log(
        "Config Reset to defaults, please re-upload if required: version" +
            iResetStorage
        );
    }
    localStorage.setItem("reset",iResetStorage);
  
} else {
    localStorage.setItem("reset",iResetStorage);
}

if (localStorage.getItem("complexity") != undefined && !bResetStorage) {
    aComplexity = JSON.parse(localStorage.getItem("complexity"));
} else {
    localStorage.setItem("complexity",JSON.stringify(aComplexityTemplate));
    aComplexity = aComplexityTemplate.slice();
}

if (localStorage.getItem("ratings") != undefined && !bResetStorage) {
    oRatings = JSON.parse(localStorage.getItem("ratings"));
} else {
    localStorage.setItem("ratings",JSON.stringify(oRatingsTemplate));
    oRatings = oRatingsTemplate;
}

if (localStorage.getItem("scoring") != undefined && !bResetStorage) {
    aScoring = JSON.parse(localStorage.getItem("scoring"));
} else {
    localStorage.setItem("scoring",JSON.stringify(aScoringTemplate));
    aScoring = aScoringTemplate.slice(0);
}

if (localStorage.getItem("naming")!= undefined && !bResetStorage) {
    oNaming = JSON.parse(localStorage.getItem("naming"));
} else {
    localStorage.setItem("naming",JSON.stringify(oNamingTemplate));
    oNaming = oNamingTemplate;
}

if (localStorage.getItem("references") != undefined && !bResetStorage) {
    oConfigReference = JSON.parse(localStorage.getItem("references"));
} else {
    localStorage.setItem("references",JSON.stringify(oConfigReferenceTemplate));
    oConfigReference = oConfigReferenceTemplate;
}


if (
    localStorage.getItem("saved")!= undefined &&
    localStorage.getItem("definition") != undefined &&
    !bResetStorage
) {
    oSaved = JSON.parse(localStorage.getItem("saved"));
    oSavedDef = JSON.parse(localStorage.getItem("definition"));
    ///iLoad.style = "display:block;";
} else {
    oSaved = null;
    oSavedDef = null;
    ///iLoad.style = "display:none;";
}
localStorage.setItem("naming",JSON.stringify(oNamingTemplate));
localStorage.setItem("complexity",JSON.stringify(aComplexityTemplate));

function SaveData(){
    localStorage.setItem("saved", JSON.stringify(oReport));
    localStorage.setItem("definition", JSON.stringify(sDefinitionParsed));
    const oDiagramSave={
      name:oReport.name,
      id:oReport.id,
      data:oReport.actionArray
    }
    sessionStorage.setItem("diagram", JSON.stringify(oDiagramSave));
}









function ResetConfigs() {
    localStorage.setItem("complexity", JSON.stringify(aComplexityTemplate));
    localStorage.setItem("ratings", JSON.stringify(oRatingsTemplate));
    localStorage.setItem("score", JSON.stringify(aScoringTemplate));
    localStorage.setItem("naming", JSON.stringify(oNamingTemplate));
    localStorage.setItem("scoring", JSON.stringify(aScoringTemplate));
    ocalStorage.setItem("references", JSON.stringify(oConfigReferenceTemplate));
    aComplexity = aComplexityTemplate.slice();
    oRatings = oRatingsTemplate;
    aScoring = aScoringTemplate.slice(0);
    oNaming = oNamingTemplate;
    oConfigReference = oConfigReferenceTemplate;
    pLoading.innerHTML = "Config Reset to defaults";
  }

  