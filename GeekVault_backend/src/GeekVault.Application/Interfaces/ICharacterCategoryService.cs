using GeekVault.Application.DTOs;

namespace GeekVault.Application.Interfaces
{
    public interface ICharacterCategoryService
    {
        Task<IEnumerable<CharacterTypeDto>> GetAllAsync();
        Task<CharacterTypeDto> CreateAsync(CharacterTypeCreateRequestDto dto);
        Task<CharacterTypeDto?> GetByIdAsync(Guid id);
        Task<CharacterTypeDto?> UpdateAsync(Guid id, CharacterTypeUpdateRequestDto dto);
        Task<bool> DeleteAsync(Guid id);
    }
}
