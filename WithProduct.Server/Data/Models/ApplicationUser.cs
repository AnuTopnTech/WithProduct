using Microsoft.AspNetCore.Identity;

namespace WithProduct.Server.Data.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string? FullName { get; set; }

        public string? ProfileImage { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime RefreshTokenExpiryTime { get; set; }
    }
} 
