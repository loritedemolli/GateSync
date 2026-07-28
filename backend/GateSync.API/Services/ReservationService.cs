using GateSync.API.Models.DTOs.Reservation;
using GateSync.API.Models.Entities;
using GateSync.API.Models;
using GateSync.API.Repositories;

namespace GateSync.API.Services
{
    public class ReservationService : IReservationService
    {
        private readonly IReservationRepository _repository;

        public ReservationService(IReservationRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<ReservationResponseDTO>> GetAllAsync()
        {
            var reservations = await _repository.GetAllAsync();
            return reservations.Select(r => new ReservationResponseDTO
            {
                ReservationId = r.ReservationId,
                FacilityName = r.FacilityName,
                Time = r.Time,
                Status = r.Status.ToString(),
                ResidentName = r.Resident.FullName
            }).ToList();
        }

        public async Task<ReservationResponseDTO?> GetByIdAsync(int id)
        {
            var reservation = await _repository.GetByIdAsync(id);
            if (reservation == null) return null;

            return new ReservationResponseDTO
            {
                ReservationId = reservation.ReservationId,
                FacilityName = reservation.FacilityName,
                Time = reservation.Time,
                Status = reservation.Status.ToString(),
                ResidentName = reservation.Resident.FullName
            };
        }

        public async Task<List<ReservationResponseDTO>> GetByResidentIdAsync(int residentId)
        {
            var reservations = await _repository.GetByResidentIdAsync(residentId);
            return reservations.Select(r => new ReservationResponseDTO
            {
                ReservationId = r.ReservationId,
                FacilityName = r.FacilityName,
                Time = r.Time,
                Status = r.Status.ToString(),
                ResidentName = r.Resident.FullName
            }).ToList();
        }

        public async Task<ReservationResponseDTO> CreateAsync(CreateReservationDTO dto)
        {
            var reservation = new Reservation
            {
                FacilityName = dto.FacilityName,
                Time = dto.Time,
                Status = ReservationStatus.Pending,
                ResidentId = dto.ResidentId
            };

            await _repository.CreateAsync(reservation);
            var created = await _repository.GetByIdAsync(reservation.ReservationId);

            return new ReservationResponseDTO
            {
                ReservationId = created!.ReservationId,
                FacilityName = created.FacilityName,
                Time = created.Time,
                Status = created.Status.ToString(),
                ResidentName = created.Resident.FullName
            };
        }

        public async Task<ReservationResponseDTO?> UpdateAsync(int id, UpdateReservationDTO dto)
        {
            var reservation = await _repository.GetByIdAsync(id);
            if (reservation == null) return null;

            reservation.FacilityName = dto.FacilityName;
            reservation.Time = dto.Time;
            reservation.Status = dto.Status;
            await _repository.UpdateAsync(reservation);

            var updated = await _repository.GetByIdAsync(id);
            return new ReservationResponseDTO
            {
                ReservationId = updated!.ReservationId,
                FacilityName = updated.FacilityName,
                Time = updated.Time,
                Status = updated.Status.ToString(),
                ResidentName = updated.Resident.FullName
            };
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var reservation = await _repository.GetByIdAsync(id);
            if (reservation == null) return false;

            await _repository.DeleteAsync(reservation);
            return true;
        }
        public async Task<List<ReservationResponseDTO>> GetByUserIdAsync(int userId)
        {
            var reservations = await _repository.GetAllAsync();
            return reservations
                .Where(r => r.Resident.UserId == userId)
                .Select(r => new ReservationResponseDTO
                {
                    ReservationId = r.ReservationId,
                    FacilityName = r.FacilityName,
                    Time = r.Time,
                    Status = r.Status.ToString(),
                    ResidentName = r.Resident.FullName
                }).ToList();
        }
    }
}