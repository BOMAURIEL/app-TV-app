const mediaLibrary = [
  {title:"Movie 1",tmdbId:1078605,type:"movie",img:"https://via.placeholder.com/200x300?text=Movie+1"},
  {title:"Movie 2",tmdbId:634649,type:"movie",img:"https://via.placeholder.com/200x300?text=Movie+2"},
  {title:"TV 1",tmdbId:119051,type:"tv",seasons:3,episodesPerSeason:5,img:"https://via.placeholder.com/200x300?text=TV+1"},
  {title:"TV 2",tmdbId:1412,type:"tv",seasons:2,episodesPerSeason:4,img:"https://via.placeholder.com/200x300?text=TV+2"}
];

const player = document.getElementById("player");
const movieGrid = document.getElementById("movieGrid");
const tvGrid = document.getElementById("tvGrid");
const continueWatching = document.getElementById("continueWatching");
const favorites = document.getElementById("favorites");
const searchBar = document.getElementById("searchBar");

// Load Vidking player
function loadPlayer(item, season=1, episode=1) {
  let progressKey = item.type === "movie" ? `progress-${item.tmdbId}` : `progress-${item.tmdbId}-s${season}e${episode}`;
  let progress = JSON.parse(localStorage.getItem(progressKey))?.time || 0;
  if(item.type === "movie") {
    player.src = `https://www.vidking.net/embed/movie/${item.tmdbId}?color=ff0000&autoPlay=true&progress=${progress}`;
  } else {
    player.src = `https://www.vidking.net/embed/tv/${item.tmdbId}/${season}/${episode}?color=ff0000&autoPlay=true&nextEpisode=true&episodeSelector=true&progress=${progress}`;
  }
}

// Populate Movie Grid
function populateMovieGrid(filter="") {
  movieGrid.innerHTML = "";
  const filtered = mediaLibrary.filter(m=>m.type==="movie" && m.title.toLowerCase().includes(filter.toLowerCase()));
  filtered.forEach(item=>{
    const card = document.createElement("div");
    card.className="card";
    card.innerHTML = `<img src="${item.img}" alt="${item.title}">
                      <div class="title">${item.title}</div>
                      <button class="btn">Play</button>
                      <button class="btn" onclick="addFavorite('${item.tmdbId}')">★</button>`;
    card.querySelector(".btn").addEventListener("click",()=>loadPlayer(item));
    movieGrid.appendChild(card);
  });
}

// Populate TV Grid
function populateTVGrid(filter="") {
  tvGrid.innerHTML = "";
  const filtered = mediaLibrary.filter(m=>m.type==="tv" && m.title.toLowerCase().includes(filter.toLowerCase()));
  filtered.forEach(item=>{
    const card = document.createElement("div");
    card.className="card";

    // Season & Episode dropdowns
    let seasonOptions = "";
    for(let s=1;s<=item.seasons;s++) seasonOptions += `<option value="${s}">${s}</option>`;
    let episodeOptions = "";
    for(let e=1;e<=item.episodesPerSeason;e++) episodeOptions += `<option value="${e}">${e}</option>`;

    card.innerHTML = `<img src="${item.img}" alt="${item.title}">
                      <div class="title">${item.title}</div>
                      <select class="seasonSelect">${seasonOptions}</select>
                      <select class="episodeSelect">${episodeOptions}</select>
                      <button class="btn">Play</button>
                      <button class="btn" onclick="addFavorite('${item.tmdbId}')">★</button>`;

    card.querySelector(".btn").addEventListener("click",()=>{
      const season = parseInt(card.querySelector(".seasonSelect").value);
      const episode = parseInt(card.querySelector(".episodeSelect").value);
      loadPlayer(item,season,episode);
    });

    tvGrid.appendChild(card);
  });
}

// Favorites
function addFavorite(tmdbId) {
  let favs = JSON.parse(localStorage.getItem("favorites")||"[]");
  if(!favs.includes(tmdbId)) favs.push(tmdbId);
  localStorage.setItem("favorites",JSON.stringify(favs));
  populateFavorites();
}

function populateFavorites() {
  favorites.innerHTML = "";
  let favs = JSON.parse(localStorage.getItem("favorites")||"[]");
  favs.forEach(id=>{
    const item = mediaLibrary.find(m=>m.tmdbId==id);
    if(!item) return;
    const card = document.createElement("div");
    card.className="card";
    let innerHTML = `<img src="${item.img}" alt="${item.title}">
                     <div class="title">${item.title}</div>`;
    if(item.type==="movie") {
      innerHTML += `<button class="btn" onclick='loadPlayer(${JSON.stringify(item)})'>Resume</button>`;
    } else {
      innerHTML += `<select class="seasonSelect">`;
      for(let s=1;s<=item.seasons;s++) innerHTML += `<option value="${s}">${s}</option>`;
      innerHTML += `</select><select class="episodeSelect">`;
      for(let e=1;e<=item.episodesPerSeason;e++) innerHTML += `<option value="${e}">${e}</option>`;
      innerHTML += `</select><button class="btn" onclick='loadPlayer(${JSON.stringify(item)}, parseInt(this.previousElementSibling.previousElementSibling.value), parseInt(this.previousElementSibling.value))'>Resume</button>`;
    }
    card.innerHTML = innerHTML;
    favorites.appendChild(card);
  });
}

// Continue Watching
function populateContinueWatching() {
  continueWatching.innerHTML = "";
  Object.keys(localStorage).forEach(key=>{
    if(key.startsWith("progress-")) {
      const data = JSON.parse(localStorage.getItem(key));
      const idMatch = key.match(/progress-(\d+)/);
      if(!idMatch) return;
      const tmdbId = parseInt(idMatch[1]);
      const item = mediaLibrary.find(m=>m.tmdbId===tmdbId);
      if(!item) return;
      const percent = ((data.time/data.duration)*100).toFixed(0);
      const card = document.createElement("div");
      card.className="card";
      card.innerHTML = `<img src="${item.img}" alt="${item.title}">
                        <div class="title">${item.title} ${percent}%</div>
                        <button class="btn" onclick="loadPlayer(${JSON.stringify(item)})">Resume</button>`;
      continueWatching.appendChild(card);
    }
  });
}

// Search filter
searchBar.addEventListener("input",(e)=>{
  populateMovieGrid(e.target.value);
  populateTVGrid(e.target.value);
});

// Listen for player events
window.addEventListener("message", function(event){
  try{
    const data = JSON.parse(event.data);
    if(data.event === "timeupdate"){
      let key = data.mediaType === "movie" ? `progress-${data.id}` : `progress-${data.id}-s${data.season}e${data.episode}`;
      localStorage.setItem(key, JSON.stringify({time:data.currentTime,duration:data.duration}));
      populateContinueWatching();
    }
    if(data.event==="ended"){
      let key = data.mediaType === "movie" ? `progress-${data.id}` : `progress-${data.id}-s${data.season}e${data.episode}`;
      localStorage.removeItem(key);
      populateContinueWatching();
    }
  }catch(e){}
});

// Initial load
populateMovieGrid();
populateTVGrid();
populateFavorites();
populateContinueWatching();
