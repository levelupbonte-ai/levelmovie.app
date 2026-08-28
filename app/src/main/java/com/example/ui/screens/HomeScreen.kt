package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.example.data.MovieItem
import com.example.data.TmdbGenres
import com.example.ui.LevelMovieViewModel
import com.example.ui.components.MovieCard
import com.example.ui.components.SectionHeader
import com.example.ui.theme.*

@Composable
fun HomeScreen(
    viewModel: LevelMovieViewModel,
    onStartWatchParty: (MovieItem) -> Unit,
    modifier: Modifier = Modifier
) {
    val heroMovie by viewModel.heroMovie.collectAsState()
    val trendingMovies by viewModel.trendingMovies.collectAsState()
    val trendingTv by viewModel.trendingTv.collectAsState()
    val topRated by viewModel.topRated.collectAsState()
    val actionMovies by viewModel.actionMovies.collectAsState()
    val sciFiMovies by viewModel.sciFiMovies.collectAsState()
    val horrorMovies by viewModel.horrorMovies.collectAsState()
    val isLoading by viewModel.isLoadingHome.collectAsState()

    var selectedFilter by remember { mutableStateOf("Tous") }
    val filters = listOf("Tous", "Films Tendances", "Séries VIP", "Action", "Sci-Fi", "Horreur")

    if (isLoading && trendingMovies.isEmpty()) {
        Box(
            modifier = modifier
                .fillMaxSize()
                .background(BgDark),
            contentAlignment = Alignment.Center
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                CircularProgressIndicator(color = PurpleNeon, strokeWidth = 3.dp)
                Spacer(modifier = Modifier.height(12.dp))
                Text(
                    text = "Chargement du catalogue LevelMovie...",
                    fontSize = 13.sp,
                    color = TextSecondary
                )
            }
        }
        return
    }

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(BgDark),
        contentPadding = PaddingValues(bottom = 90.dp)
    ) {
        // Hero Movie Banner
        if (heroMovie != null) {
            item {
                HeroBanner(
                    movie = heroMovie!!,
                    onPlay = { viewModel.openMovieDetails(heroMovie!!) },
                    onInfo = { viewModel.openMovieDetails(heroMovie!!) },
                    onWatchParty = { onStartWatchParty(heroMovie!!) }
                )
            }
        }

        // Quick Category Filter Row
        item {
            LazyRow(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 12.dp),
                contentPadding = PaddingValues(horizontal = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(filters) { f ->
                    val isSelected = selectedFilter == f
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(20.dp))
                            .background(if (isSelected) PurpleNeon else BgCardLighter)
                            .border(1.dp, if (isSelected) PurpleLight else GlassBorder, RoundedCornerShape(20.dp))
                            .clickable { selectedFilter = f }
                            .padding(horizontal = 14.dp, vertical = 7.dp)
                    ) {
                        Text(
                            text = f,
                            fontSize = 12.sp,
                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                            color = if (isSelected) Color.White else TextSecondary
                        )
                    }
                }
            }
        }

        // Trending Movies Section
        if (selectedFilter == "Tous" || selectedFilter == "Films Tendances") {
            item {
                SectionHeader(
                    title = "🔥 Tendances du Moment",
                    icon = Icons.Default.LocalFireDepartment,
                    iconColor = RoseAccent
                )
                LazyRow(
                    contentPadding = PaddingValues(horizontal = 16.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    items(trendingMovies) { movie ->
                        MovieCard(
                            movie = movie,
                            onClick = { viewModel.openMovieDetails(movie) }
                        )
                    }
                }
            }
        }

        // Top 10 Plébiscités
        if (selectedFilter == "Tous") {
            item {
                Spacer(modifier = Modifier.height(16.dp))
                SectionHeader(
                    title = "👑 Top 10 des Membres VIP",
                    icon = Icons.Default.EmojiEvents,
                    iconColor = AmberAccent
                )
                LazyRow(
                    contentPadding = PaddingValues(horizontal = 16.dp),
                    horizontalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    items(topRated.take(10).mapIndexed { idx, m -> Pair(idx + 1, m) }) { (rank, movie) ->
                        Row(
                            verticalAlignment = Alignment.Bottom,
                            modifier = Modifier.clickable { viewModel.openMovieDetails(movie) }
                        ) {
                            Text(
                                text = "$rank",
                                fontSize = 60.sp,
                                fontWeight = FontWeight.Black,
                                color = PurpleDark,
                                modifier = Modifier.offset(x = 10.dp)
                            )
                            MovieCard(
                                movie = movie,
                                onClick = { viewModel.openMovieDetails(movie) }
                            )
                        }
                    }
                }
            }
        }

        // Trending Series TV
        if (selectedFilter == "Tous" || selectedFilter == "Séries VIP") {
            item {
                Spacer(modifier = Modifier.height(16.dp))
                SectionHeader(
                    title = "📺 Séries & Épisodes Exclusifs",
                    icon = Icons.Default.Tv,
                    iconColor = CyanAccent
                )
                LazyRow(
                    contentPadding = PaddingValues(horizontal = 16.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    items(trendingTv) { tvShow ->
                        MovieCard(
                            movie = tvShow,
                            onClick = { viewModel.openMovieDetails(tvShow) }
                        )
                    }
                }
            }
        }

        // Action Movies
        if (selectedFilter == "Tous" || selectedFilter == "Action") {
            item {
                Spacer(modifier = Modifier.height(16.dp))
                SectionHeader(
                    title = "⚡ Adrénaline & Action Pure",
                    icon = Icons.Default.Bolt,
                    iconColor = AmberAccent
                )
                LazyRow(
                    contentPadding = PaddingValues(horizontal = 16.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    items(actionMovies) { movie ->
                        MovieCard(
                            movie = movie,
                            onClick = { viewModel.openMovieDetails(movie) }
                        )
                    }
                }
            }
        }

        // Sci-Fi Movies
        if (selectedFilter == "Tous" || selectedFilter == "Sci-Fi") {
            item {
                Spacer(modifier = Modifier.height(16.dp))
                SectionHeader(
                    title = "🚀 Science-Fiction & Futur",
                    icon = Icons.Default.RocketLaunch,
                    iconColor = PurpleNeon
                )
                LazyRow(
                    contentPadding = PaddingValues(horizontal = 16.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    items(sciFiMovies) { movie ->
                        MovieCard(
                            movie = movie,
                            onClick = { viewModel.openMovieDetails(movie) }
                        )
                    }
                }
            }
        }

        // Horror Movies
        if (selectedFilter == "Tous" || selectedFilter == "Horreur") {
            item {
                Spacer(modifier = Modifier.height(16.dp))
                SectionHeader(
                    title = "👻 Frissons & Mystères Nocturnes",
                    icon = Icons.Default.Nightlight,
                    iconColor = RoseAccent
                )
                LazyRow(
                    contentPadding = PaddingValues(horizontal = 16.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    items(horrorMovies) { movie ->
                        MovieCard(
                            movie = movie,
                            onClick = { viewModel.openMovieDetails(movie) }
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun HeroBanner(
    movie: MovieItem,
    onPlay: () -> Unit,
    onInfo: () -> Unit,
    onWatchParty: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(420.dp)
    ) {
        AsyncImage(
            model = movie.backdropUrl,
            contentDescription = movie.displayTitle,
            contentScale = ContentScale.Crop,
            modifier = Modifier.fillMaxSize()
        )

        // Gradient layers
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.verticalGradient(
                        colors = listOf(
                            Color.Black.copy(alpha = 0.4f),
                            Color.Transparent,
                            BgDark.copy(alpha = 0.8f),
                            BgDark
                        )
                    )
                )
        )

        // Content
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 20.dp, vertical = 20.dp),
            verticalArrangement = Arrangement.Bottom
        ) {
            // Quality Tag
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(4.dp))
                        .background(PurpleNeon)
                        .padding(horizontal = 6.dp, vertical = 2.dp)
                ) {
                    Text("À LA UNE", fontSize = 10.sp, fontWeight = FontWeight.Black, color = Color.White)
                }

                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(4.dp))
                        .background(Color.Black.copy(alpha = 0.6f))
                        .padding(horizontal = 6.dp, vertical = 2.dp)
                ) {
                    Text("4K HDR", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = CyanAccent)
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = movie.displayTitle,
                fontSize = 26.sp,
                fontWeight = FontWeight.Black,
                color = Color.White,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis
            )

            if (!movie.overview.isNullOrEmpty()) {
                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    text = movie.overview,
                    fontSize = 12.sp,
                    color = TextSecondary,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis,
                    lineHeight = 16.sp
                )
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Action Buttons
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Button(
                    onClick = onPlay,
                    colors = ButtonDefaults.buttonColors(containerColor = Color.White),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier
                        .weight(1f)
                        .height(44.dp)
                ) {
                    Icon(Icons.Default.PlayArrow, contentDescription = null, tint = Color.Black)
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("Regarder", fontWeight = FontWeight.ExtraBold, color = Color.Black, fontSize = 13.sp)
                }

                Button(
                    onClick = onWatchParty,
                    colors = ButtonDefaults.buttonColors(containerColor = CyanAccent),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier
                        .weight(1f)
                        .height(44.dp)
                ) {
                    Icon(Icons.Default.Groups, contentDescription = null, tint = Color.Black)
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("Watch Party", fontWeight = FontWeight.ExtraBold, color = Color.Black, fontSize = 13.sp)
                }

                IconButton(
                    onClick = onInfo,
                    modifier = Modifier
                        .size(44.dp)
                        .clip(RoundedCornerShape(12.dp))
                        .background(BgCardLighter)
                        .border(1.dp, GlassBorder, RoundedCornerShape(12.dp))
                ) {
                    Icon(Icons.Default.Info, contentDescription = "Détails", tint = Color.White)
                }
            }
        }
    }
}
