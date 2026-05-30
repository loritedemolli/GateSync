using GateSync.API.Models.DTOs.User;

namespace GateSync.API.Services
{
    public interface IUserService
    {
        Task<List<UserResponseDTO>> GetAllAsync();
        Task<UserResponseDTO?> GetByIdAsync(int id);
        Task<UserResponseDTO> CreateAsync(CreateUserDTO dto);
        Task<UserResponseDTO?> UpdateAsync(int id, UpdateUserDTO dto);
        Task<bool> DeleteAsync(int id);
    }
}