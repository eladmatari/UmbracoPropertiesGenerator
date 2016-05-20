using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Umbraco.Core.Models;
using Umbraco.Web;

namespace Common.Umbraco.Objects
{
    public class GeneralComponent
    {
        public GeneralComponent()
        {

        }

        public GeneralComponent(IPublishedContent content)
        {
            Id = content.Id;
            Title = content.GetPropertyValue<string>("title");
        }

        public int Id { get; set; }

        public string Title { get; set; }
    }
}