export function createIframe(srcUrl: string, name: string): HTMLIFrameElement {
  // srcUrl = ensureUrl(srcUrl);

  const childFrame = document.createElement("iframe")!;
  childFrame.src = srcUrl;
  childFrame.name = name;
  childFrame.style.display = "none";

  // Set sandbox permissions.
  // TODO: Enable sandboxing?
  // childFrame.sandbox.add("allow-same-origin");
  // childFrame.sandbox.add("allow-scripts");

  document.body.appendChild(childFrame);
  return childFrame;
 }

 export function ensureUrl(url: string): string {
  return ensurePrefix(url, "https://");
}

function ensurePrefix(s: string, prefix: string): string {
  if (!s.startsWith(prefix)) {
    s = `${prefix}${s}`;
  }
  return s;
}

export function randomSkylink() {
  var result           = '';
  var characters       = '_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  var charactersLength = characters.length;
  for ( var i = 0; i < 46; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}