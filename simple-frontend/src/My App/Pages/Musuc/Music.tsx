import { useRef, useState } from "react"
import { musicData, type Artist, type Genre, type Song } from "./Musiccontant"


const Music = () => {
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null)
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null)
  const [selectedSong, setSelectedSong] = useState<Song | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const artistsRef = useRef<HTMLDivElement>(null)
  const songsRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  const filteredGenres = musicData
    .map((genre) => ({
      ...genre,
      artists: genre.artists
        .map((artist) => ({
          ...artist,
          songs: artist.songs.filter((song) =>
            song.title.toLowerCase().includes(searchTerm.toLowerCase())
          ),
        }))
        .filter((artist) => artist.songs.length > 0),
    }))
    .filter((genre) => genre.artists.length > 0)

  const genresToShow = searchTerm ? filteredGenres : musicData

  const scrollToArtists = () => {
    setTimeout(() => {
      if (artistsRef.current) {
        artistsRef.current.scrollIntoView({ behavior: "smooth" })
      }
    }, 100)
  }

  const scrollToSongs = () => {
    setTimeout(() => {
      if (songsRef.current) {
        songsRef.current.scrollIntoView({ behavior: "smooth" })
      }
    }, 100)
  }

  const scrollToModal = () => {
    setTimeout(() => {
      if (modalRef.current) {
        modalRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }, 100)
  }

  return (
    <div
      className="pt-25 min-h-screen text-white p-8 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')",
      }}
    >
      <h1 className="text-5xl font-extrabold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-indigo-500">
        Music Explorer
      </h1>

      {/* Search */}
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Search your favorite songs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-6 py-3 w-full max-w-lg rounded-full bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
        />
      </div>

      {/* Genres */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {genresToShow.map((genre) => (
          <div
            key={genre.name}
            onClick={() => {
              setSelectedGenre(genre)
              setSelectedArtist(null)
              setSelectedSong(null)
              scrollToArtists()
            }}
            className={`relative cursor-pointer rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-105 ${
              selectedGenre?.name === genre.name ? "ring-4 ring-pink-500" : ""
            }`}
          >
            <img
              src={genre.coverImage}
              alt={genre.name}
              className="w-full h-48 object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gray-800 bg-opacity-50 flex flex-col justify-center items-center p-4">
              <h2 className="text-2xl font-bold text-white">{genre.name}</h2>
              <p className="text-sm text-gray-300 text-center mt-2">{genre.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Artists */}
      {selectedGenre && (
        <div ref={artistsRef} className="mb-10">
          <h2 className="text-3xl font-semibold mb-6 text-center text-pink-400">{selectedGenre.name} Artists</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {selectedGenre.artists.map((artist) => (
              <div
                key={artist.name}
                onClick={() => {
                  setSelectedArtist(artist)
                  setSelectedSong(null)
                  scrollToSongs()
                }}
                className="cursor-pointer bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-all transform hover:scale-105"
              >
                <h3 className="text-xl font-bold text-white">{artist.name}</h3>
                <p className="text-sm text-gray-300 mt-2">{artist.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Songs */}
      {selectedArtist && (
        <div ref={songsRef} className="mb-10 max-w-5xl mx-auto">
          <h2 className="text-3xl font-semibold mb-6 text-center text-pink-400">{selectedArtist.name}'s Songs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {selectedArtist.songs.map((song) => (
              <div
                key={song.title}
                onClick={() => {
                  setSelectedSong(song)
                  scrollToModal()
                }}
                className="cursor-pointer bg-gray-800 rounded-lg p-4 hover:bg-pink-600 transition-all transform hover:scale-105"
              >
                <p className="text-white font-medium">{song.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
{selectedSong && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4"
    onClick={() => setSelectedSong(null)}
  >
    <div
      className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto flex flex-col relative"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close Button */}
      <button
        className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white text-2xl font-bold hover:text-pink-500 transition"
        onClick={() => setSelectedSong(null)}
      >
        ×
      </button>

      {/* Song Title */}
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 text-center sm:text-left">
        {selectedSong.title}
      </h2>

      {/* Responsive YouTube */}
      <div className="w-full">
        <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
            src={`https://www.youtube.com/embed/${selectedSong.youtubeId}?rel=0&modestbranding=1&playsinline=1`}
            title={selectedSong.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  </div>
)}



    </div>
  )
}

export default Music
