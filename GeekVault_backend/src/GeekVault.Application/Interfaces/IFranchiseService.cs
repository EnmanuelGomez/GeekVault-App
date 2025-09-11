using GeekVault.Application.DTOs;

namespace GeekVault.Application.Interfaces
{
    public interface IFranchiseService
    {
        Task<IEnumerable<FranchiseDto>> GetAllAsync();
        Task<FranchiseDto?> GetByIdAsync(Guid id);
        Task<IEnumerable<FranchiseDto>> GetByCategoryAsync(Guid categoryId);
        // POST
        Task<FranchiseDto> CreateAsync(FranchiseDto request, CancellationToken ct = default);
    }
}
