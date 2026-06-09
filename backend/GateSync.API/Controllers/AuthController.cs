using GateSync.API.Models.DTOs.Auth;
using GateSync.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace GateSync.API.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class AuthController : ControllerBase
	{
		private readonly IAuthService _authService;

		public AuthController(IAuthService authService)
		{
			_authService = authService;
		}

		[HttpPost("login")]
		public async Task<IActionResult> Login([FromBody] LoginDTO dto)
		{
			if (!ModelState.IsValid) return BadRequest(ModelState);

			var result = await _authService.LoginAsync(dto);
			if (result == null)
				return Unauthorized("Username ose fjalëkalimi është i gabuar!");

			return Ok(result);
		}

		[HttpPost("register")]
		public async Task<IActionResult> Register([FromBody] RegisterDTO dto)
		{
			if (!ModelState.IsValid) return BadRequest(ModelState);

			var result = await _authService.RegisterAsync(dto);
			if (result == null)
				return BadRequest("Username ekziston tashmë!");

			return Ok(result);
		}

		[HttpPost("refresh")]
		public async Task<IActionResult> Refresh([FromBody] RefreshRequestDTO dto)
		{
			var result = await _authService.RefreshTokenAsync(dto.RefreshToken);
			if (result == null)
				return Unauthorized("Refresh token i pavlefshëm!");

			return Ok(result);
		}

		[HttpPost("revoke")]
		public async Task<IActionResult> Revoke([FromBody] RefreshRequestDTO dto)
		{
			var result = await _authService.RevokeTokenAsync(dto.RefreshToken);
			if (!result)
				return NotFound("Refresh token nuk u gjet!");

			return NoContent();
		}
	}
}