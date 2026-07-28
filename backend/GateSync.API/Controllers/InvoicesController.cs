using GateSync.API.Models.DTOs.Invoice;
using GateSync.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GateSync.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class InvoicesController : ControllerBase
    {
        private readonly IInvoiceService _service;

        public InvoicesController(IInvoiceService service)
        {
            _service = service;
        }

        [HttpGet]
        [Authorize(Roles = "SuperAdmin,Admin")]
        public async Task<IActionResult> GetAll()
        {
            var invoices = await _service.GetAllAsync();
            return Ok(invoices);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "SuperAdmin,Admin")]
        public async Task<IActionResult> GetById(int id)
        {
            var invoice = await _service.GetByIdAsync(id);
            if (invoice == null) return NotFound();
            return Ok(invoice);
        }

        [HttpGet("residence/{residenceId}")]
        [Authorize(Roles = "SuperAdmin,Admin")]
        public async Task<IActionResult> GetByResidenceId(int residenceId)
        {
            var invoices = await _service.GetByResidenceIdAsync(residenceId);
            return Ok(invoices);
        }

        [HttpGet("my")]
        [Authorize(Roles = "Resident")]
        public async Task<IActionResult> GetMyInvoices()
        {
            var userId = User.FindFirst("userId")?.Value;
            if (userId == null) return Unauthorized();
            var invoices = await _service.GetByUserIdAsync(int.Parse(userId));
            return Ok(invoices);
        }

        [HttpPost]
        [Authorize(Roles = "SuperAdmin,Admin")]
        public async Task<IActionResult> Create([FromBody] CreateInvoiceDTO dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById),
                new { id = created.InvoiceId }, created);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "SuperAdmin,Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateInvoiceDTO dto)
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