using AalaNiroo.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AalaNiroo.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _db;
    public UsersController(AppDbContext db) { _db = db; }

    [HttpGet]
    [Authorize(Policy = "superadmin_or_admin")]
    public async Task<IActionResult> GetAll()
    {
        var users = await _db.Users.OrderByDescending(u => u.CreatedAt).ToListAsync();
        return Ok(users.Select(u => new
        {
            u.Id, u.Email, u.Name, u.Role, u.Status, u.Avatar, u.Grants, u.Denies, u.LastLogin, u.CreatedAt, u.UpdatedAt
        }));
    }

    [HttpPost]
    [Authorize(Policy = "superadmin")]
    public async Task<IActionResult> Create([FromBody] CreateUserDto body)
    {
        if (await _db.Users.AnyAsync(u => u.Email == body.Email.ToLower())) return Conflict(new { error = "email_exists" });
        var salt = Services.PasswordHasher.RandomHex(16);
        var hash = Services.PasswordHasher.Hash(body.Password, salt);
        var user = new User
        {
            Email = body.Email.ToLower(),
            Name = body.Name,
            Role = body.Role ?? "manager",
            Status = body.Status ?? "active",
            Avatar = body.Avatar,
            Salt = salt,
            Password = hash,
            Grants = body.Grants ?? Array.Empty<string>(),
            Denies = body.Denies ?? Array.Empty<string>()
        };
        await _db.Users.AddAsync(user);
        await _db.AuditLogs.AddAsync(new AuditLog { ActorId = User.GetUserId(), Action = "user.create", Target = user.Id });
        await _db.SaveChangesAsync();
        return Created($"/api/users/{user.Id}", new { user.Id });
    }

    [HttpPatch("{id}")]
    [Authorize(Policy = "superadmin")]
    public async Task<IActionResult> Update([FromRoute] string id, [FromBody] UpdateUserDto body)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == id);
        if (user is null) return NotFound();
        if (body.Name != null) user.Name = body.Name;
        if (body.Role != null) user.Role = body.Role;
        if (body.Status != null) user.Status = body.Status;
        if (body.Avatar != null) user.Avatar = body.Avatar;
        if (body.Grants != null) user.Grants = body.Grants;
        if (body.Denies != null) user.Denies = body.Denies;
        if (!string.IsNullOrWhiteSpace(body.Password))
        {
            var salt = Services.PasswordHasher.RandomHex(16);
            var hash = Services.PasswordHasher.Hash(body.Password, salt);
            user.Salt = salt; user.Password = hash;
        }
        user.UpdatedAt = DateTime.UtcNow;
        await _db.AuditLogs.AddAsync(new AuditLog { ActorId = User.GetUserId(), Action = "user.update", Target = user.Id });
        await _db.SaveChangesAsync();
        return Ok(new { ok = true });
    }

    [HttpDelete("{id}")]
    [Authorize(Policy = "superadmin")]
    public async Task<IActionResult> Delete([FromRoute] string id)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == id);
        if (user is null) return NotFound();
        _db.Users.Remove(user);
        await _db.AuditLogs.AddAsync(new AuditLog { ActorId = User.GetUserId(), Action = "user.delete", Target = id });
        await _db.SaveChangesAsync();
        return Ok(new { ok = true });
    }

    public class CreateUserDto
    {
        public string Email { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? Role { get; set; }
        public string? Status { get; set; }
        public string? Avatar { get; set; }
        public string Password { get; set; } = string.Empty;
        public string[]? Grants { get; set; }
        public string[]? Denies { get; set; }
    }

    public class UpdateUserDto
    {
        public string? Email { get; set; }
        public string? Name { get; set; }
        public string? Role { get; set; }
        public string? Status { get; set; }
        public string? Avatar { get; set; }
        public string? Password { get; set; }
        public string[]? Grants { get; set; }
        public string[]? Denies { get; set; }
    }
}

static class ClaimsPrincipalExtensions
{
    public static string? GetUserId(this System.Security.Claims.ClaimsPrincipal user)
        => user.Claims.FirstOrDefault(c => c.Type == System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;
}
