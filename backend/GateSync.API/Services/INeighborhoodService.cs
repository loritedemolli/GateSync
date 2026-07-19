using GateSync.API.Models.DTOs.Neighborhood;

namespace GateSync.API.Services
{
    public interface INeighborhoodService
    {
        Task<List<NeighborhoodResponseDTO>> GetAllAsync();
        Task<NeighborhoodResponseDTO?> GetByIdAsync(int id);
        Task<List<NeighborhoodResponseDTO>> GetByCityIdAsync(int cityId);
        Task<NeighborhoodResponseDTO> CreateAsync(CreateNeighborhoodDTO dto);
        Task<NeighborhoodResponseDTO?> UpdateAsync(int id, UpdateNeighborhoodDTO dto);
        Task<bool> DeleteAsync(int id);
    }
}