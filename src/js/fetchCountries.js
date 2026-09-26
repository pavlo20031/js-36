export function fetchCountries (country) {
    return fetch(
        `https://api.restcountries.com/countries/v5?q=${country}`,
  { 
    headers: { 
      'Authorization': 'Bearer rc_live_a90df3d1f70b46439b657b67d796b8ab' 
    } 
  }
)
  .then(function (response) { 
    if (!response.ok) {
      throw new Error('Помилка сервера: ' + response.status);
    }
    return response.json(); 
  })
}

