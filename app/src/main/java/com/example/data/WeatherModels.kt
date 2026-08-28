package com.example.data

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class OpenMeteoHourly(
    val time: List<String> = emptyList(),
    @SerialName("temperature_2m") val temperature2m: List<Double> = emptyList(),
    @SerialName("relative_humidity_2m") val relativeHumidity2m: List<Int> = emptyList(),
    @SerialName("weather_code") val weatherCode: List<Int> = emptyList(),
    @SerialName("wind_speed_10m") val windSpeed10m: List<Double> = emptyList()
)

@Serializable
data class OpenMeteoDaily(
    val time: List<String> = emptyList(),
    @SerialName("temperature_2m_max") val temperature2mMax: List<Double> = emptyList(),
    @SerialName("temperature_2m_min") val temperature2mMin: List<Double> = emptyList(),
    @SerialName("weather_code") val weatherCode: List<Int> = emptyList()
)

@Serializable
data class OpenMeteoCurrent(
    val time: String = "",
    @SerialName("temperature_2m") val temperature2m: Double = 0.0,
    @SerialName("relative_humidity_2m") val relativeHumidity2m: Int = 0,
    @SerialName("apparent_temperature") val apparentTemperature: Double = 0.0,
    @SerialName("is_day") val isDay: Int = 1,
    @SerialName("weather_code") val weatherCode: Int = 0,
    @SerialName("wind_speed_10m") val windSpeed10m: Double = 0.0
)

@Serializable
data class OpenMeteoResponse(
    val latitude: Double = 0.0,
    val longitude: Double = 0.0,
    val timezone: String = "",
    val current: OpenMeteoCurrent? = null,
    val hourly: OpenMeteoHourly? = null,
    val daily: OpenMeteoDaily? = null
)

@Serializable
data class GeocodingItem(
    val id: Long = 0,
    val name: String = "",
    val latitude: Double = 0.0,
    val longitude: Double = 0.0,
    val country: String? = null,
    @SerialName("admin1") val region: String? = null
)

@Serializable
data class GeocodingResponse(
    val results: List<GeocodingItem> = emptyList()
)

fun getWeatherDescription(code: Int): Pair<String, String> {
    return when (code) {
        0 -> Pair("Ciel dégagé", "☀️")
        1 -> Pair("Principalement dégagé", "🌤️")
        2 -> Pair("Partiellement nuageux", "⛅")
        3 -> Pair("Couvert", "☁️")
        45, 48 -> Pair("Brouillard givrant", "🌫️")
        51, 53, 55 -> Pair("Bruine légère", "🌦️")
        61, 63, 65 -> Pair("Pluie continue", "🌧️")
        71, 73, 75 -> Pair("Chutes de neige", "❄️")
        80, 81, 82 -> Pair("Averses d'orage", "⛈️")
        95, 96, 99 -> Pair("Orages violents", "⚡")
        else -> Pair("Temps variable", "🌥️")
    }
}
