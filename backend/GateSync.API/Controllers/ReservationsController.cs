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
        public async Task<IActionResult> GetAll()
        {
            var reservations = await _service.GetAllAsync();
            return Ok(reservations);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var reservation = await _service.GetByIdAsync(id);
            if (reservation == null) return NotFound();
            return Ok(reservation);
        }

        [HttpGet("resident/{residentId}")]
        public async Task<IActionResult> GetByResidentId(int residentId)
        {
            var reservations = await _service.GetByResidentIdAsync(residentId);
            return Ok(reservations);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateReservationDTO dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById),
                new { id = created.ReservationId }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateReservationDTO dto)
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