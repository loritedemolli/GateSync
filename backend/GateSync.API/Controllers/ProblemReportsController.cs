using GateSync.API.Models.DTOs.ProblemReport;
using GateSync.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GateSync.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProblemReportsController : ControllerBase
    {
        private readonly IProblemReportService _service;

        public ProblemReportsController(IProblemReportService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var reports = await _service.GetAllAsync();
            return Ok(reports);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var report = await _service.GetByIdAsync(id);
            if (report == null) return NotFound();
            return Ok(report);
        }

        [HttpGet("resident/{residentId}")]
        public async Task<IActionResult> GetByResidentId(int residentId)
        {
            var reports = await _service.GetByResidentIdAsync(residentId);
            return Ok(reports);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateProblemReportDTO dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById),
                new { id = created.ProblemReportId }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateProblemReportDTO dto)
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