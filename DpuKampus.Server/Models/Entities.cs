using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DpuKampus.Server.Models
{
    public class User
    {
        [Key]
        [MaxLength(64)]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        [MaxLength(128)]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [MaxLength(128)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MaxLength(128)]
        public string Faculty { get; set; } = string.Empty;

        [MaxLength(256)]
        public string? PasswordHash { get; set; }

        [MaxLength(512)]
        public string? AvatarUrl { get; set; }

        public DateTime JoinedAt { get; set; } = DateTime.UtcNow;

        public bool VerifiedStudent { get; set; } = true;

        // Navigation
        public List<Listing> Listings { get; set; } = new();
        public List<ForumPost> ForumPosts { get; set; } = new();
        public List<ForumComment> ForumComments { get; set; } = new();
        public List<ForumPostLike> ForumLikes { get; set; } = new();
    }

    public class ForumPost
    {
        [Key]
        [MaxLength(64)]
        public string Id { get; set; } = "fp_" + Guid.NewGuid().ToString("N");

        [Required]
        [MaxLength(64)]
        public string AuthorId { get; set; } = string.Empty;

        [ForeignKey("AuthorId")]
        public User? Author { get; set; }

        [Required]
        [MaxLength(500)]
        public string Content { get; set; } = string.Empty;

        [Required]
        [MaxLength(32)]
        public string Topic { get; set; } = "#Genel";

        public bool IsAnonymous { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public int ViewCount { get; set; } = 1;

        // Navigation
        public List<ForumComment> Comments { get; set; } = new();
        public List<ForumPostLike> Likes { get; set; } = new();
    }

    public class ForumComment
    {
        [Key]
        [MaxLength(64)]
        public string Id { get; set; } = "fc_" + Guid.NewGuid().ToString("N");

        [Required]
        [MaxLength(64)]
        public string PostId { get; set; } = string.Empty;

        [ForeignKey("PostId")]
        public ForumPost? Post { get; set; }

        [Required]
        [MaxLength(64)]
        public string AuthorId { get; set; } = string.Empty;

        [ForeignKey("AuthorId")]
        public User? Author { get; set; }

        [Required]
        [MaxLength(500)]
        public string Content { get; set; } = string.Empty;

        public bool IsAnonymous { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class ForumPostLike
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(64)]
        public string PostId { get; set; } = string.Empty;

        [ForeignKey("PostId")]
        public ForumPost? Post { get; set; }

        [Required]
        [MaxLength(64)]
        public string UserId { get; set; } = string.Empty;

        [ForeignKey("UserId")]
        public User? User { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class Listing
    {
        [Key]
        [MaxLength(64)]
        public string Id { get; set; } = "l_" + Guid.NewGuid().ToString("N");

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        public decimal Price { get; set; } = 0;

        [Required]
        [MaxLength(32)]
        public string Condition { get; set; } = "İyi";

        [Required]
        [MaxLength(64)]
        public string Category { get; set; } = "Genel";

        [Required]
        [MaxLength(64)]
        public string PickupPoint { get; set; } = "Merkez Kütüphane";

        [MaxLength(512)]
        public string ImageUrl { get; set; } = string.Empty;

        [Required]
        [MaxLength(64)]
        public string SellerId { get; set; } = string.Empty;

        [ForeignKey("SellerId")]
        public User? Seller { get; set; }

        public bool IsFree { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public bool IsActive { get; set; } = true;
    }

    public class Club
    {
        [Key]
        [MaxLength(64)]
        public string Id { get; set; } = "c_" + Guid.NewGuid().ToString("N");

        [Required]
        [MaxLength(128)]
        public string Name { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public int MemberCount { get; set; } = 0;

        [MaxLength(512)]
        public string? LogoUrl { get; set; }

        public string Tags { get; set; } = string.Empty;

        public List<ClubEvent> Events { get; set; } = new();
    }

    public class ClubEvent
    {
        [Key]
        [MaxLength(64)]
        public string Id { get; set; } = "e_" + Guid.NewGuid().ToString("N");

        [Required]
        [MaxLength(64)]
        public string ClubId { get; set; } = string.Empty;

        [ForeignKey("ClubId")]
        public Club? Club { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public DateTime Date { get; set; } = DateTime.UtcNow;

        [MaxLength(128)]
        public string Venue { get; set; } = string.Empty;

        public int TotalQuota { get; set; } = 50;

        public int RegisteredCount { get; set; } = 0;
    }

    public class LostFoundItem
    {
        [Key]
        [MaxLength(64)]
        public string Id { get; set; } = "lf_" + Guid.NewGuid().ToString("N");

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        [Required]
        [MaxLength(16)]
        public string Status { get; set; } = "KAYIP"; // KAYIP or BULUNTU

        [MaxLength(128)]
        public string Location { get; set; } = string.Empty;

        [Required]
        [MaxLength(64)]
        public string ReportedById { get; set; } = string.Empty;

        [ForeignKey("ReportedById")]
        public User? ReportedBy { get; set; }

        [MaxLength(512)]
        public string? ImageUrl { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public bool IsResolved { get; set; } = false;
    }

    public class CourseNote
    {
        [Key]
        [MaxLength(64)]
        public string Id { get; set; } = "n_" + Guid.NewGuid().ToString("N");

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MaxLength(128)]
        public string Course { get; set; } = string.Empty;

        [Required]
        [MaxLength(128)]
        public string Faculty { get; set; } = string.Empty;

        [MaxLength(32)]
        public string Semester { get; set; } = string.Empty;

        public int PageCount { get; set; } = 1;

        [Required]
        [MaxLength(64)]
        public string UploaderId { get; set; } = string.Empty;

        [ForeignKey("UploaderId")]
        public User? Uploader { get; set; }

        public int Upvotes { get; set; } = 0;

        [MaxLength(512)]
        public string FileUrl { get; set; } = "#";

        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    }

    public class Report
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(64)]
        public string TargetId { get; set; } = string.Empty;

        [Required]
        [MaxLength(32)]
        public string TargetType { get; set; } = "ForumPost";

        [Required]
        [MaxLength(256)]
        public string Reason { get; set; } = string.Empty;

        [MaxLength(64)]
        public string? ReportedById { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public bool IsHandled { get; set; } = false;
    }
}
