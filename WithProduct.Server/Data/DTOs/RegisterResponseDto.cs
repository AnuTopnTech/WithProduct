namespace WithProduct.Server.Data.DTOs
{
    public class RegisterResponseDto
    {
        public string Token { get; set; } = string.Empty;

        public bool IsSuccess { get; set; }

        public string? Message { get; set; }

        public string RefreshToken { get; set; } = string.Empty;
    }
}
