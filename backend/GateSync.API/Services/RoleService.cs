using GateSync.API.Models.DTOs.Role;
using GateSync.API.Models.Entities;
using GateSync.API.Repositories;

namespace GateSync.API.Services
{
    public class RoleService : IRoleService
    {
        private readonly IRoleRepository _repository;

        public RoleService(IRoleRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<RoleResponseDTO>> GetAllAsync()
        {
            var roles = await _repository.GetAllAsync();
            return roles.Select(r => new RoleResponseDTO
            {
                RoleId = r.RoleId,
                Name = r.Name.ToString()
            }).ToList();
        }

        public async Task<RoleResponseDTO?> GetByIdAsync(int id)
        {
            var role = await _repository.GetByIdAsync(id);
            if (role == null) return null;

            return new RoleResponseDTO
            {
                RoleId = role.RoleId,
                Name = role.Name.ToString()
            };
        }

        public async Task<RoleResponseDTO> CreateAsync(CreateRoleDTO dto)
        {
            var role = new Role { Name = dto.Name };
            await _repository.CreateAsync(role);

            return new RoleResponseDTO
            {
                RoleId = role.RoleId,
                Name = role.Name.ToString()
            };
        }

        public async Task<RoleResponseDTO?> UpdateAsync(int id, UpdateRoleDTO dto)
        {
            var role = await _repository.GetByIdAsync(id);
            if (role == null) return null;

            role.Name = dto.Name;
            await _repository.UpdateAsync(role);

            return new RoleResponseDTO
            {
                RoleId = role.RoleId,
                Name = role.Name.ToString()
            };
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var role = await _repository.GetByIdAsync(id);
            if (role == null) return false;

            await _repository.DeleteAsync(role);
            return true;
        }
    }
}