using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace Common.Piba.Objects
{
    [XmlRoot("ROWDATA")]
    public class StreetsData
    {
        [XmlElement("ROW")]
        public List<Row> Rows { get; set; }

        [XmlType("ROW")]
        public class Row
        {
            [XmlElement("סמל_ישוב")]
            public string CityCode { get; set; }

            [XmlElement("סמל_רחוב")]
            public string Code { get; set; }

            [XmlElement("שם_רחוב")]
            public string Name { get; set; }
        }
    }
}
