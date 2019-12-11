using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FinanceApp.Models
{
    public class Goal
    {
        [Key]
        public int GoalId { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Description { get; set; }

        public int CurrentAmount { get; set; } = 0;
        public int GoalAmount { get; set; }

        [FutureDate]
        public DateTime ReachBy { get; set; }

        public bool Completed { get; set; } = false;

        public bool Favorite { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;

        //Navigation

        public User User { get; set; }

        //methods
        public int completedPercent()
        {

            double percent = CurrentAmount * 100 / GoalAmount;
            return (int)Math.Round(percent, 0);
        }
    }
}