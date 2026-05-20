using System.ComponentModel.DataAnnotations;
using GateSync.API.Models;

namespace GateSync.API.Models.DTOs.Role
{
    public class CreateRoleDTO
    {
        [Required(ErrorMessage = "Roli është i detyrueshëm")]
        public UserRole Name { get; set; }
    }
}