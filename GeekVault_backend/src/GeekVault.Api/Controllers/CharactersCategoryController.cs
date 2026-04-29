using GeekVault.Application.DTOs;
using GeekVault.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http; 

namespace GeekVault.Api.Controllers
{
    [ApiController]
    [Route("api/CharacterCategory")]
    public class CharactersCategoryController(ICharacterCategoryService service) : ControllerBase
    {
        private readonly ICharacterCategoryService _service = service;

        // GET: api/CharacterCategory
        [HttpGet]
        public async Task<IActionResult> GetAll()
            => Ok(await _service.GetAllAsync());

        // GET: api/CharacterCategory/{id}
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var item = await _service.GetByIdAsync(id);
            return item is null ? NotFound() : Ok(item);
        }

        // POST: api/CharacterCategory
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CharacterTypeCreateRequestDto dto)
        {
            try
            {
                var created = await _service.CreateAsync(dto);
                // Devuelve Location: /api/CharacterCategory/{id}
                return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
            }
            catch (InvalidOperationException ex)
            {
                // Conflicto por duplicado u otra condición de negocio
                return Conflict(new { message = ex.Message });
            }
        }

        // PUT: api/CharacterCategory/{id}
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] CharacterTypeUpdateRequestDto dto)
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

        // DELETE: api/CharacterCategory/{id}
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
}