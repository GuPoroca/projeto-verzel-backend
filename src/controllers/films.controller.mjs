

export default class FilmsController {
  async search(request, response) {
    var filmsSearched;
    const {searchQuery} = request.body;
    const query = searchQuery.replace(/ /g, '%20');
    console.log(query);
    
    const url =
      `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: process.env.TMBB_TOKEN,
      },
    };
    await fetch(url, options)
      .then((res) => res.json())
      .then((json) => filmsSearched = json)
      .catch((err) => console.error("error:" + err));
    response.send({
        result: filmsSearched
    });
  }



}
