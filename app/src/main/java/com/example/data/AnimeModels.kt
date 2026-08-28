package com.example.data

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class AnimeImageSet(
    @SerialName("image_url") val imageUrl: String? = null,
    @SerialName("large_image_url") val largeImageUrl: String? = null
)

@Serializable
data class AnimeImages(
    val webp: AnimeImageSet? = null,
    val jpg: AnimeImageSet? = null
)

@Serializable
data class AnimeTrailer(
    @SerialName("youtube_id") val youtubeId: String? = null,
    val url: String? = null,
    @SerialName("embed_url") val embedUrl: String? = null
)

@Serializable
data class AnimeGenre(
    @SerialName("mal_id") val malId: Int = 0,
    val name: String = ""
)

@Serializable
data class AnimeItem(
    @SerialName("mal_id") val malId: Long = 0,
    val title: String = "",
    @SerialName("title_english") val titleEnglish: String? = null,
    @SerialName("title_japanese") val titleJapanese: String? = null,
    val synopsis: String? = null,
    val score: Double? = null,
    val episodes: Int? = null,
    val status: String? = null,
    val rating: String? = null,
    val year: Int? = null,
    val images: AnimeImages? = null,
    val trailer: AnimeTrailer? = null,
    val genres: List<AnimeGenre> = emptyList(),
    val popularity: Int? = null
) {
    val displayTitle: String
        get() = titleEnglish ?: title

    val posterUrl: String
        get() = images?.webp?.largeImageUrl ?: images?.jpg?.largeImageUrl ?: images?.webp?.imageUrl ?: ""

    val formattedScore: String
        get() = score?.let { String.format("%.1f", it) } ?: "N/A"
}

@Serializable
data class JikanResponse(
    val data: List<AnimeItem> = emptyList()
)

val ANIME_GENRE_LIST = listOf(
    Pair(1, "Action"),
    Pair(2, "Aventure"),
    Pair(4, "Comédie"),
    Pair(8, "Drame"),
    Pair(10, "Fantasy"),
    Pair(14, "Horreur"),
    Pair(22, "Romance"),
    Pair(24, "Sci-Fi"),
    Pair(30, "Sport"),
    Pair(36, "Tranche de vie"),
    Pair(37, "Surnaturel"),
    Pair(7, "Mystère")
)
