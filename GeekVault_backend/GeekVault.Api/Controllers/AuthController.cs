using Microsoft.AspNetCore.Mvc;
// using Microsoft.AspNetCore.Authorization;

namespace GeekVault.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    /// <summary>
    /// Login de administrador (placeholder). Retorna un token dummy solo para pruebas de UI.
    /// </summary>
    [HttpPost("login")]
    // [AllowAnonymous]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        // TODO: Reemplazar con validación real + emisión de JWT.
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            return BadRequest(new { error = "Credenciales inválidas" });

        return Ok(new
        {
            accessToken = "DUMMY_TOKEN_REEMPLAZAR_POR_JWT",
            expiresIn = 3600,
            user = new { email = request.Email, role = "Admin" }
        });
    }

    public record LoginRequest(string Email, string Password);
}
