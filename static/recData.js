function getAllLogs() {

  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "/logs");
  xhttp.send();

  xhttp.onload = function() {
    let str = this.responseText;
    str = str.replace(/]/g, '');
    str = str.replace(/,/g, '');
    str = str.substring(1);
  



    document.getElementById("display").innerHTML = str;
  }
}

function logCalendar() {

  let url = "/logs/";
  let studentName = document.getElementById("logDay").value;
  let finalUrl = url + studentName;

  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", finalUrl);
  xhttp.send();

  xhttp.onload = function() {
    let str = this.responseText;
    str = str.replace(/]/g, '');
    str = str.replace(/,/g, '');
    str = str.substring(1);
    
    document.getElementById("display").innerHTML = str;
  }
}

var date = new Date();
var result = date.toISOString().split('T')[0];
console.log(result); // outputs “2018-03-01”

function todaysLog() {

  let url = "/logs/";
  let finalUrl = url + result;

  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", finalUrl);
  xhttp.send();

  xhttp.onload = function() {
    let str = this.responseText;
    str = str.replace(/]/g, '');
    str = str.replace(/,/g, '');
    str = str.substring(1);
    
    document.getElementById("display").innerHTML = str;
  }
}