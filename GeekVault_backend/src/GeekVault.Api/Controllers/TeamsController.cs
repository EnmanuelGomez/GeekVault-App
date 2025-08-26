using Microsoft.AspNetCore.Mvc;

namespace GeekVault.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TeamsController : ControllerBase
    {
        [HttpGet] public IActionResult Get() => Ok(new { message = "Team up OK" });
        [HttpGet("{id:int}")] public IActionResult GetById(int id) => Ok(new { id, message = "Detalle pending" });
    }
}
