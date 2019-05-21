//Variables
const dogBar = document.getElementById("dog-bar");
const dogInfo = document.getElementById("dog-info");
const goodDogFilterButton = document.getElementById("good-dog-filter");

///////////  ALL DOG INFO FUNCTIONS  /////////////
//Get all dog data
function getData() {
  fetch("http://localhost:3000/pups")
    .then(res => res.json())
    .then(dogsData => appendDogSpans(dogsData))
}


//Appends span for each dog to dogBar
function appendDogSpans(dogsData) {
  let dogNames = ''
  dogsData.map( dog => dogNames += createDogSpan(dog) )
  dogBar.innerHTML = dogNames
}

//Helper function for appendDogSpans
function createDogSpan(dog) {
  span = document.createElement("span");
  span.innerHTML = dog.name;
  span.dataset.id = dog.id;
  span.dataset.isGood = dog.isGoodDog;
  return span.outerHTML;
}



///////////  INDIVIDUAL DOG INFO FUNCTIONS  /////////////

//Manges bubbling of click event for dogBar
function clickDogInfo() {
  let clicked = event.target;
  if (clicked.tagName === "SPAN") {
    fetchDogInfo(clicked.dataset.id)
  }
}

//Helper function for appendDogInfo that fetches indivual dog info
function fetchDogInfo(id) {
  fetch(`http://localhost:3000/pups/${id}`)
    .then(res => res.json())
    .then(dogData => appendDogInfo(dogData))
}

//Appends dog info to dogInfo
function appendDogInfo(dogData) {
  let dogElements = `
    <img src="${dogData.image}">
    <h2>${dogData.name}</h2>
    <button data-id="${dogData.id}" data-is-good="${dogData.isGoodDog}">${dogData.isGoodDog ? "Good Dog!" : "Bad Dog!"}</button>
    `;
  dogInfo.innerHTML = dogElements;
}

//Manges bubbling of click event for dogInfo
function clickGoodDogBadDog() {
  let clicked = event.target;
  if (clicked.tagName === "BUTTON") {
    changeGoodDogBadDog(clicked.dataset.id, clicked.dataset.isGood)
  }
}

//Fetch patch request to change dog from good/bad
function changeGoodDogBadDog(id, dogStatus) {
  fetch(`http://localhost:3000/pups/${id}`, patchDog(dogStatus))
    .then(res => res.json())
    .then(dogData => appendDogInfo(dogData))
    .then(dogData => getData())
}

//Obj for fetch patch
function patchDog(dogStatus) {
  dogStatus = JSON.parse(dogStatus)
  return {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({isGoodDog: !dogStatus})
  }
}



///////////  DOG FILTER FUNCTIONS  /////////////

//Sets display of spans in dogBar to "none" if isGood === "false"
function filterGoodDog() {
  let dogBar = document.querySelectorAll("#dog-bar span");
  dogBar.forEach(dog => {
    if (dog.dataset.isGood === "false") {
      dog.style.display = "none";
    }
  })
}

//Sets display of all spans in dogBar to ""
function filterAllDog() {
  let dogBar = document.querySelectorAll("#dog-bar span");
  dogBar.forEach(dog => dog.style.display = "")
}

//Calls on either filterGoodDog() or filterAllDog() depending on goodDogFilterButton innerHTML
function filter() {
  if (event.target.innerHTML === "Filter good dogs: OFF") {
    filterGoodDog();
    event.target.innerHTML = "Filter good dogs: ON"
  } else {
    filterAllDog();
    event.target.innerHTML = "Filter good dogs: OFF"
  }
}




///////////  EVENT LISTENERS  /////////////

dogBar.addEventListener("click", clickDogInfo)
dogInfo.addEventListener("click", clickGoodDogBadDog)
goodDogFilterButton.addEventListener("click", filter)


///////////  INVOKED FUNCTIONS ON PAGE LOAD  /////////////

getData();
