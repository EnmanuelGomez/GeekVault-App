using System.ComponentModel.DataAnnotations;

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

    public sealed class CharacterTypeCreateRequestDto
    {
        [Required, StringLength(200)]
        public string Name { get; init; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; init; }
    }

    public sealed class CharacterTypeUpdateRequestDto
    {
        [Required, StringLength(200)]
        public string Name { get; init; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; init; }
    }
}
