namespace GeekVault.Domain.Entities
{
    public class TeamMembership
    {
        public Guid TeamId { get; set; }
        public Team Team { get; set; } = default!;

        public Guid CharacterId { get; set; }
        public Character Character { get; set; } = default!;

        // Optional: useful metadata
        public string? RoleInTeam { get; set; } // leader, member, etc.
        public DateOnly? JoinDate { get; set; }
        public DateOnly? LeaveDate { get; set; }
    }
}
