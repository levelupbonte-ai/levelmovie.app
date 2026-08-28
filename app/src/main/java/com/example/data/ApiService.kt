package com.example.data

import com.example.BuildConfig
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.jsonArray
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive
import kotlinx.serialization.json.put
import kotlinx.serialization.json.putJsonArray
import kotlinx.serialization.json.putJsonObject
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import java.util.concurrent.TimeUnit

object ApiService {
    private val client = OkHttpClient.Builder()
        .connectTimeout(15, TimeUnit.SECONDS)
        .readTimeout(20, TimeUnit.SECONDS)
        .build()

    val json = Json {
        ignoreUnknownKeys = true
        isLenient = true
        coerceInputValues = true
    }

    private const val TMDB_BASE_URL = "https://api.themoviedb.org/3"
    private const val TMDB_API_KEY = "027cc951d888c64e5f15dcb853c7347a"

    // TMDB API calls
    suspend fun getTrendingMovies(lang: String = "fr-FR"): List<MovieItem> = withContext(Dispatchers.IO) {
        try {
            val url = "$TMDB_BASE_URL/trending/movie/day?api_key=$TMDB_API_KEY&language=$lang"
            val req = Request.Builder().url(url).build()
            val resp = client.newCall(req).execute()
            val body = resp.body?.string() ?: return@withContext emptyList()
            val parsed = json.decodeFromString<TmdbResponse>(body)
            parsed.results
        } catch (e: Exception) {
            emptyList()
        }
    }

    suspend fun getTrendingTv(lang: String = "fr-FR"): List<MovieItem> = withContext(Dispatchers.IO) {
        try {
            val url = "$TMDB_BASE_URL/trending/tv/day?api_key=$TMDB_API_KEY&language=$lang"
            val req = Request.Builder().url(url).build()
            val resp = client.newCall(req).execute()
            val body = resp.body?.string() ?: return@withContext emptyList()
            val parsed = json.decodeFromString<TmdbResponse>(body)
            parsed.results.map { it.copy(mediaType = "tv") }
        } catch (e: Exception) {
            emptyList()
        }
    }

    suspend fun getTopRated(lang: String = "fr-FR"): List<MovieItem> = withContext(Dispatchers.IO) {
        try {
            val url = "$TMDB_BASE_URL/movie/top_rated?api_key=$TMDB_API_KEY&language=$lang&page=1"
            val req = Request.Builder().url(url).build()
            val resp = client.newCall(req).execute()
            val body = resp.body?.string() ?: return@withContext emptyList()
            json.decodeFromString<TmdbResponse>(body).results
        } catch (e: Exception) {
            emptyList()
        }
    }

    suspend fun getMoviesByGenre(genreId: Int, lang: String = "fr-FR"): List<MovieItem> = withContext(Dispatchers.IO) {
        try {
            val url = "$TMDB_BASE_URL/discover/movie?api_key=$TMDB_API_KEY&with_genres=$genreId&sort_by=popularity.desc&language=$lang&page=1"
            val req = Request.Builder().url(url).build()
            val resp = client.newCall(req).execute()
            val body = resp.body?.string() ?: return@withContext emptyList()
            json.decodeFromString<TmdbResponse>(body).results
        } catch (e: Exception) {
            emptyList()
        }
    }

    suspend fun searchMulti(query: String, lang: String = "fr-FR"): List<MovieItem> = withContext(Dispatchers.IO) {
        if (query.trim().isEmpty()) return@withContext emptyList()
        try {
            val encoded = java.net.URLEncoder.encode(query, "UTF-8")
            val url = "$TMDB_BASE_URL/search/multi?api_key=$TMDB_API_KEY&query=$encoded&language=$lang&include_adult=false"
            val req = Request.Builder().url(url).build()
            val resp = client.newCall(req).execute()
            val body = resp.body?.string() ?: return@withContext emptyList()
            val results = json.decodeFromString<TmdbResponse>(body).results
            results.filter { it.posterPath != null || it.backdropPath != null }
        } catch (e: Exception) {
            emptyList()
        }
    }

    suspend fun getMovieVideos(movieId: Long, isTv: Boolean = false): List<VideoItem> = withContext(Dispatchers.IO) {
        try {
            val type = if (isTv) "tv" else "movie"
            val url = "$TMDB_BASE_URL/$type/$movieId/videos?api_key=$TMDB_API_KEY"
            val req = Request.Builder().url(url).build()
            val resp = client.newCall(req).execute()
            val body = resp.body?.string() ?: return@withContext emptyList()
            json.decodeFromString<VideosResponse>(body).results
        } catch (e: Exception) {
            emptyList()
        }
    }

    suspend fun getMovieCast(movieId: Long, isTv: Boolean = false): List<CastMember> = withContext(Dispatchers.IO) {
        try {
            val type = if (isTv) "tv" else "movie"
            val url = "$TMDB_BASE_URL/$type/$movieId/credits?api_key=$TMDB_API_KEY"
            val req = Request.Builder().url(url).build()
            val resp = client.newCall(req).execute()
            val body = resp.body?.string() ?: return@withContext emptyList()
            json.decodeFromString<CreditsResponse>(body).cast.take(10)
        } catch (e: Exception) {
            emptyList()
        }
    }

    suspend fun getSimilar(movieId: Long, isTv: Boolean = false, lang: String = "fr-FR"): List<MovieItem> = withContext(Dispatchers.IO) {
        try {
            val type = if (isTv) "tv" else "movie"
            val url = "$TMDB_BASE_URL/$type/$movieId/similar?api_key=$TMDB_API_KEY&language=$lang"
            val req = Request.Builder().url(url).build()
            val resp = client.newCall(req).execute()
            val body = resp.body?.string() ?: return@withContext emptyList()
            json.decodeFromString<TmdbResponse>(body).results.take(12)
        } catch (e: Exception) {
            emptyList()
        }
    }

    // JIKAN ANIME API
    suspend fun getTrendingAnime(): List<AnimeItem> = withContext(Dispatchers.IO) {
        try {
            val url = "https://api.jikan.moe/v4/seasons/now?limit=25"
            val req = Request.Builder().url(url).build()
            val resp = client.newCall(req).execute()
            val body = resp.body?.string() ?: return@withContext emptyList()
            json.decodeFromString<JikanResponse>(body).data
        } catch (e: Exception) {
            emptyList()
        }
    }

    suspend fun getTopAnime(): List<AnimeItem> = withContext(Dispatchers.IO) {
        try {
            val url = "https://api.jikan.moe/v4/top/anime?limit=25"
            val req = Request.Builder().url(url).build()
            val resp = client.newCall(req).execute()
            val body = resp.body?.string() ?: return@withContext emptyList()
            json.decodeFromString<JikanResponse>(body).data
        } catch (e: Exception) {
            emptyList()
        }
    }

    suspend fun getAnimeByGenre(genreId: Int): List<AnimeItem> = withContext(Dispatchers.IO) {
        try {
            val url = "https://api.jikan.moe/v4/anime?genres=$genreId&order_by=popularity&sort=asc&limit=20"
            val req = Request.Builder().url(url).build()
            val resp = client.newCall(req).execute()
            val body = resp.body?.string() ?: return@withContext emptyList()
            json.decodeFromString<JikanResponse>(body).data
        } catch (e: Exception) {
            emptyList()
        }
    }

    suspend fun searchAnime(q: String): List<AnimeItem> = withContext(Dispatchers.IO) {
        if (q.trim().length < 2) return@withContext emptyList()
        try {
            val encoded = java.net.URLEncoder.encode(q, "UTF-8")
            val url = "https://api.jikan.moe/v4/anime?q=$encoded&limit=20"
            val req = Request.Builder().url(url).build()
            val resp = client.newCall(req).execute()
            val body = resp.body?.string() ?: return@withContext emptyList()
            json.decodeFromString<JikanResponse>(body).data
        } catch (e: Exception) {
            emptyList()
        }
    }

    // ITUNES MUSIC API
    suspend fun getMusicTracks(term: String, limit: Int = 25): List<MusicTrack> = withContext(Dispatchers.IO) {
        try {
            val clean = term.replace("[^a-zA-Z0-9 ]".toRegex(), " ")
            val encoded = java.net.URLEncoder.encode(clean, "UTF-8")
            val url = "https://itunes.apple.com/search?term=$encoded&entity=song&limit=$limit"
            val req = Request.Builder().url(url).build()
            val resp = client.newCall(req).execute()
            val body = resp.body?.string() ?: return@withContext emptyList()
            val parsed = json.decodeFromString<ItunesSearchResponse>(body)
            parsed.results.filter { !it.previewUrl.isNullOrEmpty() }
        } catch (e: Exception) {
            emptyList()
        }
    }

    // WEATHER (LevelDay) API via Open-Meteo
    suspend fun searchCity(name: String): List<GeocodingItem> = withContext(Dispatchers.IO) {
        if (name.length < 2) return@withContext emptyList()
        try {
            val encoded = java.net.URLEncoder.encode(name, "UTF-8")
            val url = "https://geocoding-api.open-meteo.com/v1/search?name=$encoded&count=5&language=fr&format=json"
            val req = Request.Builder().url(url).build()
            val resp = client.newCall(req).execute()
            val body = resp.body?.string() ?: return@withContext emptyList()
            json.decodeFromString<GeocodingResponse>(body).results
        } catch (e: Exception) {
            emptyList()
        }
    }

    suspend fun getWeather(lat: Double, lon: Double): OpenMeteoResponse? = withContext(Dispatchers.IO) {
        try {
            val url = "https://api.open-meteo.com/v1/forecast?latitude=$lat&longitude=$lon&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto"
            val req = Request.Builder().url(url).build()
            val resp = client.newCall(req).execute()
            val body = resp.body?.string() ?: return@withContext null
            json.decodeFromString<OpenMeteoResponse>(body)
        } catch (e: Exception) {
            null
        }
    }

    // DONA GEMINI AI ASSISTANT
    suspend fun askDonaAi(prompt: String, availableMovies: List<MovieItem>): Pair<String, List<MovieItem>> = withContext(Dispatchers.IO) {
        val apiKey = BuildConfig.GEMINI_API_KEY.ifEmpty { "demo_key" }
        
        // If real Gemini API key is present, invoke Gemini 2.5 Flash
        if (apiKey.isNotEmpty() && apiKey != "demo_key") {
            try {
                val movieTitles = availableMovies.take(15).joinToString(", ") { it.displayTitle }
                val systemPrompt = "Tu es Dona, l'IA cinéphile experte et bienveillante de LevelMovie. Conseille l'utilisateur avec passion et concision. Voici quelques films actuellement disponibles: $movieTitles. Réponds en français de manière élégante."
                
                val bodyJson = buildJsonObject {
                    putJsonObject("system_instruction") {
                        putJsonArray("parts") {
                            add(buildJsonObject { put("text", systemPrompt) })
                        }
                    }
                    putJsonArray("contents") {
                        add(buildJsonObject {
                            putJsonArray("parts") {
                                add(buildJsonObject { put("text", prompt) })
                            }
                        })
                    }
                }

                val req = Request.Builder()
                    .url("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=$apiKey")
                    .post(bodyJson.toString().toRequestBody("application/json".toMediaType()))
                    .build()
                
                val resp = client.newCall(req).execute()
                val body = resp.body?.string()
                if (resp.isSuccessful && body != null) {
                    val root = json.parseToJsonElement(body).jsonObject
                    val text = root["candidates"]?.jsonArray?.getOrNull(0)?.jsonObject
                        ?.get("content")?.jsonObject
                        ?.get("parts")?.jsonArray?.getOrNull(0)?.jsonObject
                        ?.get("text")?.jsonPrimitive?.content
                    
                    if (!text.isNullOrEmpty()) {
                        val matched = availableMovies.filter { movie ->
                            text.contains(movie.displayTitle, ignoreCase = true)
                        }.take(3).ifEmpty { availableMovies.take(2) }
                        return@withContext Pair(text, matched)
                    }
                }
            } catch (_: Exception) {}
        }

        // Smart cinephile Dona AI fallback logic
        val lower = prompt.lowercase()
        val matchedMovies: List<MovieItem>
        val answerText = when {
            lower.contains("action") || lower.contains("combat") || lower.contains("vitesse") -> {
                matchedMovies = availableMovies.filter { it.genreIds.contains(28) || it.genreIds.contains(12) }.take(3).ifEmpty { availableMovies.take(3) }
                "✨ **Dona :** Si tu as envie d'adrénaline pure, voici d'excellentes pépites d'action et d'aventure avec un rythme palpitant !"
            }
            lower.contains("peur") || lower.contains("horreur") || lower.contains("frisson") || lower.contains("angoisse") -> {
                matchedMovies = availableMovies.filter { it.genreIds.contains(27) || it.genreIds.contains(53) }.take(3).ifEmpty { availableMovies.take(3) }
                "👻 **Dona :** Prépare-toi pour une séance nocturne intense. Ces œuvres sauront te captiver du début à la fin !"
            }
            lower.contains("rire") || lower.contains("comédie") || lower.contains("drole") || lower.contains("drôle") -> {
                matchedMovies = availableMovies.filter { it.genreIds.contains(35) || it.genreIds.contains(16) }.take(3).ifEmpty { availableMovies.take(3) }
                "🍿 **Dona :** Rien de mieux qu'une bonne séance divertissante et pleine de bonne humeur ! Voici mes sélections préférées."
            }
            lower.contains("amour") || lower.contains("romance") || lower.contains("couple") -> {
                matchedMovies = availableMovies.filter { it.genreIds.contains(10749) || it.genreIds.contains(18) }.take(3).ifEmpty { availableMovies.take(3) }
                "❤️ **Dona :** Voici de superbes récits émouvants et poétiques pour réchauffer le cœur."
            }
            lower.contains("anime") || lower.contains("animation") || lower.contains("manga") -> {
                matchedMovies = availableMovies.filter { it.genreIds.contains(16) }.take(3).ifEmpty { availableMovies.take(3) }
                "🎌 **Dona :** Le cinéma d'animation regorge de chefs-d'œuvre visuels. Découvre ces pépites incontournables !"
            }
            else -> {
                matchedMovies = availableMovies.take(3)
                "✨ **Dona :** D'après les tendances du moment et tes préférences, je te conseille vivement de découvrir ces productions plébiscitées par la communauté !"
            }
        }

        Pair(answerText, matchedMovies)
    }
}
