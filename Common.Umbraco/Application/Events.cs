using Common.Utils;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using Umbraco.Core;

namespace Common.Umbraco.Application
{
    public class Events : ApplicationEventHandler
    {
        protected override void ApplicationStarted(UmbracoApplicationBase umbracoApplication, ApplicationContext applicationContext)
        {
            WatchPluginJs();
        }

        private void WatchPluginJs()
        {
            string jsPath = HttpContext.Current.Server.MapPath("~/App_Plugins/");
            string clientDependencyPath = HttpContext.Current.Server.MapPath("~/App_Data/TEMP/ClientDependency/");

            Action deleteClientDependencyFiles = () =>
            {
                var files = Directory.GetFiles(clientDependencyPath);

                foreach (var file in files)
                {
                    File.Delete(file);
                }
            };

            deleteClientDependencyFiles();

            FileWatcher.Instance.Add("javascript:" + jsPath, jsPath, "*.js", (sender, args) =>
            {
                deleteClientDependencyFiles();
            }, true);
        }
    }
}
