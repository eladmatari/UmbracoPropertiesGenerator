using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Linq;
using Common.Piba.Objects;
using Common.Utils;

namespace Common.Piba
{
    public static class PibaDataHelper
    {
        public static CitiesData GetCitiesFromUrl(string url)
        {
            string xml = GetStringFromUrl(url);

            var citiesData = XmlHelper.Deserialize<CitiesData>(xml);

            if (
                citiesData == null 
                || 
                citiesData.Rows == null 
                || 
                citiesData.Rows.Count == 0
                ||
                citiesData.Rows[0].Code == null
                ||
                citiesData.Rows[0].NafaCode == null
                ||
                citiesData.Rows[0].NafaCode == null
                ||
                citiesData.Rows[0].NafaCode == null
            )
            {
                throw new InvalidDataException();
            }

            return citiesData;
        }

        public static StreetsData GetStreetsFromUrl(string url)
        {
            string xml = GetStringFromUrl(url);

            var streetsData = XmlHelper.Deserialize<StreetsData>(xml);

            if (
                streetsData == null
                ||
                streetsData.Rows == null
                ||
                streetsData.Rows.Count == 0
                ||
                streetsData.Rows[0].Code == null
                ||
                streetsData.Rows[0].Name == null
                ||
                streetsData.Rows[0].CityCode == null
            )
            {
                throw new InvalidDataException();
            }

            return streetsData;
        }

        private static string GetStringFromUrl(string url)
        {
            using (var webClient = new WebClient())
            {
                return webClient.DownloadString(url);
            }
        }
    }
}