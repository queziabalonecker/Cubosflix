const movies = document.querySelector('.movies');
const bodyHTML = document.querySelector('body');

const themeButton = document.querySelector('.btn-theme');
themeButton.addEventListener('click', () => {
  bodyHTML.classList.toggle('darkthemeBody');

  const subtitle = document.querySelector('.subtitle');
  subtitle.classList.toggle('darkThemeSub');

  const highlightInfo = document.querySelector('.highlight__info');
  highlightInfo.classList.toggle('darktheme__highligth_info');

  const input = document.querySelector('.input');
  input.classList.toggle('darkthemeBody');

  const btnNext = document.querySelector('.btn-next');
  const btnPrev = document.querySelector('.btn-prev');

  if (bodyHTML.classList.contains('darkthemeBody')) {
    themeButton.src = './assets/dark-mode.svg';
    btnNext.src = './assets/seta-direita-branca.svg';
    btnPrev.src = './assets/seta-esquerda-branca.svg';
  } else {
    themeButton.src = './assets/light-mode.svg';
    btnNext.src = './assets/seta-direita-preta.svg';
    btnPrev.src = './assets/seta-esquerda-preta.svg';
  }
});

async function returnMovies() {
  const moviesPromise = await fetch(
    'https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false'
  );
  const body = await moviesPromise.json();
  return body.results;
}
const arrayMovies = returnMovies();
let movieDivs = [];

function createElements(body) {
  for (let i = 0; i < body.length; i++) {
    let item = body[i];

    const movie = document.createElement('div');
    movie.classList.add('movie');
    movie.id = `${item.id}`;
    movie.style.backgroundImage = `url(${item.poster_path})`;

    const movieInfo = document.createElement('div');
    movieInfo.classList.add('movie__info');
    movie.append(movieInfo);

    const movieTitle = document.createElement('span');
    movieTitle.textContent = item.title;
    movieTitle.classList.add('movie__title');

    const star = document.createElement('img');
    star.src = './assets/estrela.svg';

    const rating = item.vote_average;

    const movieRating = document.createElement('span');
    movieRating.classList.add('movie__rating');
    movieRating.append(star, rating);

    movieInfo.append(movieTitle, movieRating);
    movieDivs.push(movie);
  }
}

arrayMovies.then((arrayMovies) => {
  createElements(arrayMovies);
  const elementsPerPage = 5;
  const state = {
    page: 0,
    elementsPerPage,
    totalPages: Math.ceil(movieDivs.length / elementsPerPage),
  };
  const controls = {
    next() {
      state.page++;

      const lastpage = state.page === state.totalPages;
      if (lastpage) {
        state.page = 0;
      }
    },
    prev() {
      state.page--;

      const firstPage = state.page < 0;
      if (firstPage) {
        state.page = Math.ceil(movieDivs.length / elementsPerPage) - 1;
      }
    },
  };
  const next = document.querySelector('.btn-next');
  next.addEventListener('click', () => {
    controls.next();
    paginateItems();
  });
  const prev = document.querySelector('.btn-prev');
  prev.addEventListener('click', () => {
    controls.prev();
    paginateItems();
  });

  function paginateItems() {
    movies.innerHTML = '';
    let start = state.page * state.elementsPerPage;
    let end = start + state.elementsPerPage;
    state.totalPages = Math.ceil(movieDivs.length / elementsPerPage);
    const listedItems = movieDivs.slice(start, end);

    listedItems.forEach((movie) => {
      movies.append(movie);
    });
    waitForModal();
  }
  paginateItems();

  const inputBusca = document.querySelector('.input');
  inputBusca.addEventListener('keyup', async (event) => {
    if (event.key !== 'Enter') {
      return;
    }
    movieDivs = [];
    const moviesPromise = await fetch(
      `https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${inputBusca.value}`
    );
    const body = await moviesPromise.json();

    createElements(body.results);
    state.page = 0;
    inputBusca.value = '';
    paginateItems();
  });

  function waitForModal() {
    const movie = document.querySelectorAll('.movie');
    const modal = document.querySelector('.modal');
    const btnClose = document.querySelector('.modal__close');
    btnClose.addEventListener('click', () => {
      modal.classList.add('hidden');
    });

    movie.forEach((item) => {
      item.addEventListener('click', async (event) => {
        modal.classList.remove('hidden');

        const searchById = await fetch(
          `https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${event.target.id}?language=pt-BR`
        );
        const movie = await searchById.json();

        const title = document.querySelector('.modal__title');
        title.textContent = movie.title;
        const modalImage = document.querySelector('.modal__img');
        modalImage.src = movie.backdrop_path;
        const description = document.querySelector('.modal__description');
        description.textContent = movie.overview;
        const rating = document.querySelector('.modal__average');
        rating.textContent = movie.vote_average;

        const modalGenres = document.querySelector('.modal__genres');
        modalGenres.innerHTML = '';

        movie.genres.forEach((genre) => {
          const modalGenre = document.createElement('span');
          modalGenre.classList.add('modal__genre');
          modalGenre.textContent = genre.name;
          modalGenres.append(modalGenre);
        });
      });
    });
  }
});

async function showHighligth() {
  const promiseBody = await fetch(
    'https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR'
  );
  const body = await promiseBody.json();

  const promiseVideo = await fetch(
    'https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR'
  );
  const videoInfo = await promiseVideo.json();

  const videoLink = document.querySelector('.highlight__video-link');
  videoLink.href = `https://www.youtube.com/watch?v=${videoInfo.results[0].key}`;

  const divVideo = document.querySelector('.highlight__video');
  divVideo.style.backgroundImage = `url(${body.backdrop_path})`;

  const title = document.querySelector('.highlight__title');
  title.textContent = body.title;

  const rating = document.querySelector('.highlight__rating');
  rating.textContent = body.vote_average;

  const genre = document.querySelector('.highlight__genres');
  const genres = [];
  body.genres.forEach((item) => {
    genres.push(item.name);
  });
  genre.textContent = genres.join(', ');

  const dateLaunch = document.querySelector('.highlight__launch');
  const meses = [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez',
  ];
  let data = new Date(body.release_date);
  let dataFormatada = data.getDate() + ' ' + meses[data.getMonth()] + ' ' + data.getFullYear();
  dateLaunch.textContent = `/ ${dataFormatada}`;

  const description = document.querySelector('.highlight__description');
  description.textContent = body.overview;
}
showHighligth();
