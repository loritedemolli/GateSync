using GateSync.API.Models.Entities;

namespace GateSync.API.Repositories
{
    public interface IVehicleRepository
    {
        Task<List<Vehicle>> GetAllAsync();
        Task<Vehicle?> GetByIdAsync(int id);
        Task<List<Vehicle>> GetByResidentIdAsync(int residentId);
        Task CreateAsync(Vehicle vehicle);
        Task UpdateAsync(Vehicle vehicle);
        Task DeleteAsync(Vehicle vehicle);
        Task<bool> ExistsAsync(int id);
        Task<bool> PlateNumberExistsAsync(string plateNumber);
    }
}