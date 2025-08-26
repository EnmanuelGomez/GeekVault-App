using Microsoft.AspNetCore.Mvc;

namespace GeekVault.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CharactersController : ControllerBase
{
    /// <summary>
    /// Devuelve un ping básico del recurso Characters.
    /// </summary>
    [HttpGet]
    public IActionResult Get()
        => Ok(new { message = "Characters endpoint OK", data = Array.Empty<object>() });

    /// <summary>
    /// Obtiene un personaje por ID (placeholder).
    /// </summary>
    [HttpGet("{id:int}")]
    public IActionResult GetById(int id)
        => Ok(new { id, message = "Detalle placeholder (implementación pendiente)" });

    // [HttpPost] / [HttpPut] / [HttpDelete] se implementarán luego
}
