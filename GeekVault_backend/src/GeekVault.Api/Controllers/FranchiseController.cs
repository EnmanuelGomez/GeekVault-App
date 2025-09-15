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
    public async Task<IActionResult> Create([FromBody] FranchiseCreateRequestDto request, CancellationToken ct)
    {
        try
        {
            var created = await _service.CreateAsync(request, ct);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (ArgumentException ex)
        {
            return Problem(title: "Invalid request data", detail: ex.Message,
                statusCode: StatusCodes.Status400BadRequest);
        }
        catch (InvalidOperationException ex)
        {
            return Problem(title: "Conflict", detail: ex.Message,
                statusCode: StatusCodes.Status409Conflict);
        }
    }

    // PUT /api/Franchises/{id}
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] FranchiseUpdateRequestDto request, CancellationToken ct)
    {
        try
        {
            var updated = await _service.UpdateAsync(id, request, ct);
            return Ok(updated);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        catch (ArgumentException ex)
        {
            return Problem(title: "Invalid request data", detail: ex.Message,
                           statusCode: StatusCodes.Status400BadRequest);
        }
        catch (InvalidOperationException ex)
        {
            return Problem(title: "Conflict", detail: ex.Message,
                           statusCode: StatusCodes.Status409Conflict);
        }
    }

    // GET /api/Franchises/{id}/category  -> para precargar la categoría
    [HttpGet("{id:guid}/category")]
    public async Task<IActionResult> GetPrimaryCategory(Guid id, CancellationToken ct)
    {
        var catId = await _service.GetPrimaryCategoryIdAsync(id, ct);
        return Ok(new { categoryId = catId }); // puede ser null si no tiene
    }

}