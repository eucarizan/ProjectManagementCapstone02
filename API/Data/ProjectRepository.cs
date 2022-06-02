using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class ProjectRepository : IProjectRepository
    {
        private readonly DataContext _context;
        public ProjectRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<Project> GetProjectByIdAsync(int id)
        {
            return await _context.Projects
                .Include(p => p.Members)
                .FirstOrDefaultAsync(p => p.Id == id);
                // .FindAsync(id);
        }

        public async Task<Project> GetProjectByProjectNameAsync(string projectName)
        {
            return await _context.Projects
                .Include(p => p.Members)
                .SingleOrDefaultAsync(x => x.ProjectName == projectName);
        }

        public async Task<IEnumerable<Project>> GetProjectsAsync()
        {
            return await _context.Projects
                .Include(p => p.Members)
                .ToListAsync();
        }

        public async Task<IEnumerable<Project>> GetProjectsByManagerAsync(int id)
        {
            return await _context.Projects
                .Include(p => p.Members)
                .Where(p => p.ManagerId == id)
                .ToListAsync();
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> ProjectExists(string projectname) {
            return await _context.Projects.AnyAsync(x => x.ProjectName == projectname.ToLower());
        }

        public void Update(Project project)
        {
            _context.Entry(project).State = EntityState.Modified;
        }
        
        public void AddProject(Project project) {
            _context.Add(project);
        }

        public void RemoveProject(Project project) {
            _context.Remove(project);
        }
    }
}