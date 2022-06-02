namespace API.Entities
{
    public class Project
    {
        public Project()
        {
            this.Members= new HashSet<AppUser>();
        }

        public int Id { get; set; }
        public string ProjectName { get; set; }
        public DateTime StartDate { get; set; } = DateTime.Now;
        public DateTime EndDate { get; set; } = DateTime.Now;
        public string ProjectDescription { get; set; }
        public ICollection<AppUser> Members { get; set; }
        public int ManagerId { get; set; }
        public string ClientName { get; set; }
        public int Budget { get; set; }
        public int Expenditure { get; set; }
        public int TeamSize { get; set; }
        public bool IsActive { get; set; }
        
    }
}