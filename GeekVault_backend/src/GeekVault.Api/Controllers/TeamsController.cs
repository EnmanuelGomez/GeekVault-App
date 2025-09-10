using GeekVault.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class TeamsController : ControllerBase
{
    private readonly ITeamService _service;
    public TeamsController(ITeamService service) => _service = service;

    // GET /api/teams?includeMembers=false
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] bool includeMembers = false)
        => Ok(await _service.GetAllAsync(includeMembers));

    // GET /api/teams/{id}?includeMembers=true
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, [FromQuery] bool includeMembers = false)
    {
        var team = await _service.GetByIdAsync(id, includeMembers);
        return team is null ? NotFound() : Ok(team);
    }
}
