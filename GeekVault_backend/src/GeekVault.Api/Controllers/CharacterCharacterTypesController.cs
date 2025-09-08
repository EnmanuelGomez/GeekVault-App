using GeekVault.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class CharacterCharacterTypesController : ControllerBase
{
    private readonly ICharacterCharacterTypeService _service;

    public CharacterCharacterTypesController(ICharacterCharacterTypeService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
        => Ok(await _service.GetAllAsync());

    [HttpGet("character/{characterId:guid}")]
    public async Task<IActionResult> GetByCharacter(Guid characterId)
        => Ok(await _service.GetByCharacterAsync(characterId));

    [HttpGet("type/{typeId:guid}")]
    public async Task<IActionResult> GetByType(Guid typeId)
        => Ok(await _service.GetByTypeAsync(typeId));

    [HttpGet("character/{characterId:guid}/categories")]
    public async Task<IActionResult> GetCategoriesByCharacter(Guid characterId)
        => Ok(await _service.GetCategoriesByCharacterAsync(characterId));
}
