using GateSync.API.Models.DTOs.Resident;

namespace GateSync.API.Services
{
    public interface IResidentService
    {
        Task<List<ResidentResponseDTO>> GetAllAsync();
        Task<ResidentResponseDTO?> GetByIdAsync(int id);
        Task<ResidentResponseDTO> CreateAsync(CreateResidentDTO dto);
        Task<ResidentResponseDTO?> UpdateAsync(int id, UpdateResidentDTO dto);
        Task<bool> DeleteAsync(int id);
        Task<ResidentResponseDTO?> GetByUserIdAsync(int userId);
    }
}