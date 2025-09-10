using GeekVault.Application.DTOs;
using GeekVault.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace GeekVault.Infrastructure.Services
{
    public class CharacterCategoryService : ICharacterCategoryService
    {
        private readonly GeekVaultDbContext _db;

        public CharacterCategoryService(GeekVaultDbContext db) => _db = db;

        public async Task<IEnumerable<CharacterTypeDto>> GetAllAsync()
        {
            return await _db.CharacterTypes  //Character Types = Character Categories
                .AsNoTracking()
                .Select(c => new CharacterTypeDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Description = c.Description
                })
                .ToListAsync();
        }
    }
}
