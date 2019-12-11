using System;
using System.ComponentModel.DataAnnotations;

namespace FinanceApp.Models
{
    public class Stock
    {
        [Key]
        public int StockId { get; set; }

        public string Symbol { get; set; }

        public int Quantity { get; set; }


        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;

        public User User { get; set; }
    }
}