using GeekVault.Application.DTOs;
using GeekVault.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryService _service;

    public CategoriesController(ICategoryService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
        => Ok(await _service.GetAllAsync());

    // GET: api/categories/{id}
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var category = await _service.GetByIdAsync(id);
        return category is not null ? Ok(category) : NotFound();
    }

    // POST: api/categories
    [HttpPost]
     public async Task<IActionResult> Create([FromBody] CategoryCreateRequestDto dto)
    {
        try
        {
            var created = await _service.CreateAsync(dto);
            // Devuelve Location: /api/categories/{id}
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (InvalidOperationException ex)
        {
            // Conflicto por duplicado u otra condición de negocio
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] CategoryUpdateRequestDto dto)
    {
        try
        {
            var updated = await _service.UpdateAsync(id, dto);
            if (updated is null) return NotFound();
            return Ok(updated);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Delete(Guid id)
    {
        try
        {
            var deleted = await _service.DeleteAsync(id);
            return deleted ? NoContent() : NotFound();
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }
}
