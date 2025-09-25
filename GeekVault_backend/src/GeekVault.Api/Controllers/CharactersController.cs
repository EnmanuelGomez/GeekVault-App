using GeekVault.Application.DTOs;
using GeekVault.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace GeekVault.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CharactersController : ControllerBase
{
    private readonly ICharacterService _service;

    public CharactersController(ICharacterService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
        => Ok(await _service.GetAllAsync());

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var ch = await _service.GetByIdAsync(id);
        return ch is null ? NotFound() : Ok(ch);
    }

    [HttpGet("by-franchise/{franchiseId:guid}")]
    public async Task<IActionResult> GetByFranchise(Guid franchiseId)
    => Ok(await _service.GetByFranchiseAsync(franchiseId));

    // POST /api/characters
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCharacterRequest request, CancellationToken ct)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        try
        {
            var created = await _service.CreateAsync(request, ct);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (ArgumentException ex)
        {
            // IDs inválidos u otra validación de negocio
            return BadRequest(new { error = ex.Message });
        }
    }
}
