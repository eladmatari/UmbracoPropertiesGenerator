using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Helpers;
using System.Web.Mvc;
using Umbraco.Core.Models;
using Umbraco.Web;
using Umbraco.Web.Models;

namespace Common.Umbraco.UI
{
    public static class IPublishedContentExtensions
    {
        public static string GetMediaUrl(this IPublishedContent content, string propertyName)
        {
            if (content != null)
            {
                int mediaId = content.GetPropertyValue<int>(propertyName);

                if (mediaId != 0)
                {
                    var umbracoHelper = new UmbracoHelper(UmbracoContext.Current);

                    var media = umbracoHelper.Media(mediaId);

                    if (media != null)
                    {
                        return media.Url;
                    }
                }
            }

            return string.Empty;
        }

        public static int[] GetPickerIds(this IPublishedContent content, string propertyName)
        {
            var ids = new List<int>();

            if (content != null)
            {
                string idsCsv = content.GetPropertyValue<string>(propertyName);

                if(idsCsv != null)
                {
                    var idsStrArray = idsCsv.Split(',');

                    foreach (string idStr in idsStrArray)
                    {
                        int id;
                        if (int.TryParse(idStr, out id))
                            ids.Add(id);
                    }
                }
            }

            return ids.ToArray();
        }

        public static dynamic GetMacroParameter(this IPublishedContent model, string alias)
        {
            if (alias != null && model.GetPropertyValue<string>(alias) != null)
                return (dynamic)Json.Decode((dynamic)HttpUtility.HtmlDecode(model.GetPropertyValue<string>(alias)));

            return null;
        }

        public static T GetPropertyModel<T>(this IPublishedContent model, string alias)
        {
            string json = model.GetPropertyValue<string>(alias);

            if (!string.IsNullOrWhiteSpace(json))
            {
                try
                {
                    var settings = new JsonSerializerSettings();
                    settings.ContractResolver = new CamelCasePropertyNamesContractResolver();

                    return JsonConvert.DeserializeObject<T>(json, settings);
                }
                catch { }
            }

            return default(T);
        }
    }
}