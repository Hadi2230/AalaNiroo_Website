using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Web.Http;
using Microsoft.IdentityModel.Tokens;
using AalaNiroo.Api.Data;
using AalaNiroo.Api.Services;

namespace AalaNiroo.Api.Controllers
{
    [RoutePrefix("api/auth")]
    public class AuthController : ApiController
    {
        [HttpPost]
        [Route("login")]
        public IHttpActionResult Login(LoginDto body)
        {
            body = body ?? new LoginDto();
            var email = (body.Email ?? string.Empty).Trim().ToLowerInvariant();
            var password = (body.Password ?? string.Empty).Trim();

            using (var db = new AppDbContext())
            {
                var user = db.Users.FirstOrDefault(u => u.Email == email);
                if (user == null || user.Status != "active") return Unauthorized();
                var hash = PasswordHasher.Hash(password, user.Salt);
                if (!string.Equals(hash, user.Password, StringComparison.OrdinalIgnoreCase)) return Unauthorized();

                user.LastLogin = DateTime.UtcNow;
                db.SaveChanges();

                var token = GenerateJwt(user);
                db.AuditLogs.Add(new Models.AuditLog { ActorId = user.Id, Action = "login", Target = user.Email, UserAgent = Request.Headers.UserAgent?.ToString() });
                db.SaveChanges();

                return Ok(new
                {
                    token,
                    user = new { user.Id, user.Name, user.Email, user.Role, user.Avatar, user.Status, user.LastLogin }
                });
            }
        }

        private string GenerateJwt(Models.User user)
        {
            var key = System.Configuration.ConfigurationManager.AppSettings["Jwt:Key"];
            var issuer = System.Configuration.ConfigurationManager.AppSettings["Jwt:Issuer"];
            var audience = System.Configuration.ConfigurationManager.AppSettings["Jwt:Audience"];

            var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var creds = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim("role", user.Role),
                new Claim("email", user.Email)
            };

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: creds
            );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public class LoginDto { public string Email { get; set; } public string Password { get; set; } }
    }
}
