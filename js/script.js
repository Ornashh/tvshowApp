const popularShowUrl =
  "https://api.themoviedb.org/3/discover/tv?api_key=39008b197a5755859d6786a809d485be&language=en-US&sort_by=popularity.desc&page=";
const imgUrl = "http://image.tmdb.org/t/p/w1280";
const searchUrl =
  "https://api.themoviedb.org/3/search/tv?api_key=39008b197a5755859d6786a809d485be&language=en-US&page=1&query=";

const cardEl = document.querySelector(".card");
const modalEl = document.querySelector(".modal");
const formEl = document.querySelector(".form");
const searchEl = document.querySelector(".search");
const backBtn = document.querySelector(".back-btn");
const pagination = document.querySelector(".pagination");
const paginationInner = document.querySelector(".pagination ul");

async function fetchDetails(id) {
  const response = await fetch(
    `https://api.themoviedb.org/3/tv/${id}?api_key=39008b197a5755859d6786a809d485be&language=en-US`
  );
  const details = await response.json();

  const genresArr = [];

  details.genres.forEach((genres) => {
    genresArr.push(genres.name);
  });

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
  const response = await fetch(url);
  const show = await response.json();

  displayShow(show.results);
}

function displayShow(query) {
  cardEl.innerHTML = "";

  query.forEach((show) => {
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

  if (searchEl.value) {
    fetchShow(searchUrl + searchEl.value);
    searchEl.value = "";
  }

  backBtn.style.display = "block";
  pagination.style.display = "none";

  backBtn.addEventListener("click", () => {
    backBtn.style.display = "none";
    pagination.style.display = "block";
    paginationInner.innerHTML = createPagination(totalPages, page);
  });
});

let totalPages = 500;
let page = 1;

function createPagination(totalPages, page) {
  let liTag = "";
  let active;
  let beforePage = page - 1;
  let afterPage = page + 1;

  if (page > 1) {
    liTag += `<li class="btn prev" onclick="createPagination(totalPages, ${
      page - 1
    })"><span><i class="fas fa-angle-left"></i></span></li>`;
    fetchShow(popularShowUrl + page);
  }

  if (page > 2) {
    liTag += `<li class="first numb" onclick="createPagination(totalPages, 1)"><span>1</span></li>`;
    if (page > 3) {
      liTag += `<li class="dots"><span>...</span></li>`;
    }
  }

  if (page == totalPages) {
    beforePage = beforePage - 2;
  } else if (page == totalPages - 1) {
    beforePage = beforePage - 1;
  }

  if (page == 1) {
    afterPage = afterPage + 2;
  } else if (page == 2) {
    afterPage = afterPage + 1;
  }

  for (let plength = beforePage; plength <= afterPage; plength++) {
    if (plength > totalPages) {
      continue;
    }
    if (plength == 0) {
      plength = plength + 1;
    }
    if (page == plength) {
      active = "active";
    } else {
      active = "";
    }
    liTag += `<li class="numb ${active}" onclick="createPagination(totalPages, ${plength})"><span>${plength}</span></li>`;
  }

  if (page < totalPages - 1) {
    if (page < totalPages - 2) {
      liTag += `<li class="dots"><span>...</span></li>`;
    }
    liTag += `<li class="last numb" onclick="createPagination(totalPages, ${totalPages})"><span>${totalPages}</span></li>`;
  }

  if (page < totalPages) {
    liTag += `<li class="btn next" onclick="createPagination(totalPages, ${
      page + 1
    })"><span><i class="fas fa-angle-right"></i></span></li>`;
    fetchShow(popularShowUrl + page);
  }
  paginationInner.innerHTML = liTag;
  return liTag;
}

paginationInner.innerHTML = createPagination(totalPages, page);
