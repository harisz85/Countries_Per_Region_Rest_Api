'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
const dropdownContent = document.querySelector('.dropdown_content');
const dropdownChoice = document.querySelector('.dropdown_choice');
const regionContainer = document.getElementById('regions');
const countriesTablePerRegion =  document.querySelector('.countriesTablePerRegion');
const countriesTablePerRegion_Container =  document.querySelector('.countriesTablePerRegion_Container');
const countryOfRegion = document.querySelector('.countryOfRegion');
const countryDetails = document.querySelector('.countryDetails');


///////////////////////////////////////
//https://countries-api-836d.onrender.com/countries/
//https://api.countrylayer.com/v2/
//https://restcountries.com/v3.1/name/GREECE
//https://restcountries.com/v3.1/all
//https://restcountries.com/v2/all
//https://www.apicountries.com/countries

const renderCountry = function(countryDetailsObject)
{

 // console.log(countryDetailsObject);

  while(countryDetails.hasChildNodes()) 
  {
    countryDetails.removeChild(countryDetails.firstChild);
  }
  
  const html = `
    <div class="countryDetailsCard">
          <h2>Country Name :  ${countryDetailsObject.country}</h2>
          <h3>Capital : ${countryDetailsObject.capital}</h3>
          <h3>Population : ${countryDetailsObject.population}</h3>
          <h3>Currency : ${countryDetailsObject.currency}</h3>
    </div>`;

  //renderCountry(Thiscountry.textContent);     
  countryDetails.insertAdjacentHTML('beforeend',html);
}


function getCountry(Thiscountry) 
{

    fetch(`https://restcountries.com/v3.1/name/${Thiscountry.textContent}`)
    .then((response) => response.json()
    .then(data => {
      //renderCountry(data[0]);  
      // console.log(data);
      //console.log(data[0].name.common);
      // console.log(data[0].population);
      // console.log(Object.values(Object.values(data[0].currencies))[0].name);
      // return;

      let countryDetailsObject = 
      {
        country :  data[0].name.common,
        capital :  data[0].capital,
        population : data[0].population,
        currency : Object.values(Object.values(data[0].currencies))[0].name

      }

   renderCountry(countryDetailsObject)

  }))
}

const getCountryAndNeighbour = function(country) {
  fetch(`https://restcountries.com/v3.1/name/${country}`)
  .then((response) => response.json()
  .then(data => {
    renderCountry(data[0]);  

    const neighbours = data[0].borders;
   // console.log(data[0].borders);

   if (!neighbours) return;

    neighbours.forEach(neighbour=> 
      fetch(`https://restcountries.com/v3.1/alpha/${neighbour}`)
      .then((response) => response.json()
      .then(data => {
        renderCountry(data[0]);  
      }))
    )
  } 
  ));
}


async function getDataFetch()
{
  const url = "https://restcountries.com/v3.1/all?fields=region";
  
  await fetch(url)
  .then(response => response.json())
  .then(data =>
  {
  let regions = [];

    for(let i = 0; i <data.length; i++) {
    //console.log(data[i].region);
      regions.push(data[i].region)
      }
       
        let set;
        let regionsDistinct = [];
        set = new Set(regions);
        regionsDistinct = [...set];
        //console.log(regionsDistinct);

    for(let  i=0;i <regionsDistinct.length;i++) {
      const html = `<option value="${regionsDistinct[i]}">${regionsDistinct[i]}</option>`;
      regionContainer.insertAdjacentHTML('beforeend',html);
    }
  }
);

}



regionContainer.addEventListener("change",(event) => {
  const selectedIndex = regionContainer.selectedIndex;
 //alert(selectedIndex + " " + regionContainer.value);

  if (selectedIndex === 0) 
  {
    while(countryDetails.hasChildNodes()) 
    {
      countryDetails.removeChild(countryDetails.firstChild);
    }               
    return;
  }

  while(countryDetails.hasChildNodes()) 
  {
    countryDetails.removeChild(countryDetails.firstChild);
  }

  while( countriesTablePerRegion_Container.hasChildNodes()) 
  {
     countriesTablePerRegion_Container.removeChild(countriesTablePerRegion_Container.firstChild);
  }
  
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };

  var countriesOfRegion= [];
  
  fetch(`https://restcountries.com/v3.1/region/${regionContainer.value}`, requestOptions)
    .then((response) => response.json())
    .then((data) => {

      //Loop through object
      for(let prop in data) {
       // console.log(data[prop].name.common)
       let countryName = data[prop].name.common;
       //console.log(countryName);
       countriesOfRegion.push(countryName);
       let html = `<p class="countryOfRegion" onclick="getCountry(this)">${countryName}</p>`;
          
       countriesTablePerRegion_Container.insertAdjacentHTML('beforeend',html);         
           
      }

    //console.log(countriesOfRegion);
   //   return `${data[prop].name.common}`;

    })
    .catch((error) => console.error(error));
})



getDataFetch();
