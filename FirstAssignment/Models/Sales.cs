using System;
using System.Collections.Generic;

namespace FirstAssignment.Models
{
    public partial class Sales
    {
        public int Id { get; set; }
        public int? ProductId { get; set; }
        public int? CustomerId { get; set; }
        public int? StoreId { get; set; }

    
        public DateTime DateSold { get; set; }

        public virtual Customers Customer { get; set; }
        public virtual Products Product { get; set; }
        public virtual Store Store { get; set; }
    }
}
