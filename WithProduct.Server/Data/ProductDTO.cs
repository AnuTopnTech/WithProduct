using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace WithProduct.Server.Data
{
    public class ProductDTO
    {
        public required string Title { get; set; }

        public string? Category { get; set; }
       
        public int Id { get; set; }

        public decimal Quantity { get; set; }

        public decimal Price { get; set; }

        public string? Image { get; set; }
    }
}
