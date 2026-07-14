using GateSync.API.Data;
using GateSync.API.Helpers;
using GateSync.API.Models.DTOs.Auth;
using GateSync.API.Models.Entities;
using GateSync.API.Repositories;
using Microsoft.EntityFrameworkCore;

namespace GateSync.API.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly AppDbContext _context;
        private readonly JwtHelper _jwtHelper;
        private readonly IConfiguration _configuration;

        public AuthService(
            IUserRepository userRepository,
            AppDbContext context,
            JwtHelper jwtHelper,
            IConfiguration configuration)
        {
            _userRepository = userRepository;
            _context = context;
            _jwtHelper = jwtHelper;
            _configuration = configuration;
        }

        public async Task<AuthResponseDTO?> LoginAsync(LoginDTO dto)
        {
            var user = await _userRepository.GetByUsernameAsync(dto.Username);
            if (user == null) return null;

            if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                return null;

            return await GenerateTokensAsync(user);
        }

        public async Task<AuthResponseDTO?> RegisterAsync(RegisterDTO dto)
        {
            // Kontrollo nëse username ekziston
            if (await _userRepository.UsernameExistsAsync(dto.Username))
                return null;

            // Kontrollo nëse email ekziston
            if (await _context.Residents.AnyAsync(r => r.Email == dto.Email))
                return null;

            // Krijo User
            var user = new User
            {
                Username = dto.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                RoleId = dto.RoleId
            };

            await _userRepository.CreateAsync(user);

            // Krijo Resident automatikisht
            var resident = new Resident
            {
                FullName = dto.FullName,
                Email = dto.Email,
                PhoneNumber = dto.PhoneNumber,
                IsOwner = dto.IsOwner,
                ResidenceId = dto.ResidenceId,
                UserId = user.UserId
            };

            await _context.Residents.AddAsync(resident);
            await _context.SaveChangesAsync();

            var created = await _userRepository.GetByIdAsync(user.UserId);
            return await GenerateTokensAsync(created!);
        }

        public async Task<AuthResponseDTO?> RefreshTokenAsync(string refreshToken)
        {
            var token = await _context.RefreshTokens
                .Include(r => r.User)
                    .ThenInclude(u => u.Role)
                .FirstOrDefaultAsync(r =>
                    r.Token == refreshToken &&
                    !r.IsRevoked &&
                    r.ExpiryDate > DateTime.UtcNow);

            if (token == null) return null;

            token.IsRevoked = true;
            await _context.SaveChangesAsync();

            return await GenerateTokensAsync(token.User);
        }

        public async Task<bool> RevokeTokenAsync(string refreshToken)
        {
            var token = await _context.RefreshTokens
                .FirstOrDefaultAsync(r => r.Token == refreshToken);

            if (token == null) return false;

            token.IsRevoked = true;
            await _context.SaveChangesAsync();
            return true;
        }

        private async Task<AuthResponseDTO> GenerateTokensAsync(User user)
        {
            var accessToken = _jwtHelper.GenerateAccessToken(user);
            var refreshToken = _jwtHelper.GenerateRefreshToken();

            var refreshTokenEntity = new RefreshToken
            {
                Token = refreshToken,
                ExpiryDate = DateTime.UtcNow.AddDays(
                    int.Parse(_configuration["JwtSettings:RefreshTokenExpiryDays"]!)),
                UserId = user.UserId
            };

            await _context.RefreshTokens.AddAsync(refreshTokenEntity);
            await _context.SaveChangesAsync();

            return new AuthResponseDTO
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                Username = user.Username,
                Role = user.Role.Name.ToString()
            };
        }
    }
}