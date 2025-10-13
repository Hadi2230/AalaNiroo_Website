using System;
using System.ComponentModel.DataAnnotations;

namespace ServerNetFx.Models
{
    public class AuditLog
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string ActorId { get; set; }
        public string Action { get; set; }
        public string Target { get; set; }
        public string Metadata { get; set; }
        public string UserAgent { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
