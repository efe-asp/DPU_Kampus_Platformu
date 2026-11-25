using System.Globalization;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace DpuKampus.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WeatherController : ControllerBase
{
    private const string CacheKey = "weather_kutahya";
    private const string OpenMeteoUrl =
        "https://api.open-meteo.com/v1/forecast?latitude=39.4811&longitude=29.8986&elevation=970&current=temperature_2m,weather_code&timezone=Europe%2FIstanbul";
    private const string WttrUrl = "https://wttr.in/Kutahya?format=j1";

    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IMemoryCache _cache;
    private readonly ILogger<WeatherController> _logger;

    public WeatherController(
        IHttpClientFactory httpClientFactory,
        IMemoryCache cache,
        ILogger<WeatherController> logger)
    {
        _httpClientFactory = httpClientFactory;
        _cache = cache;
        _logger = logger;
    }

    [HttpGet("kutahya")]
    public async Task<ActionResult<WeatherResponse>> GetKutahyaWeather(CancellationToken cancellationToken)
    {
        if (_cache.TryGetValue(CacheKey, out WeatherResponse? cached) && cached is not null)
        {
            return Ok(cached);
        }

        var client = _httpClientFactory.CreateClient();
        client.Timeout = TimeSpan.FromSeconds(8);

        try
        {
            using var response = await client.GetAsync(OpenMeteoUrl, cancellationToken);
            response.EnsureSuccessStatusCode();

            await using var stream = await response.Content.ReadAsStreamAsync(cancellationToken);
            var payload = await JsonSerializer.DeserializeAsync<OpenMeteoResponse>(stream, cancellationToken: cancellationToken);

            if (payload?.Current is not null)
            {
                var temperature = (int)Math.Round(payload.Current.Temperature2m, MidpointRounding.AwayFromZero);
                var (condition, icon) = MapWmoWeatherCode(payload.Current.WeatherCode);

                var result = new WeatherResponse("Kütahya", temperature, condition, icon);
                _cache.Set(CacheKey, result, TimeSpan.FromMinutes(15));
                return Ok(result);
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Open-Meteo hava durumu alınamadı, wttr.in deneniyor.");
        }

        try
        {
            using var wttrResponse = await client.GetAsync(WttrUrl, cancellationToken);
            wttrResponse.EnsureSuccessStatusCode();

            await using var wttrStream = await wttrResponse.Content.ReadAsStreamAsync(cancellationToken);
            var wttrPayload = await JsonSerializer.DeserializeAsync<WttrResponse>(wttrStream, cancellationToken: cancellationToken);
            var current = wttrPayload?.CurrentCondition?.FirstOrDefault();

            if (current is not null &&
                double.TryParse(current.TempC, NumberStyles.Any, CultureInfo.InvariantCulture, out var tempDouble))
            {
                var temperature = (int)Math.Round(tempDouble, MidpointRounding.AwayFromZero);
                var result = new WeatherResponse("Kütahya", temperature, "Güncel", "cloud-sun");
                _cache.Set(CacheKey, result, TimeSpan.FromMinutes(15));
                return Ok(result);
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "wttr.in hava durumu alınamadı.");
        }

        return StatusCode(StatusCodes.Status503ServiceUnavailable, new { message = "Hava durumu alınamadı" });
    }

    private static (string Condition, string Icon) MapWmoWeatherCode(int code) => code switch
    {
        0 => ("Açık", "sun"),
        >= 1 and <= 3 => ("Parçalı Bulutlu", "cloud-sun"),
        45 or 48 => ("Sisli", "cloud"),
        (>= 51 and <= 67) or (>= 80 and <= 82) => ("Yağmurlu", "rain"),
        (>= 71 and <= 77) or 85 or 86 => ("Karlı", "snow"),
        >= 95 and <= 99 => ("Fırtınalı", "storm"),
        _ => ("Bulutlu", "cloud"),
    };

    public sealed record WeatherResponse(string City, int Temperature, string Condition, string Icon);

    private sealed class OpenMeteoResponse
    {
        [JsonPropertyName("current")]
        public OpenMeteoCurrent? Current { get; set; }
    }

    private sealed class OpenMeteoCurrent
    {
        [JsonPropertyName("temperature_2m")]
        public double Temperature2m { get; set; }

        [JsonPropertyName("weather_code")]
        public int WeatherCode { get; set; }
    }

    private sealed class WttrResponse
    {
        [JsonPropertyName("current_condition")]
        public List<WttrCurrentCondition>? CurrentCondition { get; set; }
    }

    private sealed class WttrCurrentCondition
    {
        [JsonPropertyName("temp_C")]
        public string? TempC { get; set; }
    }
}
