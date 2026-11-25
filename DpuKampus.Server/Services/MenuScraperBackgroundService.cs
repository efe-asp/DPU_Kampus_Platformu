using System.Globalization;
using System.Net;
using HtmlAgilityPack;
using Microsoft.EntityFrameworkCore;
using DpuKampus.Server.Data;
using DpuKampus.Server.Models;

namespace DpuKampus.Server.Services;

public class MenuScraperBackgroundService : BackgroundService
{
    private const string MenuUrl = "https://dpu.edu.tr/index/yemek";
    private static readonly CultureInfo TurkishCulture = CultureInfo.GetCultureInfo("tr-TR");

    private readonly IServiceScopeFactory _scopeFactory;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<MenuScraperBackgroundService> _logger;

    public MenuScraperBackgroundService(
        IServiceScopeFactory scopeFactory,
        IHttpClientFactory httpClientFactory,
        ILogger<MenuScraperBackgroundService> logger)
    {
        _scopeFactory = scopeFactory;
        _httpClientFactory = httpClientFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        // Run immediately on startup, then every 2 hours
        await TryScrapeAndSaveMenuAsync(stoppingToken);

        using var timer = new PeriodicTimer(TimeSpan.FromHours(2));
        while (!stoppingToken.IsCancellationRequested &&
               await timer.WaitForNextTickAsync(stoppingToken))
        {
            await TryScrapeAndSaveMenuAsync(stoppingToken);
        }
    }

    private async Task TryScrapeAndSaveMenuAsync(CancellationToken cancellationToken)
    {
        try
        {
            var client = _httpClientFactory.CreateClient();
            client.Timeout = TimeSpan.FromSeconds(15);

            var html = await client.GetStringAsync(MenuUrl, cancellationToken);
            if (string.IsNullOrWhiteSpace(html))
            {
                return;
            }

            var doc = new HtmlDocument();
            doc.LoadHtml(html);

            var liNodes = doc.DocumentNode.SelectNodes(
                "//*[self::h1 or self::h2 or self::h3][contains(normalize-space(.), 'Öğrenci Yemek Listesi')]/following-sibling::ul[1]/li");

            if (liNodes is null || liNodes.Count == 0)
            {
                // Weekend / holiday or empty page — skip silently
                return;
            }

            var items = liNodes
                .Select(n => WebUtility.HtmlDecode(n.InnerText)?.Trim() ?? string.Empty)
                .Where(s => !string.IsNullOrWhiteSpace(s))
                .Select(ToTurkishTitleCase)
                .Take(4)
                .ToList();

            if (items.Count < 4)
            {
                return;
            }

            var todayTurkey = GetTurkeyToday();

            using var scope = _scopeFactory.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            var existing = await db.DailyMenus
                .FirstOrDefaultAsync(m => m.MenuDate == todayTurkey, cancellationToken);

            if (existing is null)
            {
                db.DailyMenus.Add(new DailyMenu
                {
                    MenuDate = todayTurkey,
                    Starter = items[0],
                    MainCourse = items[1],
                    SideDish = items[2],
                    Complement = items[3],
                    CreatedAt = DateTime.UtcNow,
                });
                await db.SaveChangesAsync(cancellationToken);
                _logger.LogInformation("DPÜ yemekhane menüsü kaydedildi ({Date}): {Starter}, {MainCourse}", todayTurkey.ToString("yyyy-MM-dd"), items[0], items[1]);
            }
            else if (existing.Starter != items[0] ||
                     existing.MainCourse != items[1] ||
                     existing.SideDish != items[2] ||
                     existing.Complement != items[3])
            {
                existing.Starter = items[0];
                existing.MainCourse = items[1];
                existing.SideDish = items[2];
                existing.Complement = items[3];
                await db.SaveChangesAsync(cancellationToken);
                _logger.LogInformation("DPÜ yemekhane menüsü güncellendi ({Date}).", todayTurkey.ToString("yyyy-MM-dd"));
            }
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
            // Graceful shutdown
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "DPÜ yemekhane menüsü çekilemedi, bir sonraki kontrol beklenecek.");
        }
    }

    private static string ToTurkishTitleCase(string input)
    {
        var lowered = input.Trim().ToLower(TurkishCulture);
        return TurkishCulture.TextInfo.ToTitleCase(lowered);
    }

    internal static DateTime GetTurkeyToday()
    {
        try
        {
            var tz = TimeZoneInfo.FindSystemTimeZoneById("Turkey Standard Time");
            return TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, tz).Date;
        }
        catch
        {
            return DateTime.UtcNow.AddHours(3).Date;
        }
    }
}
