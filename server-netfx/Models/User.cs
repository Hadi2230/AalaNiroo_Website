using System;
using System.ComponentModel.DataAnnotations;

namespace AalaNiroo.Api.Models
{
    public class User
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        [Required, MaxLength(200)]
        public string Email { get; set; }
        [Required, MaxLength(200)]
        public string Name { get; set; }
        [Required, MaxLength(30)]
        public string Role { get; set; } // superadmin | admin | manager | sales
        [Required, MaxLength(30)]
        public string Status { get; set; } // active | disabled
        public string Avatar { get; set; }
        [Required]
        public string Password { get; set; } // hex salted hash
        [Required]
        public string Salt { get; set; } // hex
        public string Grants { get; set; } // csv
        public string Denies { get; set; } // csv
        public DateTime? LastLogin { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
