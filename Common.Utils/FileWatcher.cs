using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Utils
{
    public class FileWatcher : IDisposable
    {
        static FileWatcher()
        {
            _instance = new FileWatcher();
        }

        private static FileWatcher _instance;
        public static FileWatcher Instance { get { return _instance; } }

        private FileWatcher()
        {
            _watchersDict = new Dictionary<string, FileSystemWatcher>();
        }

        private readonly Dictionary<string, FileSystemWatcher> _watchersDict;

        public void Add(string name, string path, string filter, Action<object, FileSystemEventArgs> onChanged, bool includeSubdirectories = false)
        {
            Remove(name);

            var watcher = _watchersDict[name] = new FileSystemWatcher(path);

            watcher.NotifyFilter = NotifyFilters.LastAccess | NotifyFilters.LastWrite
          | NotifyFilters.FileName | NotifyFilters.DirectoryName;

            if (filter != null)
                watcher.Filter = filter;

            // Add event handlers.
            watcher.Changed += new FileSystemEventHandler(onChanged);
            watcher.Created += new FileSystemEventHandler(onChanged);
            watcher.Deleted += new FileSystemEventHandler(onChanged);
            watcher.Renamed += new RenamedEventHandler(onChanged);
            watcher.IncludeSubdirectories = includeSubdirectories;

            // Begin watching.
            watcher.EnableRaisingEvents = true;
        }

        public void Remove(string name)
        {
            if (!_watchersDict.ContainsKey(name))
                return;

            try
            {
                _watchersDict[name].Dispose();
                _watchersDict.Remove(name);
            }
            catch { }
        }

        public void Dispose()
        {
            if (_watchersDict != null)
            {
                var keys = _watchersDict.Keys;

                foreach (var key in keys)
                {
                    Remove(key);
                }
            }
        }
    }
}
