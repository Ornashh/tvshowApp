const popularShowUrl =
  "https://api.themoviedb.org/3/discover/tv?api_key=39008b197a5755859d6786a809d485be&language=en-US&sort_by=popularity.desc&page=";
const imgUrl = "http://image.tmdb.org/t/p/w1280";
const searchUrl =
  "https://api.themoviedb.org/3/search/tv?api_key=39008b197a5755859d6786a809d485be&language=en-US&page=1&query=";
const genresUrl =
  "https://api.themoviedb.org/3/genre/movie/list?api_key=39008b197a5755859d6786a809d485be&language=en-US";

const cardEl = document.querySelector(".card");
const modalEl = document.querySelector(".modal");
const formEl = document.querySelector(".form");
const searchEl = document.querySelector(".search");
const backBtn = document.querySelector(".back-btn");
const pagination = document.querySelector(".pagination");
const paginationInner = document.querySelector(".pagination ul");

// FETCHING FUNCTION
async function fetchShow(url) {
  const response = await fetch(url);
  const data = await response.json();

  displayShow(data.results);
}

function displayShow(query) {
  cardEl.innerHTML = "";

  query.forEach((show) => {
    const cardInnerEl = document.createElement("div");
    cardInnerEl.classList.add("card-inner");

    if (show.poster_path === null) {
      cardInnerEl.innerHTML = `
        <img src="./img/poster-not-found.jpg" class="card-img">
        <div class="card-name">${show.name}</div>
      `;
    } else {
      cardInnerEl.innerHTML = `
        <img src=${imgUrl + show.poster_path} class="card-img">
        <div class="card-name">${show.name}</div>
      `;
    }

    const modalInnerEl = document.createElement("div");
    modalInnerEl.classList.add("modal-inner");

    if (
      show.backdrop_path === null ||
      show.first_air_date === "" ||
      show.origin_country[0] === undefined
    ) {
      modalInnerEl.innerHTML = `
        <div class="modal-btn">
          <button type="button">&times;</button>
        </div>
        <div class="modal-bg">
          <img src="./img/backdrop-not-found.jpg">
        </div>
        <div class="modal-text">
          <div class="name">
            <span>${show.vote_average}</span>
            <h2>${show.name}</h2>
            <p>(Not Found)</p>
          </div>
          <div class="overview">${show.overview}</div>
          <div>Country: Not Found</div>
        </div>
      `;
    } else {
      modalInnerEl.innerHTML = `
        <div class="modal-btn">
          <button type="button">&times;</button>
        </div>
        <div class="modal-bg">
          <img src=${imgUrl + show.backdrop_path}>
        </div>
        <div class="modal-text">
          <div class="name">
            <span>${show.vote_average}</span>
            <h2>${show.name}</h2>
            <p>(${show.first_air_date.slice(0, 4)})</p>
          </div>
          <div class="overview">${show.overview}</div>
          <div>Country: ${show.origin_country[0]}</div>
        </div>
      `;
    }

    cardEl.appendChild(cardInnerEl);

    cardInnerEl.addEventListener("click", (e) => {
      if (e.target.className === "card-img") {
        modalEl.appendChild(modalInnerEl);
        modalEl.classList.add("show-modal");
        document.body.style.overflow = "hidden";
      }

      try {
        document
          .querySelector(".modal-btn button")
          .addEventListener("click", () => {
            modalEl.innerHTML = "";
            modalEl.classList.remove("show-modal");
            document.body.style.overflow = "auto";
          });
      } catch (error) {
        return;
      }
    });
  });
}

fetchShow(popularShowUrl);

// HANDLER SEARCH
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

// PAGINATION
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
