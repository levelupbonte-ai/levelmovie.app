package com.example.data

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class MusicTrack(
    @SerialName("trackId") val id: Long = 0,
    @SerialName("trackName") val name: String = "",
    @SerialName("artistName") val artist: String = "",
    @SerialName("collectionName") val album: String? = null,
    @SerialName("artworkUrl100") val artworkUrl100: String? = null,
    val previewUrl: String? = null,
    @SerialName("trackTimeMillis") val trackTimeMillis: Long = 30000,
    @SerialName("primaryGenreName") val genre: String? = null
) {
    val artworkUrl: String
        get() = artworkUrl100?.replace("100x100bb", "600x600bb") ?: ""

    val durationSeconds: Long
        get() = trackTimeMillis / 1000

    val formattedDuration: String
        get() {
            val totalSeconds = durationSeconds
            val min = totalSeconds / 60
            val sec = totalSeconds % 60
            return String.format("%d:%02d", min, sec)
        }
}

@Serializable
data class ItunesSearchResponse(
    val resultCount: Int = 0,
    val results: List<MusicTrack> = emptyList()
)

data class MusicCategory(
    val id: Int,
    val title: String,
    val titleEn: String,
    val term: String,
    val colorHex: Long
)

val MUSIC_CATEGORIES = listOf(
    MusicCategory(1, "Nouveautés 2025", "New Releases", "nouveautes 2025", 0xFF1D4ED8),
    MusicCategory(2, "Rap Français", "French Rap", "rap francais", 0xFF7C3AED),
    MusicCategory(3, "Hits Mondiaux", "Global Hits", "top hits mondial", 0xFFBE185D),
    MusicCategory(4, "Amapiano", "Amapiano", "amapiano hits", 0xFFB45309),
    MusicCategory(5, "Rumba Congolaise", "Congolese Rumba", "rumba congolaise", 0xFF065F46),
    MusicCategory(6, "Afrobeat", "Afrobeat", "afrobeat", 0xFF92400E),
    MusicCategory(7, "Hip-Hop US", "US Hip-Hop", "us rap hip hop", 0xFF1E3A5F),
    MusicCategory(8, "Drill", "Drill", "drill uk fr", 0xFF111827),
    MusicCategory(9, "Lo-Fi Beats", "Lo-Fi Beats", "lofi beats relax", 0xFF1E3A5F),
    MusicCategory(10, "R&B & Soul", "R&B & Soul", "rnb soul hits", 0xFF5B21B6),
    MusicCategory(11, "Pop Mondiale", "Global Pop", "pop hits 2025", 0xFFBE185D),
    MusicCategory(12, "Reggaeton", "Reggaeton", "reggaeton latino", 0xFF166534),
    MusicCategory(13, "K-Pop", "K-Pop", "kpop bts blackpink", 0xFF831843),
    MusicCategory(14, "Électro & Club", "Electro & Club", "electro club dance", 0xFF1D4ED8)
)
