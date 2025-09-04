using GeekVault.Application.DTOs;

namespace GeekVault.Application.Interfaces
{
    public interface ICharacterCategoryService
    {
        Task<IEnumerable<CharacterCategoryDto>> GetAllAsync();
    }
}
