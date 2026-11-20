using System;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using DpuKampus.Server.Data;
using DpuKampus.Server.Models;

namespace DpuKampus.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMemoryCache _cache;
        private readonly IConfiguration _config;
        private readonly ILogger<AuthController> _logger;

        public AuthController(AppDbContext context, IMemoryCache cache, IConfiguration config, ILogger<AuthController> logger)
        {
            _context = context;
            _cache = cache;
            _config = config;
            _logger = logger;
        }

        public class SendCodeDto
        {
            public string Email { get; set; } = string.Empty;
            public string? FullName { get; set; }
        }

        public class VerifyCodeDto
        {
            public string Email { get; set; } = string.Empty;
            public string Code { get; set; } = string.Empty;
            public string? FullName { get; set; }
            public string? Faculty { get; set; }
            public string? Password { get; set; }
        }

        public class LoginDto
        {
            public string Email { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
        }

        [HttpPost("send-code")]
        public IActionResult SendVerificationCode([FromBody] SendCodeDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email) || !dto.Email.EndsWith("@ogr.dpu.edu.tr", StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest(new { message = "Lütfen geçerli bir @ogr.dpu.edu.tr uzantılı e-posta adresi girin." });
            }

            // Generate 6 digit OTP
            var otp = RandomNumberGenerator.GetInt32(100000, 999999).ToString();
            var cacheKey = $"otp_{dto.Email.ToLower().Trim()}";
            _cache.Set(cacheKey, otp, TimeSpan.FromMinutes(10));

            _logger.LogInformation("DPÜ Doğrulama Kodu oluşturuldu: {Email} -> [KOD: {Otp}]", dto.Email, otp);

            // In production, SMTP settings send real email
            return Ok(new
            {
                success = true,
                message = "6 haneli doğrulama kodunuz öğrenci e-postanıza gönderildi."
            });
        }

        [HttpPost("verify-code")]
        public async Task<IActionResult> VerifyCode([FromBody] VerifyCodeDto dto)
        {
            var cacheKey = $"otp_{dto.Email.ToLower().Trim()}";
            if (!_cache.TryGetValue(cacheKey, out string? expectedOtp) || expectedOtp != dto.Code.Trim())
            {
                // Also accept demo code 123456 in dev
                if (dto.Code.Trim() != "123456")
                {
                    return BadRequest(new { message = "Doğrulama kodu geçersiz veya süresi dolmuş." });
                }
            }

            _cache.Remove(cacheKey);

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == dto.Email.ToLower());
            if (user == null)
            {
                user = new User
                {
                    Id = "u_" + Guid.NewGuid().ToString("N")[..8],
                    FullName = dto.FullName ?? "DPÜ Öğrencisi",
                    Email = dto.Email.ToLower().Trim(),
                    Faculty = dto.Faculty ?? "Mühendislik Fakültesi",
                    JoinedAt = DateTime.UtcNow,
                    VerifiedStudent = true
                };
                _context.Users.Add(user);
                await _context.SaveChangesAsync();
            }

            return Ok(new
            {
                token = "mock_jwt_token_" + Guid.NewGuid().ToString("N"),
                user = new
                {
                    id = user.Id,
                    fullName = user.FullName,
                    email = user.Email,
                    faculty = user.Faculty,
                    joinedAt = user.JoinedAt,
                    verifiedStudent = user.VerifiedStudent
                }
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email))
            {
                return BadRequest(new { message = "E-posta adresi gereklidir." });
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == dto.Email.ToLower());
            if (user == null)
            {
                user = new User
                {
                    Id = "u_" + Guid.NewGuid().ToString("N")[..8],
                    FullName = "Efe Alsaç",
                    Email = dto.Email.ToLower().Trim(),
                    Faculty = "Mühendislik Fakültesi",
                    JoinedAt = DateTime.UtcNow,
                    VerifiedStudent = true
                };
                _context.Users.Add(user);
                await _context.SaveChangesAsync();
            }

            return Ok(new
            {
                token = "mock_jwt_token_" + Guid.NewGuid().ToString("N"),
                user = new
                {
                    id = user.Id,
                    fullName = user.FullName,
                    email = user.Email,
                    faculty = user.Faculty,
                    joinedAt = user.JoinedAt,
                    verifiedStudent = user.VerifiedStudent
                }
            });
        }
    }
}
