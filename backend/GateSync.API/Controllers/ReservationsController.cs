using GateSync.API.Models.DTOs.Reservation;
using GateSync.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GateSync.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ReservationsController : ControllerBase
    {
        private readonly IReservationService _service;

        public ReservationsController(IReservationService service)
        {
            _service = service;
        }

        [HttpGet]
        [Authorize(Roles = "SuperAdmin,Admin")]
        public async Task<IActionResult> GetAll()
        {
            var reservations = await _service.GetAllAsync();
            return Ok(reservations);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "SuperAdmin,Admin")]
        public async Task<IActionResult> GetById(int id)
        {
            var reservation = await _service.GetByIdAsync(id);
            if (reservation == null) return NotFound();
            return Ok(reservation);
        }

        [HttpGet("resident/{residentId}")]
        [Authorize(Roles = "SuperAdmin,Admin")]
        public async Task<IActionResult> GetByResidentId(int residentId)
        {
            var reservations = await _service.GetByResidentIdAsync(residentId);
            return Ok(reservations);
        }

        [HttpGet("my")]
        [Authorize(Roles = "Resident")]
        public async Task<IActionResult> GetMyReservations()
        {
            var userId = User.FindFirst("userId")?.Value;
            if (userId == null) return Unauthorized();
            var reservations = await _service.GetByUserIdAsync(int.Parse(userId));
            return Ok(reservations);
        }

        [HttpPost]
        [Authorize(Roles = "SuperAdmin,Admin,Resident")]
        public async Task<IActionResult> Create([FromBody] CreateReservationDTO dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById),
                new { id = created.ReservationId }, created);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "SuperAdmin,Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateReservationDTO dto)
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