import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMoviesCredits } from '../../services/fetch-service';
import ImageError from '../../components/ImageError/ImageError';
import '../Cast/Cast.scss';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useMediaQuery } from 'react-responsive';

const Status = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

function Cast({ loader }) {
  const { movieId } = useParams();
  const [cast, setCast] = useState(null);
  const [error, setError] = useState(null);
  const [spinner, setSpinner] = useState(false);
  const [, setStatus] = useState(Status.PENDING);

  const zoom = useMediaQuery({ query: '(max-width: 768px)' });

  useEffect(() => {
    setStatus(Status.PENDING);
    setSpinner(true);
    const fetchMovieCast = async function () {
      try {
        const response = await fetchMoviesCredits(movieId);
        setStatus(Status.RESOLVED);
        setCast(response.cast);
      } catch (error) {
        setStatus(Status.REJECTED);
        setError(error);
      } finally {
        setSpinner(false);
      }
    };

    fetchMovieCast();
  }, [movieId]);

  const settings = {
    dots: zoom ? false : true,
    infinite: true,
    speed: 500,
    slidesToShow: zoom ? 1 : 4,
    slidesToScroll: zoom ? 1 : 3,
    arrows: true,
  };

  return (
    <>
      {Status.PENDING && spinner && loader}
      {Status.RESOLVED && cast && (
        <div className="cast-container">
          <ul className="cast-list">
            <Slider {...settings} width="500px" className="cast-slider">
              {cast.map(cast => (
                <li key={cast.id}>
                  {
                    <div className="cast-image">
                      {cast.profile_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/original/${cast.profile_path}`}
                          width="100"
                          alt={cast.name}
                        />
                      ) : (
                        <ImageError width={100} height={150} />
                      )}
                      <h3 className="cast-name">{cast.name}</h3>
                      <p className="cast-character">
                        Character: {cast.character}
                      </p>
                    </div>
                  }
                </li>
              ))}
            </Slider>
          </ul>
        </div>
      )}
      {Status.REJECTED && error && (
        <p className="home-error">This text has already been found!</p>
      )}
    </>
  );
}

export default Cast;
