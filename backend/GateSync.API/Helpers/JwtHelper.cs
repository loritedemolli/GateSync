using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using GateSync.API.Models.Entities;
using Microsoft.IdentityModel.Tokens;

namespace GateSync.API.Helpers
{
    public class JwtHelper
    {
        private readonly IConfiguration _configuration;

        public JwtHelper(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // Gjeneron Access Token
        public string GenerateAccessToken(User user)
        {
            var secret = _configuration["JwtSettings:Secret"]!;
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

          // Permbajtja e tokenit
            var claims = new[]
            {
                new Claim("userId", user.UserId.ToString()),
                new Claim("username", user.Username),
                new Claim(ClaimTypes.Role, user.Role.Name.ToString())
            };

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(
                    int.Parse(_configuration["JwtSettings:ExpiryMinutes"]!)),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // Gjeneron Refresh Token
        public string GenerateRefreshToken()
        {
            var randomBytes = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomBytes);
            return Convert.ToBase64String(randomBytes);
        }
    }
}