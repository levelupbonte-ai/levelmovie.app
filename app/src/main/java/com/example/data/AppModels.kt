package com.example.data

import kotlinx.serialization.Serializable

@Serializable
data class ClientReview(
    val id: String = "",
    val name: String = "",
    val rating: Int = 5,
    val comment: String = "",
    val isVerified: Boolean = true,
    val date: String = "Aujourd'hui",
    val avatarUrl: String? = null
)

@Serializable
data class DonaChatMessage(
    val id: String = "",
    val isUser: Boolean = false,
    val text: String = "",
    val suggestedMovies: List<MovieItem> = emptyList(),
    val timestamp: Long = System.currentTimeMillis()
)

@Serializable
data class WatchPartyComment(
    val id: String,
    val user: String,
    val text: String,
    val time: String,
    val isSystem: Boolean = false
)

@Serializable
data class WatchPartyRoom(
    val code: String,
    val movie: MovieItem,
    val hostName: String,
    val isPlaying: Boolean = true,
    val currentPositionSeconds: Long = 0,
    val participantsCount: Int = 1,
    val comments: List<WatchPartyComment> = emptyList()
)

@Serializable
data class OppaStory(
    val id: String,
    val tag: String,
    val title: String,
    val desc: String,
    val imageUrl: String,
    val timeAgo: String
)

@Serializable
data class UserProfile(
    val displayName: String = "Membre VIP",
    val email: String = "vip@levelmovie.app",
    val avatarUrl: String = "https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&w=200&q=80",
    val isParentalLocked: Boolean = false,
    val parentalPin: String? = null,
    val language: String = "fr"
)
