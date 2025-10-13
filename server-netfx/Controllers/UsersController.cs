using System;
using System.Linq;
using System.Web.Http;
using ServerNetFx.Data;
using ServerNetFx.Models;
using ServerNetFx.Services;

namespace ServerNetFx.Controllers
{
    [Authorize]
    [RoutePrefix("api/users")]
    public class UsersController : ApiController
    {
        [HttpGet]
        [Route("")]
        public IHttpActionResult GetAll()
        {
            // superadmin/admin only - demo: rely on frontend to hide; enforce in production via JWT validation or custom attribute
            using (var db = new AppDbContext())
            {
                var users = db.Users.OrderByDescending(u => u.CreatedAt).ToList()
                    .Select(u => new { u.Id, u.Email, u.Name, u.Role, u.Status, u.Avatar, Grants = (u.Grants ?? "").Split(new[]{','}, StringSplitOptions.RemoveEmptyEntries), Denies = (u.Denies ?? "").Split(new[]{','}, StringSplitOptions.RemoveEmptyEntries), u.LastLogin, u.CreatedAt, u.UpdatedAt });
                return Ok(users);
            }
        }

        [HttpPost]
        [Route("")]
        public IHttpActionResult Create(CreateUserDto body)
        {
            body = body ?? new CreateUserDto();
            using (var db = new AppDbContext())
            {
                var email = (body.Email ?? "").ToLowerInvariant();
                if (db.Users.Any(u => u.Email == email)) return Conflict();
                var salt = PasswordHasher.RandomHex(16);
                var hash = PasswordHasher.Hash(body.Password ?? "", salt);
                var user = new User
                {
                    Email = email,
                    Name = body.Name ?? "",
                    Role = string.IsNullOrWhiteSpace(body.Role) ? "manager" : body.Role,
                    Status = string.IsNullOrWhiteSpace(body.Status) ? "active" : body.Status,
                    Avatar = body.Avatar,
                    Salt = salt,
                    Password = hash,
                    Grants = string.Join(",", body.Grants ?? new string[0]),
                    Denies = string.Join(",", body.Denies ?? new string[0])
                };
                db.Users.Add(user);
                db.AuditLogs.Add(new AuditLog { ActorId = User.Identity.Name, Action = "user.create", Target = user.Id });
                db.SaveChanges();
                return Created($"/api/users/{user.Id}", new { user.Id });
            }
        }

        [HttpPatch]
        [Route("{id}")]
        public IHttpActionResult Update(string id, UpdateUserDto body)
        {
            using (var db = new AppDbContext())
            {
                var user = db.Users.FirstOrDefault(u => u.Id == id);
                if (user == null) return NotFound();
                if (body.Name != null) user.Name = body.Name;
                if (body.Role != null) user.Role = body.Role;
                if (body.Status != null) user.Status = body.Status;
                if (body.Avatar != null) user.Avatar = body.Avatar;
                if (body.Grants != null) user.Grants = string.Join(",", body.Grants);
                if (body.Denies != null) user.Denies = string.Join(",", body.Denies);
                if (!string.IsNullOrWhiteSpace(body.Password))
                {
                    var salt = PasswordHasher.RandomHex(16);
                    var hash = PasswordHasher.Hash(body.Password, salt);
                    user.Salt = salt; user.Password = hash;
                }
                user.UpdatedAt = DateTime.UtcNow;
                db.AuditLogs.Add(new AuditLog { ActorId = User.Identity.Name, Action = "user.update", Target = user.Id });
                db.SaveChanges();
                return Ok(new { ok = true });
            }
        }

        [HttpDelete]
        [Route("{id}")]
        public IHttpActionResult Delete(string id)
        {
            using (var db = new AppDbContext())
            {
                var user = db.Users.FirstOrDefault(u => u.Id == id);
                if (user == null) return NotFound();
                db.Users.Remove(user);
                db.AuditLogs.Add(new AuditLog { ActorId = User.Identity.Name, Action = "user.delete", Target = id });
                db.SaveChanges();
                return Ok(new { ok = true });
            }
        }

        public class CreateUserDto
        {
            public string Email { get; set; }
            public string Name { get; set; }
            public string Role { get; set; }
            public string Status { get; set; }
            public string Avatar { get; set; }
            public string Password { get; set; }
            public string[] Grants { get; set; }
            public string[] Denies { get; set; }
        }
        public class UpdateUserDto
        {
            public string Email { get; set; }
            public string Name { get; set; }
            public string Role { get; set; }
            public string Status { get; set; }
            public string Avatar { get; set; }
            public string Password { get; set; }
            public string[] Grants { get; set; }
            public string[] Denies { get; set; }
        }
    }
}
