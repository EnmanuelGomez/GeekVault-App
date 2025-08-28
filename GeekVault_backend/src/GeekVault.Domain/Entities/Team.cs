namespace GeekVault.Domain.Entities
{
    public class Team
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = default!;
        public int? FoundedYear { get; set; }
        public string? CreatedBy { get; set; }
        public string? ImageUrl { get; set; }

        public ICollection<TeamMembership> Memberships { get; set; } = new List<TeamMembership>();
    }
}
