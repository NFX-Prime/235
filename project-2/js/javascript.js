 // 1
 window.onload = (e) => {document.querySelector("#search").onclick = searchButtonClicked};
	
 // 2
 let displayTerm = "";
 
 // 3
 function searchButtonClicked(){
     console.log("searchButtonClicked() called");
     
 const GIPHY_URL = "https://free-to-play-games-database.p.rapidapi.com/api/games";

 let url = GIPHY_URL;

 let limit = document.querySelector("#limit").value;
 limit = parseInt(limit);

 getData(url);
 }

 function getData(url){
     const data = null;

 const xhr = new XMLHttpRequest();
 xhr.withCredentials = true;

 xhr.addEventListener('readystatechange', function () {
 if (this.readyState === this.DONE) {
     console.log(this.responseText);
 }
 });

 xhr.open('GET', 'https://free-to-play-games-database.p.rapidapi.com/api/games');
 xhr.setRequestHeader('x-rapidapi-key', '6cef503bd3msh28ac9b0fe25f174p18dc9djsn44f478740c5f');
 xhr.setRequestHeader('x-rapidapi-host', 'free-to-play-games-database.p.rapidapi.com');

 xhr.onload = dataLoaded;
 xhr.onerror = dataError;

 xhr.send(data);
 }

 function dataLoaded(e){
     let xhr = e.target;

     let obj =JSON.parse(xhr.responseText);

     let results= [];

     for (let i = 0; i<parseInt(limit.value); i++) {
        results.push(obj[i]);
     }

     let bigString = "<p><i>Here are " + results.length + " results";
     
     for(let i=0; i<results.length; i++){
         let result = results[i];

         let smallURL = result.thumbnail;
         if (!smallURL) smallURL = "images/no-image-found.png";

         let url = result.url;

         let line = `<div class='result'><img src='${smallURL}' title='${result.id}' />`;
         line += `<p>Title: ${result.title}<br><a target='_blank' href='${result.game_url}'>View Game Page</a></p></div>`;

         bigString+= line;
     }

     document.querySelector("p").innerHTML = bigString;
 }

 function dataError(e){
     console.log("An error occurred");
 }
