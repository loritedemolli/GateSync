using GateSync.API.Models.DTOs.Notification;
using GateSync.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GateSync.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class NotificationsController : ControllerBase
    {
        private readonly INotificationService _service;

        public NotificationsController(INotificationService service)
        {
            _service = service;
        }

        [HttpGet]
        [Authorize(Roles = "SuperAdmin,Admin")]
        public async Task<IActionResult> GetAll()
        {
            var notifications = await _service.GetAllAsync();
            return Ok(notifications);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "SuperAdmin,Admin")]
        public async Task<IActionResult> GetById(int id)
        {
            var notification = await _service.GetByIdAsync(id);
            if (notification == null) return NotFound();
            return Ok(notification);
        }

        [HttpGet("resident/{residentId}")]
        [Authorize(Roles = "SuperAdmin,Admin")]
        public async Task<IActionResult> GetByResidentId(int residentId)
        {
            var notifications = await _service.GetByResidentIdAsync(residentId);
            return Ok(notifications);
        }

        [HttpGet("my")]
        [Authorize(Roles = "Resident,Security,Maintenance")]
        public async Task<IActionResult> GetMyNotifications()
        {
            var userId = User.FindFirst("userId")?.Value;
            if (userId == null) return Unauthorized();
            var notifications = await _service.GetByUserIdAsync(int.Parse(userId));
            return Ok(notifications);
        }

        [HttpPost]
        [Authorize(Roles = "SuperAdmin,Admin")]
        public async Task<IActionResult> Create([FromBody] CreateNotificationDTO dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById),
                new { id = created.NotificationId }, created);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "SuperAdmin,Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateNotificationDTO dto)
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