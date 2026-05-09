const API_KEY = "AIzaSyAC-f-HXqzPUJMKhG-zg0nF4GRyNnneGVU";
const FOLDER_ID = "19xOhe711glOh_3swG5v7VE_vWwxog66y";
const mimeIcons = {
  "application/vnd.google-apps.folder": "folder",
  default: "draft",

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

  "image/jpeg": "image",
  "image/png": "image",
  "image/gif": "gif",
  "image/bmp": "image",
  "image/webp": "image",
  "image/svg+xml": "polyline",
  "image/tiff": "image",

  "audio/mpeg": "audio_file",
  "audio/mp3": "audio_file",
  "audio/wav": "audio_file",
  "audio/ogg": "audio_file",
  "audio/flac": "audio_file",
  "audio/x-ms-wma": "audio_file",

  "video/mp4": "video_file",
  "video/x-msvideo": "video_file",
  "video/x-matroska": "video_file",
  "video/webm": "video_file",
  "video/quicktime": "video_file",
  "video/x-flv": "video_file",

  "application/zip": "folder_zip",
  "application/x-rar-compressed": "folder_zip",
  "application/x-7z-compressed": "folder_zip",
  "application/x-tar": "folder_zip",
  "application/gzip": "folder_zip",

  "text/html": "html",
  "application/json": "data_object",
  "application/javascript": "javascript",
  "text/css": "css",
  "text/x-python": "terminal",
  "text/x-c": "terminal",
  "text/x-java-source": "terminal",
  "application/x-sh": "terminal",
  "text/markdown": "markdown",

  "application/vnd.android.package-archive": "android",
  "application/x-msdownload": "system_update",
  "application/x-diskcopy": "save",

  "application/vnd.oasis.opendocument.text": "description",
  "application/vnd.oasis.opendocument.spreadsheet": "table_view",
  "application/vnd.oasis.opendocument.presentation": "presentation",

  "application/vnd.adobe.photoshop": "brush",
  "application/x-coreldraw": "draw",
  "image/x-adobe-dng": "camera",
  "image/vnd.dwg": "architecture",
};

function formatBytes(bytes) {
  if (!bytes) return "Unknown size";
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + " " + sizes[i];
}

async function listFiles() {
  const url = `https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}'+in+parents&key=${API_KEY}&fields=files(id,name,mimeType,size)`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    const fileList = document.getElementById("fileList");
    fileList.innerHTML = "";

    if (!data.files || data.files.length === 0) {
      fileList.innerHTML = "<li>No files found.</li>";
      return;
    }

    data.files.sort((a, b) => a.name.localeCompare(b.name));

    data.files.forEach((file) => {
      const li = document.createElement("li");
      const link = document.createElement("a");

      const iconName = mimeIcons[file.mimeType] || mimeIcons["default"];
      const fileSize = formatBytes(file.size);

      link.innerHTML = `<span class="material-symbols-outlined">${iconName}</span> <span>${file.name}</span>`;
      link.href = `https://drive.google.com/uc?export=download&id=${file.id}`;
      link.target = "_blank";
      link.title = `${file.name} (${fileSize})`;
      li.appendChild(link);
      fileList.appendChild(li);
    });
  } catch (error) {
    document.getElementById("fileList").innerHTML =
      `<li>Error loading files: ${error.message}</li>`;
  }
}

listFiles();
