using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using Umbraco.Core.Models;
using Umbraco.Web;

namespace Common.Umbraco.UI
{
    public static class HtmlHelperExtensions
    {
        public static MvcHtmlString GetGridHtmlInherited(this HtmlHelper html, IPublishedContent content, string propertyAlias, string framework)
        {
            return GetGridHtmlInherited(html, content, propertyAlias, propertyAlias, framework);
        }

        public static MvcHtmlString GetGridHtmlInherited(this HtmlHelper html, IPublishedContent content, string propertyAlias, string inheritPropertyAlias, string framework)
        {
            if (content.GetPropertyValue<bool>("inheritParentGrid"))
                return html.GetGridHtml(content.Parent, inheritPropertyAlias, framework);

            return html.GetGridHtml(content, propertyAlias, framework);
        }

        public static string GenerateControlId(this HtmlHelper html)
        {
            return "c_" + new Random().Next();
        }
    }
}
