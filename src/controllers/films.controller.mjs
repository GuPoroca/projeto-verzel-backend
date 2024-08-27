import prismaClient from "../utils/prismaClient.mjs";

async function getFavoriteMoviesForUser(userId, movieIds) {
  return await prismaClient.favoriteMovie.findMany({
    where: {
      userId: userId,
      movieId: {
        in: movieIds,
      },
    },
    select: {
      movieId: true,
    },
  });
}

export default class FilmsController {

  async search(request, response) {
    const { searchQuery, userId } = request.body; // Inclua userId na requisição
  
    var filmsSearched;
    const query = searchQuery.replace(/ /g, "%20");
    const url = `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: process.env.TMDB_TOKEN,
      },
    };
  
    try {
      const fetchResponse = await fetch(url, options);
      filmsSearched = await fetchResponse.json();
  
      // Verificar quais filmes são favoritos
      const movieIds = filmsSearched.results.map(movie => movie.id);
      const favoriteMovies = await getFavoriteMoviesForUser(userId, movieIds);
  
      // Mapear os filmes para incluir a informação de favoritos
      const results = filmsSearched.results.map(movie => ({
        ...movie,
        isFavorite: favoriteMovies.some(fav => fav.movieId === movie.id),
      }));
  
      response.send({
        result: {
          ...filmsSearched,
          results,
        },
      });
    } catch (err) {
      console.error("error:" + err);
      response.status(500).send({ error: 'An error occurred' });
    }
  }

  async test(request, response) {
    return "teste";
  }

  async favorite(request, response) {
    const movie = request.body;
    const logged_user = request.logged_user;

    const user = await prismaClient.user.findUnique({
      where: { id: logged_user.id },
    });

    if (!user) {
      return response.status(400).send({ error: "User ID is not valid" });
    }

    let existingMovie = await prismaClient.movie.findUnique({
      where: { id: movie.id },
    });

    // Se o filme não existe, cria um novo
    if (!existingMovie) {
      existingMovie = await prismaClient.movie.create({
        data: {
          id: movie.id,
          name: movie.name,
          rating: movie.rating,
          image: movie.image,
        },
      });
    }

    // Verifica se a relação de filme favorito já existe para o usuário
    const existingFavorite = await prismaClient.favoriteMovie.findUnique({
      where: {
        userId_movieId: {
          userId: logged_user.id,
          movieId: existingMovie.id,
        },
      },
    });

    // Se a relação já existe, remove a relação de favorito (desfavorita)
    if (existingFavorite) {
      await prismaClient.favoriteMovie.delete({
        where: {
          userId_movieId: {
            userId: logged_user.id,
            movieId: existingMovie.id,
          },
        },
      });

      return response
        .status(200)
        .send({ message: "Movie removed from favorites" });
    }

    // Se a relação não existe, cria a relação de favorito (favorita)
    const favorite = await prismaClient.favoriteMovie.create({
      data: {
        user: { connect: { id: logged_user.id } },
        movie: { connect: { id: existingMovie.id } },
      },
    });

    return response.status(201).send(favorite);
  }

  async favoriteList(request, response) {
    const { hash } = request.params;

    const user = await prismaClient.user.findUnique({
      where: { hash: hash },
      include: {
        favoriteMovies: {
          include: {
            movie: true,
          },
        },
      },
    });

    if (!user) {
      return response.status(404).send({ error: "User not found" });
    }

    const favoriteMoviesList = user.favoriteMovies.map(
      (favorite) => favorite.movie
    );

    return response.status(200).send(favoriteMoviesList);
  }

}
