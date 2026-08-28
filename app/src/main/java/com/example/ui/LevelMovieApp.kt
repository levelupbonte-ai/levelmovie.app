package com.example.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
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
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import coil.compose.AsyncImage
import com.example.data.MovieItem
import com.example.ui.components.LevelMovieBrand
import com.example.ui.dialogs.DonaAiDialog
import com.example.ui.dialogs.MovieDetailDialog
import com.example.ui.dialogs.SettingsDialog
import com.example.ui.screens.*
import com.example.ui.theme.*

sealed class Screen(val route: String, val title: String, val icon: ImageVector) {
    object Home : Screen("home", "Accueil", Icons.Default.Home)
    object Explore : Screen("explore", "Explorer", Icons.Default.Search)
    object Party : Screen("party", "Watch Party", Icons.Default.Groups)
    object Watchlist : Screen("watchlist", "Ma Liste", Icons.Default.Bookmark)
    object Ecosystem : Screen("ecosystem", "Écosystème", Icons.Default.Apps)
}

@Composable
fun LevelMovieApp(
    viewModel: LevelMovieViewModel = viewModel()
) {
    var currentScreen by remember { mutableStateOf<Screen>(Screen.Home) }
    var showDonaDialog by remember { mutableStateOf(false) }
    var showSettingsDialog by remember { mutableStateOf(false) }

    val selectedMovie by viewModel.selectedMovie.collectAsState()
    val profile by viewModel.userProfile.collectAsState()

    val screens = listOf(
        Screen.Home,
        Screen.Explore,
        Screen.Party,
        Screen.Watchlist,
        Screen.Ecosystem
    )

    Scaffold(
        topBar = {
            TopAppBar(
                title = { LevelMovieBrand() },
                actions = {
                    // Dona AI Trigger Button
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(12.dp))
                            .background(
                                Brush.linearGradient(listOf(PurpleDark, PurpleNeon))
                            )
                            .border(1.dp, PurpleLight.copy(alpha = 0.5f), RoundedCornerShape(12.dp))
                            .clickable { showDonaDialog = true }
                            .padding(horizontal = 10.dp, vertical = 6.dp)
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(4.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.AutoAwesome,
                                contentDescription = "Dona AI",
                                tint = AmberAccent,
                                modifier = Modifier.size(16.dp)
                            )
                            Text(
                                text = "Dona IA",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Black,
                                color = Color.White
                            )
                        }
                    }

                    Spacer(modifier = Modifier.width(10.dp))

                    // Profile Avatar / Settings
                    IconButton(
                        onClick = { showSettingsDialog = true },
                        modifier = Modifier.size(38.dp)
                    ) {
                        AsyncImage(
                            model = profile.avatarUrl,
                            contentDescription = "Profil",
                            contentScale = ContentScale.Crop,
                            modifier = Modifier
                                .fillMaxSize()
                                .clip(CircleShape)
                                .border(1.5.dp, CyanAccent, CircleShape)
                        )
                    }

                    Spacer(modifier = Modifier.width(6.dp))
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = BgDark
                )
            )
        },
        bottomBar = {
            NavigationBar(
                containerColor = BgCard,
                tonalElevation = 8.dp,
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, GlassBorder)
            ) {
                screens.forEach { screen ->
                    val isSelected = currentScreen == screen
                    NavigationBarItem(
                        selected = isSelected,
                        onClick = { currentScreen = screen },
                        icon = {
                            Icon(
                                imageVector = screen.icon,
                                contentDescription = screen.title,
                                modifier = Modifier.size(22.dp)
                            )
                        },
                        label = {
                            Text(
                                text = screen.title,
                                fontSize = 10.sp,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal
                            )
                        },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = PurpleNeon,
                            selectedTextColor = PurpleNeon,
                            unselectedIconColor = TextMuted,
                            unselectedTextColor = TextMuted,
                            indicatorColor = PurpleDark.copy(alpha = 0.35f)
                        )
                    )
                }
            }
        },
        containerColor = BgDark
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            when (currentScreen) {
                Screen.Home -> HomeScreen(
                    viewModel = viewModel,
                    onStartWatchParty = { movie ->
                        viewModel.createWatchParty(movie, profile.displayName)
                        currentScreen = Screen.Party
                    }
                )
                Screen.Explore -> ExploreScreen(viewModel = viewModel)
                Screen.Party -> PartyScreen(viewModel = viewModel)
                Screen.Watchlist -> WatchlistScreen(viewModel = viewModel)
                Screen.Ecosystem -> EcosystemHubScreen(viewModel = viewModel)
            }
        }
    }

    // Movie Detail Dialog
    if (selectedMovie != null) {
        MovieDetailDialog(
            movie = selectedMovie!!,
            viewModel = viewModel,
            onDismiss = { viewModel.closeMovieDetails() },
            onStartWatchParty = { movie ->
                viewModel.createWatchParty(movie, profile.displayName)
                currentScreen = Screen.Party
            }
        )
    }

    // Dona AI Dialog
    if (showDonaDialog) {
        DonaAiDialog(
            viewModel = viewModel,
            onDismiss = { showDonaDialog = false }
        )
    }

    // Settings Dialog
    if (showSettingsDialog) {
        SettingsDialog(
            viewModel = viewModel,
            onDismiss = { showSettingsDialog = false }
        )
    }
}
