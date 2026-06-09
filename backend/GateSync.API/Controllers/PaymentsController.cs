using GateSync.API.Models.DTOs.Payment;
using GateSync.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GateSync.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PaymentsController : ControllerBase
    {
        private readonly IPaymentService _service;

        public PaymentsController(IPaymentService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var payments = await _service.GetAllAsync();
            return Ok(payments);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var payment = await _service.GetByIdAsync(id);
            if (payment == null) return NotFound();
            return Ok(payment);
        }

        [HttpGet("resident/{residentId}")]
        public async Task<IActionResult> GetByResidentId(int residentId)
        {
            var payments = await _service.GetByResidentIdAsync(residentId);
            return Ok(payments);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreatePaymentDTO dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById),
                new { id = created.PaymentId }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdatePaymentDTO dto)
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