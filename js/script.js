const api = "39008b197a5755859d6786a809d485be";

const popularShowUrl = `https://api.themoviedb.org/3/discover/tv?api_key=${api}&language=en-US&sort_by=popularity.desc&page=`;
const searchUrl = `https://api.themoviedb.org/3/search/tv?api_key=${api}&language=en-US&page=1&query=`;
const imgUrl = "http://image.tmdb.org/t/p/w1280";

const cardEl = document.querySelector(".card");
const modalEl = document.querySelector(".modal");
const formEl = document.querySelector(".form");
const searchEl = document.querySelector(".search");
const backBtn = document.querySelector(".back-btn");
const loadMoreBtn = document.querySelector(".more-btn");

let page = 1;

let ff = false;

async function fetchDetails(id) {
  const details = await (
    await fetch(
      `https://api.themoviedb.org/3/tv/${id}?api_key=${api}&language=en-US`
    )
  ).json();

  const genresArr = details.genres.map((genres) => genres.name);

  const modalInnerEl = document.createElement("div");
  modalInnerEl.classList.add("modal-inner");

  modalInnerEl.innerHTML = `
    <div class="modal-btn">
      <button type="button">&times;</button>
    </div>
    <div class="modal-bg">
      <img src=${
        details.backdrop_path === null
          ? "./img/backdrop-not-found.jpg"
          : imgUrl + details.backdrop_path
      }>
    </div>
    <div class="modal-text">
      <div class="name">
        <span>${details.vote_average}</span>
        <h2>${details.name}</h2>
        <p>(${
          details.first_air_date === ""
            ? ""
            : details.first_air_date.slice(0, 4)
        })</p>
      </div>
      <div class="genres">${genresArr === [] ? "" : genresArr.join(", ")}</div>
      <div class="overview">${details.overview}</div>
      <div class="more-info">
        <div>Country: ${
          details.origin_country[0] === undefined
            ? "Not Found"
            : details.origin_country[0]
        }</div>
        <div>Status: ${details.status}</div>
        <div>Seasons: ${details.seasons.length}</div>
      </div>
    </div>
  `;

  modalEl.appendChild(modalInnerEl);
  modalEl.classList.add("show-modal");
  document.body.style.overflow = "hidden";

  document.querySelector(".modal-btn button").addEventListener("click", () => {
    modalEl.innerHTML = "";
    modalEl.classList.remove("show-modal");
    document.body.style.overflow = "auto";
  });
}

async function fetchShow(url) {
  const data = await (await fetch(url)).json();

  data.results.forEach((show) => {
    const cardInnerEl = document.createElement("div");
    cardInnerEl.classList.add("card-inner");

    cardInnerEl.innerHTML = `
      <img src=${
        show.poster_path === null
          ? "./img/poster-not-found.jpg"
          : imgUrl + show.poster_path
      } class="card-img">
      <div class="card-name">${show.name}</div>
    `;

    cardEl.appendChild(cardInnerEl);

    cardInnerEl.addEventListener("click", (e) => {
      if (e.target.className === "card-img") {
        fetchDetails(show.id);
      }
    });
  });
}

fetchShow(popularShowUrl);

formEl.addEventListener("submit", (e) => {
  e.preventDefault();

  cardEl.innerHTML = "";

  if (searchEl.value) {
    fetchShow(searchUrl + searchEl.value);
    searchEl.value = "";
  }

  backBtn.parentElement.style.display = "block";
  loadMoreBtn.parentElement.style.display = "none";

  backBtn.addEventListener("click", () => {
    cardEl.innerHTML = "";

    backBtn.parentElement.style.display = "none";
    loadMoreBtn.parentElement.style.display = "block";

    fetchShow(popularShowUrl);

    page = 1;
  });
});

loadMoreBtn.addEventListener("click", () => {
  page++;

  fetchShow(popularShowUrl + page);
});
