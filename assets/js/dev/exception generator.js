
function createException(aExceptions,aNaming,sHtml,oDependencies){
    let sSolution =oDependencies.ImportExportXml.SolutionManifest.UniqueName;
    let sVersion = oDependencies.ImportExportXml.SolutionManifest.Version;
    let sPublisher=oDependencies.ImportExportXml.SolutionManifest.Publisher.UniqueName
    let sFlowTable='<table class="mui-table mui-table--bordered" id="flowTable" ><thead><tr><th>Flow</th><th>Trigger</th><th>Complexity</th><th>Fails</th><th>Warnings</th></tr></thead><tbody>';
    let sTable ='<table class="mui-table mui-table--bordered" id="exceptionTable" ><thead><tr><th  style="width:200px">Flow</th><th>Area</th><th>Value</th><th  style="width:70px">Level</th><th>Failed Reason</th></tr></thead><tbody>';
   
    if (
        oDependencies?.ImportExportXml?.SolutionManifest?.MissingDependencies
          ?.MissingDependency != undefined
        ) {
        let unTypeDependencies =
            oDependencies.ImportExportXml.SolutionManifest.MissingDependencies
            .MissingDependency;
        let aMatches=[];  
        if (unTypeDependencies) {
            let aDependencies=[];
            if(Array.isArray(unTypeDependencies)){
                aDependencies=unTypeDependencies
            }else{
                aDependencies.push(unTypeDependencies);
            }
            aDependencies.forEach((item) => {
            if(!aMatches.includes(item.Required.displayName)){
                sTable+='<tr><td>Solution</td><td>Missing Dependency</td><td>'+item.Required.displayName +'</td><td>Fail</td><td>Add component type '+item.Required.type+' to the solution </td></tr>';
                aMatches.push(item.Required.displayName);
            }
            });
        }
    }
   
    aExceptions.forEach(data =>{   

        let iWarning=0;
        let iFail=0;
        let sFlow=data.name;   
       
        if (data.complexity > oRatings.complexityRe) {
            sTable+='<tr><td>'+sFlow+'</td><td>Complexity</td><td>'+data.complexity+'</td><td>Warning</td><td>Overly complex flow, should be below: '+oRatings.complexityAm+'</td></tr>';
            iWarning++;
        } else if (data.complexity > oRatings.complexityAm) {
            sTable+='<tr><td>'+sFlow+'</td><td>Complexity</td><td>'+data.complexity+'</td><td>Fail</td><td>Overly complex flow, should be below: '+oRatings.complexityAm+'</td></tr>';
            iFail++;
        }
    
        if (data.steps > oRatings.actionRe) {
            sTable+='<tr><td>'+sFlow+'</td><td>Steps</td><td>'+data.steps+'</td><td>Warning</td><td>Too many step/actions within the flow, should be below: '+oRatings.actionsAm+'</td></tr>';
            iWarning++;
        } else if (data.steps > oRatings.actionsAm) {
            sTable+='<tr><td>'+sFlow+'</td><td>Steps</td><td>'+data.steps+'</td><td>Fail</td><td>Too many step/actions within the flow, should be below: '+oRatings.actionsAm+'</td></tr>';
            iFail++;
        }

        if (data.variables > oRatings.variablesRe) {
            sTable+='<tr><td>'+sFlow+'</td><td>Variables</td><td>'+data.variables+'</td><td>Warning</td><td>Too many variables within the flow, should be below: '+oRatings.variablesAm+'</td></tr>';
            iWarning++;
        } else if (data.variables > oRatings.variablesAm) {
            sTable+='<tr><td>'+sFlow+'</td><td>Variables</td><td>'+data.variables+'</td><td>Fail</td><td>Too many variables within the flow, should be below: '+oRatings.variablesAm+'</td></tr>';
            iFail++;
        }

        if (data.exception <= oRatings.exceptionsRe) {
            sTable+='<tr><td>'+sFlow+'</td><td>Exception Handler</td><td>'+data.exception+'</td><td>Warning</td><td>Should have minimum one exception (runAfter:Failed): '+oRatings.exceptionsRe+'</td></tr>';
            iWarning++;
        } else if (data.exception < oRatings.exceptions) {
            sTable+='<tr><td>'+sFlow+'</td><td>Exception Handler</td><td>'+data.exception+'</td><td>Fail</td><td>Should have minimum one exception (runAfter:Failed): '+oRatings.exceptionsRe+'</td></tr>';
            iFail++;
        }

        let aVars=data.variableArray.filter(item =>{
            return !item.used
        })

        aVars.forEach(item =>{
            sTable+='<tr><td>'+sFlow+'</td><td>Variable</td><td>'+item.name+'</td><td>Fail</td><td>All variables should be set at least once</td></tr>';
            iFail++;
        })

        aVars=data.variableArray.filter(item =>{
            return !item.named
        })
        aVars.forEach(item =>{
            sTable+='<tr><td>'+sFlow+'</td><td>Variable</td><td>'+item.name+' => '+item.type +'</td><td>Fail</td><td>Not following naming convention, should follow: '+JSON.stringify(aNaming)+'</td></tr>';
            iFail++;
        })

        if(data.composes>2){
            sTable+='<tr><td>'+sFlow+'</td><td>Composes</td><td>'+data.composes+'</td><td>Fail</td><td>Composes should only be used by rare exception, with maximum 1 recommended</td></tr>';
            iFail++;
        }

        if (!data.mainScope) {
            sTable+='<tr><td>'+sFlow+'</td><td>Top Level Main Scope</td><td>False</td><td>Fail</td><td>A Scope named Main should contain all actions to enable exception catching</td></tr>';
            iFail++;
        }
        if (!data.exceptionScope) {
            sTable+='<tr><td>'+sFlow+'</td><td>Exception Scope Following Main Scope </td><td>False</td><td>Fail</td><td>A Scope should runAfter: failed from Main scope</td></tr>';
            iFail++;
        }
        if (!data.exceptionHandleScope) {
            sTable+='<tr><td>'+sFlow+'</td><td>Exception Scope Named </td><td>False</td><td>Fail</td><td>Scope named Exception should runAfter: failed from Main scope</td></tr>';
            iFail++;
        }

        let aExcept=data.exceptionArray.filter(item =>{
            return !item.runAfter.includes("TimedOut")
        })

        aExcept.forEach(item =>{
            sTable+='<tr><td>'+sFlow+'</td><td>Exception Handling TimedOut</td><td>'+item.name+'</td><td>Fail</td><td>All runAfter: failed should also include TimedOut</td></tr>';
            iFail++;
        })

        let aActions=data.apiActionArray.filter(item => {
            return item.filter == "" && item.step == "GetItems"
        })

        aActions.forEach(item =>{
            sTable+='<tr><td>'+sFlow+'</td><td>Get Items Settings</td><td>'+item.name+'</td><td>Warning</td><td>Get Items without filter query</td></tr>';
            iWarning++;
        })

        aActions=data.apiActionArray.filter(item => {
            return item.pagination == "" && (item.step == "GetItems" || item.step.includes("ListMyTasks"))
        })

        aActions.forEach(item =>{
            sTable+='<tr><td>'+sFlow+'</td><td>Get Items Settings</td><td>'+item.name+'</td><td>Warning</td><td>Get Items without pagination turned on</td></tr>';
            iWarning++;
        })

        sFlowTable+='<tr><td>'+sFlow+'</td><td>'+data.trigger+'</td><td>'+data.complexity+'</td><td>'+iFail+'</td><td>'+iWarning+'</td><tr>'

    })
    sFlowTable+='</table>';
    sTable+='</table>';

    sHtml= sHtml.replace("{flowName}", sSolution);
    sHtml = sHtml.replace("{flowId}", sVersion);
    sHtml = sHtml.replace("{owner}", sPublisher);
    sHtml = sHtml.replace("{date}", getToday());
    sHtml = sHtml.replace("{flowsTable}",sFlowTable);
    sHtml = sHtml.replace("{exceptionsTable}",sTable);

    return sHtml
}