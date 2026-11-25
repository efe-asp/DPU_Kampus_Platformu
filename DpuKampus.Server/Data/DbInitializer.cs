using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using DpuKampus.Server.Models;

namespace DpuKampus.Server.Data
{
    public static class DbInitializer
    {
        public static void Initialize(AppDbContext context, ILogger logger)
        {
            try
            {
                logger.LogInformation("Veritabanı bağlantısı kontrol ediliyor ve şema hazırlanıyor...");
                context.Database.EnsureCreated();
                context.Database.ExecuteSqlRaw(@"
                    IF OBJECT_ID(N'[DailyMenus]', N'U') IS NULL
                    BEGIN
                        CREATE TABLE [DailyMenus] (
                            [Id] int NOT NULL IDENTITY,
                            [MenuDate] datetime2 NOT NULL,
                            [Starter] nvarchar(200) NOT NULL,
                            [MainCourse] nvarchar(200) NOT NULL,
                            [SideDish] nvarchar(200) NOT NULL,
                            [Complement] nvarchar(200) NOT NULL,
                            [LikeCount] int NOT NULL DEFAULT 0,
                            [NeutralCount] int NOT NULL DEFAULT 0,
                            [DislikeCount] int NOT NULL DEFAULT 0,
                            [CreatedAt] datetime2 NOT NULL,
                            CONSTRAINT [PK_DailyMenus] PRIMARY KEY ([Id])
                        );
                        CREATE UNIQUE INDEX [IX_DailyMenus_MenuDate] ON [DailyMenus] ([MenuDate]);
                    END");

                if (context.Users.Any())
                {
                    logger.LogInformation("Veritabanı zaten başlatılmış, mevcut veriler korunuyor.");
                    return;
                }

                logger.LogInformation("DPÜ Kampüs başlangıç verileri tohumlanıyor (Seeding)...");

                // Seed Users
                var users = new List<User>
                {
                    new User
                    {
                        Id = "u1",
                        FullName = "Efe Alsaç",
                        Email = "efe.alsac@ogr.dpu.edu.tr",
                        Faculty = "Mühendislik Fakültesi",
                        JoinedAt = DateTime.UtcNow.AddMonths(-3),
                        VerifiedStudent = true
                    },
                    new User
                    {
                        Id = "u2",
                        FullName = "Zeynep Kaya",
                        Email = "zeynep.kaya@ogr.dpu.edu.tr",
                        Faculty = "Fen-Edebiyat Fakültesi",
                        JoinedAt = DateTime.UtcNow.AddMonths(-3),
                        VerifiedStudent = true
                    },
                    new User
                    {
                        Id = "u3",
                        FullName = "Mert Demir",
                        Email = "mert.demir@ogr.dpu.edu.tr",
                        Faculty = "Kütahya Teknik Bilimler MYO",
                        JoinedAt = DateTime.UtcNow.AddYears(-1),
                        VerifiedStudent = true
                    },
                    new User
                    {
                        Id = "u4",
                        FullName = "Selin Yıldız",
                        Email = "selin.yildiz@ogr.dpu.edu.tr",
                        Faculty = "İktisadi ve İdari Bilimler Fakültesi",
                        JoinedAt = DateTime.UtcNow.AddMonths(-3),
                        VerifiedStudent = true
                    },
                    new User
                    {
                        Id = "u5",
                        FullName = "Burak Şahin",
                        Email = "burak.sahin@ogr.dpu.edu.tr",
                        Faculty = "Eğitim Fakültesi",
                        JoinedAt = DateTime.UtcNow.AddYears(-2),
                        VerifiedStudent = true
                    }
                };
                context.Users.AddRange(users);
                context.SaveChanges();

                // Seed Forum Posts
                var forumPosts = new List<ForumPost>
                {
                    new ForumPost
                    {
                        Id = "fp1",
                        AuthorId = "u1",
                        Content = "Mühendislik Fakültesi Diferansiyel Denklemler vizesi için Merkez Kütüphane 2. katta çalışan var mı? 2024 ve 2025 çıkmış soru çözümleri için çalışma grubu oluşturduk, katılmak isteyen gelebilir.",
                        Topic = "#VizeFinal",
                        IsAnonymous = false,
                        CreatedAt = DateTime.UtcNow.AddMinutes(-25),
                        ViewCount = 186
                    },
                    new ForumPost
                    {
                        Id = "fp2",
                        AuthorId = "u4",
                        Content = "Bugünkü Bedesten yemekhanesindeki fırın tavuk, mercimek çorbası ve revani menüsü gerçekten 10/10 idi. Sıra saat 12:20 civarında biraz uzundu ama turnikeler hızlı aktı. Aşçılarımızın ellerine sağlık.",
                        Topic = "#Yemekhane",
                        IsAnonymous = false,
                        CreatedAt = DateTime.UtcNow.AddHours(-2),
                        ViewCount = 342
                    },
                    new ForumPost
                    {
                        Id = "fp3",
                        AuthorId = "u4",
                        Content = "Evliya Çelebi kampüsünden Zafer Meydanı ve Vazo yönüne giden 7 numaralı belediye otobüsünün 17:30 kalkış saati 17:20 olarak güncellenmiş. Durakta soğukta beklemeyin diye yazıyorum, panoda asılı saatler güncellenmemiş henüz.",
                        Topic = "#KütahyaUlaşım",
                        IsAnonymous = true,
                        CreatedAt = DateTime.UtcNow.AddHours(-4),
                        ViewCount = 512
                    },
                    new ForumPost
                    {
                        Id = "fp4",
                        AuthorId = "u2",
                        Content = "DPÜ Yazılım Topluluğu olarak bu cuma günü saat 17:30'da Mühendislik A-201 amfisinde React & .NET ile uçtan uca proje geliştirme atölyesi yapacağız. Sıfırdan başlayanlar da katılabilir, kendi bilgisayarınızı getirmeniz yeterli!",
                        Topic = "#KampüsHayatı",
                        IsAnonymous = false,
                        CreatedAt = DateTime.UtcNow.AddHours(-7),
                        ViewCount = 290
                    },
                    new ForumPost
                    {
                        Id = "fp5",
                        AuthorId = "u1",
                        Content = "Merkez Kütüphanede masa prizlerinin bazıları çalışmıyor, özellikle B blok arka sıralar. Dün bildirim formu doldurdum ama sınav haftası öncesi teknik servisin hızlıca el atması gerekiyor. Destek için rektörlük masasına da yazalım.",
                        Topic = "#SoruCevap",
                        IsAnonymous = true,
                        CreatedAt = DateTime.UtcNow.AddHours(-12),
                        ViewCount = 405
                    }
                };
                context.ForumPosts.AddRange(forumPosts);
                context.SaveChanges();

                // Seed Comments
                var comments = new List<ForumComment>
                {
                    new ForumComment
                    {
                        Id = "fc1",
                        PostId = "fp1",
                        AuthorId = "u2",
                        Content = "Ben de oradayım, Laplace dönüşümleri kısmında takıldım. Yan masadayım, gelebilir miyim?",
                        CreatedAt = DateTime.UtcNow.AddMinutes(-18)
                    },
                    new ForumComment
                    {
                        Id = "fc2",
                        PostId = "fp1",
                        AuthorId = "u3",
                        Content = "Hangi hocanın soruları var elinizde? Salih hoca çıkmışları çok soruyor bu dönem.",
                        CreatedAt = DateTime.UtcNow.AddMinutes(-10)
                    },
                    new ForumComment
                    {
                        Id = "fc3",
                        PostId = "fp1",
                        AuthorId = "u1",
                        Content = "Hem Salih hoca hem de Ahmet hocanın son 3 yıllık vize-final arşivi var, notlar kısmına da yükledim.",
                        CreatedAt = DateTime.UtcNow.AddMinutes(-5)
                    },
                    new ForumComment
                    {
                        Id = "fc4",
                        PostId = "fp2",
                        AuthorId = "u5",
                        Content = "Kesinlikle katılıyorum, özellikle çorbanın kıvamı harikaydı.",
                        CreatedAt = DateTime.UtcNow.AddHours(-1).AddMinutes(-20)
                    },
                    new ForumComment
                    {
                        Id = "fc5",
                        PostId = "fp3",
                        AuthorId = "u3",
                        Content = "Çok teşekkürler, az kalsın eski saate güvenip dersi kaçırıyordum!",
                        CreatedAt = DateTime.UtcNow.AddHours(-2)
                    }
                };
                context.ForumComments.AddRange(comments);

                // Seed Likes
                var likes = new List<ForumPostLike>
                {
                    new ForumPostLike { PostId = "fp1", UserId = "u2" },
                    new ForumPostLike { PostId = "fp1", UserId = "u3" },
                    new ForumPostLike { PostId = "fp2", UserId = "u1" },
                    new ForumPostLike { PostId = "fp2", UserId = "u2" },
                    new ForumPostLike { PostId = "fp2", UserId = "u3" },
                    new ForumPostLike { PostId = "fp3", UserId = "u1" },
                    new ForumPostLike { PostId = "fp3", UserId = "u5" },
                };
                context.ForumPostLikes.AddRange(likes);

                // Seed Listings
                var listings = new List<Listing>
                {
                    new Listing
                    {
                        Id = "l1",
                        Title = "Casio FX-991ES Plus Hesap Makinesi",
                        Description = "Mühendislik ve fen bilimleri sınavları için ideal. Kutusu ve kılıfı tam. Hiç sorun yaşamadım, bölümü bitirdiğim için satıyorum.",
                        Price = 350,
                        Condition = "Az Kullanılmış",
                        Category = "Elektronik",
                        PickupPoint = "Mühendislik Kantini",
                        ImageUrl = "/images/products/hesap-makinesi.svg",
                        SellerId = "u1",
                        IsFree = false,
                        CreatedAt = DateTime.UtcNow.AddDays(-5),
                        IsActive = true
                    },
                    new Listing
                    {
                        Id = "l2",
                        Title = "Bilgisayar Mühendisliği Ders Notları (1-3. Sınıf)",
                        Description = "Veri yapıları, algoritmalar, işletim sistemleri derslerine ait el yazısı ve basılı notlar. Çıkmışlarla birlikte.",
                        Price = 0,
                        Condition = "İyi",
                        Category = "Ders Kitabı & Not",
                        PickupPoint = "Merkez Kütüphane",
                        ImageUrl = "/images/products/ders-notu.svg",
                        SellerId = "u2",
                        IsFree = true,
                        CreatedAt = DateTime.UtcNow.AddDays(-6),
                        IsActive = true
                    },
                    new Listing
                    {
                        Id = "l3",
                        Title = "Nespresso Essenza Mini Kahve Makinesi",
                        Description = "Yurtta kullanmak için aldım, mezun oldum artık. Temiz, bakımlı. Orijinal kutusuyla birlikte.",
                        Price = 1200,
                        Condition = "Sıfır Gibi",
                        Category = "Ev & Yurt",
                        PickupPoint = "KYK Yurtlar",
                        ImageUrl = "/images/products/kahve-makinesi.svg",
                        SellerId = "u3",
                        IsFree = false,
                        CreatedAt = DateTime.UtcNow.AddDays(-7),
                        IsActive = true
                    }
                };
                context.Listings.AddRange(listings);

                // Seed Clubs
                var clubs = new List<Club>
                {
                    new Club
                    {
                        Id = "c_gg",
                        Name = "DPÜ Gurbetçi Gençler (Kütahya)",
                        Description = "Gurbetçi Gençler Kütahya üniversite yapılanması olarak; maç izleme buluşmaları, deplasman organizasyonları ve sosyal sorumluluk projeleriyle DPÜ'deki bordo-mavi sevdalılarını bir araya getiriyoruz.",
                        MemberCount = 261,
                        LogoUrl = "/images/clubs/gurbetci-gencler.jpg",
                        Tags = "Gurbetçi Gençler,Bordo-Mavi,Deplasman"
                    },
                    new Club
                    {
                        Id = "c1",
                        Name = "DPÜ Yazılım ve Bilişim Topluluğu",
                        Description = "Yazılım geliştirme, hackathon ve proje yarışmalarına odaklanan öğrenci topluluğu.",
                        MemberCount = 312,
                        Tags = "Yazılım,Hackathon,Teknofest"
                    },
                    new Club
                    {
                        Id = "c2",
                        Name = "Siber Güvenlik Topluluğu",
                        Description = "CTF yarışmaları, penetrasyon testi ve siber güvenlik farkındalığı üzerine çalışan topluluk.",
                        MemberCount = 178,
                        Tags = "CTF,Güvenlik,Linux"
                    }
                };
                context.Clubs.AddRange(clubs);

                // Seed Club Events
                var clubEvents = new List<ClubEvent>
                {
                    new ClubEvent
                    {
                        Id = "e_gg",
                        ClubId = "c_gg",
                        Title = "Gurbetçi Gençler Kütahya Maç İzleme Buluşması",
                        Description = "Haftanın kritik Süper Lig karşılaşmasını DPÜ'lü bordo-mavililer olarak Bedesten Sosyal Tesisleri'nde hep birlikte dev ekranda izliyoruz. Meşale ve tezahüratlarla tam tribün havası!",
                        Date = DateTime.UtcNow.AddDays(9),
                        Venue = "Bedesten Sosyal Tesisleri - Gençlik Salonu",
                        TotalQuota = 80,
                        RegisteredCount = 61
                    }
                };
                context.ClubEvents.AddRange(clubEvents);

                context.SaveChanges();
                logger.LogInformation("DPÜ Kampüs başlangıç verileri başarıyla SQL Server veritabanına kaydedildi.");
            }
            catch (Exception ex)
            {
                logger.LogWarning("SQL Server veritabanı başlatılırken uyarı/hata: {Message}. (SQL Server kurulu değilse veya başlatılmadıysa uygulama çalışmaya devam edecektir)", ex.Message);
            }
        }
    }
}
