using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Helpers;
using System.Web.Mvc;
using Umbraco.Web.Macros;
using Umbraco.Web.Models;

namespace Common.Umbraco.UI
{
    public static class PartialViewMacroExtensions
    {
        public static dynamic GetMacroParameter(this PartialViewMacroModel model, string alias)
        {
            if(alias != null && model.MacroParameters[alias] != null)
                return (dynamic)Json.Decode((dynamic)HttpUtility.HtmlDecode(model.MacroParameters[alias].ToString()));

            return null;
        }

        public static dynamic GetMacroParameterJson(this PartialViewMacroModel model, string alias)
        {
            if (alias != null && model.MacroParameters[alias] != null)
                return HttpUtility.HtmlDecode(model.MacroParameters[alias].ToString());

            return null;
        }
    }
}