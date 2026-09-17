const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

export function renderAlbums(albums, base = '.') {
  if (!albums.some((album) => album.photos.length)) return '<p class="album-empty">Próximamente compartiremos más fotografías.</p>';
  return albums.filter((album) => album.photos.length).map((album) => {
    const image = (photo, className = '') => {
      const srcset = photo.srcset ? ` srcset="${escape(photo.srcset.split(', ').map((candidate) => base + '/' + candidate).join(', '))}" sizes="${className ? '(max-width: 767px) 90vw, 55vw' : '(max-width: 480px) 90vw, (max-width: 1024px) 43vw, 28vw'}"` : '';
      return `<img class="${className}" src="${escape(base + '/' + photo.src)}"${srcset} width="${photo.width}" height="${photo.height}" alt="${escape(photo.alt)}" loading="lazy" decoding="async">`;
    };
    return `<details class="album" data-album="${escape(album.id)}"><summary>${image(album.photos[0], 'album-cover')}<div class="album-info"><span class="album-count">${album.photos.length} fotografías</span><h3>${escape(album.title)}</h3><p>${escape(album.description)}</p><span class="album-toggle">Explorar álbum</span></div></summary><div class="album-photos">${album.photos.map((photo) => `<figure class="album-photo"><a href="${escape(base + '/' + photo.full)}" data-photo-link data-caption="${escape(photo.caption || photo.alt)}" aria-label="${escape('Ampliar: ' + photo.alt)}">${image(photo)}</a><figcaption>${escape(photo.caption || photo.alt)}</figcaption></figure>`).join('')}</div></details>`;
  }).join('');
}
