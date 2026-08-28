package com.example.data

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class MovieItem(
    val id: Long = 0,
    val title: String? = null,
    val name: String? = null,
    val overview: String? = null,
    @SerialName("poster_path") val posterPath: String? = null,
    @SerialName("backdrop_path") val backdropPath: String? = null,
    @SerialName("vote_average") val voteAverage: Double = 0.0,
    @SerialName("vote_count") val voteCount: Int = 0,
    @SerialName("release_date") val releaseDate: String? = null,
    @SerialName("first_air_date") val firstAirDate: String? = null,
    @SerialName("genre_ids") val genreIds: List<Int> = emptyList(),
    @SerialName("media_type") val mediaType: String? = null,
    val popularity: Double = 0.0
) {
    val displayTitle: String
        get() = title ?: name ?: "Titre Inconnu"

    val displayDate: String
        get() = (releaseDate ?: firstAirDate ?: "").take(4)

    val posterUrl: String
        get() = if (!posterPath.isNullOrEmpty()) "https://image.tmdb.org/t/p/w500$posterPath" else ""

    val backdropUrl: String
        get() = if (!backdropPath.isNullOrEmpty()) "https://image.tmdb.org/t/p/w1280$backdropPath" else posterUrl

    val formattedRating: String
        get() = String.format("%.1f", voteAverage)
}

@Serializable
data class TmdbResponse(
    val page: Int = 1,
    val results: List<MovieItem> = emptyList(),
    @SerialName("total_pages") val totalPages: Int = 1,
    @SerialName("total_results") val totalResults: Int = 0
)

@Serializable
data class VideoItem(
    val id: String = "",
    val key: String = "",
    val name: String = "",
    val site: String = "",
    val type: String = ""
)

@Serializable
data class VideosResponse(
    val id: Long = 0,
    val results: List<VideoItem> = emptyList()
)

@Serializable
data class CastMember(
    val id: Long = 0,
    val name: String = "",
    val character: String = "",
    @SerialName("profile_path") val profilePath: String? = null
) {
    val profileUrl: String
        get() = if (!profilePath.isNullOrEmpty()) "https://image.tmdb.org/t/p/w185$profilePath" else ""
}

@Serializable
data class CreditsResponse(
    val id: Long = 0,
    val cast: List<CastMember> = emptyList()
)

object TmdbGenres {
    val map = mapOf(
        28 to "Action",
        12 to "Aventure",
        16 to "Animation",
        35 to "Comédie",
        80 to "Crime",
        99 to "Documentaire",
        18 to "Drame",
        10751 to "Familial",
        14 to "Fantastique",
        36 to "Histoire",
        27 to "Horreur",
        10402 to "Musique",
        9648 to "Mystère",
        10749 to "Romance",
        878 to "Science-Fiction",
        10770 to "Téléfilm",
        53 to "Thriller",
        10752 to "Guerre",
        37 to "Western",
        10759 to "Action & Aventure",
        10765 to "Sci-Fi & Fantastique"
    )

    fun getGenreName(id: Int): String = map[id] ?: "Cinéma"
}
