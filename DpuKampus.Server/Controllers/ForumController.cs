using System;
using System.Collections.Generic;
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
    public class ForumController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<ForumController> _logger;

        public ForumController(AppDbContext context, ILogger<ForumController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // DTOs for clean JSON serialization
        public class CreatePostDto
        {
            public string Content { get; set; } = string.Empty;
            public string Topic { get; set; } = "#Genel";
            public bool IsAnonymous { get; set; } = false;
        }

        public class CreateCommentDto
        {
            public string Content { get; set; } = string.Empty;
            public bool IsAnonymous { get; set; } = false;
        }

        public class ReportDto
        {
            public string Reason { get; set; } = "Uygunsuz İçerik";
        }

        // GET: api/forum?topic=#Genel&sort=latest
        [HttpGet]
        public async Task<IActionResult> GetPosts([FromQuery] string? topic, [FromQuery] string? sort = "latest")
        {
            try
            {
                var query = _context.ForumPosts
                    .Include(p => p.Author)
                    .Include(p => p.Comments)
                        .ThenInclude(c => c.Author)
                    .Include(p => p.Likes)
                    .AsQueryable();

                if (!string.IsNullOrEmpty(topic) && topic != "Tümü")
                {
                    query = query.Where(p => p.Topic == topic);
                }

                var list = await query.ToListAsync();

                // Sort
                if (sort == "popular")
                {
                    list = list
                        .OrderByDescending(p => p.Likes.Count * 3 + p.Comments.Count * 2 + p.ViewCount * 0.1)
                        .ToList();
                }
                else
                {
                    list = list.OrderByDescending(p => p.CreatedAt).ToList();
                }

                // Map to frontend friendly shape
                var result = list.Select(p => new
                {
                    id = p.Id,
                    author = p.IsAnonymous ? new
                    {
                        id = "anon",
                        fullName = $"Anonim {p.Author?.Faculty ?? "Öğrenci"}",
                        email = "anon@ogr.dpu.edu.tr",
                        faculty = p.Author?.Faculty ?? "DPÜ",
                        joinedAt = p.CreatedAt,
                        verifiedStudent = true
                    } : new
                    {
                        id = p.Author?.Id ?? "u0",
                        fullName = p.Author?.FullName ?? "DPÜ Öğrencisi",
                        email = p.Author?.Email ?? "ogrenci@ogr.dpu.edu.tr",
                        faculty = p.Author?.Faculty ?? "DPÜ",
                        joinedAt = p.Author?.JoinedAt ?? DateTime.UtcNow,
                        verifiedStudent = p.Author?.VerifiedStudent ?? true
                    },
                    content = p.Content,
                    topic = p.Topic,
                    isAnonymous = p.IsAnonymous,
                    createdAt = p.CreatedAt,
                    likeCount = p.Likes.Count,
                    hasLiked = false,
                    commentCount = p.Comments.Count,
                    viewCount = p.ViewCount,
                    comments = p.Comments.OrderBy(c => c.CreatedAt).Select(c => new
                    {
                        id = c.Id,
                        postId = c.PostId,
                        author = c.IsAnonymous ? new
                        {
                            id = "anon",
                            fullName = "Anonim Öğrenci",
                            email = "anon@ogr.dpu.edu.tr",
                            faculty = c.Author?.Faculty ?? "DPÜ",
                            joinedAt = c.CreatedAt,
                            verifiedStudent = true
                        } : new
                        {
                            id = c.Author?.Id ?? "u0",
                            fullName = c.Author?.FullName ?? "Öğrenci",
                            email = c.Author?.Email ?? "",
                            faculty = c.Author?.Faculty ?? "",
                            joinedAt = c.Author?.JoinedAt ?? DateTime.UtcNow,
                            verifiedStudent = true
                        },
                        content = c.Content,
                        createdAt = c.CreatedAt,
                        isAnonymous = c.IsAnonymous
                    })
                });

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetPosts hatası");
                return StatusCode(500, new { message = "Sunucu hatası", error = ex.Message });
            }
        }

        // GET: api/forum/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPostById(string id)
        {
            var post = await _context.ForumPosts
                .Include(p => p.Author)
                .Include(p => p.Comments).ThenInclude(c => c.Author)
                .Include(p => p.Likes)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (post == null) return NotFound(new { message = "Gönderi bulunamadı." });

            return Ok(new
            {
                id = post.Id,
                author = post.Author,
                content = post.Content,
                topic = post.Topic,
                isAnonymous = post.IsAnonymous,
                createdAt = post.CreatedAt,
                likeCount = post.Likes.Count,
                commentCount = post.Comments.Count,
                viewCount = post.ViewCount,
                comments = post.Comments
            });
        }

        // POST: api/forum
        [HttpPost]
        public async Task<IActionResult> CreatePost([FromBody] CreatePostDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Content))
            {
                return BadRequest(new { message = "Gönderi içeriği boş olamaz." });
            }

            var author = await _context.Users.FirstOrDefaultAsync() ?? new User
            {
                Id = "u1",
                FullName = "Efe Alsaç",
                Email = "efe.alsac@ogr.dpu.edu.tr",
                Faculty = "Mühendislik Fakültesi"
            };

            var post = new ForumPost
            {
                Id = "fp_" + Guid.NewGuid().ToString("N")[..8],
                AuthorId = author.Id,
                Author = author,
                Content = dto.Content.Trim(),
                Topic = string.IsNullOrWhiteSpace(dto.Topic) ? "#Genel" : dto.Topic,
                IsAnonymous = dto.IsAnonymous,
                CreatedAt = DateTime.UtcNow,
                ViewCount = 1
            };

            _context.ForumPosts.Add(post);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                id = post.Id,
                author = post.IsAnonymous ? new
                {
                    id = "anon",
                    fullName = $"Anonim {author.Faculty}",
                    email = "anon@ogr.dpu.edu.tr",
                    faculty = author.Faculty,
                    joinedAt = DateTime.UtcNow,
                    verifiedStudent = true
                } : new
                {
                    id = author.Id,
                    fullName = author.FullName,
                    email = author.Email,
                    faculty = author.Faculty,
                    joinedAt = author.JoinedAt,
                    verifiedStudent = author.VerifiedStudent
                },
                content = post.Content,
                topic = post.Topic,
                isAnonymous = post.IsAnonymous,
                createdAt = post.CreatedAt,
                likeCount = 0,
                hasLiked = false,
                commentCount = 0,
                viewCount = 1,
                comments = Array.Empty<object>()
            });
        }

        // POST: api/forum/{id}/like
        [HttpPost("{id}/like")]
        public async Task<IActionResult> ToggleLike(string id)
        {
            var post = await _context.ForumPosts.Include(p => p.Likes).FirstOrDefaultAsync(p => p.Id == id);
            if (post == null) return NotFound(new { message = "Gönderi bulunamadı." });

            var defaultUserId = "u1"; // Current user
            var existingLike = post.Likes.FirstOrDefault(l => l.UserId == defaultUserId);

            bool liked;
            if (existingLike != null)
            {
                _context.ForumPostLikes.Remove(existingLike);
                liked = false;
            }
            else
            {
                _context.ForumPostLikes.Add(new ForumPostLike
                {
                    PostId = id,
                    UserId = defaultUserId,
                    CreatedAt = DateTime.UtcNow
                });
                liked = true;
            }

            await _context.SaveChangesAsync();

            var newCount = await _context.ForumPostLikes.CountAsync(l => l.PostId == id);
            return Ok(new { liked, count = newCount });
        }

        // POST: api/forum/{id}/view
        [HttpPost("{id}/view")]
        public async Task<IActionResult> IncrementView(string id)
        {
            var post = await _context.ForumPosts.FindAsync(id);
            if (post == null) return NotFound();

            post.ViewCount += 1;
            await _context.SaveChangesAsync();
            return Ok(new { viewCount = post.ViewCount });
        }

        // POST: api/forum/{id}/comments
        [HttpPost("{id}/comments")]
        public async Task<IActionResult> AddComment(string id, [FromBody] CreateCommentDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Content))
            {
                return BadRequest(new { message = "Yorum içeriği boş olamaz." });
            }

            var post = await _context.ForumPosts.FindAsync(id);
            if (post == null) return NotFound(new { message = "Gönderi bulunamadı." });

            var author = await _context.Users.FirstOrDefaultAsync() ?? new User
            {
                Id = "u1",
                FullName = "Efe Alsaç",
                Email = "efe.alsac@ogr.dpu.edu.tr",
                Faculty = "Mühendislik Fakültesi"
            };

            var comment = new ForumComment
            {
                Id = "fc_" + Guid.NewGuid().ToString("N")[..8],
                PostId = id,
                AuthorId = author.Id,
                Author = author,
                Content = dto.Content.Trim(),
                IsAnonymous = dto.IsAnonymous,
                CreatedAt = DateTime.UtcNow
            };

            _context.ForumComments.Add(comment);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                id = comment.Id,
                postId = comment.PostId,
                author = comment.IsAnonymous ? new
                {
                    id = "anon",
                    fullName = "Anonim Öğrenci",
                    email = "anon@ogr.dpu.edu.tr",
                    faculty = author.Faculty,
                    joinedAt = DateTime.UtcNow,
                    verifiedStudent = true
                } : new
                {
                    id = author.Id,
                    fullName = author.FullName,
                    email = author.Email,
                    faculty = author.Faculty,
                    joinedAt = author.JoinedAt,
                    verifiedStudent = author.VerifiedStudent
                },
                content = comment.Content,
                createdAt = comment.CreatedAt,
                isAnonymous = comment.IsAnonymous
            });
        }

        // POST: api/forum/{id}/report
        [HttpPost("{id}/report")]
        public async Task<IActionResult> ReportPost(string id, [FromBody] ReportDto dto)
        {
            _context.Reports.Add(new Report
            {
                TargetId = id,
                TargetType = "ForumPost",
                Reason = dto.Reason,
                ReportedById = "u1",
                CreatedAt = DateTime.UtcNow,
                IsHandled = false
            });

            await _context.SaveChangesAsync();
            return Ok(new
            {
                success = true,
                message = "Bildiriminiz moderatör ekibimize iletildi. İnceleme sonrası gerekli işlem yapılacaktır."
            });
        }
    }
}
