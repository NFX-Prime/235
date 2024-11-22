 // 1
 window.onload = (e) => {document.querySelector("#searchbutton").onclick = searchButtonClicked};
	
 // 2
 let displayTerm = "";
 
 // 3
 function searchButtonClicked(){
     
 const GAMEPAGE_URL = "https://free-to-play-games-database.p.rapidapi.com/api/games?";

 let url = GAMEPAGE_URL;

 // Variables for different filters

 let platform = document.querySelector("#platform").value.trim();
 let sort = document.querySelector("#sort").value.trim();
 let genre = document.querySelector("#genre").value.trim();

 // Adds filters to url

 url += urlCreate("&platform=", platform);
 url += urlCreate("&sort-by=", sort);
 url += urlCreate("&category=", genre);

 let limit = document.querySelector("#limit").value;

 getData(url);
 }

 function getData(url){

   document.querySelector("#numresults").innerHTML = `Searching for ${limit.value} results!<br> <img src='images/spinner.gif' alt='searching' id='spinner'>`;
   const data = null;
   const xhr = new XMLHttpRequest();
   xhr.withCredentials = true;

   xhr.open('GET', `${url}`);
   xhr.setRequestHeader('x-rapidapi-key', "6cef503bd3msh28ac9b0fe25f174p18dc9djsn44f478740c5f");
   xhr.setRequestHeader('x-rapidapi-host', 'free-to-play-games-database.p.rapidapi.com');

   xhr.onload = dataLoaded;
   xhr.onerror = dataError;

   xhr.send(data);
 }

 function dataLoaded(e){

    
     let xhr = e.target;

     let obj =JSON.parse(xhr.responseText);

     if(obj.status == 0){
      dataError();
      return;
     }

     let results= [];

     // If/else statement for determining how many results should be put down to avoid console errors

     if(obj.length < parseInt(limit.value)){
      for (let i = 0; i<obj.length; i++) {
         results.push(obj[i]);
      }
      document.querySelector("#numresults").innerHTML = `Here are ${results.length} results! (Not enough games for ${limit.value})`;
     }else{
      for (let i = 0; i<parseInt(limit.value); i++) {
         results.push(obj[i]);
      }
      document.querySelector("#numresults").innerHTML = `Here are ${limit.value} results!`;
     }

     // Start of logic for adding results into the results area
     let bigString = "";
     
     for(let i=0; i<results.length; i++){
         let result = results[i];

         let smallURL = result.thumbnail;
         if (!smallURL) smallURL = "images/no-image-found.png";

         let line = `<div class='result'><img class='resultimg' src='${smallURL}'title='${result.title}'/>`;
         line += `<button class='resultButton' data-image='${smallURL}' data-title='${result.title}'
         data-developer='${result.developer}' data-publisher='${result.publisher}' data-desc='${result.short_description}'
         data-release='${result.release_date}' data-link='${result.game_url}'>Click Here For More Info On ${result.title}</button></div>`;

         bigString+= line;
     }
     document.querySelector("#results").innerHTML = bigString;

     // List of results to add buttons to results for more information
     let listResults = document.querySelectorAll(".result");
     for (let result of listResults) {
        result.querySelector("button").addEventListener("click", displayInfo);
     }
 }

 function displayInfo(e){
   // Displays information of one of the games when selected by the user
    document.querySelector("#results").innerHTML = `<div class='moreinfo'><p>Here is more info for: ${e.target.dataset.title}</p>
    <img src='${e.target.dataset.image}' alt='${e.target.dataset.title}' width="65%">
    <p>${e.target.dataset.desc}<br><br>
    Developed By: <b>${e.target.dataset.developer}</b><br>
    Published By: <b>${e.target.dataset.publisher}</b><br>
    Released On: <b>${e.target.dataset.release}</b></p>
    <a href='${e.target.dataset.link}'>View Game Page</a><br><br>
    <button id='exit'>Click to Go Back to Results!</button></div>`;

   // Event Listener for going back to the list of options
    document.querySelector("#exit").addEventListener("click", searchButtonClicked);
 }

 function dataError(e){
   // Displays when a combination of filters amounts to no results
   document.querySelector("#numresults").innerHTML = `No Results Found! Sorry!`;
   document.querySelector("#results").innerHTML = "<img src='images/cat-cry.gif' alt='sad cat crying'>"
 }

 function urlCreate(category, query){
   // Adds to the end of the url query if there is a value
   if(query != "all"){
      return category + query;
   }
   return "";
 }
