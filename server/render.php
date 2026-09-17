<?php
declare(strict_types=1);

function cms_escape(string $value): string {
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function cms_attribute(string $tag, string $name, string $value): string {
    $attribute = ' ' . $name . '="' . cms_escape($value) . '"';
    $pattern = '/\s' . preg_quote($name, '/') . '="[^"]*"/';
    if (preg_match($pattern, $tag)) return preg_replace_callback($pattern, fn() => $attribute, $tag, 1);
    return substr($tag, 0, -1) . $attribute . '>';
}

// Only build-authored markers are interpreted. Edited content is always escaped.
// Balanced tags preserve the surrounding HTML, SVG and critical bootstrap scripts.
function cms_blocks(string $html, string $attribute, callable $callback): string {
    $pattern = '/<([a-z][a-z0-9]*)\b[^>]*\b' . preg_quote($attribute, '/') . '="([a-z0-9_.]+)"[^>]*>/i';
    $cursor = 0;
    while (preg_match($pattern, $html, $match, PREG_OFFSET_CAPTURE, $cursor)) {
        $opening = $match[0][0]; $start = $match[0][1];
        $tag = $match[1][0]; $key = $match[2][0];
        $insideStart = $start + strlen($opening);
        $depth = 1; $scan = $insideStart; $closing = null;
        $tagPattern = '/<\/?' . preg_quote($tag, '/') . '\b[^>]*>/i';
        while (preg_match($tagPattern, $html, $next, PREG_OFFSET_CAPTURE, $scan)) {
            $token = $next[0][0]; $position = $next[0][1];
            $depth += str_starts_with($token, '</') ? -1 : 1;
            if ($depth === 0) { $closing = [$token, $position]; break; }
            $scan = $position + strlen($token);
        }
        if (!$closing) throw new RuntimeException('Marcador de contenido incompleto.');
        $inside = substr($html, $insideStart, $closing[1] - $insideStart);
        $replacement = $callback($key, $opening, $inside, $closing[0]);
        $end = $closing[1] + strlen($closing[0]);
        $html = substr($html, 0, $start) . $replacement . substr($html, $end);
        $cursor = $start + strlen($replacement);
    }
    return $html;
}

function cms_text_markup(string $value, string $kind): string {
    $lines = explode("\n", $value);
    if ($kind === 'hero') {
        $last = array_pop($lines);
        return implode('<br>', array_map('cms_escape', $lines)) . '<br><span>' . cms_escape($last ?? '') . '</span>';
    }
    if ($kind === 'paragraphs') return implode('', array_map(fn($paragraph) => '<p>' . nl2br(cms_escape($paragraph), false) . '</p>', preg_split('/\n\n+/', $value)));
    if ($kind === 'manifesto') {
        $second = $lines[1] ?? '';
        $split = strrpos($second, ' ');
        $prefix = $split === false ? '' : substr($second, 0, $split + 1);
        $emphasis = $split === false ? $second : substr($second, $split + 1);
        return cms_escape($lines[0]) . '<br>' . cms_escape($prefix) . '<span>' . cms_escape($emphasis) . '</span>';
    }
    return nl2br(cms_escape($value), false);
}

function cms_render(string $html, array $content): string {
    $schema = cms_schema(); $texts = $content['texts'];
    $html = cms_blocks($html, 'data-cms', function ($key, $opening, $inside, $closing) use ($texts, $schema) {
        if (!isset($schema['fields'][$key])) throw new RuntimeException('Campo desconocido en plantilla.');
        $value = $texts[$key];
        if ($value !== '[CONTENIDO PENDIENTE APAG]') $opening = str_replace('pending-content', '', $opening);
        return $opening . cms_text_markup($value, $schema['fields'][$key]['kind'] ?? '') . $closing;
    });
    $html = cms_blocks($html, 'data-cms-pending', fn($key, $opening, $inside, $closing) =>
        ($texts[$key] ?? '') === '[CONTENIDO PENDIENTE APAG]' ? $opening . $inside . $closing : '');
    $html = cms_blocks($html, 'data-cms-proposal', fn($key, $opening, $inside, $closing) =>
        ($content['institutional_approvals'][$key] ?? false) ? '' : $opening . $inside . $closing);
    $hrefs = ['primary' => 'tel:' . $texts['contact.primary_number'], 'secondary' => 'tel:' . $texts['contact.secondary_number'], 'email' => 'mailto:' . $texts['contact.email']];
    $html = preg_replace_callback('/<a\b[^>]*data-cms-href="([a-z]+)"[^>]*>/i', fn($match) =>
        cms_attribute($match[0], 'href', $hrefs[$match[1]]), $html);
    $html = cms_blocks($html, 'data-cms-services', function ($key, $opening, $inside, $closing) use ($content) {
        if (!$content['services']) return $opening . '<p>Consulta con APAG para conocer los servicios disponibles.</p><a class="text-link" href="./contacto.html">Consultar con APAG</a>' . $closing;
        $services = $key === 'preview' ? array_slice($content['services'], 0, 3) : $content['services'];
        $cards = '<div class="cms-service-grid">';
        foreach ($services as $service) {
            $cards .= '<article class="cms-service-card"><h3>' . cms_escape($service['title']) . '</h3><p>' .
                nl2br(cms_escape($service['description']), false) . '</p><a class="text-link" href="./contacto.html">Consultar con APAG</a></article>';
        }
        return $opening . $cards . '</div>' . $closing;
    });
    $html = cms_blocks($html, 'data-cms-albums', fn($key, $opening, $inside, $closing) => $opening . cms_albums_markup($content['albums'] ?? cms_schema()['albums']) . $closing);
    $heroSource = null;
    $html = preg_replace_callback('/<img\b[^>]*data-cms-image="([a-z_]+)"[^>]*>/i', function ($match) use ($content, &$heroSource) {
        $image = $content['images'][$match[1]] ?? null;
        if (!$image) return $match[0];
        $tag = cms_attribute($match[0], 'alt', $image['alt']);
        if (isset($image['src'])) {
            foreach (['src', 'srcset', 'width', 'height'] as $name) {
                $value = (string) $image[$name];
                if ($name === 'src') $value = cms_base() . '/' . $value;
                if ($name === 'srcset') $value = implode(', ', array_map(fn($candidate) => cms_base() . '/' . $candidate, explode(', ', $value)));
                $tag = cms_attribute($tag, $name, $value);
            }
            if ($match[1] === 'hero') { $heroSource = cms_base() . '/' . $image['src']; $tag = cms_attribute($tag, 'sizes', '(max-width: 767px) 100vw, 51vw'); }
        }
        return $tag;
    }, $html);
    if ($heroSource) $html = preg_replace_callback('/<link\b[^>]*rel="preload"[^>]*as="image"[^>]*>/i', fn($match) => cms_attribute($match[0], 'href', $heroSource), $html);
    $html = preg_replace_callback('/<script type="application\/ld\+json">([^<]+)<\/script>/', function ($match) use ($texts) {
        $data = json_decode($match[1], true, 512, JSON_THROW_ON_ERROR);
        foreach ($data['@graph'] as &$entry) {
            if ($entry['@type'] === 'Organization') {
                $entry['email'] = $texts['contact.email'];
                $entry['telephone'] = [$texts['contact.primary_number'], $texts['contact.secondary_number']];
            }
        }
        unset($entry);
        return '<script type="application/ld+json">' . json_encode($data, JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_THROW_ON_ERROR) . '</script>';
    }, $html);
    return $html;
}
