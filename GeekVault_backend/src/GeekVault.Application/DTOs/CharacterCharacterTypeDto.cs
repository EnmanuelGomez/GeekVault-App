namespace GeekVault.Application.DTOs
{
    public sealed class CharacterCharacterTypeDto
    {
        public Guid CharacterId { get; set; }
        public string CharacterName { get; set; } = string.Empty;

        public Guid CharacterTypeId { get; set; }
        public string CharacterTypeName { get; set; } = string.Empty;
    }
}
