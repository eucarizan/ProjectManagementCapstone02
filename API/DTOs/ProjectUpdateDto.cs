namespace API.DTOs
{
    public class ProjectUpdateDto
    {
        public string ProjectName { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string ProjectDescription { get; set; }
        public int ManagerId { get; set; }
        public string ClientName { get; set; }
        public int Budget { get; set; }
        public bool IsActive { get; set; }
        public int Expenditure { get; set; }
        public int TeamSize { get; set; }
    }
}