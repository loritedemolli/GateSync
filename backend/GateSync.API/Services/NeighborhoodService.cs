using GateSync.API.Models.DTOs.Neighborhood;
using GateSync.API.Models.Entities;
using GateSync.API.Repositories;

namespace GateSync.API.Services
{
    public class NeighborhoodService : INeighborhoodService
    {
        private readonly INeighborhoodRepository _repository;

        public NeighborhoodService(INeighborhoodRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<NeighborhoodResponseDTO>> GetAllAsync()
        {
            var neighborhoods = await _repository.GetAllAsync();
            return neighborhoods.Select(n => new NeighborhoodResponseDTO
            {
                NeighborhoodId = n.NeighborhoodId,
                Name = n.Name,
                Address = n.Address,
                Description = n.Description,
                IsActive = n.IsActive,
                CityName = n.City.Name,
                CountryName = n.City.Country.Name,
                TotalResidences = n.Residences.Count
            }).ToList();
        }

        public async Task<NeighborhoodResponseDTO?> GetByIdAsync(int id)
        {
            var n = await _repository.GetByIdAsync(id);
            if (n == null) return null;

            return new NeighborhoodResponseDTO
            {
                NeighborhoodId = n.NeighborhoodId,
                Name = n.Name,
                Address = n.Address,
                Description = n.Description,
                IsActive = n.IsActive,
                CityName = n.City.Name,
                CountryName = n.City.Country.Name,
                TotalResidences = n.Residences.Count
            };
        }

        public async Task<List<NeighborhoodResponseDTO>> GetByCityIdAsync(int cityId)
        {
            var neighborhoods = await _repository.GetByCityIdAsync(cityId);
            return neighborhoods.Select(n => new NeighborhoodResponseDTO
            {
                NeighborhoodId = n.NeighborhoodId,
                Name = n.Name,
                Address = n.Address,
                Description = n.Description,
                IsActive = n.IsActive,
                CityName = n.City.Name,
                CountryName = n.City.Country.Name,
                TotalResidences = n.Residences.Count
            }).ToList();
        }

        public async Task<NeighborhoodResponseDTO> CreateAsync(CreateNeighborhoodDTO dto)
        {
            var neighborhood = new Neighborhood
            {
                Name = dto.Name,
                Address = dto.Address,
                Description = dto.Description,
                IsActive = true,
                CityId = dto.CityId
            };

            await _repository.CreateAsync(neighborhood);
            var created = await _repository.GetByIdAsync(neighborhood.NeighborhoodId);

            return new NeighborhoodResponseDTO
            {
                NeighborhoodId = created!.NeighborhoodId,
                Name = created.Name,
                Address = created.Address,
                Description = created.Description,
                IsActive = created.IsActive,
                CityName = created.City.Name,
                CountryName = created.City.Country.Name,
                TotalResidences = created.Residences.Count
            };
        }

        public async Task<NeighborhoodResponseDTO?> UpdateAsync(int id, UpdateNeighborhoodDTO dto)
        {
            var neighborhood = await _repository.GetByIdAsync(id);
            if (neighborhood == null) return null;

            neighborhood.Name = dto.Name;
            neighborhood.Address = dto.Address;
            neighborhood.Description = dto.Description;
            neighborhood.IsActive = dto.IsActive;
            neighborhood.CityId = dto.CityId;

            await _repository.UpdateAsync(neighborhood);
            var updated = await _repository.GetByIdAsync(id);

            return new NeighborhoodResponseDTO
            {
                NeighborhoodId = updated!.NeighborhoodId,
                Name = updated.Name,
                Address = updated.Address,
                Description = updated.Description,
                IsActive = updated.IsActive,
                CityName = updated.City.Name,
                CountryName = updated.City.Country.Name,
                TotalResidences = updated.Residences.Count
            };
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var neighborhood = await _repository.GetByIdAsync(id);
            if (neighborhood == null) return false;

            await _repository.DeleteAsync(neighborhood);
            return true;
        }
    }
}