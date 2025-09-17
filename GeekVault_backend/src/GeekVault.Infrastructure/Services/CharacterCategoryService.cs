using GeekVault.Application.DTOs;
using GeekVault.Application.Interfaces;
using GeekVault.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GeekVault.Infrastructure.Services
{
    public class CharacterCategoryService : ICharacterCategoryService
    {
        private readonly GeekVaultDbContext _db;

        public CharacterCategoryService(GeekVaultDbContext db) => _db = db;

        public async Task<IEnumerable<CharacterTypeDto>> GetAllAsync()
        {
            return await _db.CharacterTypes
                .AsNoTracking()
                .Select(c => new CharacterTypeDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Description = c.Description
                })
                .ToListAsync();
        }

        public async Task<CharacterTypeDto?> GetByIdAsync(Guid id)
        {
            return await _db.CharacterTypes
                .AsNoTracking()
                .Where(c => c.Id == id)
                .Select(c => new CharacterTypeDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Description = c.Description
                })
                .FirstOrDefaultAsync();
        }

        public async Task<CharacterTypeDto> CreateAsync(CharacterTypeCreateRequestDto dto)
        {
            var exists = await _db.CharacterTypes
                .AnyAsync(c => c.Name.ToLower() == dto.Name.ToLower());

            if (exists)
                throw new InvalidOperationException($"Character Category '{dto.Name}' already exists.");

            var entity = new CharacterType
            {
                Id = Guid.NewGuid(),
                Name = dto.Name.Trim(),
                Description = string.IsNullOrWhiteSpace(dto.Description) ? null : dto.Description!.Trim()
            };

            _db.CharacterTypes.Add(entity);
            await _db.SaveChangesAsync();

            return new CharacterTypeDto
            {
                Id = entity.Id,
                Name = entity.Name,
                Description = entity.Description
            };
        }

        public async Task<CharacterTypeDto?> UpdateAsync(Guid id, CharacterTypeUpdateRequestDto dto)
        {
            var entity = await _db.CharacterTypes.FirstOrDefaultAsync(c => c.Id == id);
            if (entity is null) return null;

            var duplicate = await _db.CharacterTypes
                .AnyAsync(c => c.Id != id && c.Name.ToLower() == dto.Name.ToLower());
            if (duplicate)
                throw new InvalidOperationException($"Character Category '{dto.Name}' already exists.");

            entity.Name = dto.Name.Trim();
            entity.Description = string.IsNullOrWhiteSpace(dto.Description) ? null : dto.Description!.Trim();

            await _db.SaveChangesAsync();

            return new CharacterTypeDto { Id = entity.Id, Name = entity.Name, Description = entity.Description };
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var entity = await _db.CharacterTypes.FirstOrDefaultAsync(c => c.Id == id);
            if (entity is null) return false;

            // Verifica si está en uso en CharacterCharacterTypes
            var inUse = await _db.CharacterCharacterTypes.AnyAsync(cc => cc.CharacterTypeId == id);
            if (inUse)
                throw new InvalidOperationException("La categoría está en uso por uno o más personajes.");

            _db.CharacterTypes.Remove(entity);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}