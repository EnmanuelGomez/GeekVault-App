using Microsoft.AspNetCore.Mvc;

namespace GeekVault.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FranchiseController : ControllerBase
    {
        [HttpGet] public IActionResult Get() => Ok(new { message = "Franchise OK" });
        [HttpGet("{id:int}")] public IActionResult GetById(int id) => Ok(new { id, message = "Detalle pending" });
    }

}
