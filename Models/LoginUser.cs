using System.ComponentModel.DataAnnotations;

namespace FinanceApp.Models
{
    public class LoginUser
    {
        [Required]
        public string LoginEmail { get; set; }

        [Required]
        public string LoginPassword { get; set; }
    }
}