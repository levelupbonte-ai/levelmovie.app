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
import com.example.data.MUSIC_CATEGORIES
import com.example.data.MusicTrack
import com.example.ui.LevelMovieViewModel
import com.example.ui.theme.*

@Composable
fun LevelMusicScreen(
    viewModel: LevelMovieViewModel,
    modifier: Modifier = Modifier
) {
    val selectedCategory by viewModel.selectedMusicCategory.collectAsState()
    val tracks by viewModel.musicTracks.collectAsState()
    val currentTrack by viewModel.currentTrack.collectAsState()
    val isPlaying by viewModel.isPlayingMusic.collectAsState()
    val progress by viewModel.musicProgress.collectAsState()
    val currentTime by viewModel.musicCurrentTime.collectAsState()
    val likedTracks by viewModel.likedTracks.collectAsState()

    var showPlayerSheet by remember { mutableStateOf(false) }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(BgDark)
    ) {
        // Genre Categories Carousel
        LazyRow(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 12.dp),
            contentPadding = PaddingValues(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(MUSIC_CATEGORIES) { cat ->
                val isSelected = selectedCategory.id == cat.id
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(18.dp))
                        .background(if (isSelected) Color(cat.colorHex) else BgCardLighter)
                        .border(1.dp, if (isSelected) Color.White.copy(alpha = 0.6f) else GlassBorder, RoundedCornerShape(18.dp))
                        .clickable { viewModel.loadMusicCategory(cat) }
                        .padding(horizontal = 14.dp, vertical = 7.dp)
                ) {
                    Text(
                        text = cat.title,
                        fontSize = 12.sp,
                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                        color = Color.White
                    )
                }
            }
        }

        // Tracks List
        LazyColumn(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth(),
            contentPadding = PaddingValues(start = 16.dp, end = 16.dp, top = 4.dp, bottom = 120.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(
                        text = "${selectedCategory.title} (${tracks.size})",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = Color.White
                    )

                    if (tracks.isNotEmpty()) {
                        IconButton(
                            onClick = {
                                viewModel.playTrack(tracks.random())
                            }
                        ) {
                            Icon(Icons.Default.Shuffle, contentDescription = "Shuffle", tint = PurpleNeon)
                        }
                    }
                }
            }

            items(tracks) { track ->
                val isThisPlaying = currentTrack?.id == track.id
                val isLiked = viewModel.isTrackLiked(track.id)

                Card(
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = if (isThisPlaying) PurpleDark.copy(alpha = 0.4f) else BgCard
                    ),
                    border = CardDefaults.outlinedCardBorder().copy(
                        brush = androidx.compose.ui.graphics.SolidColor(if (isThisPlaying) PurpleNeon else GlassBorder)
                    ),
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { viewModel.playTrack(track) }
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(10.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        // Artwork
                        Box(
                            modifier = Modifier
                                .size(48.dp)
                                .clip(RoundedCornerShape(8.dp))
                                .background(BgCardLighter)
                        ) {
                            AsyncImage(
                                model = track.artworkUrl,
                                contentDescription = track.name,
                                contentScale = ContentScale.Crop,
                                modifier = Modifier.fillMaxSize()
                            )

                            if (isThisPlaying && isPlaying) {
                                Box(
                                    modifier = Modifier
                                        .fillMaxSize()
                                        .background(Color.Black.copy(alpha = 0.4f)),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.GraphicEq,
                                        contentDescription = "Playing",
                                        tint = CyanAccent,
                                        modifier = Modifier.size(22.dp)
                                    )
                                }
                            }
                        }

                        // Title & Artist
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = track.name,
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (isThisPlaying) CyanAccent else Color.White,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis
                            )
                            Text(
                                text = track.artist,
                                fontSize = 11.sp,
                                color = TextSecondary,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis
                            )
                        }

                        // Like button
                        IconButton(
                            onClick = { viewModel.toggleTrackLike(track) },
                            modifier = Modifier.size(36.dp)
                        ) {
                            Icon(
                                imageVector = if (isLiked) Icons.Default.Favorite else Icons.Default.FavoriteBorder,
                                contentDescription = "Like",
                                tint = if (isLiked) RoseAccent else TextMuted,
                                modifier = Modifier.size(20.dp)
                            )
                        }

                        // Play/Pause Action
                        IconButton(
                            onClick = {
                                if (isThisPlaying) {
                                    viewModel.togglePlayPauseMusic()
                                } else {
                                    viewModel.playTrack(track)
                                }
                            },
                            modifier = Modifier
                                .size(38.dp)
                                .clip(CircleShape)
                                .background(if (isThisPlaying) PurpleNeon else BgCardLighter)
                        ) {
                            Icon(
                                imageVector = if (isThisPlaying && isPlaying) Icons.Default.Pause else Icons.Default.PlayArrow,
                                contentDescription = "Play",
                                tint = Color.White,
                                modifier = Modifier.size(20.dp)
                            )
                        }
                    }
                }
            }
        }

        // Mini Audio Player Bar
        if (currentTrack != null) {
            Card(
                shape = RoundedCornerShape(topStart = 16.dp, topEnd = 16.dp),
                colors = CardDefaults.cardColors(containerColor = BgCardLighter),
                border = CardDefaults.outlinedCardBorder().copy(brush = androidx.compose.ui.graphics.SolidColor(PurpleNeon.copy(alpha = 0.5f))),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 75.dp)
            ) {
                Column {
                    // Scrubbing Progress Bar
                    Slider(
                        value = progress,
                        onValueChange = { viewModel.seekMusic(it) },
                        colors = SliderDefaults.colors(
                            thumbColor = CyanAccent,
                            activeTrackColor = CyanAccent,
                            inactiveTrackColor = GlassBorder
                        ),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(18.dp)
                            .padding(horizontal = 8.dp)
                    )

                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 14.dp, vertical = 6.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(10.dp),
                            modifier = Modifier.weight(1f)
                        ) {
                            AsyncImage(
                                model = currentTrack!!.artworkUrl,
                                contentDescription = null,
                                contentScale = ContentScale.Crop,
                                modifier = Modifier
                                    .size(42.dp)
                                    .clip(RoundedCornerShape(8.dp))
                            )
                            Column {
                                Text(
                                    text = currentTrack!!.name,
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color.White,
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis
                                )
                                Text(
                                    text = "${currentTrack!!.artist} • $currentTime / 0:30",
                                    fontSize = 10.sp,
                                    color = CyanAccent
                                )
                            }
                        }

                        Row(verticalAlignment = Alignment.CenterVertically) {
                            IconButton(onClick = { viewModel.playPrevTrack() }, modifier = Modifier.size(36.dp)) {
                                Icon(Icons.Default.SkipPrevious, contentDescription = "Prev", tint = Color.White)
                            }
                            IconButton(
                                onClick = { viewModel.togglePlayPauseMusic() },
                                modifier = Modifier
                                    .size(40.dp)
                                    .clip(CircleShape)
                                    .background(PurpleNeon)
                            ) {
                                Icon(
                                    imageVector = if (isPlaying) Icons.Default.Pause else Icons.Default.PlayArrow,
                                    contentDescription = "Play/Pause",
                                    tint = Color.White
                                )
                            }
                            IconButton(onClick = { viewModel.playNextTrack() }, modifier = Modifier.size(36.dp)) {
                                Icon(Icons.Default.SkipNext, contentDescription = "Next", tint = Color.White)
                            }
                        }
                    }
                }
            }
        }
    }
}
