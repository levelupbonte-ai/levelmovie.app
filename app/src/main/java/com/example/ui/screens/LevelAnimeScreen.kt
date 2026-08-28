package com.example.ui.screens

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import coil.compose.AsyncImage
import com.example.data.ANIME_GENRE_LIST
import com.example.data.AnimeItem
import com.example.ui.LevelMovieViewModel
import com.example.ui.components.SectionHeader
import com.example.ui.theme.*

@Composable
fun LevelAnimeScreen(
    viewModel: LevelMovieViewModel,
    modifier: Modifier = Modifier
) {
    val trendingAnime by viewModel.trendingAnime.collectAsState()
    val topAnime by viewModel.topAnime.collectAsState()
    val genreAnime by viewModel.genreAnime.collectAsState()
    val selectedGenre by viewModel.selectedAnimeGenre.collectAsState()
    val searchQuery by viewModel.animeSearchQuery.collectAsState()
    val searchResults by viewModel.animeSearchResults.collectAsState()
    val selectedAnime by viewModel.selectedAnime.collectAsState()

    val context = LocalContext.current

    // Anime Detail Dialog
    if (selectedAnime != null) {
        val anime = selectedAnime!!
        Dialog(
            onDismissRequest = { viewModel.selectAnime(null) },
            properties = DialogProperties(usePlatformDefaultWidth = false)
        ) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(BgDark)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .statusBarsPadding()
                        .navigationBarsPadding()
                ) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(260.dp)
                    ) {
                        AsyncImage(
                            model = anime.posterUrl,
                            contentDescription = anime.displayTitle,
                            contentScale = ContentScale.Crop,
                            modifier = Modifier.fillMaxSize()
                        )
                        Box(
                            modifier = Modifier
                                .fillMaxSize()
                                .background(
                                    Brush.verticalGradient(
                                        listOf(Color.Black.copy(alpha = 0.4f), Color.Transparent, BgDark)
                                    )
                                )
                        )
                        IconButton(
                            onClick = { viewModel.selectAnime(null) },
                            modifier = Modifier
                                .padding(12.dp)
                                .align(Alignment.TopEnd)
                                .size(36.dp)
                                .clip(RoundedCornerShape(18.dp))
                                .background(Color.Black.copy(alpha = 0.6f))
                        ) {
                            Icon(Icons.Default.Close, contentDescription = "Fermer", tint = Color.White)
                        }
                    }

                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(20.dp)
                    ) {
                        Text(
                            text = anime.displayTitle,
                            fontSize = 22.sp,
                            fontWeight = FontWeight.Black,
                            color = Color.White
                        )
                        Spacer(modifier = Modifier.height(8.dp))

                        Row(
                            horizontalArrangement = Arrangement.spacedBy(8.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier
                                    .clip(RoundedCornerShape(6.dp))
                                    .background(AmberAccent.copy(alpha = 0.2f))
                                    .padding(horizontal = 8.dp, vertical = 3.dp)
                            ) {
                                Icon(Icons.Default.Star, contentDescription = null, tint = AmberAccent, modifier = Modifier.size(13.dp))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(anime.formattedScore, fontSize = 12.sp, fontWeight = FontWeight.Bold, color = AmberAccent)
                            }

                            if (anime.episodes != null) {
                                Text(
                                    text = "${anime.episodes} Épisodes",
                                    fontSize = 11.sp,
                                    color = CyanAccent,
                                    modifier = Modifier
                                        .clip(RoundedCornerShape(6.dp))
                                        .background(CyanAccent.copy(alpha = 0.15f))
                                        .padding(horizontal = 8.dp, vertical = 3.dp)
                                )
                            }
                        }

                        if (!anime.trailer?.youtubeId.isNullOrEmpty() || !anime.trailer?.url.isNullOrEmpty()) {
                            Spacer(modifier = Modifier.height(14.dp))
                            Button(
                                onClick = {
                                    val trailerUrl = if (!anime.trailer?.youtubeId.isNullOrEmpty())
                                        "https://www.youtube.com/watch?v=${anime.trailer!!.youtubeId}"
                                    else anime.trailer?.url ?: ""
                                    if (trailerUrl.isNotEmpty()) {
                                        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(trailerUrl))
                                        context.startActivity(intent)
                                    }
                                },
                                colors = ButtonDefaults.buttonColors(containerColor = RoseAccent),
                                shape = RoundedCornerShape(12.dp),
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Icon(Icons.Default.PlayArrow, contentDescription = null)
                                Spacer(modifier = Modifier.width(6.dp))
                                Text("Voir Bande-Annonce Officielle", fontWeight = FontWeight.Bold)
                            }
                        }

                        Spacer(modifier = Modifier.height(14.dp))
                        Text(text = "Synopsis", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = Color.White)
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = anime.synopsis ?: "Aucun synopsis disponible.",
                            fontSize = 12.sp,
                            color = TextSecondary,
                            lineHeight = 18.sp
                        )
                    }
                }
            }
        }
    }

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(BgDark),
        contentPadding = PaddingValues(top = 12.dp, bottom = 90.dp)
    ) {
        // Search bar
        item {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 6.dp)
            ) {
                TextField(
                    value = searchQuery,
                    onValueChange = { viewModel.onAnimeSearch(it) },
                    placeholder = { Text("Rechercher un anime (Jujutsu, One Piece...)", fontSize = 12.sp, color = TextMuted) },
                    leadingIcon = { Icon(Icons.Default.Search, contentDescription = null, tint = PurpleLight) },
                    trailingIcon = {
                        if (searchQuery.isNotEmpty()) {
                            IconButton(onClick = { viewModel.onAnimeSearch("") }) {
                                Icon(Icons.Default.Close, contentDescription = null, tint = TextSecondary)
                            }
                        }
                    },
                    singleLine = true,
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(16.dp))
                        .border(1.dp, GlassBorder, RoundedCornerShape(16.dp)),
                    colors = TextFieldDefaults.colors(
                        focusedContainerColor = BgCard,
                        unfocusedContainerColor = BgCard,
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        focusedIndicatorColor = Color.Transparent,
                        unfocusedIndicatorColor = Color.Transparent
                    )
                )
            }
        }

        // Genre filter row
        item {
            LazyRow(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 8.dp),
                contentPadding = PaddingValues(horizontal = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                item {
                    val isSelected = selectedGenre == null
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(20.dp))
                            .background(if (isSelected) RoseAccent else BgCardLighter)
                            .border(1.dp, if (isSelected) RoseAccent else GlassBorder, RoundedCornerShape(20.dp))
                            .clickable { viewModel.selectAnimeGenre(null) }
                            .padding(horizontal = 14.dp, vertical = 6.dp)
                    ) {
                        Text("Tous les Genres", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color.White)
                    }
                }

                items(ANIME_GENRE_LIST) { (id, name) ->
                    val isSelected = selectedGenre == id
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(20.dp))
                            .background(if (isSelected) RoseAccent else BgCardLighter)
                            .border(1.dp, if (isSelected) RoseAccent else GlassBorder, RoundedCornerShape(20.dp))
                            .clickable { viewModel.selectAnimeGenre(if (isSelected) null else id) }
                            .padding(horizontal = 14.dp, vertical = 6.dp)
                    ) {
                        Text(name, fontSize = 11.sp, fontWeight = FontWeight.Bold, color = if (isSelected) Color.White else TextSecondary)
                    }
                }
            }
        }

        // Search Results
        if (searchQuery.isNotEmpty()) {
            item {
                SectionHeader(title = "Résultats de recherche", icon = Icons.Default.Search, iconColor = CyanAccent)
            }
            item {
                LazyRow(
                    contentPadding = PaddingValues(horizontal = 16.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    items(searchResults) { anime ->
                        AnimeCardItem(anime = anime, onClick = { viewModel.selectAnime(anime) })
                    }
                }
            }
        }

        // Genre Filtered List
        if (selectedGenre != null) {
            item {
                SectionHeader(
                    title = "Genre sélectionné",
                    icon = Icons.Default.FilterList,
                    iconColor = RoseAccent
                )
            }
            item {
                LazyRow(
                    contentPadding = PaddingValues(horizontal = 16.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    items(genreAnime) { anime ->
                        AnimeCardItem(anime = anime, onClick = { viewModel.selectAnime(anime) })
                    }
                }
            }
        }

        // Trending Seasonal Anime
        item {
            Spacer(modifier = Modifier.height(10.dp))
            SectionHeader(title = "🎌 Nouveautés de la Saison", icon = Icons.Default.AutoAwesome, iconColor = PurpleNeon)
            LazyRow(
                contentPadding = PaddingValues(horizontal = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(trendingAnime) { anime ->
                    AnimeCardItem(anime = anime, onClick = { viewModel.selectAnime(anime) })
                }
            }
        }

        // Top Rated Anime
        item {
            Spacer(modifier = Modifier.height(18.dp))
            SectionHeader(title = "🏆 Chefs-d'œuvre Incontournables", icon = Icons.Default.EmojiEvents, iconColor = AmberAccent)
            LazyRow(
                contentPadding = PaddingValues(horizontal = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(topAnime) { anime ->
                    AnimeCardItem(anime = anime, onClick = { viewModel.selectAnime(anime) })
                }
            }
        }
    }
}

@Composable
fun AnimeCardItem(anime: AnimeItem, onClick: () -> Unit) {
    Column(
        modifier = Modifier
            .width(130.dp)
            .clickable(onClick = onClick)
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(185.dp)
                .clip(RoundedCornerShape(14.dp))
                .background(BgCard)
                .border(1.dp, GlassBorder, RoundedCornerShape(14.dp))
        ) {
            AsyncImage(
                model = anime.posterUrl,
                contentDescription = anime.displayTitle,
                contentScale = ContentScale.Crop,
                modifier = Modifier.fillMaxSize()
            )

            // Rating
            if (anime.score != null) {
                Box(
                    modifier = Modifier
                        .padding(6.dp)
                        .align(Alignment.TopStart)
                        .clip(RoundedCornerShape(6.dp))
                        .background(Color.Black.copy(alpha = 0.75f))
                        .padding(horizontal = 6.dp, vertical = 2.dp)
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(3.dp)
                    ) {
                        Icon(Icons.Default.Star, contentDescription = null, tint = AmberAccent, modifier = Modifier.size(11.dp))
                        Text(anime.formattedScore, fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Color.White)
                    }
                }
            }
        }
        Spacer(modifier = Modifier.height(6.dp))
        Text(
            text = anime.displayTitle,
            fontSize = 12.sp,
            fontWeight = FontWeight.SemiBold,
            color = Color.White,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis
        )
    }
}
