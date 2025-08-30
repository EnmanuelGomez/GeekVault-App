using GeekVault.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class FranchisesController : ControllerBase
{
    private readonly IFranchiseService _service;

    public FranchisesController(IFranchiseService service)
    {
        _service = service;
    }

    // GET /api/Franchises
    // GET /api/Franchises?categoryId={GUID}
    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] Guid? categoryId)
    {
        if (categoryId.HasValue && categoryId.Value != Guid.Empty)
        {
            var byCat = await _service.GetByCategoryAsync(categoryId.Value);
            return Ok(byCat);
        }

        var all = await _service.GetAllAsync();
        return Ok(all);
    }
}
