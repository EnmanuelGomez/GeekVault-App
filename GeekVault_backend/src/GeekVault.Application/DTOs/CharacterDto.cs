using System.Text.Json;

namespace GeekVault.Application.DTOs
{
    public sealed class CharacterDto
    {
        public Guid Id { get; set; }
        public string Name { get; init; } = string.Empty;
        public string? Alias { get; init; }
        public string? Description { get; init; }
        public int? CreatedOn { get; init; }   
        public string? CreatedBy { get; init; }
        public string? ImageUrl { get; init; }
        public Guid FranchiseId { get; init; }
        public string? ExtraData { get; init; }
    }

    public sealed class CreateCharacterRequest
    {
        public string Name { get; init; } = string.Empty;
        public string? Alias { get; init; }
        public string? Description { get; init; }
        public int? CreatedOn { get; init; }
        public string? CreatedBy { get; init; }
        public Guid FranchiseId { get; init; }
        public string? ImageUrl { get; init; }

        // json entrante -> se deserializa a JsonDocument
        public JsonElement? ExtraData { get; init; }

        // Relacionales opcionales
        public List<Guid>? CharacterTypeIds { get; init; }
    }
}
