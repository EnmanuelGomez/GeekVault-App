using GeekVault.Application.DTOs;
using GeekVault.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace GeekVault.Infrastructure.Services
{
    public class CharacterService : ICharacterService
    {
        private readonly GeekVaultDbContext _db;

        public CharacterService(GeekVaultDbContext db) => _db = db;

        public async Task<IEnumerable<CharacterDto>> GetAllAsync()
        {
            return await _db.Characters
                .AsNoTracking()
                .Select(f => new CharacterDto
                {
                    Id = f.Id,
                    Name = f.Name,
                    Alias = f.Alias,
                    Description = f.Description,
                    FranchiseId = f.FranchiseId,
                    ExtraData = f.ExtraData,
                    ImageUrl = f.ImageUrl
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<CharacterDto>> GetByFranchiseAsync(Guid franchiseId)
        {
            return await _db.Characters
                .AsNoTracking()
                .Where(c => c.FranchiseId == franchiseId)
                .Select(c => new CharacterDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Alias = c.Alias,
                    Description = c.Description,
                    FranchiseId = c.FranchiseId,
                    ExtraData = c.ExtraData,
                    ImageUrl = c.ImageUrl
                })
                .ToListAsync();
        }

        public async Task<CharacterDto?> GetByIdAsync(Guid id) =>
            await _db.Characters.AsNoTracking()
                 .Where(c => c.Id == id)
                 .Select(c => new CharacterDto
                 {
                    Id = c.Id,
                    Name = c.Name,
                    Alias = c.Alias,
                    Description = c.Description,
                    FranchiseId = c.FranchiseId,
                    ExtraData = c.ExtraData,
                    ImageUrl = c.ImageUrl
                 })
                 .FirstOrDefaultAsync();
    }
}
