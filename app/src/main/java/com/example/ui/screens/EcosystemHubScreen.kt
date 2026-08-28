package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.LevelMovieViewModel
import com.example.ui.theme.*

data class SubAppItem(
    val id: String,
    val title: String,
    val icon: ImageVector,
    val accentColor: Color
)

@Composable
fun EcosystemHubScreen(
    viewModel: LevelMovieViewModel,
    modifier: Modifier = Modifier
) {
    val subApps = listOf(
        SubAppItem("anime", "LevelAnime", Icons.Default.AutoAwesome, RoseAccent),
        SubAppItem("music", "LevelMusic", Icons.Default.MusicNote, PurpleNeon),
        SubAppItem("oppa", "LevelOppa", Icons.Default.Newspaper, AmberAccent),
        SubAppItem("reviews", "LevelReviews", Icons.Default.VerifiedUser, EmeraldAccent),
        SubAppItem("day", "LevelDay", Icons.Default.WbSunny, CyanAccent)
    )

    var selectedAppId by remember { mutableStateOf("anime") }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(BgDark)
    ) {
        // App Switcher Tabs
        LazyRow(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 10.dp),
            contentPadding = PaddingValues(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            items(subApps) { app ->
                val isSelected = selectedAppId == app.id
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(16.dp))
                        .background(if (isSelected) app.accentColor else BgCardLighter)
                        .border(1.dp, if (isSelected) Color.White.copy(alpha = 0.5f) else GlassBorder, RoundedCornerShape(16.dp))
                        .clickable { selectedAppId = app.id }
                        .padding(horizontal = 14.dp, vertical = 8.dp)
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Icon(
                            imageVector = app.icon,
                            contentDescription = null,
                            tint = if (isSelected) Color.Black else app.accentColor,
                            modifier = Modifier.size(16.dp)
                        )
                        Text(
                            text = app.title,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (isSelected) Color.Black else Color.White
                        )
                    }
                }
            }
        }

        // Sub App View Content
        Box(modifier = Modifier.weight(1f)) {
            when (selectedAppId) {
                "anime" -> LevelAnimeScreen(viewModel = viewModel)
                "music" -> LevelMusicScreen(viewModel = viewModel)
                "oppa" -> LevelOppaScreen(viewModel = viewModel)
                "reviews" -> LevelReviewsScreen(viewModel = viewModel)
                "day" -> LevelDayScreen(viewModel = viewModel)
            }
        }
    }
}
