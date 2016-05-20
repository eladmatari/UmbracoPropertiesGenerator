using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace Common.Utils
{
    public static class XmlHelper
    {
        public static string Serialize(object obj, bool removeNamespace = true, string declaration = null)
        {
            using (var sw = new StringWriter())
            {
                var writer = new XmlSerializer(obj.GetType());

                var xns = new XmlSerializerNamespaces();
                if (removeNamespace)
                    xns.Add("", "");

                writer.Serialize(sw, obj, xns);

                string xml = sw.ToString();

                if (declaration != null)
                    return declaration + Regex.Replace(xml, "<\\?.+\\?>", "");

                return xml;
            }
        }

        public static object Deserialize(Type type, string xml)
        {
            var reader = new XmlSerializer(type);

            using (TextReader tr = new StringReader(xml))
            {
                return reader.Deserialize(tr);
            }
        }

        public static T Deserialize<T>(string xml)
        {
            var reader = new XmlSerializer(typeof(T));

            using (TextReader tr = new StringReader(xml))
            {
                return (T)reader.Deserialize(tr);
            }
        }

        public static T Deserialize<T>(Stream stream)
        {
            var reader = new XmlSerializer(typeof(T));

            return (T)reader.Deserialize(stream);
        }

        public static T Deserialize<T>(TextReader textReader)
        {
            var reader = new XmlSerializer(typeof(T));

            return (T)reader.Deserialize(textReader);
        }
    }
}
