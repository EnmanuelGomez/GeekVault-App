using GeekVault.Application.DTOs;

namespace GeekVault.Application.Interfaces
{
    public interface ICategoryService
    {
        Task<IEnumerable<CategoryDto>> GetAllAsync();
    }
}
