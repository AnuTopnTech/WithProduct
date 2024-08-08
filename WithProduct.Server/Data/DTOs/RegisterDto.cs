using System.ComponentModel.DataAnnotations;

namespace WithProduct.Server.Data.DTOs
{
    public class RegisterDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string FullName { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
        public string? Image { get; set; }
    }
}
