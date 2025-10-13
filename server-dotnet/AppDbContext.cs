using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using AalaNiroo.Api.Models;

namespace AalaNiroo.Api;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var stringArrayConverter = new Microsoft.EntityFrameworkCore.Storage.ValueConversion.ValueConverter<string[], string>(
            v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
            v => string.IsNullOrWhiteSpace(v) ? Array.Empty<string>() : JsonSerializer.Deserialize<string[]>(v) ?? Array.Empty<string>()
        );

        modelBuilder.Entity<User>(e =>
        {
            e.HasIndex(u => u.Email).IsUnique();
            e.Property(u => u.Grants).HasConversion(stringArrayConverter);
            e.Property(u => u.Denies).HasConversion(stringArrayConverter);
        });

        base.OnModelCreating(modelBuilder);
    }
}
