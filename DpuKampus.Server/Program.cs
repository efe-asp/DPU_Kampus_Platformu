using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using DpuKampus.Server.Data;
using DpuKampus.Server.Services;

var builder = WebApplication.CreateBuilder(args);

// 1. Add Controllers with Views & JSON ignore cycles
builder.Services.AddControllersWithViews()
    .AddJsonOptions(o =>
    {
        o.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        o.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });

// 2. Add DbContext with SQL Server 2022
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? "Server=.\\SQLEXPRESS;Database=DpuKampusDb;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True;";

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlServer(connectionString, sqlOptions =>
    {
        sqlOptions.EnableRetryOnFailure(
            maxRetryCount: 3,
            maxRetryDelay: TimeSpan.FromSeconds(5),
            errorNumbersToAdd: null);
    });
});

// 3. Add Memory Cache, HttpClient & Background Services
builder.Services.AddMemoryCache();
builder.Services.AddHttpClient();
builder.Services.AddHostedService<MenuScraperBackgroundService>();

// 4. CORS Policy for Vite dev servers (5173, 5174, 8080)
builder.Services.AddCors(options =>
{
    options.AddPolicy("ViteDevPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:5174", "http://localhost:8080", "http://127.0.0.1:5173", "http://127.0.0.1:5174")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// 5. Seed / Ensure database on startup
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();
    var context = services.GetRequiredService<AppDbContext>();
    DbInitializer.Initialize(context, logger);
}

// 6. Middleware Pipeline
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseCors("ViteDevPolicy");

// Static files support (for both wwwroot and client dist build)
app.UseStaticFiles();

var clientDistPath = Path.Combine(builder.Environment.ContentRootPath, "..", "dist");
if (Directory.Exists(clientDistPath))
{
    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(clientDistPath),
        RequestPath = ""
    });
}

app.UseRouting();
app.UseAuthorization();

app.MapControllers();
app.MapDefaultControllerRoute();

// Fallback to React index.html for client-side routing
if (Directory.Exists(clientDistPath) && File.Exists(Path.Combine(clientDistPath, "index.html")))
{
    app.MapFallbackToFile(Path.Combine(clientDistPath, "index.html"));
}
else
{
    app.MapFallbackToFile("index.html");
}

app.Run();
