using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FinanceApp.Models
{
    public class Transaction
    {
        [Key]
        public int TransactionId { get; set; }

        public string Name { get; set; }

        public int Amount { get; set; }
        public DateTime Date { get; set; }

        // public bool Recurrence { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;

        //Navigation

        public User User { get; set; }

        public Category Category { get; set; }
    }
}