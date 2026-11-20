using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DpuKampus.Server.Data;
using DpuKampus.Server.Models;

namespace DpuKampus.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MarketplaceController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MarketplaceController(AppDbContext context)
        {
            _context = context;
        }

        public class CreateListingDto
        {
            public string Title { get; set; } = string.Empty;
            public string Description { get; set; } = string.Empty;
            public decimal Price { get; set; }
            public string Condition { get; set; } = "İyi";
            public string Category { get; set; } = "Genel";
            public string PickupPoint { get; set; } = "Merkez Kütüphane";
            public string ImageUrl { get; set; } = string.Empty;
            public bool IsFree { get; set; } = false;
        }

        [HttpGet]
        public async Task<IActionResult> GetListings([FromQuery] string? category, [FromQuery] string? search)
        {
            var query = _context.Listings.Include(l => l.Seller).Where(l => l.IsActive).AsQueryable();

            if (!string.IsNullOrEmpty(category) && category != "Tümü")
            {
                query = query.Where(l => l.Category == category);
            }

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(l => l.Title.Contains(search) || l.Description.Contains(search));
            }

            var list = await query.OrderByDescending(l => l.CreatedAt).ToListAsync();
            return Ok(list);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetListingById(string id)
        {
            var item = await _context.Listings.Include(l => l.Seller).FirstOrDefaultAsync(l => l.Id == id);
            if (item == null) return NotFound(new { message = "İlan bulunamadı." });
            return Ok(item);
        }

        [HttpPost]
        public async Task<IActionResult> CreateListing([FromBody] CreateListingDto dto)
        {
            var seller = await _context.Users.FirstOrDefaultAsync() ?? new User
            {
                Id = "u1",
                FullName = "Efe Alsaç",
                Email = "efe.alsac@ogr.dpu.edu.tr",
                Faculty = "Mühendislik Fakültesi"
            };

            var listing = new Listing
            {
                Id = "l_" + Guid.NewGuid().ToString("N")[..8],
                Title = dto.Title,
                Description = dto.Description,
                Price = dto.IsFree ? 0 : dto.Price,
                Condition = dto.Condition,
                Category = dto.Category,
                PickupPoint = dto.PickupPoint,
                ImageUrl = string.IsNullOrEmpty(dto.ImageUrl) ? "/images/products/hesap-makinesi.svg" : dto.ImageUrl,
                SellerId = seller.Id,
                Seller = seller,
                IsFree = dto.IsFree,
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };

            _context.Listings.Add(listing);
            await _context.SaveChangesAsync();
            return Ok(listing);
        }
    }
}
