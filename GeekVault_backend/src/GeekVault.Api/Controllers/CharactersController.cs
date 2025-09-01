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
}
