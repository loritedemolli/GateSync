using GateSync.API.Models.DTOs.Vehicle;
using GateSync.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GateSync.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class VehiclesController : ControllerBase
    {
        private readonly IVehicleService _service;

        public VehiclesController(IVehicleService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var vehicles = await _service.GetAllAsync();
            return Ok(vehicles);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var vehicle = await _service.GetByIdAsync(id);
            if (vehicle == null) return NotFound();
            return Ok(vehicle);
        }

        [HttpGet("resident/{residentId}")]
        public async Task<IActionResult> GetByResidentId(int residentId)
        {
            var vehicles = await _service.GetByResidentIdAsync(residentId);
            return Ok(vehicles);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateVehicleDTO dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById),
                new { id = created.VehicleId }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateVehicleDTO dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var updated = await _service.UpdateAsync(id, dto);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _service.DeleteAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }
    }
}