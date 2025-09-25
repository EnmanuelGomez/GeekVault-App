using GeekVault.Application.DTOs;
using GeekVault.Application.Interfaces;
using GeekVault.Domain.Entities;
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
                    CreatedBy = f.CreatedBy,
                    CreatedOn = f.CreatedOn,
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
                    CreatedBy = c.CreatedBy,
                    CreatedOn = c.CreatedOn,
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
                    CreatedBy = c.CreatedBy,
                    CreatedOn = c.CreatedOn,
                    FranchiseId = c.FranchiseId,
                    ExtraData = c.ExtraData,
                    ImageUrl = c.ImageUrl
                 })
                 .FirstOrDefaultAsync();

        public async Task<CharacterDto> CreateAsync(CreateCharacterRequest request, CancellationToken ct = default)
        {

            string? extraRaw = request.ExtraData.HasValue
                                       ? request.ExtraData.Value.GetRawText()    // JSON canónico (sin comillas extra)
    :                                   null;

            // 1) Validar franquicia
            var franchiseExists = await _db.Franchises
                .AsNoTracking()
                .AnyAsync(f => f.Id == request.FranchiseId, ct);
            if (!franchiseExists)
                throw new ArgumentException("FranchiseId inválido o no existe.");

            // 2) Validar tipos (si vienen)
            var typeIds = request.CharacterTypeIds?.Distinct().ToList() ?? new List<Guid>();
            var types = new List<CharacterType>();
            if (typeIds.Count > 0)
            {
                types = await _db.CharacterTypes
                    .Where(t => typeIds.Contains(t.Id))
                    .ToListAsync(ct);

                if (types.Count != typeIds.Count)
                    throw new ArgumentException("Uno o más CharacterTypeIds no existen.");
            }

            // 4) Construir entidad Character
            var entity = new Character
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                Alias = request.Alias,
                Description = request.Description,
                CreatedOn = request.CreatedOn,
                CreatedBy = request.CreatedBy,
                FranchiseId = request.FranchiseId,
                ImageUrl = request.ImageUrl,
                ExtraData = extraRaw // <- string con JSON válido
            };

            // 5) Agregar M:N tipos
            foreach (var t in types)
            {
                entity.CharacterCharacterTypes.Add(new CharacterCharacterType
                {
                    CharacterId = entity.Id,
                    CharacterTypeId = t.Id
                });
            }

            // 6) Persistir
            _db.Characters.Add(entity);
            await _db.SaveChangesAsync(ct);

            // 7) Devolver DTO
            return new CharacterDto
            {
                Id = entity.Id,
                Name = entity.Name,
                Alias = entity.Alias,
                Description = entity.Description,
                CreatedBy = entity.CreatedBy,
                CreatedOn = entity.CreatedOn,
                FranchiseId = entity.FranchiseId,
                ImageUrl = entity.ImageUrl,
                ExtraData = entity.ExtraData
            };
        }
    }

}
