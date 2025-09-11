using GeekVault.Application.DTOs;
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

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var item = await _service.GetByIdAsync(id);
        return item is null ? NotFound() : Ok(item);
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

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] GeekVault.Application.DTOs.FranchiseDto request, CancellationToken ct)
    {
        try
        {
            var created = await _service.CreateAsync(request, ct);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (ArgumentException ex)
        {
            return Problem(title: "Invalid request data",
                           detail: ex.Message,
                           statusCode: StatusCodes.Status400BadRequest);
        }
        catch (InvalidOperationException ex)
        {
            return Problem(title: "Conflict",
                           detail: ex.Message,
                           statusCode: StatusCodes.Status409Conflict);
        }
    }


}
