using Microsoft.AspNetCore.Mvc;

namespace GeekVault.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    /// <summary>
    /// Devuelve listado de categorías (placeholder).
    /// </summary>
    [HttpGet]
    public IActionResult Get()
        => Ok(new { message = "Categories endpoint OK", data = Array.Empty<object>() });

    // [HttpPost] / [HttpPut] / [HttpDelete] se implementarán luego
}
