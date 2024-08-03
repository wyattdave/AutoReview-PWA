
const content = document.getElementById("content");

content.onload=load();
document.getElementById("download").addEventListener("click", function() {
    downloadHTML()
  });

function load(){
    content.innerHTML=sessionStorage.getItem("solution");     
}

function downloadHTML(){
    let sHTML=document.querySelector("html").innerHTML;
    let sName=document.getElementById("target-flowName").innerHTML.replace('&nbsp;','');
    sHTML='<!doctype html><html lang="en">'+sHTML+"</html>";
    sHTML=sHTML.replace('<div class="mui--text-black mui--text-body2" style="color:white; text-align:right;" id="download">Download</div>',"");
    sHTML=sHTML.replaceAll('<script src="assets/js/solutionLoad.js"></script>','');
    
    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + 
    encodeURIComponent(sHTML));
    element.setAttribute("download", sName+" Solution.html");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
};