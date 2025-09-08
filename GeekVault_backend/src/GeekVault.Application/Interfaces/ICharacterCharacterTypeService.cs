using GeekVault.Application.DTOs;

namespace GeekVault.Application.Interfaces
{
    public interface ICharacterCharacterTypeService
    {
        Task<IEnumerable<CharacterCharacterTypeDto>> GetAllAsync();
        Task<IEnumerable<CharacterCharacterTypeDto>> GetByCharacterAsync(Guid characterId);
        Task<IEnumerable<CharacterCharacterTypeDto>> GetByTypeAsync(Guid typeId);
        Task<IReadOnlyList<CharacterTypeDto>> GetCategoriesByCharacterAsync(Guid characterId);
    }
}
