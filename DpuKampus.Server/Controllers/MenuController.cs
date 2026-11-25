using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DpuKampus.Server.Data;
using DpuKampus.Server.Models;
using DpuKampus.Server.Services;

namespace DpuKampus.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MenuController : ControllerBase
{
    private readonly AppDbContext _db;

    public MenuController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("today")]
    public async Task<ActionResult<MenuResponse>> GetTodayMenu(CancellationToken cancellationToken)
    {
        var today = MenuScraperBackgroundService.GetTurkeyToday();

        var menu = await _db.DailyMenus
            .AsNoTracking()
            .FirstOrDefaultAsync(m => m.MenuDate == today, cancellationToken);

        var isFallback = false;

        if (menu is null)
        {
            menu = await _db.DailyMenus
                .AsNoTracking()
                .OrderByDescending(m => m.MenuDate)
                .FirstOrDefaultAsync(cancellationToken);
            isFallback = true;
        }

        if (menu is null)
        {
            return NotFound(new { message = "Kayıtlı yemekhane menüsü bulunamadı." });
        }

        return Ok(ToMenuResponse(menu, isFallback));
    }

    [HttpPost("{id:int}/vote")]
    public async Task<ActionResult<VoteResponse>> Vote(int id, [FromBody] MenuVoteRequest request, CancellationToken cancellationToken)
    {
        var menu = await _db.DailyMenus.FirstOrDefaultAsync(m => m.Id == id, cancellationToken);
        if (menu is null)
        {
            return NotFound(new { message = "Menü bulunamadı." });
        }

        var normalized = request?.Vote?.Trim().ToLowerInvariant();
        switch (normalized)
        {
            case "like":
            case "liked":
                menu.LikeCount += 1;
                break;
            case "neutral":
            case "okay":
                menu.NeutralCount += 1;
                break;
            case "dislike":
            case "disliked":
                menu.DislikeCount += 1;
                break;
            default:
                return BadRequest(new { message = "Geçersiz oy türü. 'like', 'neutral' veya 'dislike' olmalıdır." });
        }

        await _db.SaveChangesAsync(cancellationToken);

        var (total, likePct, neutralPct, dislikePct) = CalculatePercentages(menu);
        return Ok(new VoteResponse(
            menu.Id,
            menu.LikeCount,
            menu.NeutralCount,
            menu.DislikeCount,
            total,
            likePct,
            neutralPct,
            dislikePct));
    }

    private static MenuResponse ToMenuResponse(DailyMenu menu, bool isFallback)
    {
        var (total, likePct, neutralPct, dislikePct) = CalculatePercentages(menu);
        return new MenuResponse(
            menu.Id,
            menu.MenuDate,
            menu.Starter,
            menu.MainCourse,
            menu.SideDish,
            menu.Complement,
            menu.LikeCount,
            menu.NeutralCount,
            menu.DislikeCount,
            total,
            likePct,
            neutralPct,
            dislikePct,
            isFallback);
    }

    private static (int Total, int LikePct, int NeutralPct, int DislikePct) CalculatePercentages(DailyMenu menu)
    {
        var total = menu.LikeCount + menu.NeutralCount + menu.DislikeCount;
        if (total <= 0)
        {
            return (0, 0, 0, 0);
        }

        var likePct = (int)Math.Round(menu.LikeCount * 100.0 / total);
        var neutralPct = (int)Math.Round(menu.NeutralCount * 100.0 / total);
        var dislikePct = Math.Max(0, 100 - likePct - neutralPct);
        return (total, likePct, neutralPct, dislikePct);
    }

    public sealed record MenuVoteRequest(string Vote);

    public sealed record MenuResponse(
        int Id,
        DateTime MenuDate,
        string Starter,
        string MainCourse,
        string SideDish,
        string Complement,
        int LikeCount,
        int NeutralCount,
        int DislikeCount,
        int TotalVotes,
        int LikePercent,
        int NeutralPercent,
        int DislikePercent,
        bool IsFallback);

    public sealed record VoteResponse(
        int Id,
        int LikeCount,
        int NeutralCount,
        int DislikeCount,
        int TotalVotes,
        int LikePercent,
        int NeutralPercent,
        int DislikePercent);
}
