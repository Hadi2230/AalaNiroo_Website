using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AalaNiroo.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AuditLogsController : ControllerBase
{
    private readonly AppDbContext _db;
    public AuditLogsController(AppDbContext db) { _db = db; }

    [HttpGet]
    [Authorize(Policy = "superadmin")]
    public async Task<IActionResult> Get([FromQuery] string? q)
    {
        var logs = await _db.AuditLogs.OrderByDescending(l => l.CreatedAt).Take(1000).ToListAsync();
        if (!string.IsNullOrWhiteSpace(q))
        {
            var query = q.ToLowerInvariant();
            logs = logs.Where(l => (l.Action ?? "").ToLower().Contains(query) || (l.Target ?? "").ToLower().Contains(query)).ToList();
        }
        return Ok(logs);
    }
}
