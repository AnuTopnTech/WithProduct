using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.EntityFrameworkCore;
using WithProduct.Server.Data;

namespace WithProduct.Server.Data.Models
{
    public class Products
    {
        public required string Title { get; set; }

        [MaxLength(50)]
        public string? Category { get; set; }

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }


        [Range(1, 9999, ErrorMessage = "Quantity Limited By {0} and {1}")]
        public decimal Quantity { get; set; }

        [Range(1, 9999, ErrorMessage = "Price Limited By {0} and {1}")]
        [RegularExpression(@"[0-9]*\.?[0-9]+", ErrorMessage = "{0} Must be Number!")]
        public decimal Price { get; set; }

        public string? Image { get; set; }

    }

}

