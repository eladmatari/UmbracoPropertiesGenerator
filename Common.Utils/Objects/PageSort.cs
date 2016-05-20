using Common.Utils.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Utils.Objects
{
    public class PageSort
    {
        public PageSort(int pageSize = 0, int pageNumber = 1)
        {
            PageSize = pageSize;
            PageNumber = pageNumber;
        }

        private int _pageSize;

        public int PageSize
        {
            get
            {
                return _pageSize;
            }
            set
            {
                if (value >= 0)
                    _pageSize = value;
            }
        }

        private int _pageNumber;

        public int PageNumber
        {
            get
            {
                return _pageNumber;
            }
            set
            {
                if (value >= 1)
                    _pageNumber = value;
            }
        }

        public bool IsPaging
        {
            get
            {
                return PageSize > 0;
            }
        }

        public List<SortExpresion> Sort { get; set; }

        public class SortExpresion
        {
            public string Field { get; set; }

            public SortDirection Direction { get; set; }
        }
    }
}
