# Weather-Forecast-Web-App

## Description
A weather application which allows travellers to search for the current weather and the five day forecast for multiple cities, so that they can plan trips accordingly.
<br><br>
Application usage on a large screen is demonstrated below. <br>
 ![App Demo](/assets/images/demo_gif.gif) <br>

The gif below showcases the responsive layout at various device sizes. <br>
 ![Responsive Demo](/assets/images/mobile_responsive_demo.gif) <br>

## Deployment
The app is deployed using GitHub Pages at: https://aywink.github.io/Weather-Forecast-Web-App/

## Usage
### End User
Search for the weather forecast using the search box. Specify the country code (seperated by a comma after the city name) to always obtain the correct weather. View history in the dropdown menu by clicking the search box. Recent searches appear at the top. Alternatively narrow down previously searched cities with the autocomplete feature. Note that only valid cities will be saved to the search history. Clear all saved searches by clicking on the rubbish bin icon in the top right of the app.

The user is able to scroll through the five day forecast using the buttons found at the bottom. The buttons disappear to indicate when the user has scrolled to the beginning or the end.

### Development
Files  are named appropriately and placed in a logically structured folder layout. The codebase includes comments and appropriately named expressions, so that the code is easy to understand. The JavaScript file only contains functions with no variables in the global scope that could interfere with future development. The app.js file also includes logic for a custom carousel component.

The initial layout of the webpage consists of the header, search form, and footer. Containers for the current weather and five-day forecast sections are also included in the layout; however, the containers are initially hidden using CSS.

Bootstrap and jQuery UI frameworks, along with a custom styles sheet, are used to style the web application.

The application is developed using jQuery, jQueryUI (Autocomplete) and moment.js third party APIs. Weather data is obtained using the OpenWeather API.

## Credits
- W3Schools - https://www.w3schools.com/js/default.asp
- MDN Documentation - https://developer.mozilla.org/en-US/
- Stack Overflow threads - https://stackoverflow.com/
- JavaScript: The Definitive Guide, 7th Edition by David Flanagan - ISBN: 9781491952023
- jQuery Cheat Sheet - https://htmlcheatsheet.com/jquery/
- Moment.js Documentation - https://momentjs.com/docs/
- jQuery UI autocomplete Documentation - https://api.jqueryui.com/autocomplete/
- jQuery Documentation - https://api.jquery.com/
- Bootstrap Documentation - https://getbootstrap.com/docs/5.2/getting-started/introduction/
- YouTube carousel tutorials - https://www.youtube.com/watch?v=9HcxHDS2w1s
- Font Awesome Docs - https://fontawesome.com/docs/web/

## License
MIT License

