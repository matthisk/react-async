import React, { Component, Fragment } from "react"
import Async from "react-async"
import "./App.css"

const apiRoot = "https://api.tmdb.org/3"
const apiKey = "aac95dd4fa440999d92dcc8191cab0ee"

const delay = ms => value => new Promise(resolve => setTimeout(resolve, ms, value))

const fetchMovies = () =>
  fetch(`${apiRoot}/movie/popular?api_key=${apiKey}`)
    .then(res => (res.ok ? res : Promise.reject(res)))
    .then(res => res.json())
    .then(data => data.results)
    .then(delay(500))

const fetchMovieDetails = ({ id }) =>
  fetch(`${apiRoot}/movie/${id}?api_key=${apiKey}`)
    .then(res => (res.ok ? res : Promise.reject(res)))
    .then(res => res.json())
    .then(delay(500))

const fetchMovieReviews = ({ id }) =>
  fetch(`${apiRoot}/movie/${id}/reviews?api_key=${apiKey}`)
    .then(res => (res.ok ? res : Promise.reject(res)))
    .then(res => res.json())
    .then(data => data.results)
    .then(delay(1500))

const iconRoot = "https://staticv2-4.rottentomatoes.com/static/images/icons/"
const iconFile = {
  certified_fresh: "CF_16x16.png",
  fresh: "fresh-16.png",
  upright: "popcorn-16.png",
  rotten: "splat-16.png",
  spilled: "badpopcorn-16.png",
  wts: "wts-16.png",
}

const Movie = ({ title, vote_average, release_date, onSelect, overview, backdrop_path }) => (
  <div
    className="Movie"
    onClick={onSelect}
    style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w500${backdrop_path})` }}
  >
    <div className="content">
      <span className="title">{title}</span>
      <span className="info">
        {vote_average * 10}% · {release_date}
      </span>
      <span className="desc">{overview}</span>
    </div>
  </div>
)

const TopMovies = ({ handleSelect }) => (
  <Fragment>
    <h1>
      Top Box Office{" "}
      <span role="img" aria-label="">
        🍿
      </span>
    </h1>
    <Async promiseFn={fetchMovies}>
      <Async.Loading>
        <p>Loading...</p>
      </Async.Loading>
      <Async.Resolved>
        {movies =>
          movies.map(movie => <Movie {...movie} key={movie.id} onSelect={handleSelect(movie)} />)
        }
      </Async.Resolved>
    </Async>
  </Fragment>
)

const Review = ({ author, content }) => (
  <div className="review">
    <p>{content}</p>
    <small>{author}</small>
  </div>
)

const Image = props => {
  const loadImage = src =>
    new Promise(resolve => {
      const image = new Image()
      image.onload = () => resolve(src)
      image.src = props.src
    })
  return <img {...props} />
}

const Details = ({ onBack, id }) => (
  <div className="Details">
    <button onClick={onBack}>
      <span role="img" aria-label="Back">
        👈
      </span>
    </button>
    <Async promiseFn={fetchMovieDetails} id={id} onResolve={console.log}>
      <Async.Loading>
        <p>Loading...</p>
      </Async.Loading>
      <Async.Resolved>
        {movie => (
          <Fragment>
            <div className="main">
              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt=""
                style={{ borderRadius: 5 }}
              />
              <div className="info">
                <h1>{movie.title}</h1>
                <div className="ratings">
                  <div className="rating">
                    <div className="title">Rating</div>
                    <div className="score">{movie.vote_average * 10}%</div>
                  </div>
                </div>
                <div className="rating">
                  <p>{movie.overview}</p>
                </div>
              </div>
            </div>
            <div className="reviews">
              <Async promiseFn={fetchMovieReviews} id={id} onResolve={console.log}>
                <Async.Loading>
                  <p>Loading...</p>
                </Async.Loading>
                <Async.Resolved>{reviews => reviews.map(Review)}</Async.Resolved>
              </Async>
            </div>
          </Fragment>
        )}
      </Async.Resolved>
    </Async>
  </div>
)

class App extends Component {
  state = { selectedMovie: undefined }
  select = movie => () => this.setState({ selectedMovie: movie.id })
  render() {
    const { selectedMovie } = this.state
    return (
      <div className="App">
        {selectedMovie ? (
          <Details id={selectedMovie} onBack={this.select({})} />
        ) : (
          <TopMovies handleSelect={this.select} />
        )}
      </div>
    )
  }
}

export default App
