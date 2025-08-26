using Microsoft.AspNetCore.Mvc;

namespace GeekVault.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    public record LoginRequest(string Email, string Password);

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Email) || string.IsNullOrWhiteSpace(req.Password))
            return BadRequest(new { error = "Credenciales inválidas" });

        return Ok(new { accessToken = "DUMMY", expiresIn = 3600, user = new { email = req.Email, role = "Admin" } });
    }
}
