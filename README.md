<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a id="readme-top"></a>

<!-- PROJECT SHIELDS -->
<div align="center">

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

</div>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/cbregoffid/game-finder">
    <img src="images/logo.png" alt="Game Finder Logo" width="400">
  </a>

<h3 align="center">Game Finder</h3>
  <p align="center">
    Game Finder is an AI-powered game recommendation engine that finds games matching your mood. Describe the vibe you're looking for using adjectives and your favorite reference titles, and let the app do the rest.
    <br />
    <br />
    <a href="https://game-finder-six.vercel.app">View Demo</a>
    &middot;
    <a href="https://github.com/cbregoffid/game-finder/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    &middot;
    <a href="https://github.com/cbregoffid/game-finder/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>


<!-- ABOUT THE PROJECT -->
## About The Project

[![Game Finder Screenshot][product-screenshot]](https://game-finder-six.vercel.app)

Game Finder uses OpenAI text embeddings and Pinecone vector search to recommend games based on semantic similarity rather than genre tags. Users enter mood adjectives and reference titles they enjoy, which are then converted into mathematical vectors and averaged into a single query point. Pinecone then searches a database of 2,000+ pre-embedded games to find the closest matches.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* [![React][React.js]][React-url]
* [![Python][Python]][Python-url]
* [![FastAPI][FastAPI]][FastAPI-url]
* [![OpenAI][OpenAI]][OpenAI-url]
* [![Pinecone][Pinecone]][Pinecone-url]
* [![Vite][Vite]][Vite-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

* Python 3.11+ — [python.org](https://python.org)
* Node.js (LTS) — [nodejs.org](https://nodejs.org)
* npm (comes with Node.js)

### Installation

1. Clone the repo
```sh
   git clone https://github.com/cbregoffid/game-finder.git
```

2. Set up environment variables

   Create a `.env` file in the `backend` folder:
```sh
   TWITCH_CLIENT_ID=your_twitch_client_id
   TWITCH_CLIENT_SECRET=your_twitch_client_secret
   OPENAI_API_KEY=your_openai_api_key
   PINECONE_API_KEY=your_pinecone_api_key
```

   > Get your Twitch credentials at [dev.twitch.tv](https://dev.twitch.tv), OpenAI key at [platform.openai.com](https://platform.openai.com), and Pinecone key at [pinecone.io](https://pinecone.io)

   Create a `.env.local` file in the `frontend` folder:
```sh
   VITE_API_URL=http://localhost:8000
```

3. Create and activate a Python virtual environment
```sh
   python -m venv venv
```
   On macOS/Linux:
```sh
   source venv/bin/activate
```
   On Windows (PowerShell):
```sh
   .\venv\Scripts\Activate.ps1
```

4. Install Python dependencies
```sh
   cd backend
   pip install -r requirements.txt
```

5. Create a Pinecone index
   - Go to [pinecone.io](https://pinecone.io) and create a new index
   - Name it `game-finder`
   - Set dimensions to `1536` and metric to `cosine`
   - This project uses OpenAI's `text-embedding-3-small` model, which outputs 1536-dimensional vectors — make sure your index matches this dimension

6. Populate the vector database
```sh
   cd scripts
   python embed_games.py
   python patch_metadata.py
```
   > This may take 10-30 minutes depending on how many games you choose to embed. `patch_metadata.py` adds franchise data needed for sequel filtering.

7. Install frontend dependencies
```sh
   cd ../../frontend
   npm install
```

8. Start the backend server (from the `backend` folder)
```sh
   cd ../backend
   uvicorn main:app --reload
```

9. Start the frontend (in a new terminal)
```sh
   cd ../frontend
   npm run dev
```

   The app will be available at `http://localhost:5173`

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE -->
## Usage

1. From the landing page, click **Start** to begin or **Settings** to configure preferences such as platform filters.

2. On the adjectives page, enter at least one adjective in the search box that describes the atmosphere or vibe of the game you are looking for. For example, someone looking for a souls-like experience might enter *punishing*, *methodical*, and *intense*. Click the **✕** button on any chip to remove an adjective. Click **Next** when ready.

3. On the games page, click any of the three boxes to open a search bar and enter a reference game title. You need at least one reference game to proceed. Click **Next** when ready.

4. Your results will appear on the final page. Scroll down and click **Load More** to see additional titles. Use the **Filter** button to exclude sequels or games related to your reference titles, or click **Start Over** to begin a new search.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

- [x] Platform filter
- [x] Sequel/franchise filtering
- [ ] Fix franchise detection edge cases (e.g. Elden Ring / Night Reign not grouped)
- [ ] Merge duplicate game entries across platforms (e.g. Skyrim Switch & Skyrim)
- [ ] Add platform info tooltip (hover "i" icon) on result cards
- [ ] Add ratings, review counts, cover images, genres, and IGDB/Steam links to result cards
- [ ] Stricter adjective validation (descriptive words only)
- [ ] Add sort feature to results page
- [ ] Add About page explaining how the app works
- [ ] Allow users to share results via a unique URL
- [ ] Weighted vector search for more accurate results
- [ ] Sound effects on interactions
- [ ] Cache frequent searches for faster load times
- [ ] Image-based search for a certain type of atmosphere/vibe using game screenshots
- [ ] Additional theme options in Settings
- [ ] VR platform filter option

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are welcome! If you have a suggestion, feel free to fork the repo and create a pull request or open an issue with the tag "enhancement".

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Colton Bregoff — [LinkedIn](https://linkedin.com/in/colton-bregoff) — cbregoffid@gmail.com

Project Link: [https://github.com/cbregoffid/game-finder](https://github.com/cbregoffid/game-finder)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [IGDB API](https://api-docs.igdb.com/) — game data and cover images
* [OpenAI](https://openai.com/) — text embeddings
* [Pinecone](https://pinecone.io/) — vector database
* [Datamuse API](https://www.datamuse.com/api/) — adjective suggestions
* [Best README Template](https://github.com/othneildrew/Best-README-Template)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
[contributors-shield]: https://img.shields.io/github/contributors/cbregoffid/game-finder.svg?style=for-the-badge
[contributors-url]: https://github.com/cbregoffid/game-finder/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/cbregoffid/game-finder.svg?style=for-the-badge
[forks-url]: https://github.com/cbregoffid/game-finder/network/members
[stars-shield]: https://img.shields.io/github/stars/cbregoffid/game-finder.svg?style=for-the-badge
[stars-url]: https://github.com/cbregoffid/game-finder/stargazers
[issues-shield]: https://img.shields.io/github/issues/cbregoffid/game-finder.svg?style=for-the-badge
[issues-url]: https://github.com/cbregoffid/game-finder/issues
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/colton-bregoff
[product-screenshot]: images/screenshot.png
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Python]: https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white
[Python-url]: https://python.org/
[FastAPI]: https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white
[FastAPI-url]: https://fastapi.tiangolo.com/
[OpenAI]: https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white
[OpenAI-url]: https://openai.com/
[Pinecone]: https://img.shields.io/badge/Pinecone-000000?style=for-the-badge&logo=pinecone&logoColor=white
[Pinecone-url]: https://pinecone.io/
[Vite]: https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white
[Vite-url]: https://vitejs.dev/
