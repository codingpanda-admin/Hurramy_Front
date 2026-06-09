import { Link } from 'react-router-dom';
import Header from '../components/Header';

const characters = [
  '/img/short_drama/short_drama_character_1.jpg',
  '/img/short_drama/short_drama_character_2.jpg',
  '/img/short_drama/short_drama_character_3.jpg',
  '/img/short_drama/short_drama_character_4.jpg',
  '/img/short_drama/short_drama_character_5.jpg',
];

function ShortDramas() {
  return (
    <div className="short-dramas-page">
      <Header />
      <main className="short-dramas-main">
        <div className="short-dramas-frame">
          <h1>Meet our virtual actors.</h1>
          <div className="short-dramas-character-grid">
            {characters.map((src, index) => (
              <article className="short-dramas-character-card" key={src}>
                <img src={src} alt={`Short drama character ${index + 1}`} loading="lazy" />
              </article>
            ))}
          </div>
        </div>
        <Link to="/" className="btn primary short-dramas-home-link">
          Back to Home
        </Link>
      </main>
    </div>
  );
}

export default ShortDramas;
