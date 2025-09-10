using GeekVault.Application.DTOs;
using GeekVault.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace GeekVault.Infrastructure.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly GeekVaultDbContext _db;

        public CategoryService(GeekVaultDbContext db) => _db = db;

        public async Task<IEnumerable<CategoryDto>> GetAllAsync()
        {
            return await _db.Categories
                .AsNoTracking()
                .Select(c => new CategoryDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Description = c.Description
                })
                .ToListAsync();
        }
    }
}
