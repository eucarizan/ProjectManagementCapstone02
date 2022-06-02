using System.Text.Json;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class Seed
    {
        public static async Task SeedUsers(UserManager<AppUser> userManager, 
            RoleManager<AppRole> roleManager)
        {
            if (await userManager.Users.AnyAsync()) return;

            var userData = await System.IO.File.ReadAllTextAsync("Data/UserSeedData.json");
            var users = JsonSerializer.Deserialize<List<AppUser>>(userData);
            if (users == null) return;

            var roles = new List<AppRole> {
                new AppRole{Name = "Admin"},
                new AppRole{Name = "Client"},
                new AppRole{Name = "Member"},
                new AppRole{Name = "Manager"}
            };

            foreach (var role in roles) {
                await roleManager.CreateAsync(role);
            }

            foreach (var user in users)
            {
                user.UserName = user.UserName.ToLower();
                await userManager.CreateAsync(user, "123123");
                if (user.ProjectRole != null && user.ProjectRole.Equals("Manager")) {
                    await userManager.AddToRoleAsync(user, "Manager");
                } else {
                    await userManager.AddToRoleAsync(user, "Member");
                }
                // user.SecurityStamp = Guid.NewGuid().ToString();
            }

            var admin = new AppUser {
                UserName = "admin",
                // SecurityStamp = Guid.NewGuid().ToString()
            };

            await userManager.CreateAsync(admin, "123123");
            await userManager.AddToRoleAsync(admin, "Admin");
        }

        public static async Task SeedProject(DataContext context) {
            if (await context.Projects.AnyAsync()) return;

            var projData = await System.IO.File.ReadAllBytesAsync("Data/ProjectSeedData.json");
            var projs = JsonSerializer.Deserialize<List<Project>>(projData);
            foreach (var proj in projs) {
                context.Projects.Add(proj);
            }
            await context.SaveChangesAsync();
        }
    }
}