let idGeneroAntes;
let idProviderAntes;
let selectedGenreId = null;

function getMovies(idGenero, idProvider) {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  let url = "https://api.themoviedb.org/3/discover/movie?api_key=4786cbeb3613782a4448fef983384b30&language=es-ES&watch_region=ES";
  if (idGenero) {
    url += "&with_genres=" + idGenero;

    if (idGenero != idGeneroAntes) {
      let genId = "gen-" + idGenero;
      document.getElementById(genId).classList.add("bg-sky-500", "text-white");

      if (idGeneroAntes) {
        let idAntes = "gen-" + idGeneroAntes;
        document.getElementById(idAntes).classList.remove("bg-sky-500", "text-white");
      }
    }

    // necesito guardar el id pulsado ahora, fuera de la funcion
    idGeneroAntes = idGenero;
    getWatchProviders();
  }

  if (idProvider) {
    url += "&with_watch_providers=" + idProvider;

    if (idProvider != idProviderAntes) {
      let provId = "prov-" + idProvider;
      document.getElementById(provId).classList.add("border-sky-500", "border-4");

      if (idProviderAntes) {
        let idAntesProv = "prov-" + idProviderAntes;
        document.getElementById(idAntesProv).classList.remove("border-sky-500", "border-4");
      }
    }

    idProviderAntes = idProvider;
    getGenres();
  }

  fetch(url, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      document.getElementById("pelis").innerHTML = "";
      for (const show of result.results) {
        document.getElementById("pelis").innerHTML += ` <div class="bg-white rounded-lg shadow-lg hover:scale-110">
      
              <img class="h-[277px] w-full object-cover rounded-t-lg" src="https://image.tmdb.org/t/p/w500${show.poster_path}" alt="">
      
              <div class="p-4">
                  <a class="font-semibold hover:text-sky-500" href="#">${show.title}</a>
                  <p class="text-slate-500">${show.release_date}</p>
              </div>
      
          </div>`;
      }
    })
    .catch((error) => console.log("error", error));
}

getMovies();

function getGenres() {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  fetch("https://api.themoviedb.org/3/genre/movie/list?api_key=4786cbeb3613782a4448fef983384b30&language=es", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      const genresElement = document.getElementById("generostv");
      let buttonsHTML = "";

      for (const genero of result.genres) {
        const buttonId = `gen-${genero.id}`;
        const buttonClass = genero.id == selectedGenreId ? "m-1 py-1 px-3 border border-slate-300 rounded-full hover:bg-sky-500 bg-sky-500 text-white hover:text-white" : "m-1 py-1 px-3 border border-slate-300 rounded-full hover:bg-sky-500 hover:text-white";

        buttonsHTML += `<button id="${buttonId}" onclick="handleGenreClick(${genero.id}, ${idProviderAntes}, '${buttonId}')" class="${buttonClass}">
            ${genero.name}
        </button>`;
      }

      genresElement.innerHTML = buttonsHTML;
    })
    .catch((error) => console.log("error", error));
}

function handleGenreClick(genreId, providerId, buttonId) {
  const buttonElement = document.getElementById(buttonId);

  if (genreId == selectedGenreId) {
    // Deseleccionar el botón actual
    buttonElement.classList.remove("bg-sky-500");
    buttonElement.classList.remove("text-white");
    selectedGenreId = null;
    getMovies();
  } else {
    // Desactivar el botón anteriormente seleccionado (si existe)
    const previousButton = document.getElementById(`gen-${selectedGenreId}`);
    if (previousButton) {
      previousButton.classList.remove("bg-sky-500");
      previousButton.classList.remove("text-white");
    }

    // Seleccionar el nuevo botón
    buttonElement.classList.add("bg-sky-500");
    buttonElement.classList.add("text-white");
    selectedGenreId = genreId;
    getMovies(genreId, providerId);
  }
}

getGenres();

function getWatchProviders() {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  fetch("https://api.themoviedb.org/3/watch/providers/tv?api_key=4786cbeb3613782a4448fef983384b30&language=es-ES&watch_region=ES", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      const providersElement = document.getElementById("providers");
      providersElement.innerHTML = "";

      for (const provider of result.results) {
        const buttonId = `prov-${provider.provider_id}`;
        const buttonClass = idProviderAntes == provider.provider_id ? "border m-1 rounded-lg border-sky-500" : "border m-1 rounded-lg";

        providersElement.innerHTML += `<button id="${buttonId}" onclick="handleButtonClick(${idGeneroAntes}, ${provider.provider_id}, '${buttonId}')" class="${buttonClass}">
            <img class="w-12 h-12 rounded-lg" src="https://www.themoviedb.org/t/p/original/${provider.logo_path}" alt="">
        </button>`;
      }
    })
    .catch((error) => console.log("error", error));
}

function handleButtonClick(idGenero, providerId, buttonId) {
  const buttonElement = document.getElementById(buttonId);
  const isButtonClicked = buttonElement.classList.contains("border-sky-500");

  if (isButtonClicked) {
    buttonElement.classList.remove("border-sky-500");
    getMovies(); // Llamar a la función getTvShow sin parámetros
  } else {
    buttonElement.classList.add("border-sky-500");
    getMovies(idGenero, providerId); // Llamar a la función getTvShow con parámetros
  }
}

getWatchProviders();

