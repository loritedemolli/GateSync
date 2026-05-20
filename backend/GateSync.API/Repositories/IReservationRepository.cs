using GateSync.API.Models.Entities;

namespace GateSync.API.Repositories
{
    public interface IReservationRepository
    {
        Task<List<Reservation>> GetAllAsync();
        Task<Reservation?> GetByIdAsync(int id);
        Task<List<Reservation>> GetByResidentIdAsync(int residentId);
        Task CreateAsync(Reservation reservation);
        Task UpdateAsync(Reservation reservation);
        Task DeleteAsync(Reservation reservation);
        Task<bool> ExistsAsync(int id);
    }
}