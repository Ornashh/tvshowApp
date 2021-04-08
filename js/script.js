const popularShowUrl =
  "https://api.themoviedb.org/3/discover/tv?api_key=39008b197a5755859d6786a809d485be&language=en-US&sort_by=popularity.desc&page=1";
const imgUrl = "http://image.tmdb.org/t/p/w1280";
const searchUrl =
  "https://api.themoviedb.org/3/search/tv?api_key=39008b197a5755859d6786a809d485be&language=en-US&page=1&query=";

const cardEl = document.querySelector(".card");
const modalEl = document.querySelector(".modal");
const formEl = document.querySelector(".form");
const searchEl = document.querySelector(".search");
const backBtn = document.querySelector(".back-btn");

async function getTvShow(url) {
  const res = await fetch(url);
  const data = await res.json();

  showTv(data.results);
}

getTvShow(popularShowUrl);

function showTv(query) {
  cardEl.innerHTML = "";

  query.forEach((tvShow) => {
    let cardInnerEl = document.createElement("div");
    cardInnerEl.classList.add("card-inner");

    cardInnerEl.innerHTML = `
      <img src=${imgUrl + tvShow.poster_path}>
      <div class="card-name">${tvShow.name}</div>
    `;

    cardEl.appendChild(cardInnerEl);

    let modalInnerEl = document.createElement("div");
    modalInnerEl.classList.add("modal-inner");

    modalInnerEl.innerHTML = `
      <div class="modal-btn">
        <button type="button">&times;</button>
      </div>
      <div class="modal-bg">
        <img src=${imgUrl + tvShow.backdrop_path}>
      </div>
      <div class="modal-text">
        <div class="name">
          <span>${tvShow.vote_average}</span>
          <h2>
            ${tvShow.name}
            <div class="year">
              (${tvShow.first_air_date.slice(0, 4)})
            </div>
          </h2>
        </div>
        <div class="overview">${tvShow.overview}</div>
        <div>Country: ${tvShow.origin_country[0]}</div>
      </div>
    `;

    cardInnerEl.addEventListener("click", () => {
      modalEl.appendChild(modalInnerEl);
      modalEl.classList.add("show-modal");
      document.body.style.overflow = "hidden";

      document
        .querySelector(".modal-btn button")
        .addEventListener("click", () => {
          modalEl.innerHTML = "";
          modalEl.classList.remove("show-modal");
          document.body.style.overflow = "auto";
        });
    });
  });
}

formEl.addEventListener("submit", (e) => {
  e.preventDefault();

  if (searchEl.value) {
    getTvShow(searchUrl + searchEl.value);
    searchEl.value = "";
  }

  backBtn.style.display = "block";

  backBtn.addEventListener("click", () => {
    getTvShow(popularShowUrl);
    backBtn.style.display = "none";
  });
});
