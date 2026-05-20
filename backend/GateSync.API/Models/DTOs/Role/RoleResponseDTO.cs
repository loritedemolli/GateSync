using GateSync.API.Models;

namespace GateSync.API.Models.DTOs.Role
{
    public class RoleResponseDTO
    {
        public int RoleId { get; set; }
        public string Name { get; set; } = string.Empty;
    }
}