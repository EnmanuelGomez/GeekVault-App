namespace GeekVault.Application.DTOs
{
    public sealed class TeamDto
    {
        public Guid Id { get; set; }
        public string Name { get; init; } = string.Empty;
        public int? FoundedYear { get; init; }
        public string? CreatedBy { get; init; }
        public string? ImageUrl { get; init; }

        // Para listados rápidos puedes ignorar esto con includeMembers=false
        public int MembersCount { get; init; }
        public IEnumerable<TeamMembershipDto>? Members { get; init; }
    }

    public sealed class TeamMembershipDto
    {
        public Guid CharacterId { get; init; }
        public string? RoleInTeam { get; init; }
        public DateOnly? JoinDate { get; init; }
        public DateOnly? LeaveDate { get; init; }

        // Opcional: si Character tiene Name/ImageUrl
        public string? CharacterName { get; init; }
        public string? CharacterImageUrl { get; init; }
    }
}
