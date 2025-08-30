namespace GeekVault.Application.DTOs
{
    public sealed class FranchiseDto
    {
        public Guid Id { get; set; }
        public string Name { get; init; } = string.Empty;
        public string? Description { get; init; }
        public string? OriginCountry { get; init; }
        public string? ImageUrl { get; init; }
    }
}
