// serch mode to determine serch button clicked
let serchMode = "none";

// dom elements for function --------------------------------------------------------

const myResultElement = document.getElementById("myResult");

const myfirstLetterInput = document.getElementById("firstLetterInput");
const myfirstLetterSearchButton = document.getElementById("firstLetterSearch");

myfirstLetterSearchButton.addEventListener("click", () => {
  serchMode = "firstLetterSearch";
  console.info(myfirstLetterInput.value);
});

const myNameInput = document.getElementById("nameInput");
const myNameSearchButton = document.getElementById("nameSearch");

myNameSearchButton.addEventListener("click", () => {
  serchMode = "nameSearch";
  console.info(myNameInput.value);
  getRecipiesByName(myNameInput.value);
});

const myIdInput = document.getElementById("idInput");
const myIdSearchButton = document.getElementById("idSearch");

myIdSearchButton.addEventListener("click", () => {
  serchMode = "idSearch";
  console.info(myIdInput.value);
});

//-------------------------------------------------------------------------------------

// fetch functions Bo's eksempel--------------------------------------------------------------------


function getRecipiesByName(myName) {
  apiUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${myName}`;

  fetch(apiUrl)
    .then((response) => {
     
        // error checking
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }

      return response.json(); // Parse the response body as JSON
    })

    .then((data) => {
      // send data on to view functions
      setupResultView(data);
    })

    .catch((error) => {
      serchMode = "error";
      console.error("Error:", error);
      setupResultView(error);
    });
}
//----------------------------------------------------------
// view code til Name search --------------------------------------------------------------------------

function setupResultView(myData) {
  switch (serchMode) {
    case "firstLetterSearch":
      console.log(myData);
      let myText2 = "";

      myData.map((myData) => {
        myText2 += myData.strIngredient13 + ", ";
      });
      break;

    case "nameSearch":
      console.log(myData.meals);
      let myText = "";

      myData.meals.map((myMeal) => {
        myText += myMeal.strMeal + ", ";
      });

      myResultElement.textContent = myText;
      break;

    case "idSearch":
      console.log(myData);
      // do view stuff with the data here
      break;

    case "errorMessage":
      console.log(myData);
      // do view stuff with the error msg here
      break;

    default:
      console.warn("ooops no data to show from setupResultView");
      break;
  }
}
;
//-------------------------------------
//billedevisaning ved lettersearch
document.addEventListener('DOMContentLoaded', () => {
  const firstLetterInput = document.getElementById('firstLetterInput');
  const firstLetterSearch = document.getElementById('firstLetterSearch');
  const myResult = document.getElementById('myResult');

  // Function to display the recipe for a meal
  function displayRecipe(mealId) {
      // Fetch the recipe details from the API using the meal ID
      fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
          .then((response) => response.json())
          .then((data) => {
              const meal = data.meals[0];

              // Create a modal to display the recipe
              const modal = document.createElement('div');
              modal.classList.add('modal');

              // Create a close button for the modal
              const closeButton = document.createElement('button');
              closeButton.textContent = 'Close';
              closeButton.classList.add('close-button');
              closeButton.addEventListener('click', () => {
                  modal.remove();
              });

              // Create a heading for the recipe
              const recipeHeading = document.createElement('h2');
              recipeHeading.textContent = `Recipe for ${meal.strMeal}`;

              // Create a paragraph for the recipe instructions
              const recipeInstructions = document.createElement('p');
              recipeInstructions.textContent = meal.strInstructions;

              // Append elements to the modal
              modal.appendChild(closeButton);
              modal.appendChild(recipeHeading);
              modal.appendChild(recipeInstructions);

              // Append the modal to the body
              document.body.appendChild(modal);
          })
          .catch((error) => {
              console.error('Error fetching recipe data:', error);
              alert('An error occurred while fetching recipe data.');
          });
  }
  // end of display recipe function
//----------------------------------------------------------
//first letter search function:

  firstLetterSearch.addEventListener('click', () => {
      const firstLetter = firstLetterInput.value;

      // Check if the input is not empty
      if (firstLetter.trim() === '') {
          alert('Please enter a letter.');
          return;
      }

      // Clear previous results
      myResult.innerHTML = '';

      // Fetch data from the API
      fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${firstLetter}`)
          .then((response) => response.json())
          .then((data) => {
              if (data.meals === null) {
                  myResult.innerHTML = 'No meals found with that letter.';
              } else {
                  data.meals.forEach((meal) => {
                      // Create a div for each meal
                      const mealDiv = document.createElement('div');
                      mealDiv.classList.add('meal-item');

                      // Create an image element for the meal
                      const mealImage = document.createElement('img');
                      mealImage.src = meal.strMealThumb;
                      mealImage.alt = meal.strMeal;

                      // Make the image clickable to display the recipe
                      mealImage.addEventListener('click', () => {
                          displayRecipe(meal.idMeal);
                      });

                      // Create a paragraph for the meal name
                      const mealName = document.createElement('p');
                      mealName.textContent = meal.strMeal;

                      // Append the image and name to the div
                      mealDiv.appendChild(mealImage);
                      mealDiv.appendChild(mealName);

                      // Append the meal div to the result
                      myResult.appendChild(mealDiv);
                  });
              }
          })
          .catch((error) => {
              console.error('Error fetching data:', error);
              myResult.innerHTML = 'An error occurred while fetching data.';
          });

      // Add a class to the article for styling
      myResult.classList.add('gallery');
  });
});

//Meal id search function --------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  const idInput = document.getElementById('idInput');
  const idSearch = document.getElementById('idSearch');
  const myResult = document.getElementById('myResult');

  // Function to display the meal details by Meal ID
  function displayMealDetails(mealId) {
      // Fetch the meal details from the API using the Meal ID
      fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
          .then((response) => response.json())
          .then((data) => {
              const meal = data.meals[0];

              // Create a list to display the meal details
              const mealDetailsList = document.createElement('ul');

              // Loop through the properties of the meal and add them to the list
              for (const property in meal) {
                  if (meal[property] && property !== 'idMeal') {
                      const listItem = document.createElement('li');
                      listItem.textContent = `${property}: ${meal[property]}`;
                      mealDetailsList.appendChild(listItem);
                  }
              }

              // Clear previous results
              myResult.innerHTML = '';

              // Append the meal details list to the result
              myResult.appendChild(mealDetailsList);
          })
          .catch((error) => {
              console.error('Error fetching meal data:', error);
              myResult.innerHTML = 'An error occurred while fetching meal data.';
          });
  }

  // Add click event listener to the Meal ID search button
  idSearch.addEventListener('click', () => {
      const mealId = idInput.value;

      // Check if the input contains exactly 5 digits
      if (/^\d{5}$/.test(mealId)) {
          displayMealDetails(mealId);
      } else {
          alert('Please enter a 5-digit Meal ID.');
      }
  });
});


