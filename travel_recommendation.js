const btnSearch = document.getElementById('btnSearch');
const btnReset = document.getElementById('btnReset');

document.addEventListener('DOMContentLoaded', () => {
  const resultsContainer = document.createElement('div');
  resultsContainer.id = 'results-container';
  const resultsList = document.createElement('ul');
  resultsContainer.appendChild(resultsList);
  document.body.appendChild(resultsContainer);
});

function checkInput(input) {
  if (["beach", "beaches"].includes(input)) {
    return "beaches";
  } else if (["temple", "temples"].includes(input)) {
    return "temples";
  } else if (input === "country" || input === "countries") {
    return "random_cities";
  } else if (["australia", "japan", "brazil"].includes(input)) {
    return input;
  } else {
    return null;
  }
}

function search() {
  const input = document.getElementById('searchInput').value.toLowerCase();
  const searchCriteria = checkInput(input);
  if (!searchCriteria) {
    alert("You have entered an invalid selection. Please try again");
    return;
  }

  fetch("travel_recommendation_api.json")
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      const resultsContainer = document.getElementById('results-container');
      const resultsList = resultsContainer.querySelector('ul');
      resultsList.innerHTML = ''; // Clear previous results
      resultsContainer.style.display = 'block'; // Show the container

      if (searchCriteria === "beaches" || searchCriteria === "temples") {
        displayItems(data[searchCriteria]);
      } else if (searchCriteria === "random_cities") {
        const allCities = data.countries.flatMap(country => country.cities);
        const randomCities = getRandomItems(allCities, 2);
        displayItems(randomCities);
      } else {
        // Handle countries
        const countryData = data.countries.find(country => country.name.toLowerCase() === searchCriteria);
        if (countryData && countryData.cities) {
          displayItems(countryData.cities);
        } else {
          console.error(`Country ${searchCriteria} does not exist in the data.`);
        }
      }
    })
    .catch(error => console.error('There has been a problem with your fetch operation:', error));
}

function getRandomItems(array, count) {
  const shuffled = array.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function displayItems(items) {
  const resultsContainer = document.getElementById('results-container');
  const resultsList = resultsContainer.querySelector('ul');
  resultsList.innerHTML = ''; // Clear previous results
  resultsContainer.style.display = 'block'; // Show the container

  items.forEach(item => {
    const titleItem = document.createElement('li');
    titleItem.className = "result-title";
    titleItem.innerHTML = `<h2>${item.name}</h2>`;

    const imageItem = document.createElement('li');
    imageItem.className = "result-image";
    const img = document.createElement('img');
    img.src = item.imageUrl;
    img.alt = item.name;

    img.onload = () => {
      imageItem.appendChild(img);

      const descriptionItem = document.createElement('li');
      descriptionItem.className = "result-description";
      descriptionItem.innerHTML = `<p>${item.description}</p>`;

      resultsList.appendChild(titleItem);
      resultsList.appendChild(imageItem);
      resultsList.appendChild(descriptionItem);
    };

    img.onerror = () => {
      const descriptionItem = document.createElement('li');
      descriptionItem.className = "result-description";
      descriptionItem.innerHTML = `<p>${item.description}</p>`;

      resultsList.appendChild(titleItem);
      resultsList.appendChild(descriptionItem);
    };
  });
}

btnSearch.addEventListener('click', search);
btnReset.addEventListener('click', () => {
  document.getElementById('searchInput').value = '';
  const resultsContainer = document.getElementById('results-container');
  resultsContainer.querySelector('ul').innerHTML = '';
  resultsContainer.style.display = 'none'; // Hide the container
});
