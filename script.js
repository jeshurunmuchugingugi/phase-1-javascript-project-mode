const baseUrl = 'https://api.rawg.io/api/games?key=ce163d1a25de47a18c8b8408bca53b66';

const searchForm = document.getElementById("search-form");
const searchInputField = document.querySelector("#search-inputfield");
const displaySearch = document.getElementById("display-search");
const wishlist = document.querySelector("wishlist-icon")
const card = document.querySelector(".card")
const homepageReco = document.getElementById("homepage-recommendation")
const rightBx = document.querySelector(".right_bx  a")


const platformIcons = {
  pc: '<i class="bi bi-pc-display"></i>',
  playstation5: '<i class="bi bi-playstation"></i>',
  xboxone: '<i class="bi bi-xbox"></i>',
  nintendoswitch: '<i class="bi bi-nintendo-switch"></i>',
  ios: '<i class="bi bi-apple"></i>',
  android: '<i class="bi bi-android2"></i>',
};

async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    displayDataToWeb(data.results);
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

function displayDataToWeb(results) {
  displaySearch.innerHTML = ''; 

  results.forEach(game => {

    let platformIconsHTML = '';

    for (let i = 0; i < game.platforms.length; i++) {
      const platform = game.platforms[i].platform;
      const platformName = platform.slug.toLowerCase();
    
      if (platformIcons[platformName]) {
        platformIconsHTML += platformIcons[platformName];
      }
    }
    platformIconsHTML.className = "big-ones"
  
    const genres = game.genres.map(g => `<a href="#">${g.name}</a>`).join(', ');
    homepageReco.innerHTML = '';
    const cardHTML = `
      <div class="game-card">
        <div class="game-thumb">
          <img src="${game.background_image}" alt="Game Cover">
        </div>
        <div class="game-info">
          <div class="platform-rating">
            <span class="platform">${platformIconsHTML}</span>
            <button class="wishlist-icon"><i class="bi bi-gift"></i></button>
          </div>
          <h2 class="title">${game.name}</h2>
          <p>${game.description || 'This api does not have a descrption for this'}</p>
          <p><strong>Release date:</strong> ${game.released}</p>
          <hr>
          <p id="genre-p"><strong>Genres:</strong> ${genres}</p>
        </div>
      </div>
    `;

 
    displaySearch.innerHTML += cardHTML;
  });
}




rightBx.addEventListener('click',(e)=>{
  e.preventDefault();
  fetchData(`${baseUrl}`)
})
document.addEventListener('DOMContentLoaded',(e)=>{
  e.preventDefault();
  fetchData(`${baseUrl}`)
})

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchInput = searchInputField.value.trim();
  if (searchInput !== '') {
    fetchData(`${baseUrl}&search=${searchInput}`);
  }
});


const platformIdMap = {
  "pc": 4,
  "x-box one": 1,
  "playstation 5": 187,
  "nintendo switch": 7,
  "ios": 3,
  "android": 21
};

const selectAllSideLinks = document.querySelectorAll("ul li a");
selectAllSideLinks.forEach(a => {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    let genreValues = e.currentTarget.textContent.toLowerCase().trim();

    if (platformIdMap[genreValues]) {
      const platformId = platformIdMap[genreValues];
      platformValue(platformId);
    } else {
      fetchData(`${baseUrl}&genres=${(genreValues)}`);
    }
  });
});



function platformValue(id) {
  fetchData(`${baseUrl}&platforms=${id}`);
}

const DB_URL = "http://localhost:3000/wishlist";


window.addEventListener("click", async (e) => {
  if (e.target.closest(".wishlist-icon")) {
    const card = e.target.closest(".game-card");
    const title = card.querySelector(".title").innerText;
    const image = card.querySelector("img").src;
    const genre = card.querySelector("#genre-p").innerText;
    const releaseDate = card.querySelector("strong").nextSibling.textContent.trim();

    const gameObj = {
      name: title,
      image: image,
      genre: genre,
      released: releaseDate
    };

    await fetch(DB_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(gameObj)
    });
    alert("Game added to wishlist!");
  }
});

const wishlistBtn = document.getElementById("wishlist");
wishlistBtn.addEventListener("click", async () => {
  const res = await fetch(DB_URL);
  const wishlistGames = await res.json();

  displaySearch.innerHTML = "";
  wishlistGames.forEach(game => {
    displaySearch.innerHTML += `
      <div class="game-card">
        <div class="game-thumb">
          <img src="${game.image}" alt="Game Cover">
        </div>
        <div class="game-info">
          <div class="platform-rating">
            <button class="btn delete-btn" data-id="${game.id}">Delete</button>
          </div>
          <h2 class="title">${game.name}</h2>
          <p><strong>${game.genre}</strong></p>
          <p><strong>Release date:</strong> ${game.released}</p>
        </div>
      </div>
    `;
  });
});

// Handle deletion
window.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const id = e.target.dataset.id;
    await fetch(`${DB_URL}/${id}`, { method: "DELETE" });
    e.target.closest(".game-card").remove();
  }
});


wishlistIcons.forEach(icon => {
  icon.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    const title = card.querySelector("h4").innerText;
    const image = card.querySelector("img").src;
    const description = card.querySelector("p").innerText;

    const gameData = {
      title: title,
      image: image,
      description: description
    };

    fetch("http://localhost:3000/wishlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(gameData)
    })
    .then(res => res.json())
    .then(data => {
      alert(`${data.title} added to wishlist!`);
    })
    .catch(err => console.error("Error:", err));
  });
});

  const gameBx = document.querySelector('.game_bx');
  const leftBtn = document.querySelector('.left-btn');
  const rightBtn = document.querySelector('.right-btn');

  const scrollAmount = 300; // Adjust scroll distance

  leftBtn.addEventListener('click', () => {
    gameBx.scrollLeft -= scrollAmount;
  });

  rightBtn.addEventListener('click', () => {
    gameBx.scrollLeft += scrollAmount;
  });
