using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Umbraco.Core.Models;
using Umbraco.Web;

namespace Common.Umbraco.Objects
{
    public class ComponentsList
    {
        public ComponentsList()
        {

        }

        public ComponentsList(IPublishedContent content)
        {
            Header = content.GetPropertyValue<string>("header");
            Alias = content.GetPropertyValue<string>("alias");
            Components = content.Children<IPublishedContent>().Where(i => i.DocumentTypeAlias == "generalComponent").Select(i => new GeneralComponent(i)).ToList();
        }

        public string Header { get; set; }

        public string Alias { get; set; }

        public List<GeneralComponent> Components { get; set; }
    }
}
