var foodAndFlavorsUrl = "https://best-wine-friends.herokuapp.com/food-flavors";
var wineUrl = "https://best-wine-friends.herokuapp.com/wine";
var mainIngredient = document.querySelector("#main-ingredient");
var flavorProfile = document.querySelector("#flavor-profile");
var foodAndFlavors = [];
var button = document.querySelector(".submit");
var formDiv = document.querySelector(".form");

fetch(foodAndFlavorsUrl)
  .then(response => {
    return response.json();
  })
  .then(response => {
    response.forEach(ingredient => {
      var option = document.createElement("option");
      option.id = ingredient.imgSrc;
      option.innerHTML = ingredient.ingredient;
      mainIngredient.appendChild(option);
      foodAndFlavors.push(ingredient);
    });
  });

mainIngredient.addEventListener("change", function(event) {
  flavorProfile.options.length = 0;
  var currentIngredient = mainIngredient.options[mainIngredient.selectedIndex].value;
  for(var i=0; i<foodAndFlavors.length; i++) {
    if(currentIngredient == foodAndFlavors[i].ingredient) {
      foodAndFlavors[i].flavors.forEach(flavor => {
        var option = document.createElement("option");
        option.id = flavor.flavorId;
        option.innerHTML = flavor.profile;
        flavorProfile.appendChild(option);
      });
    }
  }
});

button.addEventListener("click", function(event) {
  event.preventDefault();
  var currentFlavorId = flavorProfile.options[flavorProfile.selectedIndex].id;
  fetch(wineUrl, {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json"
    }),
    body: JSON.stringify({
      wine: document.querySelector(".wine-suggestion").value,
      pairings: [currentFlavorId]
    })
  })
    .then(response => response.json())
    .then(response => {
      console.log(response);
      document.querySelector("form").className = "hidden";
      var p = document.createElement("p");
      p.className = "response";
      p.innerHTML = response;
      formDiv.appendChild(p);
    })
    .catch(err => console.log(err));
});
