const btnSearch = document.getElementById('btnSearch');
const btnReset = document.getElementById('btnReset');

function checkInput(input)
{
    if(["beach", "beaches"].includes(input))
    {
        return "beaches";
    }
    else if(["temple", "temples"].includes(input))
    { 
        return "temples"
    }
    else if(["country", "countries"].includes(input))
    {
        return "countries";
    }
    else
    {
        return null;
    }
}

function search()
{
    const input = document.getElementById('searchInput').value.toLowerCase();
    searchCriteria = checkInput(input);
    if (!searchCriteria)
    {
        alert("You have entered an invalid selection. Please try again");
    }
    fetch("travel_recommendation_api.json")
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      // Process data based on the category provided by the user
      if (data.hasOwnProperty(input)) {
        const categoryData = data[input];
        console.log(categoryData);

        // Display the data in the console or further process it as needed
        categoryData.forEach(item => {
            console.log(`Name: ${item.name}`);
            console.log(`Description: ${item.description}`);
            console.log(`Image URL: ${item.imageUrl}`);
            console.log('------');
            var elemDiv = document.createElement('div');
            elemDiv.className="results";
            elemDiv.style.cssText = 'position:absolute;width:100%;height:100%;opacity:0.3;z-index:100;background:#000;';
            elemDiv.innerHTML += `<h2>${item.name}</h2>`;
            elemDiv.innerHTML += `<img src="${item.imageUrl}" alt="hjh">`;
            elemDiv.innerHTML += `<h2>${item.description}</h2>`;
            document.body.appendChild(elemDiv);
        });
      } else {
        console.error(`Category ${input} does not exist in the data.`);
      }
    })
    .catch(error => console.error('There has been a problem with your fetch operation:', error));

   
}
btnSearch.addEventListener('click', search);

