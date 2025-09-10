namespace GeekVault.Application.DTOs
{
    public sealed class CharacterTypeDto
    {
        public Guid Id { get; set; }
        public string Name { get; init; } = string.Empty;
        public string? Description { get; init; }

        public CharacterTypeDto(Guid id, string name)
        {
            Id = id;
            Name = name;
        }

        public CharacterTypeDto() { }
    }
}
