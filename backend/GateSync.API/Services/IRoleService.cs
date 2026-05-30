using GateSync.API.Models.DTOs.Role;

namespace GateSync.API.Services
{
    public interface IRoleService
    {
        Task<List<RoleResponseDTO>> GetAllAsync();
        Task<RoleResponseDTO?> GetByIdAsync(int id);
        Task<RoleResponseDTO> CreateAsync(CreateRoleDTO dto);
        Task<RoleResponseDTO?> UpdateAsync(int id, UpdateRoleDTO dto);
        Task<bool> DeleteAsync(int id);
    }
}