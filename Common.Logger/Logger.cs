using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using log4net;
using Newtonsoft.Json;

namespace Common.Logger
{
    public static class Log
    {
        const string Name = "Common.Logger";
        private static readonly ILog _log = LogManager.GetLogger(Name);

        static Log()
        {
            log4net.Config.XmlConfigurator.Configure();
        }

        private static string GetMessageFormat(string message)
        {
            if (message == null)
                message = "";
            else
                message += Environment.NewLine;

            return DateTime.Now.ToString("HH:mm:ss.fff") + " - " + message;
        }

        public static void Info(string message)
        {
            _log.Info(GetMessageFormat(message));
        }

        public static void Info(string message, object item)
        {
            string json = JsonConvert.SerializeObject(item);

            _log.Info(GetMessageFormat(message) + json + Environment.NewLine);
        }

        public static void Error(string message)
        {
            _log.Error(GetMessageFormat(message));
        }

        public static void Error(Exception exception, string message = null)
        {
            _log.Error(GetMessageFormat(message), exception);
        }

        public static void Error(string message, object item)
        {
            string json = JsonConvert.SerializeObject(item);

            _log.Error(GetMessageFormat(message) + json + Environment.NewLine);
        }

        public static void Error(Exception ex, object item)
        {
            string json = JsonConvert.SerializeObject(item);

            _log.Error(json, ex);
        }
    }
}