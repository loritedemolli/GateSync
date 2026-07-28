using GateSync.API.Models.DTOs.Resident;
using GateSync.API.Models.Entities;
using GateSync.API.Repositories;

namespace GateSync.API.Services
{
    public class ResidentService : IResidentService
    {
        private readonly IResidentRepository _repository;

        public ResidentService(IResidentRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<ResidentResponseDTO>> GetAllAsync()
        {
            var residents = await _repository.GetAllAsync();
            return residents.Select(r => new ResidentResponseDTO
            {
                ResidentId = r.ResidentId,
                FullName = r.FullName,
                PhoneNumber = r.PhoneNumber,
                Email = r.Email,
                IsOwner = r.IsOwner,
                ResidenceAddress = r.Residence.Address,
                Username = r.User.Username
            }).ToList();
        }

        public async Task<ResidentResponseDTO?> GetByIdAsync(int id)
        {
            var resident = await _repository.GetByIdAsync(id);
            if (resident == null) return null;

            return new ResidentResponseDTO
            {
                ResidentId = resident.ResidentId,
                FullName = resident.FullName,
                PhoneNumber = resident.PhoneNumber,
                Email = resident.Email,
                IsOwner = resident.IsOwner,
                ResidenceAddress = resident.Residence.Address,
                Username = resident.User.Username
            };
        }

        public async Task<ResidentResponseDTO> CreateAsync(CreateResidentDTO dto)
        {
            var resident = new Resident
            {
                FullName = dto.FullName,
                PhoneNumber = dto.PhoneNumber,
                Email = dto.Email,
                IsOwner = dto.IsOwner,
                ResidenceId = dto.ResidenceId,
                UserId = dto.UserId
            };

            await _repository.CreateAsync(resident);
            var created = await _repository.GetByIdAsync(resident.ResidentId);

            return new ResidentResponseDTO
            {
                ResidentId = created!.ResidentId,
                FullName = created.FullName,
                PhoneNumber = created.PhoneNumber,
                Email = created.Email,
                IsOwner = created.IsOwner,
                ResidenceAddress = created.Residence.Address,
                Username = created.User.Username
            };
        }

        public async Task<ResidentResponseDTO?> UpdateAsync(int id, UpdateResidentDTO dto)
        {
            var resident = await _repository.GetByIdAsync(id);
            if (resident == null) return null;

            resident.FullName = dto.FullName;
            resident.PhoneNumber = dto.PhoneNumber;
            resident.Email = dto.Email;
            resident.IsOwner = dto.IsOwner;
            resident.ResidenceId = dto.ResidenceId;
            await _repository.UpdateAsync(resident);

            var updated = await _repository.GetByIdAsync(id);
            return new ResidentResponseDTO
            {
                ResidentId = updated!.ResidentId,
                FullName = updated.FullName,
                PhoneNumber = updated.PhoneNumber,
                Email = updated.Email,
                IsOwner = updated.IsOwner,
                ResidenceAddress = updated.Residence.Address,
                Username = updated.User.Username
            };
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var resident = await _repository.GetByIdAsync(id);
            if (resident == null) return false;

            await _repository.DeleteAsync(resident);
            return true;
        }
        public async Task<ResidentResponseDTO?> GetByUserIdAsync(int userId)
        {
            var resident = await _repository.GetByUserIdAsync(userId);
            if (resident == null) return null;

            return new ResidentResponseDTO
            {
                ResidentId = resident.ResidentId,
                FullName = resident.FullName,
                Email = resident.Email,
                PhoneNumber = resident.PhoneNumber,
                IsOwner = resident.IsOwner,
                ResidenceAddress = resident.Residence?.Address,
                NeighborhoodName = resident.Residence?.Neighborhood?.Name,
                UserId = resident.UserId
            };
        }
    }
}