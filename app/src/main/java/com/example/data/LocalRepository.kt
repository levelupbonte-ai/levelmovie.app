package com.example.data

import android.content.Context
import android.content.SharedPreferences
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

class LocalRepository(context: Context) {
    private val prefs: SharedPreferences = context.getSharedPreferences("levelmovie_prefs", Context.MODE_PRIVATE)
    private val json = Json { ignoreUnknownKeys = true; isLenient = true; coerceInputValues = true }

    // Watchlist
    fun getWatchlist(): List<MovieItem> {
        val str = prefs.getString("watchlist", null) ?: return emptyList()
        return try {
            json.decodeFromString(str)
        } catch (_: Exception) {
            emptyList()
        }
    }

    fun saveWatchlist(items: List<MovieItem>) {
        prefs.edit().putString("watchlist", json.encodeToString(items)).apply()
    }

    fun toggleWatchlist(movie: MovieItem): Boolean {
        val current = getWatchlist().toMutableList()
        val exists = current.any { it.id == movie.id }
        if (exists) {
            current.removeAll { it.id == movie.id }
        } else {
            current.add(0, movie)
        }
        saveWatchlist(current)
        return !exists
    }

    // Recently Viewed
    fun getRecentlyViewed(): List<MovieItem> {
        val str = prefs.getString("recently_viewed", null) ?: return emptyList()
        return try {
            json.decodeFromString(str)
        } catch (_: Exception) {
            emptyList()
        }
    }

    fun addRecentlyViewed(movie: MovieItem) {
        val current = getRecentlyViewed().toMutableList()
        current.removeAll { it.id == movie.id }
        current.add(0, movie)
        val trimmed = current.take(30)
        prefs.edit().putString("recently_viewed", json.encodeToString(trimmed)).apply()
    }

    // Liked Music Tracks
    fun getLikedMusic(): List<MusicTrack> {
        val str = prefs.getString("liked_music", null) ?: return emptyList()
        return try {
            json.decodeFromString(str)
        } catch (_: Exception) {
            emptyList()
        }
    }

    fun toggleMusicLike(track: MusicTrack): Boolean {
        val current = getLikedMusic().toMutableList()
        val exists = current.any { it.id == track.id }
        if (exists) {
            current.removeAll { it.id == track.id }
        } else {
            current.add(0, track)
        }
        prefs.edit().putString("liked_music", json.encodeToString(current)).apply()
        return !exists
    }

    // Reviews
    fun getReviews(): List<ClientReview> {
        val str = prefs.getString("client_reviews", null)
        if (str != null) {
            try {
                return json.decodeFromString(str)
            } catch (_: Exception) {}
        }
        return defaultReviews
    }

    fun addReview(review: ClientReview) {
        val current = getReviews().toMutableList()
        current.add(0, review)
        prefs.edit().putString("client_reviews", json.encodeToString(current)).apply()
    }

    // User Profile
    fun getUserProfile(): UserProfile {
        val str = prefs.getString("user_profile", null)
        if (str != null) {
            try {
                return json.decodeFromString(str)
            } catch (_: Exception) {}
        }
        return UserProfile()
    }

    fun saveUserProfile(profile: UserProfile) {
        prefs.edit().putString("user_profile", json.encodeToString(profile)).apply()
    }

    companion object {
        val defaultReviews = listOf(
            ClientReview(
                id = "1",
                name = "Alexandre Dupont",
                rating = 5,
                comment = "Une expérience de streaming et cinéma inégalée. La synchronisation des Watch Party en direct et la qualité 4K sans buffering font toute la différence.",
                isVerified = true,
                date = "Il y a 1 jour"
            ),
            ClientReview(
                id = "2",
                name = "Sarah Benali",
                rating = 5,
                comment = "Interface sombre sublime et ultra ergonomique. L’IA Dona trouve instantanément les pépites selon mes goûts, et l’écosystème d’apps LevelUp est un vrai plus !",
                isVerified = true,
                date = "Il y a 3 jours"
            ),
            ClientReview(
                id = "3",
                name = "Marc Lefebvre",
                rating = 5,
                comment = "Fluidité impeccable sur smartphone, tablette et TV. Le lecteur gère les pistes audio et bandes-annonces avec une grande précision.",
                isVerified = true,
                date = "Il y a 6 jours"
            ),
            ClientReview(
                id = "4",
                name = "Émilie Roussel",
                rating = 4,
                comment = "Très belle plateforme, catalogue mis à jour quotidiennement. Les stories et bandes-annonces dans LevelOppa sont super addictives.",
                isVerified = true,
                date = "Il y a 10 jours"
            )
        )
    }
}
