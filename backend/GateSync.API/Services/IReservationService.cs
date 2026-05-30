using GateSync.API.Models.DTOs.Reservation;

namespace GateSync.API.Services
{
    public interface IReservationService
    {
        Task<List<ReservationResponseDTO>> GetAllAsync();
        Task<ReservationResponseDTO?> GetByIdAsync(int id);
        Task<List<ReservationResponseDTO>> GetByResidentIdAsync(int residentId);
        Task<ReservationResponseDTO> CreateAsync(CreateReservationDTO dto);
        Task<ReservationResponseDTO?> UpdateAsync(int id, UpdateReservationDTO dto);
        Task<bool> DeleteAsync(int id);
    }
}