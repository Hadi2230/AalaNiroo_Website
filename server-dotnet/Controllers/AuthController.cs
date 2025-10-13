using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AalaNiroo.Api.Models;
using AalaNiroo.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace AalaNiroo.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _cfg;

    public AuthController(AppDbContext db, IConfiguration cfg)
    {
        _db = db; _cfg = cfg;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto body)
    {
        var email = body.Email.Trim().ToLowerInvariant();
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == email);
        if (user is null || user.Status != "active") return Unauthorized(new { error = "invalid_credentials" });

        var hash = PasswordHasher.Hash(body.Password.Trim(), user.Salt);
        if (!hash.Equals(user.Password, StringComparison.OrdinalIgnoreCase)) return Unauthorized(new { error = "invalid_credentials" });

        user.LastLogin = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        var token = GenerateJwt(user);
        await _db.AuditLogs.AddAsync(new AuditLog { ActorId = user.Id, Action = "login", Target = user.Email, UserAgent = Request.Headers.UserAgent });
        await _db.SaveChangesAsync();

        return Ok(new { token, user = new { user.Id, user.Name, user.Email, user.Role, user.Avatar, user.Status, user.LastLogin } });
    }

    private string GenerateJwt(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_cfg["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id),
            new("role", user.Role),
            new("email", user.Email)
        };
        var token = new JwtSecurityToken(
            issuer: _cfg["Jwt:Issuer"],
            audience: _cfg["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: creds
        );
        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public class LoginDto { public string Email { get; set; } = string.Empty; public string Password { get; set; } = string.Empty; }
}
