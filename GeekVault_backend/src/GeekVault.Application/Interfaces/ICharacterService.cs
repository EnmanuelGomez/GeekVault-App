using GeekVault.Application.DTOs;

namespace GeekVault.Application.Interfaces
{
    public interface ICharacterService
    {
        Task<IEnumerable<CharacterDto>> GetAllAsync();
        Task<CharacterDto?> GetByIdAsync(Guid id);
        Task<IEnumerable<CharacterDto>> GetByFranchiseAsync(Guid franchiseId);

    }
}
