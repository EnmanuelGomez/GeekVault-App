using Microsoft.AspNetCore.Mvc;

namespace GeekVault.Api.Controllers
{
    [ApiController]
    [Route("api/CharacterCategory")]
    public class CharactersCategoryController : ControllerBase
    {
        [HttpGet] public IActionResult Get() => Ok(new { message = "Character Categories OK" });
        [HttpGet("{id:int}")] public IActionResult GetById(int id) => Ok(new { id, message = "Detalle pending" });
    }
}
