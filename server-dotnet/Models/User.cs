namespace AalaNiroo.Api.Models;

public class User
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Email { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Role { get; set; } = "manager"; // superadmin | admin | manager | sales
    public string Status { get; set; } = "active"; // active | disabled
    public string? Avatar { get; set; }
    public string Password { get; set; } = string.Empty; // salted hash hex
    public string Salt { get; set; } = string.Empty; // hex
    public string[] Grants { get; set; } = Array.Empty<string>();
    public string[] Denies { get; set; } = Array.Empty<string>();
    public DateTime? LastLogin { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
