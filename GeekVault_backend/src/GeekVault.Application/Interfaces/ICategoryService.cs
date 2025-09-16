using GeekVault.Application.DTOs;

namespace GeekVault.Application.Interfaces
{
    public interface ICategoryService
    {
        Task<IEnumerable<CategoryDto>> GetAllAsync();
        Task<CategoryDto> CreateAsync(CategoryCreateRequestDto dto);
        Task<CategoryDto?> GetByIdAsync(Guid id);
        Task<CategoryDto?> UpdateAsync(Guid id, CategoryUpdateRequestDto dto);
        Task<bool> DeleteAsync(Guid id);
    }
}
