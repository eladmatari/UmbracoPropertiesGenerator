using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using Umbraco.Web.Editors;
using Umbraco.Web.Mvc;

namespace Site.App_Plugins.PropertiesGenerator.properties.datasources
{
    [PluginController("propertiesGenerator")]
    public class DropdownController : UmbracoAuthorizedJsonController
    {
        [HttpPost]
        public object GetDemo(dynamic property)
        {
            var items = (new[] {
                new { Id = 1, Title = "One" },
                new { Id = 2, Title = "Two" },
                new { Id = 3, Title = "Three" }
            }).Select(i => new
            {
                value = i.Id.ToString(),
                label = i.Title
            }).ToList();

            items.Insert(0, new
            {
                value = "",
                label = "Choose..."
            });

            return items;
        }
    }
}