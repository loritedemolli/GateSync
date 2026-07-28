using GateSync.API.Models.DTOs.Vehicle;
using GateSync.API.Models.Entities;
using GateSync.API.Repositories;

namespace GateSync.API.Services
{
    public class VehicleService : IVehicleService
    {
        private readonly IVehicleRepository _repository;

        public VehicleService(IVehicleRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<VehicleResponseDTO>> GetAllAsync()
        {
            var vehicles = await _repository.GetAllAsync();
            return vehicles.Select(v => new VehicleResponseDTO
            {
                VehicleId = v.VehicleId,
                PlateNumber = v.PlateNumber,
                Brand = v.Brand,
                ModelName = v.ModelName,
                ResidentName = v.Resident.FullName
            }).ToList();
        }

        public async Task<VehicleResponseDTO?> GetByIdAsync(int id)
        {
            var vehicle = await _repository.GetByIdAsync(id);
            if (vehicle == null) return null;

            return new VehicleResponseDTO
            {
                VehicleId = vehicle.VehicleId,
                PlateNumber = vehicle.PlateNumber,
                Brand = vehicle.Brand,
                ModelName = vehicle.ModelName,
                ResidentName = vehicle.Resident.FullName
            };
        }

        public async Task<List<VehicleResponseDTO>> GetByResidentIdAsync(int residentId)
        {
            var vehicles = await _repository.GetByResidentIdAsync(residentId);
            return vehicles.Select(v => new VehicleResponseDTO
            {
                VehicleId = v.VehicleId,
                PlateNumber = v.PlateNumber,
                Brand = v.Brand,
                ModelName = v.ModelName,
                ResidentName = v.Resident.FullName
            }).ToList();
        }

        public async Task<VehicleResponseDTO> CreateAsync(CreateVehicleDTO dto)
        {
            var vehicle = new Vehicle
            {
                PlateNumber = dto.PlateNumber,
                Brand = dto.Brand,
                ModelName = dto.ModelName,
                ResidentId = dto.ResidentId
            };

            await _repository.CreateAsync(vehicle);
            var created = await _repository.GetByIdAsync(vehicle.VehicleId);

            return new VehicleResponseDTO
            {
                VehicleId = created!.VehicleId,
                PlateNumber = created.PlateNumber,
                Brand = created.Brand,
                ModelName = created.ModelName,
                ResidentName = created.Resident.FullName
            };
        }

        public async Task<VehicleResponseDTO?> UpdateAsync(int id, UpdateVehicleDTO dto)
        {
            var vehicle = await _repository.GetByIdAsync(id);
            if (vehicle == null) return null;

            vehicle.PlateNumber = dto.PlateNumber;
            vehicle.Brand = dto.Brand;
            vehicle.ModelName = dto.ModelName;
            await _repository.UpdateAsync(vehicle);

            var updated = await _repository.GetByIdAsync(id);
            return new VehicleResponseDTO
            {
                VehicleId = updated!.VehicleId,
                PlateNumber = updated.PlateNumber,
                Brand = updated.Brand,
                ModelName = updated.ModelName,
                ResidentName = updated.Resident.FullName
            };
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var vehicle = await _repository.GetByIdAsync(id);
            if (vehicle == null) return false;

            await _repository.DeleteAsync(vehicle);
            return true;
        }
        public async Task<List<VehicleResponseDTO>> GetByUserIdAsync(int userId)
        {
            var vehicles = await _repository.GetAllAsync();
            return vehicles
                .Where(v => v.Resident.UserId == userId)
                .Select(v => new VehicleResponseDTO
                {
                    VehicleId = v.VehicleId,
                    PlateNumber = v.PlateNumber,
                    Brand = v.Brand,
                    ModelName = v.ModelName, 
                    ResidentName = v.Resident.FullName
                }).ToList();
        }
    }
}