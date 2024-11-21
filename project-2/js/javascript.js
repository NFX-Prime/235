 // 1
 window.onload = (e) => {document.querySelector("#searchbutton").onclick = searchButtonClicked};
	
 // 2
 let displayTerm = "";
 
 // 3
 function searchButtonClicked(){
     
 const GIPHY_URL = "https://free-to-play-games-database.p.rapidapi.com/api/games?";

 let url = GIPHY_URL;
 let platform = document.querySelector("#platform").value.trim();
 let sort = document.querySelector("#sort").value.trim();
 let genre = document.querySelector("#genre").value.trim();

 if(platform != "all"){
    url += "&platform="+platform;
    console.log(url)
 }
 if(sort != "all"){
    url += "&sort-by="+sort
    console.log(url)
 }
 if(genre != "all"){
   url += "&category="+genre
   console.log(url)
 }
 

 let limit = document.querySelector("#limit").value;

 getData(url);
 }

 function getData(url){
     const data = null;

 const xhr = new XMLHttpRequest();
 xhr.withCredentials = true;

 xhr.addEventListener('readystatechange', function () {
 if (this.readyState === this.DONE) {
   document.querySelector("#numresults").innerHTML = `Searching for ${limit.value} results!`;
 }
 });

 xhr.open('GET', `${url}`);
 xhr.setRequestHeader('x-rapidapi-key', '6cef503bd3msh28ac9b0fe25f174p18dc9djsn44f478740c5f');
 xhr.setRequestHeader('x-rapidapi-host', 'free-to-play-games-database.p.rapidapi.com');

 xhr.onload = dataLoaded;
 xhr.onerror = dataError;

 xhr.send(data);
 }

 function dataLoaded(e){

     let xhr = e.target;

     let obj =JSON.parse(xhr.responseText);
     console.log(obj);

     let results= [];

     if(obj.length < parseInt(limit.value)){
      for (let i = 0; i<obj.length; i++) {
         results.push(obj[i]);
      }
     }else{
      for (let i = 0; i<parseInt(limit.value); i++) {
         results.push(obj[i]);
      }
     }


     document.querySelector("#numresults").innerHTML = `Here are ${limit.value} results!`;
     let bigString = "";
     
     for(let i=0; i<results.length; i++){
         let result = results[i];

         let smallURL = result.thumbnail;
         if (!smallURL) smallURL = "images/no-image-found.png";

         let url = result.url;

         let line = `<div class='result'><img src='${smallURL}'title='${result.title}'/>`;
         line += `<button class='resultButton' data-image='${smallURL}' data-title='${result.title}'
         data-developer='${result.developer}' data-publisher='${result.publisher}' data-desc='${result.short_description}'
         data-release='${result.release_date}' data-link='${result.game_url}'>Click Here For More Info On ${result.title}</button></div>`;

         bigString+= line;
     }

     document.querySelector("#results").innerHTML = bigString;
     let listResults = document.querySelectorAll(".result");
     console.log(listResults);
     for (let result of listResults) {
        result.querySelector("button").addEventListener("click", displayInfo);
     }
 }

 function displayInfo(e){
    console.log(e);
    document.querySelector("#results").innerHTML = `<div class='moreinfo'><p>Here is more info for: ${e.target.dataset.title}</p>
    <img src='${e.target.dataset.image}' alt='${e.target.dataset.title}' width="65%">
    <p>${e.target.dataset.desc}<br><br>
    Developed By: <b>${e.target.dataset.developer}</b><br>
    Published By: <b>${e.target.dataset.publisher}</b><br>
    Released On: <b>${e.target.dataset.release}</b></p>
    <a href='${e.target.dataset.link}'>View Game Page</a><br><br>
    <button id='exit'>Click to Go Back to Results!</button></div>`;

    document.querySelector("#exit").addEventListener("click", searchButtonClicked);
 }

 function dataError(e){
     console.log("An error occurred");
 }
