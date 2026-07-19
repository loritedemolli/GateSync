using GateSync.API.Models.DTOs.Residence;
using GateSync.API.Models.Entities;
using GateSync.API.Repositories;

namespace GateSync.API.Services
{
    public class ResidenceService : IResidenceService
    {
        private readonly IResidenceRepository _repository;

        public ResidenceService(IResidenceRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<ResidenceResponseDTO>> GetAllAsync()
        {
            var residences = await _repository.GetAllAsync();
            return residences.Select(r => new ResidenceResponseDTO
            {
                ResidenceId = r.ResidenceId,
                Address = r.Address,
                Type = r.Type.ToString(),
                IsOccupied = r.IsOccupied,
                NeighborhoodName = r.Neighborhood.Name,
                CityName = r.Neighborhood.City.Name,
                CountryName = r.Neighborhood.City.Country.Name
            }).ToList();
        }

        public async Task<ResidenceResponseDTO?> GetByIdAsync(int id)
        {
            var residence = await _repository.GetByIdAsync(id);
            if (residence == null) return null;

            return new ResidenceResponseDTO
            {
                ResidenceId = residence.ResidenceId,
                Address = residence.Address,
                Type = residence.Type.ToString(),
                IsOccupied = residence.IsOccupied,
                NeighborhoodName = residence.Neighborhood.Name,
                CityName = residence.Neighborhood.City.Name,
                CountryName = residence.Neighborhood.City.Country.Name
            };
        }

        public async Task<ResidenceResponseDTO> CreateAsync(CreateResidenceDTO dto)
        {
            var residence = new Residence
            {
                Address = dto.Address,
                Type = dto.Type,
                IsOccupied = false,
                NeighborhoodId = dto.NeighborhoodId
            };

            await _repository.CreateAsync(residence);
            var created = await _repository.GetByIdAsync(residence.ResidenceId);

            return new ResidenceResponseDTO
            {
                ResidenceId = created!.ResidenceId,
                Address = created.Address,
                Type = created.Type.ToString(),
                IsOccupied = created.IsOccupied,
                NeighborhoodName = created.Neighborhood.Name,
                CityName = created.Neighborhood.City.Name,
                CountryName = created.Neighborhood.City.Country.Name
            };
        }

        public async Task<ResidenceResponseDTO?> UpdateAsync(int id, UpdateResidenceDTO dto)
        {
            var residence = await _repository.GetByIdAsync(id);
            if (residence == null) return null;

            residence.Address = dto.Address;
            residence.Type = dto.Type;
            residence.IsOccupied = dto.IsOccupied;
            residence.NeighborhoodId = dto.NeighborhoodId;
            await _repository.UpdateAsync(residence);

            var updated = await _repository.GetByIdAsync(id);
            return new ResidenceResponseDTO
            {
                ResidenceId = updated!.ResidenceId,
                Address = updated.Address,
                Type = updated.Type.ToString(),
                IsOccupied = updated.IsOccupied,
                NeighborhoodName = updated.Neighborhood.Name,
                CityName = updated.Neighborhood.City.Name,
                CountryName = updated.Neighborhood.City.Country.Name
            };
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var residence = await _repository.GetByIdAsync(id);
            if (residence == null) return false;

            await _repository.DeleteAsync(residence);
            return true;
        }
    }
}