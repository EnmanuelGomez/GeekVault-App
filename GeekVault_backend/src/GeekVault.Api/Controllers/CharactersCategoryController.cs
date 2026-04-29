using GeekVault.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace GeekVault.Api.Controllers
{
    [ApiController]
    [Route("api/CharacterCategory")]
    public class CharactersCategoryController(ICharacterCategoryService service) : ControllerBase
    {
        private readonly ICharacterCategoryService _service = service;

        [HttpGet]
        public async Task<IActionResult> GetAll()
            => Ok(await _service.GetAllAsync());
    }
}
