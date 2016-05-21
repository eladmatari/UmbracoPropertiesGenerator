using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Helpers;
using Umbraco.Core.Models;
using Umbraco.Web.Models;

namespace Umbraco.Web
{
    public static class PropertiesGeneratorExtensions
    {
        public static dynamic GetDynamicParameter(this PartialViewMacroModel model, string alias)
        {
            if (alias != null && model.MacroParameters.ContainsKey(alias) && model.MacroParameters[alias] != null)
                return (dynamic)Json.Decode((dynamic)HttpUtility.HtmlDecode(model.MacroParameters[alias].ToString()));

            return null;
        }
    }
}