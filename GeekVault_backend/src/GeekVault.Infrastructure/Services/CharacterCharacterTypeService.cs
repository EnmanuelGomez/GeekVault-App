using GeekVault.Application.DTOs;
using GeekVault.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace GeekVault.Infrastructure.Services
{
    public class CharacterCharacterTypeService : ICharacterCharacterTypeService
    {
        private readonly GeekVaultDbContext _db;

        public CharacterCharacterTypeService(GeekVaultDbContext db) => _db = db;

        public async Task<IEnumerable<CharacterCharacterTypeDto>> GetAllAsync()
        {
            return await _db.CharacterCharacterTypes
                .AsNoTracking()
                .Include(cct => cct.Character)
                .Include(cct => cct.CharacterType)
                .Select(cct => new CharacterCharacterTypeDto
                {
                    CharacterId = cct.CharacterId,
                    CharacterName = cct.Character.Name,
                    CharacterTypeId = cct.CharacterTypeId,
                    CharacterTypeName = cct.CharacterType.Name
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<CharacterCharacterTypeDto>> GetByCharacterAsync(Guid characterId)
        {
            return await _db.CharacterCharacterTypes
                .AsNoTracking()
                .Where(cct => cct.CharacterId == characterId)
                .Include(cct => cct.CharacterType)
                .Select(cct => new CharacterCharacterTypeDto
                {
                    CharacterId = cct.CharacterId,
                    CharacterName = cct.Character.Name,
                    CharacterTypeId = cct.CharacterTypeId,
                    CharacterTypeName = cct.CharacterType.Name
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<CharacterCharacterTypeDto>> GetByTypeAsync(Guid typeId)
        {
            return await _db.CharacterCharacterTypes
                .AsNoTracking()
                .Where(cct => cct.CharacterTypeId == typeId)
                .Include(cct => cct.Character)
                .Select(cct => new CharacterCharacterTypeDto
                {
                    CharacterId = cct.CharacterId,
                    CharacterName = cct.Character.Name,
                    CharacterTypeId = cct.CharacterTypeId,
                    CharacterTypeName = cct.CharacterType.Name
                })
                .ToListAsync();
        }
    }
}
