namespace API.DTOs
{
    public class ProjectDto
    {
        public int Id { get; set; }
        public string ProjectName { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string ProjectDescription { get; set; }
        public IEnumerable<ProjectMembersDto> Members { get; set; }
        public int ManagerId { get; set; }
        public string ClientName { get; set; }
        public int Budget { get; set; }
        public int Expenditure { get; set; }
        public int TeamSize { get; set; }

        public bool IsActive { get; set; }
    }
}