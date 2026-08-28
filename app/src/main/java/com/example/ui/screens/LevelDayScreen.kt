package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
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
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.getWeatherDescription
import com.example.ui.LevelMovieViewModel
import com.example.ui.theme.*

@Composable
fun LevelDayScreen(
    viewModel: LevelMovieViewModel,
    modifier: Modifier = Modifier
) {
    val weatherData by viewModel.weatherData.collectAsState()
    val currentCity by viewModel.currentCity.collectAsState()
    val searchResults by viewModel.citySearchResults.collectAsState()
    val isLoading by viewModel.isWeatherLoading.collectAsState()

    var cityQuery by remember { mutableStateOf("") }
    var isFahrenheit by remember { mutableStateOf(false) }

    fun formatTemp(celsius: Double): String {
        return if (isFahrenheit) {
            val f = (celsius * 9 / 5) + 32
            "${f.toInt()}°F"
        } else {
            "${celsius.toInt()}°C"
        }
    }

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(BgDark)
            .padding(horizontal = 16.dp),
        contentPadding = PaddingValues(top = 12.dp, bottom = 90.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        // City Search Bar & Unit Toggle
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                TextField(
                    value = cityQuery,
                    onValueChange = {
                        cityQuery = it
                        viewModel.searchWeatherCities(it)
                    },
                    placeholder = { Text("Rechercher une ville (Paris, Abidjan...)", fontSize = 12.sp, color = TextMuted) },
                    leadingIcon = { Icon(Icons.Default.Search, contentDescription = null, tint = CyanAccent) },
                    singleLine = true,
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(14.dp)),
                    colors = TextFieldDefaults.colors(
                        focusedContainerColor = BgCard,
                        unfocusedContainerColor = BgCard,
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White
                    )
                )

                Button(
                    onClick = { isFahrenheit = !isFahrenheit },
                    colors = ButtonDefaults.buttonColors(containerColor = BgCardLighter),
                    shape = RoundedCornerShape(14.dp)
                ) {
                    Text(if (isFahrenheit) "°F" else "°C", fontWeight = FontWeight.Bold, color = CyanAccent)
                }
            }
        }

        // Search Suggestions Dropdown list
        if (cityQuery.isNotEmpty() && searchResults.isNotEmpty()) {
            items(searchResults) { city ->
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(10.dp))
                        .background(BgCardLighter)
                        .clickable {
                            viewModel.loadWeatherData(city.latitude, city.longitude, city.name)
                            cityQuery = ""
                        }
                        .padding(12.dp)
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Icon(Icons.Default.LocationOn, contentDescription = null, tint = CyanAccent, modifier = Modifier.size(16.dp))
                        Text("${city.name}, ${city.country ?: ""}", fontSize = 12.sp, color = Color.White, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }

        if (isLoading) {
            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(40.dp),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator(color = CyanAccent)
                }
            }
        } else if (weatherData?.current != null) {
            val cur = weatherData!!.current!!
            val (desc, emoji) = getWeatherDescription(cur.weatherCode)

            // Current Weather Hero Card
            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(24.dp))
                        .background(
                            Brush.linearGradient(listOf(Color(0xFF0C1938), BgCard))
                        )
                        .border(1.dp, CyanAccent.copy(alpha = 0.3f), RoundedCornerShape(24.dp))
                        .padding(24.dp)
                ) {
                    Column(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Icon(Icons.Default.LocationOn, contentDescription = null, tint = CyanAccent, modifier = Modifier.size(18.dp))
                            Text(currentCity, fontSize = 20.sp, fontWeight = FontWeight.Black, color = Color.White)
                        }

                        Spacer(modifier = Modifier.height(10.dp))

                        Text(emoji, fontSize = 54.sp)

                        Spacer(modifier = Modifier.height(6.dp))

                        Text(
                            text = formatTemp(cur.temperature2m),
                            fontSize = 48.sp,
                            fontWeight = FontWeight.Black,
                            color = Color.White
                        )

                        Text(
                            text = desc,
                            fontSize = 14.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = CyanAccent
                        )

                        Spacer(modifier = Modifier.height(16.dp))

                        // Secondary Stats Row
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceEvenly
                        ) {
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Icon(Icons.Default.WaterDrop, contentDescription = null, tint = BlueAccent, modifier = Modifier.size(18.dp))
                                Spacer(modifier = Modifier.height(4.dp))
                                Text("${cur.relativeHumidity2m}%", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color.White)
                                Text("Humidité", fontSize = 10.sp, color = TextMuted)
                            }

                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Icon(Icons.Default.Air, contentDescription = null, tint = CyanAccent, modifier = Modifier.size(18.dp))
                                Spacer(modifier = Modifier.height(4.dp))
                                Text("${cur.windSpeed10m} km/h", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color.White)
                                Text("Vent", fontSize = 10.sp, color = TextMuted)
                            }

                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Icon(Icons.Default.Thermostat, contentDescription = null, tint = AmberAccent, modifier = Modifier.size(18.dp))
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(formatTemp(cur.apparentTemperature), fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color.White)
                                Text("Ressenti", fontSize = 10.sp, color = TextMuted)
                            }
                        }
                    }
                }
            }

            // Hourly Forecast
            if (weatherData?.hourly != null) {
                val h = weatherData!!.hourly!!
                item {
                    Text(
                        text = "Prévisions Heure par Heure",
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    LazyRow(
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        items(h.time.take(12).indices.toList()) { idx ->
                            val hourStr = h.time[idx].takeLast(5)
                            val temp = h.temperature2m.getOrElse(idx) { 0.0 }
                            val code = h.weatherCode.getOrElse(idx) { 0 }
                            val (_, hourEmoji) = getWeatherDescription(code)

                            Card(
                                shape = RoundedCornerShape(14.dp),
                                colors = CardDefaults.cardColors(containerColor = BgCard),
                                border = CardDefaults.outlinedCardBorder().copy(brush = androidx.compose.ui.graphics.SolidColor(GlassBorder))
                            ) {
                                Column(
                                    modifier = Modifier.padding(horizontal = 14.dp, vertical = 10.dp),
                                    horizontalAlignment = Alignment.CenterHorizontally
                                ) {
                                    Text(hourStr, fontSize = 11.sp, color = TextSecondary)
                                    Spacer(modifier = Modifier.height(4.dp))
                                    Text(hourEmoji, fontSize = 20.sp)
                                    Spacer(modifier = Modifier.height(4.dp))
                                    Text(formatTemp(temp), fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color.White)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
