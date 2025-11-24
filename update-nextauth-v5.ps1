# Update all files from NextAuth v4 getServerSession to NextAuth v5 auth()

$files = Get-ChildItem -Path . -Include *.ts,*.tsx -Recurse -File | Where-Object { 
    $_.FullName -notmatch 'node_modules|\.next|\.git' 
}

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
    
    if ($content) {
        $modified = $false
        
        # Replace imports
        if ($content -match 'import \{ getServerSession \} from [''"]next-auth[/next]*[''"]') {
            $content = $content -replace 'import \{ getServerSession \} from [''"]next-auth[/next]*[''"]', 'import { auth } from "@/lib/auth"'
            $modified = $true
        }
        
        # Remove authOptions import if it exists
        if ($content -match 'import \{ authOptions \} from [''"]@/lib/auth[''"]') {
            $content = $content -replace 'import \{ authOptions \} from [''"]@/lib/auth[''"]', ''
            $content = $content -replace '\r?\n\s*\r?\n', "`r`n"  # Clean up double blank lines
            $modified = $true
        }
        
        # Replace function calls
        if ($content -match 'getServerSession\(authOptions\)') {
            $content = $content -replace 'getServerSession\(authOptions\)', 'auth()'
            $modified = $true
        }
        
        if ($modified) {
            Set-Content -Path $file.FullName -Value $content -NoNewline
            Write-Host "Updated: $($file.FullName)"
        }
    }
}

Write-Host "`nUpdate complete!"
