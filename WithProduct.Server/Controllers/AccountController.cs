using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using WithProduct.Server.Data.Models;
using WithProduct.Server.Data;
using System.IdentityModel.Tokens.Jwt;
using WithProduct.Server.Data.DTOs;
using System.Security.Cryptography;
using System.Security.Claims;
using System.Text;


namespace WithProduct.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.
    public class AccountController(UserManager<ApplicationUser> userManager,
#pragma warning restore CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.

        IConfiguration configuration) : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager = userManager;
        private readonly IConfiguration _configuration = configuration;


        [HttpPost("register")]
        public async Task<ActionResult<string>> Register(RegisterDto registerDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = new ApplicationUser
            {
                Email = registerDto.Email,
                FullName = registerDto.FullName,
                UserName = registerDto.FullName,
                ProfileImage = registerDto.Image

            };
            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }
            return Ok(new RegisterResponseDto
            {
                IsSuccess = true,
                Message = "Account Created Successfully!"
            });
        }

        [HttpPost("login")]
        public async Task<ActionResult<RegisterResponseDto>> Login(ApiLoginRequest loginRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = await _userManager.FindByEmailAsync(loginRequest.Email);

            if (user == null)
            {
                return Unauthorized(new RegisterResponseDto
                {

                    IsSuccess = false,
                    Message = "User not found with this email",
                });

            }
            var result = await _userManager.
                CheckPasswordAsync(user, loginRequest.Password);

            if (!result)
            {
                return Unauthorized(new RegisterResponseDto
                {
                    IsSuccess = false,
                    Message = "Invalid Password."
                });
            }

            var token = GenerateToken(user);
            var refreshToken = GenerateRefreshToken();
            _ = int.TryParse(_configuration.GetSection("JWTSetting").GetSection("RefreshTokenValidityIn").Value!, out int RefreshTokenValidityIn);
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddMinutes(RefreshTokenValidityIn);
            await _userManager.UpdateAsync(user);

            return Ok(new RegisterResponseDto
            {

                IsSuccess = true,
                Token = token,
                Message = "Login Success.",
                RefreshToken = refreshToken
            });


        }
        private string GenerateRefreshToken()
#pragma warning restore CA1822 // Mark members as static
        {
            var randomNumber = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }
        private string GenerateToken(ApplicationUser user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.
                GetBytes(_configuration.GetSection("JwtSettings")
                .GetSection("SecurityKey").Value!);
            List<Claim> claims = [
                new (JwtRegisteredClaimNames.Email, user.Email?? ""),
                new (JwtRegisteredClaimNames.Name,user.FullName?? ""),
                 new (JwtRegisteredClaimNames.NameId,user.Id?? ""),
                  new (JwtRegisteredClaimNames.Aud,
                  _configuration
                  .GetSection("JwtSettings").GetSection("Audience").Value!),
                  new(JwtRegisteredClaimNames.Iss,
                  _configuration.GetSection("JwtSettings").GetSection("Issuer").Value!)
                ];

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
