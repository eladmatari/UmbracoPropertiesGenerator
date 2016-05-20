using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Umbraco.Objects
{
    public class RelatedLink
    {
        public RelatedLink() { }

        public RelatedLink(dynamic relatedLink)
        {
            Caption = relatedLink.caption;
            Link = relatedLink.link;
            IsNewWindow = relatedLink.newWindow;
            IsEdit = relatedLink.edit;
            IsInternal = relatedLink.isInternal;
            Type = relatedLink.type;
            Title = relatedLink.title;
        }

        public string Caption { get; set; }
        public string Link { get; set; }
        public bool IsNewWindow { get; set; }
        public bool IsEdit { get; set; }
        public bool IsInternal { get; set; }
        public string Type { get; set; }
        public string Title { get; set; }

        public string Target
        {
            get
            {
                return IsNewWindow ? "_blank" : "_self";
            }
        }
    }
}