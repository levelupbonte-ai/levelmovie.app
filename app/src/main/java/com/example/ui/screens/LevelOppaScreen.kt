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
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import coil.compose.AsyncImage
import com.example.data.OppaStory
import com.example.ui.LevelMovieViewModel
import com.example.ui.components.MovieCard
import com.example.ui.components.SectionHeader
import com.example.ui.theme.*

@Composable
fun LevelOppaScreen(
    viewModel: LevelMovieViewModel,
    modifier: Modifier = Modifier
) {
    val stories by viewModel.oppaStories.collectAsState()
    val trending by viewModel.trendingMovies.collectAsState()
    val topRated by viewModel.topRated.collectAsState()

    var activeStory by remember { mutableStateOf<OppaStory?>(null) }

    // Full Screen Story Modal
    if (activeStory != null) {
        val s = activeStory!!
        Dialog(
            onDismissRequest = { activeStory = null },
            properties = DialogProperties(usePlatformDefaultWidth = false)
        ) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(Color.Black)
            ) {
                AsyncImage(
                    model = s.imageUrl,
                    contentDescription = s.title,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxSize()
                )

                // Overlays
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(
                            Brush.verticalGradient(
                                listOf(Color.Black.copy(alpha = 0.6f), Color.Transparent, Color.Black.copy(alpha = 0.9f))
                            )
                        )
                )

                // Top Header in Story
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .statusBarsPadding()
                        .padding(16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(4.dp))
                                .background(PurpleNeon)
                                .padding(horizontal = 6.dp, vertical = 2.dp)
                        ) {
                            Text(s.tag, fontSize = 9.sp, fontWeight = FontWeight.Black, color = Color.White)
                        }
                        Text(s.timeAgo, fontSize = 11.sp, color = TextSecondary)
                    }

                    IconButton(
                        onClick = { activeStory = null },
                        modifier = Modifier
                            .size(36.dp)
                            .clip(CircleShape)
                            .background(Color.Black.copy(alpha = 0.5f))
                    ) {
                        Icon(Icons.Default.Close, contentDescription = "Fermer", tint = Color.White)
                    }
                }

                // Story Content
                Column(
                    modifier = Modifier
                        .align(Alignment.BottomStart)
                        .padding(20.dp)
                        .navigationBarsPadding()
                ) {
                    Text(
                        text = s.title,
                        fontSize = 24.sp,
                        fontWeight = FontWeight.Black,
                        color = Color.White
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = s.desc,
                        fontSize = 13.sp,
                        color = TextSecondary,
                        lineHeight = 20.sp
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                    Button(
                        onClick = { activeStory = null },
                        colors = ButtonDefaults.buttonColors(containerColor = CyanAccent),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text("Découvrir sur LevelMovie", color = Color.Black, fontWeight = FontWeight.Bold)
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
        // Stories Row (Instagram/Reels Style)
        item {
            LazyRow(
                contentPadding = PaddingValues(horizontal = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(stories) { story ->
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier
                            .width(76.dp)
                            .clickable { activeStory = story }
                    ) {
                        Box(
                            modifier = Modifier
                                .size(70.dp)
                                .clip(CircleShape)
                                .border(
                                    2.dp,
                                    Brush.sweepGradient(listOf(PurpleNeon, RoseAccent, CyanAccent, PurpleNeon)),
                                    CircleShape
                                )
                                .padding(3.dp)
                        ) {
                            AsyncImage(
                                model = story.imageUrl,
                                contentDescription = story.title,
                                contentScale = ContentScale.Crop,
                                modifier = Modifier
                                    .fillMaxSize()
                                    .clip(CircleShape)
                            )
                        }
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = story.title,
                            fontSize = 10.sp,
                            color = Color.White,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis
                        )
                    }
                }
            }
        }

        // Radar Cinema Box-Office
        item {
            Spacer(modifier = Modifier.height(16.dp))
            SectionHeader(title = "📡 Radar Cinéma & Sorties", icon = Icons.Default.Sensors, iconColor = CyanAccent)
            LazyRow(
                contentPadding = PaddingValues(horizontal = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(topRated.take(8)) { movie ->
                    MovieCard(movie = movie, onClick = { viewModel.openMovieDetails(movie) })
                }
            }
        }

        // Flash Info News Feed
        item {
            Spacer(modifier = Modifier.height(20.dp))
            SectionHeader(title = "📰 Actualités & Révélations", icon = Icons.Default.Newspaper, iconColor = AmberAccent)
        }

        items(stories) { s ->
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = BgCard),
                border = CardDefaults.outlinedCardBorder().copy(brush = androidx.compose.ui.graphics.SolidColor(GlassBorder)),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 6.dp)
                    .clickable { activeStory = s }
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(12.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    AsyncImage(
                        model = s.imageUrl,
                        contentDescription = s.title,
                        contentScale = ContentScale.Crop,
                        modifier = Modifier
                            .size(76.dp)
                            .clip(RoundedCornerShape(10.dp))
                    )

                    Column(modifier = Modifier.weight(1f)) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Text(
                                text = s.tag,
                                fontSize = 9.sp,
                                fontWeight = FontWeight.Bold,
                                color = PurpleLight
                            )
                            Text(text = "•", fontSize = 9.sp, color = TextMuted)
                            Text(text = s.timeAgo, fontSize = 9.sp, color = TextMuted)
                        }

                        Spacer(modifier = Modifier.height(2.dp))

                        Text(
                            text = s.title,
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.White,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis
                        )

                        Spacer(modifier = Modifier.height(3.dp))

                        Text(
                            text = s.desc,
                            fontSize = 11.sp,
                            color = TextSecondary,
                            maxLines = 2,
                            overflow = TextOverflow.Ellipsis
                        )
                    }
                }
            }
        }
    }
}
