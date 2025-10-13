using AalaNiroo.Api.Models;
using AalaNiroo.Api.Services;
using Microsoft.EntityFrameworkCore;

namespace AalaNiroo.Api;

public static class Seed
{
    public static async Task RunAsync(AppDbContext db, IConfiguration config)
    {
        if (!await db.Users.AnyAsync(u => u.Role == "superadmin"))
        {
            var email = (config["Seed:SuperAdminEmail"] ?? "root@aalaniroo.com").ToLowerInvariant();
            var name = config["Seed:SuperAdminName"] ?? "Super Admin";
            var pass = config["Seed:SuperAdminPassword"] ?? "ChangeMe!234";
            var salt = PasswordHasher.RandomHex(16);
            var hash = PasswordHasher.Hash(pass, salt);
            db.Users.Add(new User
            {
                Email = email,
                Name = name,
                Role = "superadmin",
                Status = "active",
                Salt = salt,
                Password = hash
            });
            await db.SaveChangesAsync();
        }
    }
}
