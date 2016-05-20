using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Utils
{
    public static class GeoHelper
    {
        public enum DistanceUnitType
        {
            Kilometer = 0,
            Mile = 1,
            NauticalMile = 2
        }

        public static double CalculateDistance(double lat1, double lon1, double lat2, double lon2, DistanceUnitType unit = DistanceUnitType.Kilometer)
        {
            double theta = lon1 - lon2;
            double dist = Math.Sin(Deg2rad(lat1)) * Math.Sin(Deg2rad(lat2)) + Math.Cos(Deg2rad(lat1)) * Math.Cos(Deg2rad(lat2)) * Math.Cos(Deg2rad(theta));
            dist = Math.Acos(dist);
            dist = Rad2deg(dist);
            dist = dist * 60 * 1.1515;
            if (unit == DistanceUnitType.Kilometer)
            {
                dist = dist * 1.609344;
            }
            else if (unit == DistanceUnitType.NauticalMile)
            {
                dist = dist * 0.8684;
            }
            return (dist);
        }

        private static double Deg2rad(double deg)
        {
            return (deg * Math.PI / 180.0);
        }

        private static double Rad2deg(double rad)
        {
            return (rad / Math.PI * 180.0);
        }
    }
}
