const API_KEY = "AIzaSyAC-f-HXqzPUJMKhG-zg0nF4GRyNnneGVU";
const FOLDER_ID = "19xOhe711glOh_3swG5v7VE_vWwxog66y";
const mimeIcons = {
  // Folders & Generic
  "application/vnd.google-apps.folder": "folder",
  default: "draft",

  // Documents
  "application/pdf": "picture_as_pdf",
  "text/plain": "notes",
  "application/msword": "description",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "description",
  "application/vnd.ms-excel": "table_view",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
    "table_view",
  "application/vnd.ms-powerpoint": "presentation",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    "presentation",
  "application/rtf": "description",
  "application/vnd.oasis.opendocument.text": "description",
  "application/vnd.oasis.opendocument.spreadsheet": "table_view",
  "application/vnd.oasis.opendocument.presentation": "presentation",

  // Data & Spreadsheets
  "text/csv": "csv",
  "text/tab-separated-values": "dataset",
  "application/x-sqlite3": "database",
  "application/sql": "database",

  // Images
  "image/jpeg": "image",
  "image/png": "image",
  "image/gif": "gif",
  "image/bmp": "image",
  "image/webp": "image",
  "image/svg+xml": "polyline",
  "image/tiff": "photo_library",
  "image/heic": "photo",
  "image/heif": "photo",
  "image/avif": "image",
  "image/apng": "animation",
  "image/x-icon": "app_shortcut",
  "image/vnd.microsoft.icon": "app_shortcut",
  "image/jp2": "image",
  "image/jxl": "image",

  // RAW Images
  "image/x-adobe-dng": "camera",
  "image/x-canon-cr2": "camera",
  "image/x-nikon-nef": "camera",
  "image/x-sony-arw": "camera",
  "image/x-fuji-raf": "camera",
  "image/x-panasonic-rw2": "camera",
  "image/x-olympus-orf": "camera",
  "image/raw": "camera",
  "image/vnd.dwg": "architecture",
  "image/xcf": "brush",

  // Audio
  "audio/mpeg": "audio_file",
  "audio/mp3": "audio_file",
  "audio/wav": "audio_file",
  "audio/ogg": "audio_file",
  "audio/flac": "audio_file",
  "audio/x-m4a": "audio_file",
  "audio/aac": "audio_file",
  "audio/x-ms-wma": "audio_file",
  "audio/midi": "piano",

  // Video
  "video/mp4": "video_file",
  "video/x-msvideo": "video_file",
  "video/x-matroska": "video_file",
  "video/webm": "video_file",
  "video/quicktime": "video_file",
  "video/x-flv": "video_file",
  "video/x-ms-wmv": "video_file",
  "video/mpeg": "video_file",

  // Archives
  "application/zip": "folder_zip",
  "application/x-rar-compressed": "folder_zip",
  "application/x-7z-compressed": "folder_zip",
  "application/x-tar": "folder_zip",
  "application/gzip": "folder_zip",
  "application/x-bzip2": "folder_zip",

  // Code & Web
  "text/html": "html",
  "application/json": "data_object",
  "application/javascript": "javascript",
  "application/typescript": "code",
  "text/css": "css",
  "text/x-python": "terminal",
  "text/x-c": "terminal",
  "text/x-c++src": "terminal",
  "text/x-csharp": "terminal",
  "text/x-java-source": "terminal",
  "application/x-sh": "terminal",
  "text/markdown": "markdown",
  "application/xml": "code",
  "text/xml": "code",
  "application/x-yaml": "data_object",
  "application/x-httpd-php": "code",

  // Executables & System
  "application/vnd.android.package-archive": "android",
  "application/x-msdownload": "system_update",
  "application/x-apple-diskimage": "save",
  "application/x-diskcopy": "save",
  "application/x-iso9660-image": "album",

  // Design & 3D
  "application/vnd.adobe.photoshop": "brush",
  "application/vnd.adobe.illustrator": "draw",
  "application/x-coreldraw": "draw",
  "image/vnd.dwg": "architecture",
  "image/vnd.dxf": "architecture",
  "model/gltf-binary": "view_in_ar",
  "model/gltf+json": "view_in_ar",
  "model/stl": "3d_rotation",
  "model/obj": "3d_rotation",

  // E-books
  "application/epub+zip": "menu_book",
  "application/x-mobipocket-ebook": "menu_book",
  "application/vnd.amazon.ebook": "menu_book",

  // Fonts
  "font/ttf": "text_fields",
  "font/otf": "text_fields",
  "font/woff": "text_fields",
  "font/woff2": "text_fields",

  // Misc
  "text/calendar": "calendar_month",
  "text/vcard": "contacts",
};

function formatBytes(bytes) {
  if (!bytes) return "Unknown size";
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + " " + sizes[i];
}

async function listFiles() {
  const query = encodeURIComponent(`'${FOLDER_ID}' in parents`);
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&key=${API_KEY}&fields=files(id,name,mimeType,size)`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    const fileList = document.getElementById("fileList");
    fileList.textContent = "";

    if (!data.files || data.files.length === 0) {
      const li = document.createElement("li");
      li.textContent = "No files found.";
      fileList.appendChild(li);
      return;
    }

    data.files.sort((a, b) => a.name.localeCompare(b.name));

    const fragment = document.createDocumentFragment();

    data.files.forEach((file) => {
      const li = document.createElement("li");
      const link = document.createElement("a");

      const iconName = mimeIcons[file.mimeType] || mimeIcons["default"];
      const fileSize = formatBytes(file.size);

      const iconSpan = document.createElement("span");
      iconSpan.className = "material-symbols-outlined";
      iconSpan.textContent = iconName;

      const nameSpan = document.createElement("span");
      nameSpan.textContent = file.name;

      link.appendChild(iconSpan);
      link.appendChild(nameSpan);

      link.href = `https://drive.google.com/uc?export=download&id=${encodeURIComponent(file.id)}`;
      link.target = "_blank";
      link.title = `${file.name} (${fileSize})`;

      li.appendChild(link);
      fragment.appendChild(li);
    });

    fileList.appendChild(fragment);
  } catch (error) {
    const fileList = document.getElementById("fileList");
    fileList.textContent = "";
    const li = document.createElement("li");
    li.textContent = `Error loading files: ${error.message}`;
    fileList.appendChild(li);
  }
}

listFiles();
