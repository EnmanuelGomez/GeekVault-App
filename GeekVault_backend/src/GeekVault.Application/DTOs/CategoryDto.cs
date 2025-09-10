namespace GeekVault.Application.DTOs
{
    public sealed class CategoryDto
    {
        public Guid Id { get; set; }
        public string Name { get; init; } = string.Empty;
        public string? Description { get; init; }
    }
}
