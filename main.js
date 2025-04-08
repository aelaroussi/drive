const API_KEY = 'AIzaSyAC-f-HXqzPUJMKhG-zg0nF4GRyNnneGVU';
const FOLDER_ID = '19xOhe711glOh_3swG5v7VE_vWwxog66y';
const mimeIcons = {
	// 📁 Folders & Generic
	'application/vnd.google-apps.folder': '📁',
	default: '📦',

	// 📄 Documents
	'application/pdf': '📄',
	'text/plain': '📃',
	'application/msword': '📝',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '📝',
	'application/vnd.ms-excel': '📊',
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '📊',
	'application/vnd.ms-powerpoint': '📈',
	'application/vnd.openxmlformats-officedocument.presentationml.presentation': '📈',

	// 🖼️ Images
	'image/jpeg': '📷',
	'image/png': '🖼️',
	'image/gif': '🎞️',
	'image/bmp': '🖼️',
	'image/webp': '🖼️',
	'image/svg+xml': '🖍️',
	'image/tiff': '🖼️',

	// 🎵 Audio
	'audio/mpeg': '🎵',
	'audio/mp3': '🎵',
	'audio/wav': '🔊',
	'audio/ogg': '🎧',
	'audio/flac': '🎶',
	'audio/x-ms-wma': '🎧',

	// 🎥 Video
	'video/mp4': '🎥',
	'video/x-msvideo': '🎬',
	'video/x-matroska': '🎞️',
	'video/webm': '📺',
	'video/quicktime': '📽️',
	'video/x-flv': '📺',

	// 📦 Archives
	'application/zip': '🗜️',
	'application/x-rar-compressed': '🗜️',
	'application/x-7z-compressed': '🗜️',
	'application/x-tar': '🗜️',
	'application/gzip': '🗜️',

	// 💻 Code & Markup
	'text/html': '🌐',
	'application/json': '🔧',
	'application/javascript': '🧠',
	'text/css': '🎨',
	'text/x-python': '🐍',
	'text/x-c': '💻',
	'text/x-java-source': '☕',
	'application/x-sh': '📟',
	'text/markdown': '📝',

	// 📱 Mobile & App Files
	'application/vnd.android.package-archive': '📱',
	'application/x-msdownload': '💾', // .exe
	'application/x-diskcopy': '💾',

	// 🧾 Other Office Types
	'application/vnd.oasis.opendocument.text': '📘',
	'application/vnd.oasis.opendocument.spreadsheet': '📗',
	'application/vnd.oasis.opendocument.presentation': '📙',

	// ✍️ Design & Vector
	'application/vnd.adobe.photoshop': '🎨',
	'application/x-coreldraw': '🖌️',
	'image/x-adobe-dng': '📸',
	'image/vnd.dwg': '📐',
};

function formatBytes(bytes) {
	if (!bytes) return 'Unknown size';
	const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
	const i = Math.floor(Math.log(bytes) / Math.log(1024));
	return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
}

async function listFiles() {
	const url = `https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}'+in+parents&key=${API_KEY}&fields=files(id,name,mimeType,size)`;

	try {
		const res = await fetch(url);
		const data = await res.json();

		const fileList = document.getElementById('fileList');
		fileList.innerHTML = '';

		if (!data.files || data.files.length === 0) {
			fileList.innerHTML = '<li>No files found.</li>';
			return;
		}

		data.files.sort((a, b) => a.name.localeCompare(b.name));

		data.files.forEach(file => {
			const li = document.createElement('li');
			const link = document.createElement('a');

			const icon = mimeIcons[file.mimeType] || mimeIcons['default'];
			const fileSize = formatBytes(file.size);

			link.textContent = `${icon} ${file.name}`;
			link.href = `https://drive.google.com/uc?export=download&id=${file.id}`;
			link.target = '_blank';
			link.title = `${file.name} (${fileSize})`;
			li.appendChild(link);
			fileList.appendChild(li);
		});
	} catch (error) {
		document.getElementById(
			'fileList'
		).innerHTML = `<li>Error loading files: ${error.message}</li>`;
	}
}

listFiles();
