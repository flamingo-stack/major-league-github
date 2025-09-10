class SeoFilesPlugin {
  constructor(options = {}) {
    this.baseUrl = options.baseUrl || 'https://www.mlg.soccer';
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync('SeoFilesPlugin', (compilation, callback) => {
      const currentDate = new Date().toISOString().split('T')[0];
      
      // Generate sitemap.xml
      const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${this.baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

      // Generate robots.txt
      const robotsContent = `User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${this.baseUrl}/sitemap.xml`;

      // Add files to compilation
      compilation.assets['sitemap.xml'] = {
        source: () => sitemapContent,
        size: () => sitemapContent.length
      };

      compilation.assets['robots.txt'] = {
        source: () => robotsContent,
        size: () => robotsContent.length
      };

      callback();
    });
  }
}

module.exports = SeoFilesPlugin;