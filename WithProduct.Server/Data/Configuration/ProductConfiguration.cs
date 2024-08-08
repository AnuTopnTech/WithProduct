   using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WithProduct.Server.Data.Models;

namespace WithProduct.Server.Data.Configuration
{
    public class ProductConfiguration: IEntityTypeConfiguration<Products>
    {
        public void Configure(EntityTypeBuilder<Products> builder) {

            builder.Property(x => x.Id).IsRequired();
            builder.Property(x => x.Quantity).HasColumnType("decimal(18, 2)");
            builder.Property(x => x.Title).HasMaxLength(128);
            
            builder.Property(x => x.Category).HasMaxLength(128);

            builder.Property(x => x.  Price).HasColumnType("decimal(18,2)");
         

            builder.HasData(
                new Products { Id=1, Title = "Title this", Category = "Category 1", Price = 100, Quantity = 20, Image = "https" },
                 new Products { Id = 2, Title = "Title this is", Category = "Category 2", Price = 200, Quantity = 30, Image = "https" },
                  new Products { Id = 3, Title = "Title this a", Category = "Category 3", Price = 400, Quantity = 50, Image = "https" },
                   new Products { Id = 4, Title = "Title this name", Category = "Category 4", Price = 600, Quantity = 40, Image = "https" });
        }
    }
}
