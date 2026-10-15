$ErrorActionPreference = 'Stop'
$reportDirectory = Join-Path $PSScriptRoot '../docs/audits/2026-10-02'
New-Item -ItemType Directory -Path $reportDirectory -Force | Out-Null
$sitemap = [xml](Invoke-WebRequest -UseBasicParsing -Uri 'https://splitsheetstudio.com/sitemap.xml').Content
$urls = @($sitemap.urlset.url.loc) + @('https://app.splitsheetstudio.com/', 'https://app.splitsheetstudio.com/signup', 'https://app.splitsheetstudio.com/login', 'https://app.splitsheetstudio.com/forgot-password', 'https://app.splitsheetstudio.com/account', 'https://splitsheetstudio.com/robots.txt', 'https://app.splitsheetstudio.com/robots.txt', 'https://splitsheetstudio.com/llms.txt', 'https://splitsheetstudio.com/.well-known/security.txt')
$pages = @($urls | ForEach-Object {
    $url = $_
    try {
        $r = Invoke-WebRequest -UseBasicParsing -Uri $url -TimeoutSec 20
        $links = @([regex]::Matches($r.Content, '(?i)<a\b[^>]*\bhref="([^"]+)"') | ForEach-Object { $_.Groups[1].Value })
        $images = @([regex]::Matches($r.Content, '(?i)<img\b[^>]*\bsrc="([^"]+)"') | ForEach-Object { $_.Groups[1].Value })
        [pscustomobject]@{ url = $url; status = [int]$r.StatusCode; title = [regex]::Match($r.Content, '<title>(.*?)</title>').Groups[1].Value; bytes = $r.RawContentLength; links = @($links | Where-Object { $_ }); ids = @([regex]::Matches($r.Content, '\bid="([^"]+)"') | ForEach-Object { $_.Groups[1].Value }); images = $images; h1Count = [regex]::Matches($r.Content, '<h1[ >]').Count; hasDescription = $r.Content -match 'name="description"'; hasCanonical = $r.Content -match 'rel="canonical"' }
    } catch { [pscustomobject]@{ url = $url; status = 'ERROR'; error = $_.Exception.Message; links = @(); images = @() } }
})
$destinations = @{}
$brokenAnchors = @()
foreach ($page in $pages) {
    foreach ($href in @($page.links) + @($page.images)) {
        if (!$href) { continue }
        $uri = [uri]::new([uri]$page.url, $href)
        if ($uri.Host -notin @('splitsheetstudio.com', 'app.splitsheetstudio.com')) { continue }
        if ($uri.AbsolutePath -match '^/(auth|logout|checkout|buy|account/billing)(/|$)') { continue }
        $destination = $uri.GetLeftPart([System.UriPartial]::Path)
        $destinations[$destination] = $true
        if ($uri.Fragment) {
            $target = $pages | Where-Object { $_.url -eq $destination } | Select-Object -First 1
            if ($target -and [uri]::UnescapeDataString($uri.Fragment.TrimStart('#')) -notin $target.ids) {
                $brokenAnchors += [pscustomobject]@{ source = $page.url; href = $uri.AbsoluteUri }
            }
        }
    }
}
$checks = @($destinations.Keys | ForEach-Object {
    $url = $_
    try { $r = Invoke-WebRequest -UseBasicParsing -Method Head -Uri $url -TimeoutSec 20; [pscustomobject]@{ url = $url; status = [int]$r.StatusCode; bytes = $r.Headers['Content-Length'] -join ''; type = $r.Headers['Content-Type'] -join '' } }
    catch { [pscustomobject]@{ url = $url; status = 'ERROR'; error = $_.Exception.Message } }
})
$report = [pscustomobject]@{ at = (Get-Date).ToUniversalTime().ToString('o'); pages = $pages; destinations = $checks; brokenAnchors = $brokenAnchors }
$report | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath (Join-Path $reportDirectory 'public-pages.json')
[pscustomobject]@{ pageCount = $pages.Count; blogCount = @($pages | Where-Object url -match '/blog/').Count; destinationCount = $checks.Count; errors = @($checks | Where-Object status -eq 'ERROR'); brokenAnchors = $brokenAnchors; largestAssets = @($checks | Where-Object { $_.url -match '\.(png|jpg|exe)$' } | Sort-Object { [long]$_.bytes } -Descending | Select-Object -First 8) } | ConvertTo-Json -Depth 5
