using Microsoft.EntityFrameworkCore;

namespace FinanceApp.Models
{
    public class FinanceContext : DbContext
    {
        // base() calls the parent class' constructor passing the "options" parameter along
        public FinanceContext(DbContextOptions options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Goal> Goals { get; set; }
        public DbSet<Stock> Stocks { get; set; }
    }
}