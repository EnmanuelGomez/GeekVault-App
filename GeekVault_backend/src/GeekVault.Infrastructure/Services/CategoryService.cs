using GeekVault.Application.DTOs;
using GeekVault.Application.Interfaces;
using GeekVault.Domain.Entities;
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

        public async Task<CategoryDto?> GetByIdAsync(Guid id)
        {
            return await _db.Categories
                .AsNoTracking()
                .Where(c => c.Id == id)
                .Select(c => new CategoryDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Description = c.Description
                })
                .FirstOrDefaultAsync();
        }

        public async Task<CategoryDto> CreateAsync(CategoryCreateRequestDto dto)
        {
            // Validación de unicidad por Name (case-insensitive)
            var exists = await _db.Categories
                .AnyAsync(c => c.Name.ToLower() == dto.Name.ToLower());

            if (exists)
                throw new InvalidOperationException($"Category '{dto.Name}' already exists.");

            var entity = new Category
            {
                Id = Guid.NewGuid(),
                Name = dto.Name.Trim(),
                Description = string.IsNullOrWhiteSpace(dto.Description) ? null : dto.Description!.Trim()
            };

            _db.Categories.Add(entity);
            await _db.SaveChangesAsync();

            return new CategoryDto
            {
                Id = entity.Id,
                Name = entity.Name,
                Description = entity.Description
            };
        }

        public async Task<CategoryDto?> UpdateAsync(Guid id, CategoryUpdateRequestDto dto)
        {
            var entity = await _db.Categories.FirstOrDefaultAsync(c => c.Id == id);
            if (entity is null) return null;

            var duplicate = await _db.Categories
                .AnyAsync(c => c.Id != id && c.Name.ToLower() == dto.Name.ToLower());
            if (duplicate)
                throw new InvalidOperationException($"Category '{dto.Name}' already exists.");

            entity.Name = dto.Name.Trim();
            entity.Description = string.IsNullOrWhiteSpace(dto.Description) ? null : dto.Description!.Trim();

            await _db.SaveChangesAsync();

            return new CategoryDto { Id = entity.Id, Name = entity.Name, Description = entity.Description };
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var entity = await _db.Categories.FirstOrDefaultAsync(c => c.Id == id);
            if (entity is null) return false;

            // Evitar borrar si está en uso (relación M:N con Franchise)
            var inUse = await _db.FranchiseCategories.AnyAsync(fc => fc.CategoryId == id);
            if (inUse)
                throw new InvalidOperationException("La categoría está en uso por una o más franquicias.");

            _db.Categories.Remove(entity);
            await _db.SaveChangesAsync();
            return true;
        }

    }
}
