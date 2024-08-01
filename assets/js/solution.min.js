const jsonDiv = document.getElementById("json");
const tablesDiv = document.getElementById("tables");
const jsonElm = document.getElementById("show-json");


const startClear = document.getElementById("restScroll");

startClear.addEventListener("click", function(e) {
    e.stopPropagation();
    topFunction()
  });

  startClear.click();  

  jsonElm.addEventListener("click", function() {
    if(jsonElm.innerText=="JSON Schema"){
        tablesDiv.style.display="none";
        jsonDiv.style.display="block";
        jsonElm.innerText="Tables"
    }else{
        tablesDiv.style.display="block";
        jsonDiv.style.display="none";
        jsonElm.innerText="JSON Schema"
    }
  });


  function topFunction() {
    document.body.scrollTop = 0; 
    document.documentElement.scrollTop = 0; 
  }
