using System.ComponentModel.DataAnnotations;

namespace WithProduct.Server.Data
{
    public class ApiLoginRequest
    {

        [Required(ErrorMessage = "Email is required.")]
        public required string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password is required.")]
        public required string Password { get; set; }= string.Empty;
    }
}
