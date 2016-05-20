using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Umbraco.UI
{
    public static class ObjectExtensions
    {
        public static string Json(this object o)
        {
            if (o == null)
                return "null";

            return JsonConvert.SerializeObject(o);
        }
    }
}
