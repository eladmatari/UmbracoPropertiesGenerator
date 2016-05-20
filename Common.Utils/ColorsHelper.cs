using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Utils
{
    public class ColorsHelper
    {
        private static int MultiplyColor(int color, double factor)
        {
            int result = (int)(color * factor);
            if (result > 255)
                return 255;

            return result;
        }

        public static string ChangeDarkness(string color, double factor)
        {
            if (color == null || color.Length != 6)
                return null;

            var colorStruct = FromHex(color);

            colorStruct = Color.FromArgb(MultiplyColor(colorStruct.R, factor), MultiplyColor(colorStruct.G, factor), MultiplyColor(colorStruct.B, factor));

            return ToHex(colorStruct);
        }

        public static Color FromHex(string color)
        {
            if (color == null || color.Length != 6)
                return Color.Black;

            int r = Convert.ToInt32(color.Substring(0, 2), 16);
            int g = Convert.ToInt32(color.Substring(2, 2), 16);
            int b = Convert.ToInt32(color.Substring(4, 2), 16);

            return Color.FromArgb(r, g, b);
        }

        public static string ToHex(Color color)
        {
            return String.Format("{0:X}{1:X}{2:X}", color.R, color.G, color.B);
        }
    }
}
