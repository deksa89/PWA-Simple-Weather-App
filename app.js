const button = document.getElementById("button");
const input = document.getElementById("input");


const processChanges = debounce((e) => weatherApi(e)); // funkcija weatherApi prima agrument te mu ga moramo i dati

button.addEventListener("click", processChanges);
document.addEventListener("DOMContentLoaded", processChanges);
input.addEventListener("click", removeContent);


// Debounce funkcija vraca rezultat s odgodom od 3 sekunde
function debounce(func, timeout = 1000) {
  let timer;
  return (...args) => {
    document.getElementById("content").innerHTML = "<p>Data is loading, please wait...</p>";
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

if("serviceWorker" in navigator) { //provjeravamo da li browser podrzava service worker-e, ako da, u tom slucaju izvrsava kod
    navigator.serviceWorker.register("./sw.js") //ovo je asinkron task i vraca Promise
    .then((reg)=> console.log("service worker registered", reg))
    .catch((err)=> console.log("service worker not registered", err)) 
}

let upozorenje;
var handleError = function (err) {
  console.warn(err);
  return new Response(
    JSON.stringify({
      code: 503,
      message: "Stupid network Error",
    }),
    (document.getElementById("content").innerHTML = `<p id="nointernet">No internet connection</p>`)
  );
};



async function weatherApi(event) {
    
    event.preventDefault();

    // event.target vraca element koji je pokrenuo taj event npr. <button>Pretrazi</button>, 
    // value vraca njegovu vrijednost a previousElementSibling vraca od prethodnog elementa vrijednost
    // let grad = event.target.previousElementSibling.value; //vraca ime koje smo upisali u tražilicu i prosljeđuje u api

    let grad = input.value ? input.value : "Zagreb";
    
    let fetDat = await fetch(`https://api.weatherapi.com/v1/current.json?key=bdbf7197ebc24abbb15104932220407&q=${grad}&aqi=yes`).catch(handleError);
    console.log("fetDat: ", fetDat.status)
    let data = await fetDat.json();
    console.log("data: ", data)

    // console.log(data); // ispisuje podatke o vremenu za trazeni grad

    if (data.error) {
        document.getElementById("content").innerHTML = `<p id="nodata">No data for the requested city</p>`;
    } 
    else {
        dayTime(data);

        let rezultat = `<p id="location">${data.location.name}, ${data.location.country}, ${data.location.localtime}</p><ul id="lista">`;
            rezultat += weatherConditions(data);
            rezultat += temperatura(data);
            rezultat += cloudCover(data);
            rezultat += uvZracenje(data);
        rezultat += "</ul>";
        document.getElementById("content").innerHTML = rezultat;
    }
}



// FUNKCIJE

// brise prethodni sadrzaj iz inputa
function removeContent(el){
  if (el !== undefined){
    const firstNameInput = document.getElementById("input");
    firstNameInput.value = "";
  }
}


function temperatura(element) {
  return `<li id="temp"><p id="temp-c">${element.current.temp_c} °C</p></li>`;
}

function cloudCover(element) {
  return `<li id="cloud">Cloud coverage: <p>${element.current.cloud}% </p></li>`;
}

function uvZracenje(element) {
  let zracenje = element.current.uv;

  if (zracenje >= 7) {
    return `<li id="uv-rad"><span id="uv-radiat">Dangerous level of UV.</span> The level of UV radiation is: <p>${element.current.uv}</p></li>`;
  } else {
    return `<li id="uv-rad">Level of UV radiation: <p>${element.current.uv}</p></li>`;
  }
}

function weatherConditions(element) {
  return `<li id="conditions">
            <p id="cond-txt">${element.current.condition.text}</p>
            <img id="cond-img" src="${element.current.condition.icon}">
          </li>`;
}


let addClassName;
function dayTime (element) {
    let datumVrijeme = element.location.localtime;
    let vrijeme = datumVrijeme.substr(10,)

    if (parseInt(vrijeme) > 6 && parseInt(vrijeme) < 20) {
      return (
        addClassName = document.getElementById("body-bg"),
        addClassName.setAttribute("class", "day"),
        document.getElementById("body-bg").style.backgroundImage ="url('imgs/th-sun.jpg')");
    }
    else{
      return (
        	addClassName = document.getElementById("body-bg"),
          addClassName.setAttribute("class", "night"),
        	document.getElementById("body-bg").style.backgroundImage = "url('imgs/nighta.jpg')");
    }
}



