using GeekVault.Application.DTOs;

namespace GeekVault.Application.Interfaces
{
    public interface IFranchiseService
    {
        Task<IEnumerable<FranchiseDto>> GetAllAsync();
        Task<IEnumerable<FranchiseDto>> GetByCategoryAsync(Guid categoryId);
    }
}
