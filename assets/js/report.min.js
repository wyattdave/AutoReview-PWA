////For Report HTML file
const actionSelectElem = document.getElementById("actionSelect");
const apiSelectElem = document.getElementById("apiSelect");
const varSelectElem = document.getElementById("variablesSelect");
const inputSelectElem = document.getElementById("inputSelect");
const downloadElem = document.getElementById("download");
const actionIElem = document.getElementById("actionInput");
const apiElm = document.getElementById("apiInput");
const varElem = document.getElementById("variablesInput");
const inputElem = document.getElementById("inputInput");
let sType=" Review";

if(document.title=="AutoReview Report"){
  sType=" Report"
}

downloadElem.addEventListener("click", function() {
  downloadHTML()
});

function downloadHTML(){

  let sHTML=document.querySelector("html").innerHTML;
  let sName=document.getElementById("target-flowName").innerHTML
  sHTML='<!doctype html><html lang="en">'+sHTML+"</html>";
  sHTML=sHTML.replace('<div class="mui--text-black mui--text-body2" style="color:white; text-align:right;" id="download">Download</div>',"");
  sHTML=sHTML.replaceAll(' src="/assets/js/report.min.js">','>'+sJSON);
  
  const element = document.createElement("a");
  element.setAttribute("href", "data:text/plain;charset=utf-8," + 
  encodeURIComponent(sHTML));
  element.setAttribute("download", sName.replace("&nbsp;","")+sType+".html");
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

actionSelectElem.addEventListener("change", function() {
  actionIElem.value="";
  filterActionTable("actionTable","actionInput",-1);
});
apiSelectElem.addEventListener("change", function() {
  apiElm.value="";
  filterActionTable("apiTable","apiInput",-1);
});
varSelectElem.addEventListener("change", function() {
  varElem.value="";
  filterActionTable("variablesTable","variablesInput",-1);
});
inputSelectElem.addEventListener("change", function() {
  inputElem.value="";
  filterActionTable("inputTable","inputInput",-1);
});

actionIElem.addEventListener("change", function() {
  filterActionTable("actionTable","actionInput",actionSelectElem.value);
});

apiElm.addEventListener("change", function() {
  filterActionTable("apiTable","apiInput",apiSelectElem.value);
});

varElem.addEventListener("change", function() {
  filterActionTable("variablesTable","variablesInput",varSelectElem.value);
});

inputElem.addEventListener("change", function() {
  filterActionTable("inputTable","inputInput",inputSelectElem.value);
});

const startClear = document.getElementById("restScroll");
startClear.addEventListener("click", function(e) {
  e.stopPropagation();
  topFunction()
});

startClear.click();

const variablesElem = document.getElementById("clickVariables");
variablesElem.addEventListener("click", function(e) {
  e.stopPropagation();
  showComments("divVariables");
});

const actionsElem = document.getElementById("clickActions");
actionsElem.addEventListener("click", function(e) {
  e.stopPropagation();
  showComments("divActions");
});

const apiElem = document.getElementById("clickApi");
apiElem.addEventListener("click", function(e) {
  e.stopPropagation();
  showComments("divApi");
});

const inpElem = document.getElementById("clickInput");
inpElem.addEventListener("click", function(e) {
  e.stopPropagation();
  showComments("divInput");
});

const exceptElem = document.getElementById("clickExcept");
exceptElem.addEventListener("click", function(e) {
  e.stopPropagation();
  showComments("divExcept");
});

const connectElem = document.getElementById("clickConnect");
connectElem.addEventListener("click", function(e) {
  e.stopPropagation();
  showComments("divConnect");
});

function showComments(sElem){
  let commentsElem=document.getElementById(sElem);

  if(commentsElem.style.display=="block"){
    commentsElem.style.display="none"
  }else{
    commentsElem.style.display="block"
  }
};

function filterActionTable(sTableID,sInputID,col) {
  let i=0;
  let sFilter = document.getElementById(sInputID).value.toUpperCase();
  let tableElem = document.getElementById(sTableID);
  let tr = tableElem.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
 
    if(sFilter=="" || col==-1){
      tr[i].style.display = "";
    }else{
      let td = tr[i].getElementsByTagName("td")[col];
      if (td) {  
        let sTxtValue = td.textContent || td.innerText;
        if (sTxtValue.toUpperCase().indexOf(sFilter) > -1 || (sTxtValue=="" && sFilter==" ")) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }   
    }    
  }
};

function topFunction() {
  document.body.scrollTop = 0; 
  document.documentElement.scrollTop = 0; 
};

const sJSON='const actionSelectElem=document.getElementById("actionSelect"),apiSelectElem=document.getElementById("apiSelect"),varSelectElem=document.getElementById("variablesSelect"),inputSelectElem=document.getElementById("inputSelect"),actionIElem=document.getElementById("actionInput"),apiElm=document.getElementById("apiInput"),varElem=document.getElementById("variablesInput"),inputElem=document.getElementById("inputInput");let sType=" Review";"AutoReview Report"==document.title&&(sType=" Report"),downloadElem.addEventListener("click",function(){downloadHTML()}),actionSelectElem.addEventListener("change",function(){actionIElem.value="",filterActionTable("actionTable","actionInput",-1)}),apiSelectElem.addEventListener("change",function(){apiElm.value="",filterActionTable("apiTable","apiInput",-1)}),varSelectElem.addEventListener("change",function(){varElem.value="",filterActionTable("variablesTable","variablesInput",-1)}),inputSelectElem.addEventListener("change",function(){inputElem.value="",filterActionTable("inputTable","inputInput",-1)}),actionIElem.addEventListener("change",function(){filterActionTable("actionTable","actionInput",actionSelectElem.value)}),apiElm.addEventListener("change",function(){filterActionTable("apiTable","apiInput",apiSelectElem.value)}),varElem.addEventListener("change",function(){filterActionTable("variablesTable","variablesInput",varSelectElem.value)}),inputElem.addEventListener("change",function(){filterActionTable("inputTable","inputInput",inputSelectElem.value)});const startClear=document.getElementById("restScroll");startClear.addEventListener("click",function(e){e.stopPropagation(),topFunction()}),startClear.click();const variablesElem=document.getElementById("clickVariables");variablesElem.addEventListener("click",function(e){e.stopPropagation(),showComments("divVariables")});const actionsElem=document.getElementById("clickActions");actionsElem.addEventListener("click",function(e){e.stopPropagation(),showComments("divActions")});const apiElem=document.getElementById("clickApi");apiElem.addEventListener("click",function(e){e.stopPropagation(),showComments("divApi")});const inpElem=document.getElementById("clickInput");inpElem.addEventListener("click",function(e){e.stopPropagation(),showComments("divInput")});const exceptElem=document.getElementById("clickExcept");exceptElem.addEventListener("click",function(e){e.stopPropagation(),showComments("divExcept")});const connectElem=document.getElementById("clickConnect");function showComments(e){let t=document.getElementById(e);"block"==t.style.display?t.style.display="none":t.style.display="block"}function filterActionTable(e,t,n){let l=0,i=document.getElementById(t).value.toUpperCase(),a=document.getElementById(e).getElementsByTagName("tr");for(l=0;l<a.length;l++)if(""==i||-1==n)a[l].style.display="";else{let c=a[l].getElementsByTagName("td")[n];if(c){let o=c.textContent||c.innerText;o.toUpperCase().indexOf(i)>-1||""==o&&" "==i?a[l].style.display="":a[l].style.display="none"}}}function topFunction(){document.body.scrollTop=0,document.documentElement.scrollTop=0}connectElem.addEventListener("click",function(e){e.stopPropagation(),showComments("divConnect")});';