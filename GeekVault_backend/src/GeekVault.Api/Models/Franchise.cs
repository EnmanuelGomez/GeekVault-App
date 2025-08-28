namespace GeekVault.Api.Models
{
    public class Franchise
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public ICollection<Character> Characters { get; set; } = new List<Character>();
    }
}
