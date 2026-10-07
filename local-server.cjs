const http = require('http');
const PORT = 3939;
const API = `http://127.0.0.1:${PORT}`;
const SERVER = 'Fighting';

function send(res, status, body, type = 'application/json') {
  const text = typeof body === 'string' ? body : JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': type,
    'Cache-Control': 'no-store',
    'Access-Control-Allow-Origin': '*',
  });
  res.end(text);
}

const launcherConfig = {
  launcherVer: 10001,
  launcherName: "Fighting Launcher",
  registryPath: "HKCU\\Software\\SAMP",
  themeColor: "#ef4444",
  launcherUrl: "",
  launcherLogo: "",
  discordUrl: "",
  facebookUrl: "",
  themeConfigUrl: "",
  announcements: [],
  announcementGlobal: "",
  cheatblockerConfigUrl: "",
  languages: [
    { language: "en", displayName: "English", dataUrl: "" },
    { language: "th", displayName: "ไทย", dataUrl: "" }
  ],
  discord: {
    clientId: "",
    details: "Main Menu",
    state: "Fighting Launcher",
    largeImageKey: "main",
    largeImageText: "Fighting Server",
    smallImageKey: "zorix",
    smallImageText: "Zorix"
  },
  games: [
    {
      name: "Fighting",
      themeColor: "#ef4444",
      startCmd: "samp.exe 127.0.0.1:7777",
      DataUrl: "",
      clientVer: 1,
      clientUrl: "",
      cheatblockerMD5Data: "",
      patchUrls: [],
      cheatblockerData: "",
      removeFilesData: "",
      maintenance: false,
      serverIp: "127.0.0.1",
      serverPort: 7777,
      logo: "",
      banners: [
        {
          image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200",
          title: "Fighting Server",
          description: "Welcome to Fighting — ZorixLauncher"
        }
      ],
      bannersMoreUrl: ""
    }
  ]
};

const docs = {
  launcher: launcherConfig,
  theme: {
    themeColor: "#ef4444",
    overlayUrl: ""
  },
  overlay: { html: '' },
  announcement: { announcements: [] },
  terms: { enabled: false },
  data: {},
  cheatblocker: { exe: null },
  'remove-list': { files: [], folders: [] },
  banners: { banners: launcherConfig.games[0].banners },
  'language:en': {
    play: "PLAY",
    settings: "Settings",
    delete: "Delete",
    downloading: "Downloading...",
    ready: "Ready to play",
    maintenance: "Server is under maintenance"
  },
  'language:th': {
    play: "เล่น",
    settings: "ตั้งค่า",
    delete: "ลบ",
    downloading: "กำลังดาวน์โหลด...",
    ready: "พร้อมเล่น",
    maintenance: "เซิร์ฟเวอร์กำลังปรับปรุง"
  }
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, API);
  const query = url.searchParams;
  console.log(`${new Date().toLocaleTimeString()} ${req.method} ${req.url}`);

  if (url.pathname === '/api/doc') {
    const docId = query.get('doc');
    if (query.get('server') !== SERVER) return send(res, 400, { error: 'unknown server' });
    if (!(docId in docs)) return send(res, 404, { error: `no document: ${docId}` });
    if (docId === 'overlay' && docs[docId].html) {
      return send(res, 200, docs[docId].html, 'text/html; charset=utf-8');
    }
    return send(res, 200, docs[docId]);
  }

  if (url.pathname === '/api/whitelist') return send(res, 200, { files: [] });
  if (url.pathname === '/api/report') return send(res, 200, { ok: true });
  if (url.pathname === '/api/version') {
    return send(res, 200, { ok: true, server: SERVER, launcherVer: launcherConfig.launcherVer });
  }

  return send(res, 404, { error: 'not found' });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`\n  ZorixLauncher Local API Server`);
  console.log(`  ${API}`);
  console.log(`  Server: ${SERVER}\n`);
  console.log(`  Endpoints:`);
  console.log(`    /api/doc?server=${SERVER}&doc=launcher`);
  console.log(`    /api/doc?server=${SERVER}&doc=theme`);
  console.log(`    /api/doc?server=${SERVER}&doc=data`);
  console.log(`    /api/doc?server=${SERVER}&doc=announcement`);
  console.log(`    /api/doc?server=${SERVER}&doc=terms`);
  console.log(`    /api/doc?server=${SERVER}&doc=banners`);
  console.log(`    /api/doc?server=${SERVER}&doc=language:en`);
  console.log(`    /api/doc?server=${SERVER}&doc=language:th`);
  console.log(`    /api/version?server=${SERVER}`);
  console.log(`\n  Waiting for requests...\n`);
});
