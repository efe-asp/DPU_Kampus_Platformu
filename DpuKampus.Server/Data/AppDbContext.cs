using Microsoft.EntityFrameworkCore;
using DpuKampus.Server.Models;

namespace DpuKampus.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users => Set<User>();
        public DbSet<ForumPost> ForumPosts => Set<ForumPost>();
        public DbSet<ForumComment> ForumComments => Set<ForumComment>();
        public DbSet<ForumPostLike> ForumPostLikes => Set<ForumPostLike>();
        public DbSet<Listing> Listings => Set<Listing>();
        public DbSet<Club> Clubs => Set<Club>();
        public DbSet<ClubEvent> ClubEvents => Set<ClubEvent>();
        public DbSet<LostFoundItem> LostFoundItems => Set<LostFoundItem>();
        public DbSet<CourseNote> CourseNotes => Set<CourseNote>();
        public DbSet<Report> Reports => Set<Report>();
        public DbSet<DailyMenu> DailyMenus => Set<DailyMenu>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User Email index
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // ForumPostLike unique index per user per post
            modelBuilder.Entity<ForumPostLike>()
                .HasIndex(l => new { l.PostId, l.UserId })
                .IsUnique();

            // ForumPost -> Comments
            modelBuilder.Entity<ForumPost>()
                .HasMany(p => p.Comments)
                .WithOne(c => c.Post)
                .HasForeignKey(c => c.PostId)
                .OnDelete(DeleteBehavior.Cascade);

            // ForumPost -> Likes
            modelBuilder.Entity<ForumPost>()
                .HasMany(p => p.Likes)
                .WithOne(l => l.Post)
                .HasForeignKey(l => l.PostId)
                .OnDelete(DeleteBehavior.Cascade);

            // ForumComment -> Author
            modelBuilder.Entity<ForumComment>()
                .HasOne(c => c.Author)
                .WithMany(u => u.ForumComments)
                .HasForeignKey(c => c.AuthorId)
                .OnDelete(DeleteBehavior.Restrict);

            // ForumPostLike -> User
            modelBuilder.Entity<ForumPostLike>()
                .HasOne(l => l.User)
                .WithMany(u => u.ForumLikes)
                .HasForeignKey(l => l.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // ForumPost -> Author
            modelBuilder.Entity<ForumPost>()
                .HasOne(p => p.Author)
                .WithMany(u => u.ForumPosts)
                .HasForeignKey(p => p.AuthorId)
                .OnDelete(DeleteBehavior.Restrict);

            // Listing -> Seller
            modelBuilder.Entity<Listing>()
                .HasOne(l => l.Seller)
                .WithMany(u => u.Listings)
                .HasForeignKey(l => l.SellerId)
                .OnDelete(DeleteBehavior.Restrict);

            // Decimal precision for listing price
            modelBuilder.Entity<Listing>()
                .Property(l => l.Price)
                .HasPrecision(18, 2);

            // DailyMenu unique date index
            modelBuilder.Entity<DailyMenu>()
                .HasIndex(m => m.MenuDate)
                .IsUnique();
        }
    }
}
