using System;
using System.Linq;
using ServerNetFx.Data;
using ServerNetFx.Models;
using ServerNetFx.Services;

namespace ServerNetFx
{
    public static class Seed
    {
        public static void Ensure()
        {
            using (var db = new AppDbContext())
            {
                if (!db.Users.Any(u => u.Role == "superadmin"))
                {
                    var email = (System.Configuration.ConfigurationManager.AppSettings["Seed:SuperAdminEmail"] ?? "root@aalaniroo.com").ToLowerInvariant();
                    var name = System.Configuration.ConfigurationManager.AppSettings["Seed:SuperAdminName"] ?? "Super Admin";
                    var pass = System.Configuration.ConfigurationManager.AppSettings["Seed:SuperAdminPassword"] ?? "ChangeMe!234";
                    var salt = PasswordHasher.RandomHex(16);
                    var hash = PasswordHasher.Hash(pass, salt);
                    db.Users.Add(new User { Email = email, Name = name, Role = "superadmin", Status = "active", Salt = salt, Password = hash });
                    db.SaveChanges();
                }
            }
        }
    }
}
