using GateSync.API.Models.DTOs.Vehicle;

namespace GateSync.API.Services
{
    public interface IVehicleService
    {
        Task<List<VehicleResponseDTO>> GetAllAsync();
        Task<VehicleResponseDTO?> GetByIdAsync(int id);
        Task<List<VehicleResponseDTO>> GetByResidentIdAsync(int residentId);
        Task<VehicleResponseDTO> CreateAsync(CreateVehicleDTO dto);
        Task<VehicleResponseDTO?> UpdateAsync(int id, UpdateVehicleDTO dto);
        Task<bool> DeleteAsync(int id);
    }
}