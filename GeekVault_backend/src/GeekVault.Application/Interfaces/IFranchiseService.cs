using GeekVault.Application.DTOs;

namespace GeekVault.Application.Interfaces
{
    public interface IFranchiseService
    {
        // GET
        Task<IEnumerable<FranchiseDto>> GetAllAsync();
        Task<FranchiseDto?> GetByIdAsync(Guid id);
        Task<IEnumerable<FranchiseDto>> GetByCategoryAsync(Guid categoryId);
        // POST
        Task<FranchiseDto> CreateAsync(FranchiseCreateRequestDto request, CancellationToken ct = default);
        // UPDATE
        Task<FranchiseDto> UpdateAsync(Guid id, FranchiseUpdateRequestDto request, CancellationToken ct = default);
        Task<Guid?> GetPrimaryCategoryIdAsync(Guid franchiseId, CancellationToken ct = default);
    }
}
