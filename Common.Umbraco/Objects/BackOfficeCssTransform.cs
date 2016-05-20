using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Optimization;

namespace Common.Umbraco.Objects
{
    public class BackOfficeCssTransform : IItemTransform
    {
        public string Process(string includedVirtualPath, string input)
        {
            var styles = input.Split('}');

            for (int i = 0; i < styles.Length - 1; i++)
            {
                styles[i] = ".backoffice " + styles[i].Trim();
            }

            return string.Join("} ", styles);
        }
    }
}
