package com.example.ui

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import androidx.media3.common.MediaItem
import androidx.media3.common.Player
import androidx.media3.exoplayer.ExoPlayer
import com.example.data.*
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class LevelMovieViewModel(application: Application) : AndroidViewModel(application) {
    private val repo = LocalRepository(application)

    // Player for Music
    private var musicPlayer: ExoPlayer? = null

    // Video Player for Movie trailer/stream
    private var videoPlayer: ExoPlayer? = null

    // Home Catalog States
    private val _trendingMovies = MutableStateFlow<List<MovieItem>>(emptyList())
    val trendingMovies = _trendingMovies.asStateFlow()

    private val _trendingTv = MutableStateFlow<List<MovieItem>>(emptyList())
    val trendingTv = _trendingTv.asStateFlow()

    private val _topRated = MutableStateFlow<List<MovieItem>>(emptyList())
    val topRated = _topRated.asStateFlow()

    private val _actionMovies = MutableStateFlow<List<MovieItem>>(emptyList())
    val actionMovies = _actionMovies.asStateFlow()

    private val _sciFiMovies = MutableStateFlow<List<MovieItem>>(emptyList())
    val sciFiMovies = _sciFiMovies.asStateFlow()

    private val _horrorMovies = MutableStateFlow<List<MovieItem>>(emptyList())
    val horrorMovies = _horrorMovies.asStateFlow()

    private val _heroMovie = MutableStateFlow<MovieItem?>(null)
    val heroMovie = _heroMovie.asStateFlow()

    private val _isLoadingHome = MutableStateFlow(true)
    val isLoadingHome = _isLoadingHome.asStateFlow()

    // Search
    private val _searchQuery = MutableStateFlow("")
    val searchQuery = _searchQuery.asStateFlow()

    private val _searchResults = MutableStateFlow<List<MovieItem>>(emptyList())
    val searchResults = _searchResults.asStateFlow()

    private val _isSearching = MutableStateFlow(false)
    val isSearching = _isSearching.asStateFlow()

    private var searchJob: Job? = null

    // Selected Movie Details
    private val _selectedMovie = MutableStateFlow<MovieItem?>(null)
    val selectedMovie = _selectedMovie.asStateFlow()

    private val _movieVideos = MutableStateFlow<List<VideoItem>>(emptyList())
    val movieVideos = _movieVideos.asStateFlow()

    private val _movieCast = MutableStateFlow<List<CastMember>>(emptyList())
    val movieCast = _movieCast.asStateFlow()

    private val _similarMovies = MutableStateFlow<List<MovieItem>>(emptyList())
    val similarMovies = _similarMovies.asStateFlow()

    private val _isPlayingVideo = MutableStateFlow(false)
    val isPlayingVideo = _isPlayingVideo.asStateFlow()

    // Watchlist & History
    private val _watchlist = MutableStateFlow<List<MovieItem>>(emptyList())
    val watchlist = _watchlist.asStateFlow()

    private val _history = MutableStateFlow<List<MovieItem>>(emptyList())
    val history = _history.asStateFlow()

    // Watch Party
    private val _activeParty = MutableStateFlow<WatchPartyRoom?>(null)
    val activeParty = _activeParty.asStateFlow()

    // Dona AI Assistant
    private val _donaMessages = MutableStateFlow<List<DonaChatMessage>>(emptyList())
    val donaMessages = _donaMessages.asStateFlow()

    private val _isDonaThinking = MutableStateFlow(false)
    val isDonaThinking = _isDonaThinking.asStateFlow()

    // Sub-App: LevelAnime
    private val _trendingAnime = MutableStateFlow<List<AnimeItem>>(emptyList())
    val trendingAnime = _trendingAnime.asStateFlow()

    private val _topAnime = MutableStateFlow<List<AnimeItem>>(emptyList())
    val topAnime = _topAnime.asStateFlow()

    private val _selectedAnimeGenre = MutableStateFlow<Int?>(null)
    val selectedAnimeGenre = _selectedAnimeGenre.asStateFlow()

    private val _genreAnime = MutableStateFlow<List<AnimeItem>>(emptyList())
    val genreAnime = _genreAnime.asStateFlow()

    private val _animeSearchQuery = MutableStateFlow("")
    val animeSearchQuery = _animeSearchQuery.asStateFlow()

    private val _animeSearchResults = MutableStateFlow<List<AnimeItem>>(emptyList())
    val animeSearchResults = _animeSearchResults.asStateFlow()

    private val _selectedAnime = MutableStateFlow<AnimeItem?>(null)
    val selectedAnime = _selectedAnime.asStateFlow()

    // Sub-App: LevelMusic
    private val _selectedMusicCategory = MutableStateFlow(MUSIC_CATEGORIES[0])
    val selectedMusicCategory = _selectedMusicCategory.asStateFlow()

    private val _musicTracks = MutableStateFlow<List<MusicTrack>>(emptyList())
    val musicTracks = _musicTracks.asStateFlow()

    private val _currentTrack = MutableStateFlow<MusicTrack?>(null)
    val currentTrack = _currentTrack.asStateFlow()

    private val _isPlayingMusic = MutableStateFlow(false)
    val isPlayingMusic = _isPlayingMusic.asStateFlow()

    private val _musicProgress = MutableStateFlow(0f)
    val musicProgress = _musicProgress.asStateFlow()

    private val _musicCurrentTime = MutableStateFlow("0:00")
    val musicCurrentTime = _musicCurrentTime.asStateFlow()

    private val _likedTracks = MutableStateFlow<List<MusicTrack>>(emptyList())
    val likedTracks = _likedTracks.asStateFlow()

    // Sub-App: LevelOppa
    private val _oppaStories = MutableStateFlow<List<OppaStory>>(emptyList())
    val oppaStories = _oppaStories.asStateFlow()

    // Sub-App: LevelReviews
    private val _reviews = MutableStateFlow<List<ClientReview>>(emptyList())
    val reviews = _reviews.asStateFlow()

    // Sub-App: LevelDay (Weather)
    private val _weatherData = MutableStateFlow<OpenMeteoResponse?>(null)
    val weatherData = _weatherData.asStateFlow()

    private val _currentCity = MutableStateFlow("Paris")
    val currentCity = _currentCity.asStateFlow()

    private val _citySearchResults = MutableStateFlow<List<GeocodingItem>>(emptyList())
    val citySearchResults = _citySearchResults.asStateFlow()

    private val _isWeatherLoading = MutableStateFlow(false)
    val isWeatherLoading = _isWeatherLoading.asStateFlow()

    // Profile & Settings
    private val _userProfile = MutableStateFlow(UserProfile())
    val userProfile = _userProfile.asStateFlow()

    init {
        _watchlist.value = repo.getWatchlist()
        _history.value = repo.getRecentlyViewed()
        _likedTracks.value = repo.getLikedMusic()
        _reviews.value = repo.getReviews()
        _userProfile.value = repo.getUserProfile()

        initAudioPlayer()
        loadHomeCatalog()
        loadAnimeData()
        loadMusicCategory(MUSIC_CATEGORIES[0])
        loadWeatherData(48.8566, 2.3522, "Paris")
        initDonaWelcome()
    }

    private fun initAudioPlayer() {
        val player = ExoPlayer.Builder(getApplication()).build()
        player.addListener(object : Player.Listener {
            override fun onIsPlayingChanged(isPlaying: Boolean) {
                _isPlayingMusic.value = isPlaying
            }

            override fun onPlaybackStateChanged(playbackState: Int) {
                if (playbackState == Player.STATE_ENDED) {
                    playNextTrack()
                }
            }
        })
        musicPlayer = player

        // Progress polling loop
        viewModelScope.launch {
            while (true) {
                val p = musicPlayer
                if (p != null && p.isPlaying && p.duration > 0) {
                    val pos = p.currentPosition
                    val dur = p.duration
                    _musicProgress.value = (pos.toFloat() / dur.toFloat()).coerceIn(0f, 1f)
                    val s = pos / 1000
                    _musicCurrentTime.value = String.format("%d:%02d", s / 60, s % 60)
                }
                delay(500)
            }
        }
    }

    fun loadHomeCatalog() {
        viewModelScope.launch {
            _isLoadingHome.value = true
            try {
                val trending = ApiService.getTrendingMovies()
                val tv = ApiService.getTrendingTv()
                val top = ApiService.getTopRated()
                val action = ApiService.getMoviesByGenre(28)
                val scifi = ApiService.getMoviesByGenre(878)
                val horror = ApiService.getMoviesByGenre(27)

                _trendingMovies.value = trending
                _trendingTv.value = tv
                _topRated.value = top
                _actionMovies.value = action
                _sciFiMovies.value = scifi
                _horrorMovies.value = horror

                if (trending.isNotEmpty()) {
                    _heroMovie.value = trending.firstOrNull { it.backdropPath != null } ?: trending.first()
                }

                // Generate Oppa stories from trending
                _oppaStories.value = trending.take(6).mapIndexed { idx, m ->
                    OppaStory(
                        id = m.id.toString(),
                        tag = if (idx == 0) "Top Box-Office" else "Flash Cinéma",
                        title = m.displayTitle,
                        desc = m.overview ?: "Disponible en streaming HD sur LevelMovie.",
                        imageUrl = m.backdropUrl,
                        timeAgo = "Il y a ${(idx + 1) * 3} min"
                    )
                }
            } catch (_: Exception) {}
            _isLoadingHome.value = false
        }
    }

    fun selectHero(movie: MovieItem) {
        _heroMovie.value = movie
    }

    fun onSearchQueryChanged(q: String) {
        _searchQuery.value = q
        searchJob?.cancel()
        if (q.trim().isEmpty()) {
            _searchResults.value = emptyList()
            _isSearching.value = false
            return
        }
        searchJob = viewModelScope.launch {
            delay(400)
            _isSearching.value = true
            val res = ApiService.searchMulti(q)
            _searchResults.value = res
            _isSearching.value = false
        }
    }

    fun openMovieDetails(movie: MovieItem) {
        _selectedMovie.value = movie
        repo.addRecentlyViewed(movie)
        _history.value = repo.getRecentlyViewed()

        val isTv = movie.mediaType == "tv"
        viewModelScope.launch {
            _movieVideos.value = ApiService.getMovieVideos(movie.id, isTv)
            _movieCast.value = ApiService.getMovieCast(movie.id, isTv)
            _similarMovies.value = ApiService.getSimilar(movie.id, isTv)
        }
    }

    fun closeMovieDetails() {
        _selectedMovie.value = null
        _movieVideos.value = emptyList()
        _movieCast.value = emptyList()
        _similarMovies.value = emptyList()
        _isPlayingVideo.value = false
    }

    fun toggleWatchlist(movie: MovieItem) {
        repo.toggleWatchlist(movie)
        _watchlist.value = repo.getWatchlist()
    }

    fun isMovieInWatchlist(movieId: Long): Boolean {
        return _watchlist.value.any { it.id == movieId }
    }

    // Watch Party
    fun createWatchParty(movie: MovieItem, hostName: String = "VIP Host") {
        val randomNum = (1000..9999).random()
        val code = "LM-$randomNum"
        _activeParty.value = WatchPartyRoom(
            code = code,
            movie = movie,
            hostName = hostName,
            isPlaying = true,
            currentPositionSeconds = 0,
            participantsCount = 3,
            comments = listOf(
                WatchPartyComment("c1", "Système", "Salon privé Watch Party créé avec succès ! Code: $code", "À l'instant", true),
                WatchPartyComment("c2", "Lucas M.", "Bienvenue dans la séance synchronisée !", "Il y a 1 min")
            )
        )
    }

    fun joinWatchParty(code: String, userName: String = "Cinéphile") {
        val current = _activeParty.value
        val baseMovie = _trendingMovies.value.firstOrNull() ?: MovieItem(title = "Film Événement")
        if (current != null && current.code.equals(code.trim(), ignoreCase = true)) {
            // Already in room
            return
        }
        _activeParty.value = WatchPartyRoom(
            code = code.trim().uppercase(),
            movie = baseMovie,
            hostName = "Admin Party",
            isPlaying = true,
            currentPositionSeconds = 120,
            participantsCount = 4,
            comments = listOf(
                WatchPartyComment("c1", "Système", "Vous avez rejoint le salon $code.", "À l'instant", true),
                WatchPartyComment("c2", "Alexandre D.", "Salut tout le monde ! Très bon choix de film.", "Il y a 2 min")
            )
        )
    }

    fun sendPartyComment(text: String, user: String = "Moi") {
        val room = _activeParty.value ?: return
        val newComment = WatchPartyComment(
            id = "c_${System.currentTimeMillis()}",
            user = user,
            text = text,
            time = "À l'instant"
        )
        _activeParty.value = room.copy(
            comments = room.comments + newComment
        )
    }

    fun leaveWatchParty() {
        _activeParty.value = null
    }

    // Dona AI
    private fun initDonaWelcome() {
        _donaMessages.value = listOf(
            DonaChatMessage(
                id = "m_welcome",
                isUser = false,
                text = "Bonjour ! Je suis **Dona**, ton guide cinéphile IA. Dis-moi ce qui te ferait plaisir aujourd'hui : adrénaline, grand frisson, éclats de rire ou poésie ? 🍿✨"
            )
        )
    }

    fun askDona(prompt: String) {
        if (prompt.trim().isEmpty()) return
        val userMsg = DonaChatMessage(
            id = "user_${System.currentTimeMillis()}",
            isUser = true,
            text = prompt
        )
        _donaMessages.value = _donaMessages.value + userMsg
        _isDonaThinking.value = true

        viewModelScope.launch {
            val (answer, recommended) = ApiService.askDonaAi(prompt, _trendingMovies.value + _topRated.value)
            delay(500)
            val aiMsg = DonaChatMessage(
                id = "ai_${System.currentTimeMillis()}",
                isUser = false,
                text = answer,
                suggestedMovies = recommended
            )
            _donaMessages.value = _donaMessages.value + aiMsg
            _isDonaThinking.value = false
        }
    }

    // Anime Sub-App
    private fun loadAnimeData() {
        viewModelScope.launch {
            _trendingAnime.value = ApiService.getTrendingAnime()
            _topAnime.value = ApiService.getTopAnime()
        }
    }

    fun selectAnimeGenre(genreId: Int?) {
        _selectedAnimeGenre.value = genreId
        if (genreId != null) {
            viewModelScope.launch {
                _genreAnime.value = ApiService.getAnimeByGenre(genreId)
            }
        }
    }

    fun onAnimeSearch(q: String) {
        _animeSearchQuery.value = q
        if (q.trim().isEmpty()) {
            _animeSearchResults.value = emptyList()
            return
        }
        viewModelScope.launch {
            _animeSearchResults.value = ApiService.searchAnime(q)
        }
    }

    fun selectAnime(anime: AnimeItem?) {
        _selectedAnime.value = anime
    }

    // Music Sub-App
    fun loadMusicCategory(cat: MusicCategory) {
        _selectedMusicCategory.value = cat
        viewModelScope.launch {
            val tracks = ApiService.getMusicTracks(cat.term, 30)
            _musicTracks.value = tracks
        }
    }

    fun playTrack(track: MusicTrack) {
        _currentTrack.value = track
        val url = track.previewUrl ?: return
        musicPlayer?.let { player ->
            player.setMediaItem(MediaItem.fromUri(url))
            player.prepare()
            player.play()
            _isPlayingMusic.value = true
        }
    }

    fun togglePlayPauseMusic() {
        musicPlayer?.let { player ->
            if (player.isPlaying) {
                player.pause()
            } else {
                player.play()
            }
        }
    }

    fun seekMusic(fraction: Float) {
        musicPlayer?.let { player ->
            if (player.duration > 0) {
                player.seekTo((player.duration * fraction).toLong())
            }
        }
    }

    fun playNextTrack() {
        val list = _musicTracks.value
        val cur = _currentTrack.value ?: return
        val idx = list.indexOfFirst { it.id == cur.id }
        if (idx != -1 && idx < list.size - 1) {
            playTrack(list[idx + 1])
        } else if (list.isNotEmpty()) {
            playTrack(list[0])
        }
    }

    fun playPrevTrack() {
        val list = _musicTracks.value
        val cur = _currentTrack.value ?: return
        val idx = list.indexOfFirst { it.id == cur.id }
        if (idx > 0) {
            playTrack(list[idx - 1])
        }
    }

    fun toggleTrackLike(track: MusicTrack) {
        repo.toggleMusicLike(track)
        _likedTracks.value = repo.getLikedMusic()
    }

    fun isTrackLiked(trackId: Long): Boolean {
        return _likedTracks.value.any { it.id == trackId }
    }

    // Weather Sub-App (LevelDay)
    fun loadWeatherData(lat: Double, lon: Double, cityName: String) {
        _currentCity.value = cityName
        _isWeatherLoading.value = true
        viewModelScope.launch {
            _weatherData.value = ApiService.getWeather(lat, lon)
            _isWeatherLoading.value = false
        }
    }

    fun searchWeatherCities(query: String) {
        viewModelScope.launch {
            _citySearchResults.value = ApiService.searchCity(query)
        }
    }

    // Reviews Sub-App
    fun submitReview(rating: Int, comment: String, authorName: String) {
        val newRev = ClientReview(
            id = "rev_${System.currentTimeMillis()}",
            name = authorName.ifEmpty { "Membre VIP" },
            rating = rating,
            comment = comment,
            isVerified = true,
            date = "À l'instant"
        )
        repo.addReview(newRev)
        _reviews.value = repo.getReviews()
    }

    // User Profile
    fun updateProfile(displayName: String, avatarUrl: String) {
        val updated = _userProfile.value.copy(
            displayName = displayName,
            avatarUrl = avatarUrl
        )
        _userProfile.value = updated
        repo.saveUserProfile(updated)
    }

    fun setParentalPin(pin: String?) {
        val updated = _userProfile.value.copy(
            isParentalLocked = pin != null,
            parentalPin = pin
        )
        _userProfile.value = updated
        repo.saveUserProfile(updated)
    }

    override fun onCleared() {
        super.onCleared()
        musicPlayer?.release()
        musicPlayer = null
        videoPlayer?.release()
        videoPlayer = null
    }
}
