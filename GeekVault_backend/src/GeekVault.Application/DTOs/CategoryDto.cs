using System.ComponentModel.DataAnnotations;

namespace GeekVault.Application.DTOs
{
    public sealed class CategoryDto
    {
        public Guid Id { get; set; }
        public string Name { get; init; } = string.Empty;
        public string? Description { get; init; }
    }

    public sealed class CategoryCreateRequestDto
    {
        [Required, StringLength(200)]
        public string Name { get; init; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; init; }
    }

    public sealed class CategoryUpdateRequestDto
    {
        [Required, StringLength(200)]
        public string Name { get; init; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; init; }
    }
}
