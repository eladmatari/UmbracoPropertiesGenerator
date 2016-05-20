using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace Common.Piba.Objects
{
    [XmlRoot("ROWDATA")]
    public class CitiesData
    {
        [XmlElement("ROW")]
        public List<Row> Rows { get; set; }

        [XmlType("Row")]
        public class Row
        {
            [XmlElement("סמל_ישוב")]
            public string Code { get; set; }

            [XmlElement("שם_ישוב")]
            public string Name { get; set; }

            [XmlElement("סמל_נפה")]
            public string NafaCode { get; set; }

            [XmlElement("שם_נפה")]
            public string NafaName { get; set; }
        }
    }
}
