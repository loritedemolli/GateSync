using GateSync.API.Models.DTOs.Residence;

namespace GateSync.API.Services
{
    public interface IResidenceService
    {
        Task<List<ResidenceResponseDTO>> GetAllAsync();
        Task<ResidenceResponseDTO?> GetByIdAsync(int id);
        Task<ResidenceResponseDTO> CreateAsync(CreateResidenceDTO dto);
        Task<ResidenceResponseDTO?> UpdateAsync(int id, UpdateResidenceDTO dto);
        Task<bool> DeleteAsync(int id);
    }
}