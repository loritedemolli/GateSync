using GateSync.API.Models.DTOs.Auth;

namespace GateSync.API.Services
{
    public interface IAuthService
    {
        Task<AuthResponseDTO?> LoginAsync(LoginDTO dto);
        Task<AuthResponseDTO?> RegisterAsync(RegisterDTO dto);
        Task<AuthResponseDTO?> RefreshTokenAsync(string refreshToken);
        Task<bool> RevokeTokenAsync(string refreshToken);
    }
}