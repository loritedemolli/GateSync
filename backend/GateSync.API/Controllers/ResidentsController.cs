using System.Security.Claims;
using GateSync.API.Models.DTOs.Resident;
using GateSync.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GateSync.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ResidentsController : ControllerBase
    {
        private readonly IResidentService _service;

        public ResidentsController(IResidentService service)
        {
            _service = service;
        }

        [HttpGet]
        [Authorize(Roles = "SuperAdmin,Admin,Security")]
        public async Task<IActionResult> GetAll()
        {
            var residents = await _service.GetAllAsync();
            return Ok(residents);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "SuperAdmin,Admin,Security")]
        public async Task<IActionResult> GetById(int id)
        {
            var resident = await _service.GetByIdAsync(id);
            if (resident == null) return NotFound();
            return Ok(resident);
        }

        [HttpGet("my-profile")]
        [Authorize(Roles = "Resident")]
        public async Task<IActionResult> GetMyProfile()
        {
            var userId = User.FindFirst("userId")?.Value;
            if (userId == null) return Unauthorized();
            var resident = await _service.GetByUserIdAsync(int.Parse(userId));
            if (resident == null) return NotFound();
            return Ok(resident);
        }

        [HttpPost]
        [Authorize(Roles = "SuperAdmin,Admin")]
        public async Task<IActionResult> Create([FromBody] CreateResidentDTO dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.ResidentId }, created);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "SuperAdmin,Admin,Resident")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateResidentDTO dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var updated = await _service.UpdateAsync(id, dto);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "SuperAdmin,Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _service.DeleteAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }
    }
}