//// Code dependent on if Site of Extension
let bResetStorage = false;
function loadPlatform(pLoading){
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
}

function AddCompare(){
    localStorage.setItem("compare",JSON.stringify(sDefinitionParsed));
    document.getElementById("addCompare-button").style="color: red;";
}

function OpenCompare(){
    let oSavedDefenition;
    let aDifferences=[];
    let sHtml2 =changeTemplate
    const data=localStorage.getItem("compare");
      if ( data != undefined ) {
        oSavedDefenition = JSON.parse(data);
        let sDifferences = DeepDiff(sDefinitionParsed, oSavedDefenition);
        if(sDifferences==undefined){
          sDifferences="No differences found"
        }else{
          aDifferences=sDifferences;
        };
        i = sessionStorage.getItem("windowCounter");
        let sLHS="";
        let sRHS="";
        const sKey='<u>Key</u><br> kind - indicates the kind of change; will be one of the following:<br> kN - indicates a newly added property/element<br> kD - indicates a property/element was deleted<br> kE - indicates a property/element was edited<br> kA - indicates a change occurred within an array<br> kpath - the property path (from the left-hand-side root)<br> klhs - the value on the left-hand-side of the comparison (undefined if kind === "N")<br> krhs - the value on the right-hand-side of the comparison (undefined if kind === "D")<br> kindex - when kind === "A", indicates the array index where the change occurred<br> kitem - when kind === "A", contains a nested change record indicating the change that occurred at the array index<br><br>';
  
        let changeTable =
        '<table class="mui-table mui-table--bordered" id="changeTable"><thead><tr><th>Type</th><th>Path</th><th>First Flow</th><th>Second Flow</th></tr></thead><tbody>';
        
        aDifferences.forEach((item) =>{
          if(item.lhs!=undefined){sLHS=JSON.stringify(item.lhs) + "</td><td>"}else{sLHS="</td><td>"}
          if(item.rhs!=undefined){sRHS=JSON.stringify(item.rhs) + "</td>"}else{sRHS="<td>"}     
          changeTable +=
            "<tr><td style ='width:40px' id='"+item.kind+"-IN'>" +
            item.kind+
            "</td><td>" +
            JSON.stringify(item.path) +
            "</td><td>" +
            sLHS +
            sRHS +
            "</tr>"
        });
      
        changeTable += "</tbody></table><br>";
        sHtml2 = sHtml2.replace("{flowName}", pLoading.innerText);
        sHtml2 = sHtml2.replace("{date}", getToday());
        sHtml2=sHtml2.replace("{json}",sKey+JSON.stringify(sDifferences, undefined, 2) );
        sessionStorage.setItem("changes",  sHtml2.replace("{changeTable}",changeTable));
        const newWindow = window.open("changes.html", "Comparison" + new Date().getTime() + i);  
        i++;
        sessionStorage.setItem("windowCounter", i);
      }
  }
  

function SaveData(){
    localStorage.setItem("saved", JSON.stringify(removeCircularReferences(oReport)));
    localStorage.setItem("definition", JSON.stringify(sDefinitionParsed));
    const oDiagramSave={
      name:oReport.name,
      id:oReport.id,
      data:oReport.actionArray
    }
    sessionStorage.setItem("diagram", JSON.stringify(removeCircularReferences(oDiagramSave)));
}

function ResetConfigs() {
    localStorage.setItem("complexity", JSON.stringify(aComplexityTemplate));
    localStorage.setItem("ratings", JSON.stringify(oRatingsTemplate));
    localStorage.setItem("score", JSON.stringify(aScoringTemplate));
    localStorage.setItem("naming", JSON.stringify(oNamingTemplate));
    localStorage.setItem("scoring", JSON.stringify(aScoringTemplate));
    localStorage.setItem("references", JSON.stringify(oConfigReferenceTemplate));
    aComplexity = aComplexityTemplate.slice();
    oRatings = oRatingsTemplate;
    aScoring = aScoringTemplate.slice(0);
    oNaming = oNamingTemplate;
    oConfigReference = oConfigReferenceTemplate;
    pLoading.innerHTML = "Config Reset to defaults";
  }

  function UpdateConfigs() {
    localStorage.setItem("complexity", JSON.stringify(aComplexity));
    localStorage.setItem("ratings", JSON.stringify(oRatings));
    localStorage.setItem("score", JSON.stringify(aScoring));
    localStorage.setItem("naming", JSON.stringify(oNaming));
    localStorage.setItem("scoring", JSON.stringify(aScoring));
    localStorage.setItem("references", JSON.stringify(oConfigReference));
  }