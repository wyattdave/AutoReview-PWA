///By David Wyatt
let sDefinition = "";
let sDefinitionParsed = "";
let oReport;
let oLiveReport;
let sCustomList = null;
let  oHTML;
let aConnectionTier=aConnectionTierBackup.value;;
let i = 0;
let iDefinitionFind = 0;
let iDefinitionCount = 0;
let oSaved;
let oSavedDef;
let oRatings;
let oNaming;
let aComplexity;
let aScoring;
let oConfigReference;
let oSolution;
let aEnvironmentVar=[];
let sEnvironment="";
let oDependencies;

const iResetStorage = 8;
const regExpFileID = new RegExp("[A-Z0-9]{8}-([A-Z0-9]{4}-){3}[A-Z0-9]{12}","m");
const sHtml =  '<html><head><meta name="color-scheme" content="dark"></head><body>';

const pLoading = document.getElementById("loading");
const spanVersion = document.getElementById("version");
const divCSV = document.getElementById("csvDropdown");
const divAdmin = document.getElementById("admin");
const butReview = document.getElementById("review-button");
const butReport = document.getElementById("report-button");
const butSolution  = document.getElementById("solution-button");
const butShortcut  = document.getElementById("shortcut-button");
const divDivider = document.getElementById("solution-divider");
const butData = document.getElementById("data-button");
const butDiagram = document.getElementById("diagram-button");
const butDefinition = document.getElementById("definition-button");
const lSolution = document.getElementById("solution-container");
const tSolution =document.getElementById("solution-title");
const iLoad = document.getElementById("loadSaved");
const divConfig = document.getElementById("admin");
const buLiveFlow = document.getElementById("loadLive");

document.getElementById("review-button").addEventListener("click", OpenReview);
document.getElementById("report-button").addEventListener("click", OpenReport);
document.getElementById("data-button").addEventListener("click", OpenData);
document.getElementById("diagram-button").addEventListener("click", OpenDiagram);
document.getElementById("definition-button").addEventListener("click", OpenDefinition);
document.getElementById("bugEmail").addEventListener("click", OpenBug);
document.getElementById("restConfigs").addEventListener("click", ResetConfigs);
document.getElementById("actionsCSVdownload").addEventListener("click", csvAction);
document.getElementById("variablesCSVdownload").addEventListener("click", csvVariables);
document.getElementById("connectionsCSVdownload").addEventListener("click", csvConnections);
document.getElementById("loadSaved").addEventListener("click", loadSavedFlow);
document.getElementById("compareFlows").addEventListener("click", OpenCompare);

butSolution.addEventListener("click", OpenSolution);
butShortcut.addEventListener("click", OpenShortcut);

loadPlatform(pLoading)

function DownloadCSV(sTable, data2) {
  const oTable = aDownloadConfig.find((item) => item.name == sTable);
  const data=sessionStorage.getItem(data);
    let sName=oReport.name
    if (sName == false) {
      sName = "Flow";
    }

    if (oTable && data != null) {
      if (sTable == "Actions") {
        let aTemp=oReport.actionArray.slice(0);

        aTemp.forEach((object) => {
          object.detail=object.detail.replaceAll(',','|');
          object.notes=object.notes.replaceAll(',','|');
          object.filter=object.filter.replaceAll(',','|');
          object.secure=object.secure.replaceAll(',','|');
          object.retry=object.retry.replaceAll(',','|');

          delete object["environmentVariables"];
          delete object["environmentB"];
          delete object["branch"];
         
        })
        exportCSVFile(
          oTable.headers,
          aTemp,
          sName + "-" + oTable.name
       );
      } else if (sTable == "Variables") {
        let aTemp=oReport.variableArray.slice(0);
        aTemp.forEach((object) => {
          object.value=object.value.replaceAll(',','|');
          object.value=object.value.substr(0,200);
        })
        exportCSVFile(
          oTable.headers,
          aTemp,
          sName + "-" + oTable.name
        );
       } else if (sTable == "Connections") {
        exportCSVFile(
          oTable.headers,
          oReport.connectionArray,
          sName + "-" + oTable.name
        );
      }
    }
}

function OpenReview() {
  SaveData();
  sessionStorage.setItem("actions", JSON.stringify(oReport.actionArray));
  sessionStorage.setItem("review", oHTML.review);
  sessionStorage.setItem("refernces", oHTML.references);
  i = sessionStorage.getItem("windowCounter");
  const newWindow = window.open("review.html", "Review" + new Date().getTime() + i);
  i++;
  sessionStorage.setItem("windowCounter", i);
}

function OpenReport() {
  SaveData();
  sessionStorage.setItem("report", oHTML.report);
  i = sessionStorage.getItem("windowCounter");
  const newWindow = window.open("report.html", "Report" + new Date().getTime() + i);
  i++;
  sessionStorage.setItem("windowCounter", i);
}

function OpenDiagram() {
  SaveData();
  sessionStorage.setItem("actions", JSON.stringify(oReport.actionArray));
  sessionStorage.setItem("diagram", createDiagram(oReport.actionArray,oReport.name,oReport.trigger,oReport.actionObjectArray));
  sessionStorage.setItem("name", oReport.name);
  sessionStorage.setItem("id", oReport.id);
  const oTrigger={
    trigger: oReport.trigger,
    triggerdata:oReport.triggerData,
    triggerParam:oReport.triggerParam,
    triggerConfig:oReport.triggerConfig,
    triggerExpress:oReport.triggerExpress,
    triggerInputs:oReport.triggerInputs,
    triggerRecur:oReport.triggerRecur
  }
  sessionStorage.setItem("trigger", JSON.stringify(oTrigger));
  window.open('diagram.html');
}

function OpenData() {
  SaveData();
  i = sessionStorage.getItem("windowCounter");
  const newWindow = window.open("", "Data" + new Date().getTime() + i);
  newWindow.document.write(
    sHtml +
      '<p>Schema:<a href="/Configs/AutoReview-Schema.json">https://github.com/davedidisco/Auto-Review-Self-Config/blob/main/AutoReview-Schema.json</a></p><pre>' +
      JSON.stringify(oReport, undefined, 2) +
      "</pre></body></html>"
  );
  i++;
  sessionStorage.setItem("windowCounter", i);
}

function OpenDefinition() {
  SaveData();
  i = sessionStorage.getItem("windowCounter");
  const newWindow = window.open("", "Definition" + new Date().getTime() + i);
  newWindow.document.write(
    sHtml +
      '<p>Schema:<a href="https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#">https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#</a></p><pre>' +
      JSON.stringify(sDefinitionParsed, undefined, 2) +
      "</pre></body></html>"
  );
  i++;
  sessionStorage.setItem("windowCounter", i);

}

function OpenSolution() {
  SaveData();
  i = sessionStorage.getItem("windowCounter");
  sessionStorage.setItem("solution", listSolution(oSolution,sSolutionTemplate));
  const newWindow = window.open("./solution.html", "Solution Contents" + new Date().getTime() + i);
  i++;
  sessionStorage.setItem("windowCounter", i);
}

function OpenShortcut() {
  alert('ALT+A Open AutoReview Window \nALT+L Load Previous \nALT+R Open Review \nALT+E Open Report \nALT+D Open Diagram \nALT+C Clear Last Saved')
}

function OpenBug() {
  const newWindow = window.open(sMailTemplate, "Bug Email");
}

function loadSavedFlow() {
  generateReport(oSaved);
  oReport = oSaved;
  sDefinitionParsed = oSavedDef;
  pLoading.innerHTML = '<img src="assets/img/old flow grey fill.svg"/>&nbsp;'+oSaved.name;
  divDivider.style = "display: none";
  lSolution.style = "display: none";
  tSolution.style = "display: none";
  butSolution.style = "display: none";
  butReview.style = "width:100%; display:block";
  butReport.style = "width:100%; display:block";
  butData.style = "display:block;";
  butDiagram.style ="display:block;  width:100%;";
  spanVersion.style = "display:none;";
  divCSV.style = "display:block; width:100%;";
  divAdmin.style = "display:none;";
  divConfig.style= "display:none;";
}

function csvAction() {
  DownloadCSV("Actions", oSaved);
}

function csvVariables() {
  DownloadCSV("Variables", oSaved);
}

function csvConnections() {
  DownloadCSV("Connections", oSaved);
}



/////////////////////////////
const fileInput = document.getElementById("file-input");
const encodingInput = "utf-8";
const fileInputButton = document.getElementById("file-input-button");
const passwordInput = "";
let entries;
let selectedFile;
fileInput.onchange = selectFile;
fileInputButton.onclick = () =>
  fileInput.dispatchEvent(new MouseEvent("click"));

async function selectFile() {
  try {
    fileInputButton.disabled = true;
    unpackNestedZipFiles(fileInput.files[0]);
  } catch (error) {
    console.log(error);
  } finally {
    fileInputButton.disabled = false;
    fileInput.value = "";
  }
}

async function unpackNestedZipFiles(file) {
  try {
    pLoading.style.color = "black";
    pLoading.innerText = "Loading...";
    console.log(file);
    if (file.name.endsWith(".zip") || file.name.endsWith(".msapp")) {
      const zipReader = new zip.ZipReader(new zip.BlobReader(file));
      console.log(zipReader);
      const entries = await zipReader.getEntries();
      console.log(entries);
      let entryIndex = 0;
      if (entries && entries.length) {
        lSolution.style = "display: none";
        divDivider.style = "display: none";
        tSolution.style = "display: none";
        butSolution.style.display='none';
        lSolution.innerHTML = "";
        sCustomList = null;
        oSolution = null;
        iDefinitionFind = 0;
        iDefinitionCount = 0;
        const filenamesUTF8 = Boolean(
          !entries.find((entry) => !entry.filenameUTF8)
        );
        for (const entry of entries) {
          const fileData = await entry.getData(new zip.TextWriter());
          if (
            entry.filename.includes("definition.json") ||
            (entry.filename.includes("Workflows/") &&
              !entry.filename.includes("apisMap") &&
              !entry.filename.includes("connectionsMap"))
          ) {
            entryIndex++;
            console.log(entry, "flow");
            if (iDefinitionFind == iDefinitionCount) {
              pLoading.innerHTML = "Flow Found...Loading...";

              review(entry, "flow", fileData);
              let node = document.createElement("li");
              node.innerHTML = entry.filename
                .replace("Workflows/", "")
                .replace(regExpFileID, "")
                .replace("-.json", "");
              node.value = entryIndex;
              lSolution.appendChild(node);
              node.addEventListener("click", function () {
                review(entry, "flow", fileData);
              });
            } else {
              tSolution.style = "display: block";
              divDivider.style = "display: block";
              lSolution.style =
                "display: block; height:124px; overflow-y:auto; overflow-x:hidden";
              const node = document.createElement("li");
              const textnode = document.createTextNode(
                entry.filename
                  .replace("Workflows/", "")
                  .replace(regExpFileID, "")
                  .replace("-.json", "")
              );
              node.appendChild(textnode);
              node.value = entryIndex;
              lSolution.appendChild(node);
              node.addEventListener("click", function () {
                review(entry, "flow", fileData);
              });
            }

            iDefinitionCount++;
          } else if (entry.filename.includes("customizations.xml")) {
            review(entry, "customizations", fileData);
          } else if (entry.filename.includes("solution.xml")) {
            review(entry, "solution", fileData);
          } else if (
            entry.filename.includes("environmentvariabledefinition.xml")
          ) {
            review(entry, "environmentVar", fileData);
          } else if (entry.filename.includes("complexityConfig.json")) {
            review(entry, "complexity", fileData);
          } else if (entry.filename.includes("namingConfig.json")) {
            review(entry, "naming", fileData);
          } else if (entry.filename.includes("scoringConfig.json")) {
            review(entry, "scoring", fileData);
          } else if (entry.filename.includes("ratingsConfig.json")) {
            review(entry, "ratings", fileData);
          }
        }
      }
      if (iDefinitionCount == 0 && !pLoading.innerHTML.includes("Updated")) {
        pLoading.innerHTML = "No Flows Found in Zip";
      }

      await zipReader.close();
    } else {
      pLoading.innerHTML = "No a Zip file";
      console.log(file.name);
    }
  } catch (error) {
    console.log(error.message);
    pLoading.innerHTML = "Unexpected Error: " + error.message;
  }
}

////processes files from zip
async function review(entry, type, sDefinition) {
  try {
    if (type == "flow") {
      sDefinitionParsed = JSON.parse(sDefinition);
      console.log(entry, type);
      butReview.style = "display:block;  width:100%;";
      butDiagram.style ="display:block;  width:100%;";
      butReport.style="display:block;  width:100%;";
      butDefinition.style = "width:100%; display:block";
      oReport = null;
      let sId = "";
      if (entry.filename.match(regExpFileID)) {
        sId = entry.filename.match(regExpFileID)[0];
      }

      oReport = CreateReview(
        sDefinition,
        "unknown",
        sId,
        aComplexity,
        oNaming,
        aConnectionTier,
        ""
      );

      if (oReport.error == "") {
        pLoading.innerHTML =
          '<img src="assets/img/old flow grey fill.svg"/>&nbsp;' + oReport.name;
        if (oReport.name == "unknown" && sCustomList != null) {
          let sFlowName;
          try {
            sFlowName = sCustomList.ImportExportXml.Workflows.Workflow.find(
              (item) =>
                item.WorkflowId.toUpperCase() ==
                "{" + oReport.id + "}".toUpperCase()
            );
            butSolution.style.display='block';
          } catch (error) {
            sFlowName = sCustomList.ImportExportXml.Workflows.Workflow;
          }
          if (sFlowName != null && sFlowName != undefined) {
            pLoading.innerHTML =
              '<img src="assets/img/old flow grey fill.svg"/>&nbsp;' +
              sFlowName.Name;
            oReport.name = sFlowName.Name;
          }
        }

        oSavedDef = sDefinitionParsed;
        oSaved = oReport;

        let sFlowDisplayName
        if (pLoading.innerHTML != "" && pLoading.innerHTML != null) {
          sFlowDisplayName = pLoading.innerHTML
          .replace("_img src=_assets_img_old flow grey fill.svg__&nbsp;", "")
          .replace('<img src="assets/img/old flow grey fill.svg">', "");
        }

        oHTML=generateReport(oReport,sReviewTemplate,sReportTemplate,sFlowDisplayName);
        butReview.style = "display:block;  width:100%;";
        butDiagram.style ="display:block;  width:100%;";
        butReport.style="display:block;  width:100%;";
        butData.style = "display:block;";

        spanVersion.style = "display:none;";
        divCSV.style = "display:block; width:100%;";
        divAdmin.style = "display:none;";
      } else {
        pLoading.innerHTML = oReport.error;
        spanVersion.style = "display:block;";
        divCSV.style = "display:none;";
      }
    } else if (type == "customizations") {
      butSolution.style.display='block';
      sCustomList = xmlToJson.parse(sDefinition);

      let sConnectionRefs = "";
      let sTables = "";
      let sSecurityProfile = "";
      let sCanvasApps = "";
      let sCustomControls = "";
      let sRoles = "";
      let sLanguageCode = "";

      if (
        sCustomList?.ImportExportXml?.connectionreferences
          ?.connectionreference != undefined
      ) {
        sConnectionRefs =
          sCustomList.ImportExportXml.connectionreferences.connectionreference;
      } else {
        sConnectionRefs = [];
      }
      if (sCustomList?.ImportExportXml?.Entities?.Entity != undefined) {
        sTables = sCustomList.ImportExportXml.Entities.Entity;
      } else {
        sTables = [];
      }
      if (
        sCustomList?.ImportExportXml?.FieldSecurityProfiles
          ?.FieldSecurityProfile != undefined
      ) {
        sSecurityProfile =
          sCustomList.ImportExportXml.FieldSecurityProfile
            .FieldSecurityProfiles;
      } else {
        sSecurityProfile = [];
      }
      if (sCustomList?.ImportExportXml?.CanvasApps?.CanvasApp != undefined) {
        sCanvasApps = sCustomList.ImportExportXml.CanvasApps.CanvasApp;
      } else {
        sCanvasApps = [];
      }
      if (
        sCustomList?.ImportExportXml?.CustomControls?.CustomControl != undefined
      ) {
        sCustomControls =
          sCustomList.ImportExportXml.CustomControls.CustomControl;
      } else {
        sCustomControls = [];
      }
      if (sCustomList?.ImportExportXml?.Roles?.Role != undefined) {
        sRoles = sCustomList.ImportExportXml.Roles.Role;
      } else {
        sRoles = [];
      }
      if (sCustomList?.ImportExportXml?.Languages?.Language != undefined) {
        sLanguageCode = sCustomList.ImportExportXml.Languages.Language;
      } else {
        sLanguageCode = "";
      }

      oSolution = {
        Flows: sCustomList.ImportExportXml.Workflows.Workflow,
        ConnectionRefs: sConnectionRefs,
        Tables: sTables,
        SecurityProfile: sSecurityProfile,
        CanvasApps: sCanvasApps,
        CustomControls: sCustomControls,
        Roles: sRoles,
        LanguageCode: sLanguageCode,
      };
    } else if (type == "solution") {
      oDependencies = xmlToJson.parse(sDefinition);
    } else if (type == "environmentVar") {
      aEnvironmentVar.push(xmlToJson.parse(sDefinition));
    } else if (type == "complexity") {
      pLoading.innerHTML = pLoading.innerHTML.replace(
        "Loading...",
        "<b>Config Updates:</b>"
      );
      let aJson = JSON.parse(sDefinition).aComplexityTemplate;
      if (checkArray("Name", "Complexity", aJson)) {
        console.log("complex");

        oConfigReference = {
          ...oConfigReference,
          complexity: JSON.parse(sDefinition).sReference,
        };
        aComplexity = aJson;
        pLoading.innerHTML =
          pLoading.innerHTML + "<p>Complexity Config Updated</p>";
      } else {
        pLoading.innerHTML =
          pLoading.innerHTML +
          "<p>Complexity Config Failed, please check JSON</p>";
        pLoading.style.color = "red";
      }
    } else if (type == "naming") {
      pLoading.innerHTML = pLoading.innerHTML.replace(
        "Loading...",
        "<b>Config Updates:</b>"
      );
      let oConfig = JSON.parse(sDefinition).oNamingTemplate;
      if (
        checkArray("Type", "Letter", oConfig.data) &&
        Object.hasOwn(oConfig, "char")
      ) {
        console.log("naming");

        oConfigReference = { ...oConfigReference, naming: oConfig.sReference };
        oNaming = oConfig;
        pLoading.innerHTML =
          pLoading.innerHTML + "<p> Naming Config Updated</p>";
      } else {
        pLoading.innerHTML =
          pLoading.innerHTML +
          "<p> Naming Config Failed, please check JSON</p>";
        pLoading.style.color = "red";
      }
    } else if (type == "scoring") {
      pLoading.innerHTML = pLoading.innerHTML.replace(
        "Loading...",
        "<b>Config Updates:</b>"
      );
      let aJson = JSON.parse(sDefinition).aScoringTemplate;
      if (checkArray("Name", "Score", aJson) && aJson.length == 20) {
        console.log("scoring");

        oConfigReference = {
          ...oConfigReference,
          score: JSON.parse(sDefinition).sReference,
        };
        aScoring = aJson;
        pLoading.innerHTML =
          pLoading.innerHTML + "<p>Scoring Config Updated</p>";
      } else {
        pLoading.innerHTML =
          pLoading.innerHTML +
          "<p>Scoring Config Failed, please check JSON</p>";
        pLoading.style.color = "red";
      }
    } else if (type == "ratings") {
      pLoading.innerHTML = pLoading.innerHTML.replace(
        "Loading...",
        "<b>Config Updates:</b>"
      );
      let oConfig = JSON.parse(sDefinition).oRatingsTemplate;
      if (checkRatings(oConfig)) {
        console.log("rating");

        oConfigReference = {
          ...oConfigReference,
          ratings: JSON.parse(sDefinition).sReference,
        };
        oRatings = oConfig;
        pLoading.innerHTML =
          pLoading.innerHTML + "<p>Ratings Config Updated</p>";
      } else {
        pLoading.innerHTML =
          pLoading.innerHTML +
          "<p>Ratings Config Failed, please check JSON</p>";
        pLoading.style.color = "red";
      }
    }
  } catch (error) {
    console.log(error)
    pLoading.innerHTML = "Unexpected Error: " + error;
    pLoading.style.color = "red";
  }
}

function checkArray(key1, key2, aArray) {
  let i = 0;

  for (i = 0; i < aArray.length; i++) {
    if (!Object.hasOwn(aArray[i], key1)) {
      return false;
    }
    if (!Object.hasOwn(aArray[i], key2)) {
      return false;
    }
  }
  return true;
}

async function fetchAPIData(url, token) {
  try {
    const options = {
      headers: {
        Authorization: token,
      },
    };
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching API data:", error);
  }
}

/////////////////////
if ("launchQueue" in window) {
  launchQueue.setConsumer(async (launchParams) => {
    for (const fileHandle of launchParams.files) {
      const file = await fileHandle.getFile();
      console.log(file);
      unpackNestedZipFiles(file);
    }
  });
}
