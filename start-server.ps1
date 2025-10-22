$port = 8080
$path = "d:\kansimo.com"

# Create a listener on port 8080
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

Write-Host "Server running at http://localhost:$port/"
Write-Host "Press Ctrl+C to stop the server"

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        # Get requested file path
        $requestedFile = $request.Url.LocalPath
        if ($requestedFile -eq "/") { $requestedFile = "/index.html" }
        
        $filePath = Join-Path $path $requestedFile.Substring(1)
        
        # Determine content type
        $contentType = "text/plain"
        if ($filePath -match "\.html$") { $contentType = "text/html" }
        if ($filePath -match "\.css$") { $contentType = "text/css" }
        if ($filePath -match "\.js$") { $contentType = "text/javascript" }
        if ($filePath -match "\.(jpg|jpeg)$") { $contentType = "image/jpeg" }
        if ($filePath -match "\.png$") { $contentType = "image/png" }
        if ($filePath -match "\.svg$") { $contentType = "image/svg+xml" }
        
        # Check if file exists
        if (Test-Path $filePath) {
            Write-Host "200 OK: $requestedFile"
            $content = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentType = $contentType
            $response.ContentLength64 = $content.Length
            $response.OutputStream.Write($content, 0, $content.Length)
        } else {
            Write-Host "404 Not Found: $requestedFile"
            $content = [System.Text.Encoding]::UTF8.GetBytes("<h1>404 Not Found</h1><p>The requested file was not found.</p>")
            $response.StatusCode = 404
            $response.ContentType = "text/html"
            $response.ContentLength64 = $content.Length
            $response.OutputStream.Write($content, 0, $content.Length)
        }
        
        # Close the response
        $response.Close()
    }
}
finally {
    # Stop the listener
    $listener.Stop()
}