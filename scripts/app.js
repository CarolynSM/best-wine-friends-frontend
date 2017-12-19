var foodAndFlavorsUrl = "https://best-wine-friends.herokuapp.com/food-flavors";
var wineUrl = "https://best-wine-friends.herokuapp.com/wine";
var mainIngredient = document.querySelector("#main-ingredient");
var flavorProfile = document.querySelector("#flavor-profile");
var foodAndFlavors = [];
var button = document.querySelector(".submit");
var pairingDiv = document.querySelector(".wine-pairing");
var mainImg = document.querySelector(".main-dish-img");
var flavorImg = document.querySelector(".flavor-profile-img");

fetch(foodAndFlavorsUrl)
  .then(response => {
    return response.json();
  })
  .then(response => {
    console.log(response);
    response.forEach(ingredient => {
      var option = document.createElement("option");
      option.id = ingredient.imgSrc;
      option.innerHTML = ingredient.ingredient;
      mainIngredient.appendChild(option);
      foodAndFlavors.push(ingredient);
    });
  });

mainIngredient.addEventListener("change", function(event) {
  flavorProfile.options.length = 1;
  mainImg.classList.remove("hidden");
  var currentIngredient = mainIngredient.options[mainIngredient.selectedIndex].value;
  mainImg.src = mainIngredient.options[mainIngredient.selectedIndex].id;
  document.querySelector(".plus").className = "plus img";
  for(var i=0; i<foodAndFlavors.length; i++) {
    if(currentIngredient == foodAndFlavors[i].ingredient) {
      foodAndFlavors[i].flavors.forEach(flavor => {
        var option = document.createElement("option");
        option.id = flavor.flavorId;
        option.className = flavor.imgSrc;
        option.innerHTML = flavor.profile;
        flavorProfile.appendChild(option);
      });
    }
  }
});

flavorProfile.addEventListener("change", function(event) {
  flavorImg.classList.remove("hidden");
  var currentFlavor = flavorProfile.options[flavorProfile.selectedIndex].className;
  flavorImg.src = currentFlavor;
  document.querySelector(".equals").className = "equals img";
});

function matchWineToFlavor(wine, flavorId) {
  return wine.filter(item => {
    for(var i=0; i<item.pairings.length; i++) {
      if(item.pairings[i] == flavorId) {
        return item;
      }
    }
  });
}

button.addEventListener("click", function(event) {
  event.preventDefault();
  while (pairingDiv.firstChild) {
    pairingDiv.removeChild(pairingDiv.firstChild);
  }
  var currentFlavorId = flavorProfile.options[flavorProfile.selectedIndex].id;
  var wine = [];
  fetch(wineUrl)
    .then(response => {
      return response.json();
    })
    .then(response => {
      response.forEach(response => {
        wine.push(response);
      });
      var pairing = matchWineToFlavor(wine, currentFlavorId);
      pairing.forEach(pairing => {
        var result = document.createElement("p");
        result.className = "result";
        result.innerHTML = pairing.wine;
        pairingDiv.appendChild(result);
      });
    });
});
