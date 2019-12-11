using System;
using System.ComponentModel.DataAnnotations;

namespace FinanceApp.Models
{
    public class FutureDateAttribute : ValidationAttribute
    {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            // You first may want to unbox "value" here and cast to to a DateTime variable!
            DateTime postDateTime = Convert.ToDateTime(value);
            if (postDateTime > DateTime.Now)
            {
                return ValidationResult.Success;
            }
            else
            {
                return new ValidationResult("Join date cannot be in the past");
            }
        }
    }
}